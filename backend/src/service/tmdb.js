import axios from "axios";
import { environment } from "../config/enviroment.js";
import { EntitiesMovies } from "./utils/entities.js"
import { MetodosAuxiliares } from "./utils/metodos_aux.js"

const api_key = environment.tmdbApiKey;
const base_url = environment.tmdbBaseUrl;

export class TmdbService {

    // Función para buscar películas por entidades
    static async search(entities) {

        const currentYear = new Date().getFullYear();

        // Buscar películas por año
        if (entities?.year) {

            const result = await EntitiesMovies.entitiesYear(entities, currentYear);
            return result;
        }

        // Si hay título, buscar el ID de la película
        if (entities?.title) {

            const result = await EntitiesMovies.entitiesTitle(entities);
            return result;
        }

        // --- Búsqueda discover con filtros (géneros, actores, años, etc) ---

        // Obtener géneros y actores simultáneamente
        const { genres, actors } = await EntitiesMovies.entities_Genre_Actor(entities);

        // Mapear géneros a IDs
        const genreIds = EntitiesMovies.map_genres(genres, entities);

        // Mapear actores a IDs
        const actorIds = EntitiesMovies.map_actors(actors);

        // Construir params para discover
        const params = new URLSearchParams({
            api_key: api_key,
            language: 'en-US',
            sort_by: 'popularity.desc',
            page: '1',
        });

        if (genreIds.length) params.set('with_genres', genreIds.join(','));
        if (actorIds.length) params.set('with_cast', actorIds.join(','));

        if (entities.year) {
            if (typeof entities.year === 'number') {
                params.set('primary_release_year', entities.year.toString());
            } else if (typeof entities.year === 'object' && entities.year.from && entities.year.to) {
                params.set('primary_release_date.gte', `${entities.year.from}-01-01`);
                params.set('primary_release_date.lte', `${entities.year.to}-12-31`);
            }
        }

        // Obtener total_pages para paginar aleatorio
        try {
            const quickRes = await axios.get(`${base_url}/discover/movie?${params.toString()}&page=1`);
            const totalPages = quickRes.data.total_pages;
            const maxPages = Math.min(totalPages, 50);
            const randomPage = Math.floor(Math.random() * maxPages) + 1;
            params.set('page', randomPage.toString());
        } catch {
            // En error, dejar página 1
            params.set('page', '1');
        }

        // Petición final discover
        const discoverResults = await EntitiesMovies.request_discover(params, actorIds, genreIds);

        return discoverResults;
    }


    static async getMovieDetails(movieId) {

        try {
            const res = await axios.get(`${base_url}/movie/${movieId}`, {
                params: {
                    api_key: api_key,
                    language: 'en-US'
                }
            });

            if(res.status !== 200) {
                console.warn(`No se pudo obtener detalles para película ID ${movieId}:`, res.statusText);
                return null;
            }

            return MetodosAuxiliares.formatMovie(res.data);

        } catch (error) {
            if (error.response) {
                // La respuesta fue recibida pero con error HTTP
                console.error(`Error ${error.response.status} al obtener detalles para ID ${movieId}`);
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                console.error(`No hubo respuesta para la petición de ID ${movieId}`);
            } else {
                // Otro error al preparar la petición
                console.error(`Error al preparar la petición para ID ${movieId}:`, error.message);
            }
            return null;
        }
    }
}
