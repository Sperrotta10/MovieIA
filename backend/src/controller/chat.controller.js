import { ChatService } from '../model/chat.service.js';

export class ChatController {

    static async chatWithIA (req, res) {

        const service = new ChatService();

        try {

            const { message } = req.body;
            if (!message) return res.status(400).json({ error: 'Mensaje requerido.' });

            const response = await service.getMovieRecommendations(message);
            return res.status(200).json({ response });

        } catch (err) {
            console.error('Error en chat IA:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}