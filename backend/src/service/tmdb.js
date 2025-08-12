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
        const [genreList, actorSearchResults] = await Promise.all([
            MetodosAuxiliares.getGenres(),
            entities.actor
                ? Promise.all(
                    (Array.isArray(entities.actor) ? entities.actor : [entities.actor])
                    .map(actorName => axios.get(`${base_url}/search/person`, { params: { api_key, language: 'en-US', query: actorName } }))
                )
                : Promise.resolve(null)
        ]);

        // Mapear géneros a IDs
        let genreIds = [];
        if (entities.genre) {
            const genres = Array.isArray(entities.genre) ? entities.genre : [entities.genre];
            genreIds = genres
                .map(g => genreList.find(genre => genre.name.toLowerCase() === g.toLowerCase())?.id)
                .filter(Boolean);
        }

        // Mapear actores a IDs
        let actorIds = [];
        if (actorSearchResults) {
            for (const res of actorSearchResults) {
                if (res.data.results.length > 0) {
                    actorIds.push(res.data.results[0].id);
                }
            }
        }

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
        try {
            const res = await axios.get(`${base_url}/discover/movie?${params.toString()}`);
            let results = res.data.results || [];

            // Si no hay resultados, intentar suavizar filtros: quitar actores o géneros
            if (results.length === 0) {
                if (actorIds.length > 0) {
                    // Quitar actores y buscar solo por géneros
                    const paramsNoActors = new URLSearchParams({
                        api_key: api_key,
                        language: 'en-US',
                        sort_by: 'popularity.desc',
                        page: '1',
                    });
                    if (genreIds.length) paramsNoActors.set('with_genres', genreIds.join(','));
                    const resNoActors = await axios.get(`${base_url}/discover/movie?${paramsNoActors.toString()}`);
                    results = resNoActors.data.results || [];
                }
                if (results.length === 0 && genreIds.length === 0 && actorIds.length === 0) {
                    // Buscar sin filtros (películas populares)
                    const resPopular = await axios.get(`${base_url}/movie/popular?api_key=${api_key}&language=en-US&page=1`);
                    results = resPopular.data.results || [];
                }
            }

            return { movies: results.map(m => MetodosAuxiliares.formatMovie(m)), notice: null };
        } catch (e) {
            console.error('Error fetching discover movies:', e.message);
            return { movies: [], notice: 'Error fetching movies' };
        }
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
