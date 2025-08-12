import Groq from 'groq-sdk';
import { environment } from '../config/enviroment.js';
import { TmdbService } from "../service/tmdb.js"

/*
Para máxima calidad y contexto largo:
    Usa meta-llama/llama-4-maverick-17b-128e-instruct o llama3-70b-8192.
    Estos modelos manejan bien instrucciones detalladas, diversidad y explicaciones.

Para buen balance rendimiento/costo:
    compound-beta o compound-beta-mini pueden ser la mejor opción para producción, si quieres un buen rendimiento con menos costo.

Para pruebas rápidas o menos recursos:
    llama3-8b-8192 está bien para desarrollo y pruebas.
*/

export class ChatService {

    constructor() {
        this.groq = new Groq({
            apiKey: environment.apiKey,
        });
    }

    // Metodo para clasificar la intención del usuario.
    async getIntent(message) {
        const response = await this.groq.chat.completions.create({
            model: 'llama3-8b-8192', // compound-beta-mini o meta-llama/llama-prompt-guard-2-22m o -86m
            messages: [
                {
                    role: 'system',
                        content: `
                            Eres un clasificador de intenciones para un chatbot de recomendación de películas.

                            Tu tarea es analizar el mensaje del usuario y devolver SOLO un objeto JSON válido con esta estructura:

                            {
                            "intent": "VALOR_INTENT",
                            "entities": {
                                "genre": [...],
                                "actor": [...],
                                "director": [...],
                                "title": [...],
                                "year": [...],
                                "language": [...],
                                "country": [...],
                                "setting": [...],
                                "keywords": [...]
                            }
                            }

                            Donde "intent" puede ser uno de los siguientes:

                            1. SPECIFIC_RECOMMENDATION  
                            El usuario pide películas con características muy concretas, que incluyen detalles específicos como:  
                            - género, actores, director, año o rango de años, saga, país de origen, idioma, ambientación o trama particular.  
                            - Cualquier mensaje que incluya un año o rango de años es considerado específico.

                            Ejemplos positivos:  
                            - "Quiero ver una película de acción con Tom Cruise."  
                            - "Recomiéndame comedias románticas coreanas de los 2000."  
                            - "Busca películas de terror dirigidas por James Wan."  
                            - "¿Qué películas de Christopher Nolan me recomiendas?"  
                            - "Ciencia ficción ambientada en el espacio."  
                            - "Dame sagas de fantasía como El Señor de los Anillos."  
                            - "Películas japonesas animadas de 2010."  
                            - "Recomiéndame películas de acción de los años 90."
                            - "Recomiéndame películas del año 2025."

                            Ejemplos negativos (no específicos):  
                            - "Recomiéndame un restaurante en Madrid."  
                            - "Enséñame fotos de gatos."  
                            - "Dime un chiste."  

                            2. GENERAL_RECOMMENDATION  
                            El usuario pide recomendaciones sin detalles concretos, con criterios amplios como género general, estado de ánimo o épocas amplias sin especificar años.  

                            Ejemplos positivos:  
                            - "Recomiéndame algo para reír."  
                            - "Películas de terror."  
                            - "Quiero ver una comedia."  
                            - "Opciones de películas de acción."  

                            Ejemplos negativos (no generales):  
                            - "Películas con Brad Pitt." (esto es específico)  
                            - "Películas de terror de 1990." (específico)  

                            3. GREETING  
                            El usuario solo saluda o inicia conversación sin pedir recomendaciones.  

                            Ejemplos positivos:  
                            - "Hola"  
                            - "Buenas tardes"  
                            - "¿Qué tal?"  

                            Ejemplos negativos:  
                            - "Hola, recomiéndame películas." (es general)  
                            - "Hola, quiero ver películas de Marvel." (es general)  

                            4. UNKNOWN  
                            Mensajes que no están relacionados con películas o no se entienden.  

                            Ejemplos positivos:  
                            - "Enséñame a hacer pizza."  
                            - "Quiero reservar un vuelo."  
                            - "Dime la hora exacta."  

                            Ejemplos negativos (sí están relacionados):  
                            - "Películas de acción." (general)  
                            - "Recomiéndame algo como Titanic." (específico)  

                            ---

                            Instrucciones estrictas:  
                            - Devuelve SOLO un objeto JSON válido.  
                            - No agregues texto adicional ni comentarios.  
                            - Si hay múltiples valores en una entidad, devuélvelos en un arreglo.  
                            - No inventes entidades que el usuario no mencione.  
                            - Usa minúsculas para valores excepto para nombres propios.  
                            - Si la intención es saludo, no incluyas entidades.  

                            ---

                            **Nota para la clasificación interna:**  
                            Si detectas al menos una entidad concreta (actor, director, year, title, country, language, setting, keywords), la intención es "SPECIFIC_RECOMMENDATION".  
                            Si solo hay géneros o ninguna entidad, la intención es "GENERAL_RECOMMENDATION".

                            Ejemplo de respuesta válida:

                            {
                            "intent": "SPECIFIC_RECOMMENDATION",
                            "entities": {
                                "genre": ["acción"],
                                "actor": ["Tom Cruise"],
                                "year": [2010]
                            }
                            }

                        `
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
    async handleSpecificRecommendation(entities, message) {

        // 1. Retrieval: Busca en tu base de datos primero.
        const { movies: foundMovies, notice } = await TmdbService.search(entities);

        if (notice) {
            return { text: notice, recommended_ids: [] };
        }

        if (foundMovies.length === 0) {
            return { text: "No encontré películas que coincidan con tu búsqueda. ¿Quieres intentar con otros gustos?", movies: [] };
        }

        // 2. Augmentation & Generation: Pasa los resultados al LLM para que razone sobre ellos.
        const movieContext = foundMovies.map(m => `ID: ${m.id}, Título: ${m.title}`).join('\n');
        
        const chat = await this.groq.chat.completions.create({
            model: 'meta-llama/llama-4-maverick-17b-128e-instruct', // llama3-70b-8192  o compound-beta
            messages: [
                {
                    role: 'system',
                    content: `
                        Eres un experto curador y crítico de cine con profundo conocimiento de géneros, directores, actores, épocas, idiomas y contextos culturales.

                        Un usuario ha solicitado recomendaciones de películas basadas en criterios específicos: géneros, actores, directores, años, idiomas, ambientación, entre otros.

                        Has recibido una lista de películas que coinciden con esos criterios.

                        Tu misión:

                        1. Analiza cuidadosamente cada película y selecciona SOLO aquellas que realmente se ajusten a las preferencias y contexto del usuario.
                        2. Prioriza la diversidad en géneros, décadas, países de origen y estilos cinematográficos para ofrecer recomendaciones variadas.
                        3. No repitas títulos en diferentes recomendaciones y evita sugerencias genéricas o vagas.
                        4. Selecciona un máximo de 5 películas.
                        5. Para cada película recomendada, escribe una breve explicación cálida y cercana que destaque por qué es una buena elección para el usuario.
                        6. Al final, devuelve ÚNICAMENTE un objeto JSON válido y exacto con la siguiente estructura:

                        {
                        "text": "Tu respuesta conversacional con las recomendaciones y sus breves explicaciones.",
                        "recommended_ids": [lista_de_IDs_recomendados]
                        }

                        Además, detecta el idioma del mensaje del usuario (${message}).  
                        - Si el usuario escribió el mensaje en español, responde con el texto de recomendaciones en español.  
                        - Si el usuario escribió el mensaje en inglés, responde con el texto en inglés.  
                        - Siempre adapta el idioma de la respuesta al idioma usado por el usuario.

                        IMPORTANTE: Devuelve SOLO un JSON válido. No añadas comentarios, explicaciones ni texto fuera del JSON. El JSON debe poder ser analizado sin errores.  
                        No incluyas texto ni caracteres fuera del objeto JSON.

                        Ejemplo de respuesta válida:

                        {
                        "text": "Te recomiendo estas películas que encajan perfectamente con tus gustos: 'Inception' por su intriga y ciencia ficción, 'Amélie' por su toque romántico francés y 'El Padrino' como un clásico del cine dramático.",
                        "recommended_ids": [27205, 194, 238]
                        }

                        Contexto de búsqueda: ${JSON.stringify(entities)}

                        Películas encontradas:
                        ${movieContext}
                        `
                    },
                { role: 'user', content: `Contexto de la búsqueda: ${JSON.stringify(entities)}\n\nPelículas encontradas:\n${movieContext}` }
            ],
            response_format: { type: "json_object" },
        });
        
        try {

            const result = JSON.parse(chat.choices[0].message.content);
           
            // Filtra las películas originales para devolver solo las que el LLM recomendó.
            const recommendedMovies = foundMovies.filter(m => result.recommended_ids.includes(m.id));

            return { text: result.text, movies: recommendedMovies };
        } catch (error) {
            console.error("Error parsing chat response:", error);
            return { text: "Lo siento, ocurrió un error al procesar la respuesta.", movies: [] };
        }
    }

    
    // El Agente Generalista para recomendaciones sin contexto.
    async handleGeneralRecommendation(message) {

        const chat = await this.groq.chat.completions.create({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct", // llama3-70b-8192  o compound-beta
            messages: [
            { role: 'system', 
                content: `
                    Eres un curador experto en cine con amplio conocimiento de películas de todas las épocas, géneros y países.

                    Tu tarea: Recomendar 5 películas variadas y de calidad a un usuario que busca opciones sin contexto específico.

                    No repitas siempre los mismos éxitos comerciales; mezcla clásicos inolvidables, joyas de culto, películas internacionales y diferentes géneros para ofrecer una experiencia diversa y enriquecedora.

                    Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:

                    {
                    "text": "Aquí tienes algunas películas recomendadas para ti, variadas y especiales:",
                    "recommended_ids": [123, 456, 789, 101, 112]
                    }

                    Además, detecta el idioma del mensaje del usuario (${message}).  
                    - Si el mensaje está en español, responde en español con un mensaje cálido y amigable.  
                    - Si está en inglés, responde en inglés adaptando el tono cordial.

                    IMPORTANTE: No añadas texto fuera del objeto JSON, ni comentarios. La respuesta debe ser un JSON válido y analizable.

                    Ejemplos para inspirarte (no incluir en la respuesta):  
                    - Clásicos: "Casablanca", "El Padrino"  
                    - Joyas de culto: "Blade Runner", "Donnie Darko"  
                    - Internacionales: "Parásitos", "La Vita è Bella"  
                    - Documentales o animaciones destacadas  

                    Procura diversidad en géneros (acción, drama, comedia, thriller, animación, documental) y épocas (años 60, 80, 2000, etc.).

                    Ejemplo de salida válida:

                    {
                    "text": "Te presento cinco películas variadas que seguro disfrutarás: una mezcla de clásicos, joyas ocultas y cine internacional para sorprenderte.",
                    "recommended_ids": [101, 202, 303, 404, 505]
                    }
                    ` 
                }
            ],
            response_format: { type: "json_object" },
        });

        let result = JSON.parse(chat.choices[0].message.content);
        try {
            result = JSON.parse(chat.choices[0].message.content);
        } catch (error) {
            console.error("Error parsing chat response:", error);
            return { text: "Lo siento, ocurrió un error al procesar la respuesta.", movies: [] };
        }

        // Traemos los detalles de cada película recomendada
        const movies = await Promise.all(
            result.recommended_ids.map(async (id) => {
                try {
                const movie = await TmdbService.getMovieDetails(id);
                return movie; // o null si quieres filtrar luego
                } catch (error) {
                console.warn(`No se pudo obtener detalles para película ID ${id}:`, error.message);
                return null; // para no romper Promise.all
                }
            })
        );

        // Filtramos posibles nulls si alguna película no se pudo cargar
        const filteredMovies = movies.filter(Boolean);

        return {
            text: result.text,
            movies: filteredMovies,
        };
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
                return this.handleSpecificRecommendation(entities, message);
            
            case 'GENERAL_RECOMMENDATION':
                console.log("Intención detectada: General.");
                return this.handleGeneralRecommendation(message);

            case 'GREETING':
                return { text: "¡Hola! Soy tu asistente de cine. ¿Qué te gustaría ver hoy?", movies: [] };

            default:
                return { text: "No estoy seguro de cómo ayudarte con eso. Intenta pedirme una recomendación de película.", movies: [] };
        }
    }
}
