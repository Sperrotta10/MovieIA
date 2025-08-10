import dotenv from 'dotenv';
dotenv.config();

export const environment = {
    apiKey: process.env.GROQ_API_KEY,
    port: process.env.PORT,
    tmdbApiKey: process.env.TMDB_API_KEY,
    tmdbBaseUrl: process.env.BASE_URL
}