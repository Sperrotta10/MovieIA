import Groq from 'groq-sdk';
import { environment } from '../config/enviroment.js';

export class ChatService {

    constructor() {
        this.groq = new Groq({
            apiKey: environment.apiKey,
        });
    }

    async getMovieRecommendations(message) {

        if (!message) {
            throw new Error('Mensaje requerido.');
        }

        const chat = await this.groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un experto en cine. Recomienda películas basadas en gustos, géneros, actores, o películas similares.',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        return { text : chat.choices[0].message.content, movies : []};
    }
}
