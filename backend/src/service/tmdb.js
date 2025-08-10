// src/services/tmdb.service.js
import axios from "axios";
import { environment } from "../config/enviroment.js";

export class TmdbService {
    constructor() {
        this.apiKey = environment.tmdbApiKey; // La API key de TMDB en tu .env
        this.baseUrl = environment.tmdbBaseUrl; // La URL base de TMDB en tu .env
    }

    async search(entities) {
        let url;
        
        // Si hay un título exacto
        if (entities?.title) {
            url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=es-ES&query=${encodeURIComponent(entities.title)}`;
        }
        // Si hay género o actor
        else if (entities?.genre || entities?.actor) {
            let genreId = null;
            let actorId = null;

            // Buscar ID de género si se especifica
            if (entities.genre) {
                const genreList = await this.getGenres();
                const genreMatch = genreList.find(g => g.name.toLowerCase() === entities.genre.toLowerCase());
                genreId = genreMatch?.id;
            }

            // Buscar ID de actor si se especifica
            if (entities.actor) {
                const actorRes = await axios.get(`${this.baseUrl}/search/person`, {
                    params: { api_key: this.apiKey, language: "es-ES", query: entities.actor }
                });
                actorId = actorRes.data.results[0]?.id;
            }

            // Construir búsqueda avanzada
            url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=es-ES&sort_by=popularity.desc`;
            if (genreId) url += `&with_genres=${genreId}`;
            if (actorId) url += `&with_cast=${actorId}`;
        }
        // Fallback: búsqueda general
        else {
            url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES`;
        }

        const res = await axios.get(url);
        return res.data.results.map(m => ({
            id: m.id,
            title: m.title,
            overview: m.overview,
            imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average
        }));
    }

    async getPopular() {
        const res = await axios.get(`${this.baseUrl}/movie/popular`, {
            params: { api_key: this.apiKey, language: "es-ES" }
        });
        return res.data.results.map(m => ({
            id: m.id,
            title: m.title,
            overview: m.overview,
            imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average
        }));
    }

    async getGenres() {
        const res = await axios.get(`${this.baseUrl}/genre/movie/list`, {
            params: { api_key: this.apiKey, language: "es-ES" }
        });
        return res.data.genres;
    }
}

export const tmdbService = new TmdbService();
