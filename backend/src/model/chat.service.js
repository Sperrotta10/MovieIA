import Groq from 'groq-sdk';
import { environment } from '../config/enviroment.js';
import { tmdbService } from "../service/tmdb.js"

export class ChatService {

    constructor() {
        this.groq = new Groq({
            apiKey: environment.apiKey,
        });
    }

    // "Recepcionista" que clasifica la intención del usuario.
    async getIntent(message) {
        const response = await this.groq.chat.completions.create({
            model: 'llama3-8b-8192', // Usamos un modelo más rápido y barato para clasificar
            messages: [
                {
                    role: 'system',
                    content: `Analiza el mensaje del usuario y clasifícalo en una de las siguientes intenciones: 'SPECIFIC_RECOMMENDATION', 'GENERAL_RECOMMENDATION', 'GREETING'.
                    Si la intención es 'SPECIFIC_RECOMMENDATION', extrae entidades como géneros, actores o títulos de películas.
                    Responde únicamente con un objeto JSON. Ejemplo: {"intent": "SPECIFIC_RECOMMENDATION", "entities": {"genre": "acción", "actor": "Tom Cruise"}}`
                },
                { role: 'user', content: message }
            ],
            response_format: { type: "json_object" },
        });

        try {
            return JSON.parse(response.choices[0].message.content);
        } catch (e) {
            return { intent: 'UNKNOWN' };
        }
    }

    // El Agente Experto para recomendaciones específicas. Utiliza el patrón RAG (Retrieval-Augmented Generation).
    async handleSpecificRecommendation(entities) {

        // 1. Retrieval: Busca en tu base de datos primero.
        const foundMovies = await tmdbService.search(entities);

        if (foundMovies.length === 0) {
            return { text: "No encontré películas que coincidan con tu búsqueda. ¿Quieres intentar con otros gustos?", movies: [] };
        }

        // 2. Augmentation & Generation: Pasa los resultados al LLM para que razone sobre ellos.
        const movieContext = foundMovies.map(m => `ID: ${m.id}, Título: ${m.title}`).join('\n');
        
        const chat = await this.groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                {
                    role: 'system',
                    content: `Eres un experto en cine. Un usuario busca películas con ciertos criterios. Yo ya he buscado en una base de datos y te proporciono una lista de películas encontradas.
                    Tu tarea es seleccionar las mejores de esta lista, presentarlas de forma amigable y conversacional. Al final, devuelve los IDs de las películas que recomiendas en un array JSON.
                    Formato de respuesta esperado: {"text": "Tu respuesta conversacional...", "recommended_ids": [123, 456]}`
                },
                { role: 'user', content: `Contexto de la búsqueda: ${JSON.stringify(entities)}\n\nPelículas encontradas:\n${movieContext}` }
            ],
            response_format: { type: "json_object" },
        });
        
        const result = JSON.parse(chat.choices[0].message.content);
        
        // Filtra las películas originales para devolver solo las que el LLM recomendó.
        const recommendedMovies = foundMovies.filter(m => result.recommended_ids.includes(m.id));

        return { text: result.text, movies: recommendedMovies };
    }

    
    // El Agente Generalista para recomendaciones sin contexto.
    async handleGeneralRecommendation() {

        // Busca las películas más populares o mejor valoradas
        const popularMovies = await tmdbService.getPopular();
        return { text: "Aquí tienes algunas películas populares que podrían gustarte:", movies: popularMovies.slice(0, 5) };
    }

    // El Agente Generalista para recomendaciones sin contexto.
    async getMovieRecommendations(message) {
        if (!message) {
            throw new Error('Mensaje requerido.');
        }

        const { intent, entities } = await this.getIntent(message);

        switch (intent) {
            case 'SPECIFIC_RECOMMENDATION':
                console.log("Intención detectada: Específica. Entidades:", entities);
                return this.handleSpecificRecommendation(entities);
            
            case 'GENERAL_RECOMMENDATION':
                console.log("Intención detectada: General.");
                return this.handleGeneralRecommendation();

            case 'GREETING':
                return { text: "¡Hola! Soy tu asistente de cine. ¿Qué te gustaría ver hoy?", movies: [] };

            default:
                return { text: "No estoy seguro de cómo ayudarte con eso. Intenta pedirme una recomendación de película.", movies: [] };
        }
    }
}
