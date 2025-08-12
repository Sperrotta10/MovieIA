import { environment } from "../../config/enviroment.js";

const api_key = environment.tmdbApiKey;
const base_url = environment.tmdbBaseUrl;

export class MetodosAuxiliares {

    // Método auxiliar para formatear respuesta de película
    static formatMovie(m) {
        return {
            id: m.id,
            title: m.title,
            overview: m.overview,
            imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average,
        };
    }

    // Método para obtener géneros de películas
    static async getGenres() {
        const res = await axios.get(`${base_url}/genre/movie/list`, {
            params: { api_key: api_key, language: "en-US" }
        });
        return res.data.genres;
    }

    // Función auxiliar para obtener el cast (actores) de una película
    static async getMovieCast(movieId) {
        try {
            const res = await axios.get(`${base_url}/movie/${movieId}/credits`, {
                params: { api_key: api_key }
            });
            return res.data.cast || [];
        } catch (e) {
            console.warn(`Error fetching cast for movie ID ${movieId}`, e.message);
            return [];
        }
    }

    // Función para buscar películas por años (pasados o actuales)
    static async fetchMoviesByYears(years) {
        // Aquí implementas la llamada a TMDb con filtro por rango de fechas
        // Usar el mínimo y máximo del array years para el rango
        const fromDate = `${Math.min(...years)}-01-01`;
        const toDate = `${Math.max(...years)}-12-31`;

        const params = new URLSearchParams({
            api_key: api_key,
            language: 'en-US',
            'primary_release_date.gte': fromDate,
            'primary_release_date.lte': toDate,
            sort_by: 'popularity.desc',
            page: '1'
        });

        const res = await axios.get(`${base_url}/discover/movie?${params.toString()}`);
        return res.data.results || [];
    }

    // Función para buscar estrenos futuros (upcoming)
    static async fetchUpcomingMovies(years) {
        // El endpoint /movie/upcoming no permite filtro exacto por año,
        // así que usamos discover con rango de fechas en futuro
        const fromDate = `${Math.min(...years)}-01-01`;
        const toDate = `${Math.max(...years)}-12-31`;

        const params = new URLSearchParams({
            api_key: api_key,
            language: 'en-US',
            'primary_release_date.gte': fromDate,
            'primary_release_date.lte': toDate,
            sort_by: 'popularity.desc',
            page: '1'
        });

        const res = await axios.get(`${base_url}/discover/movie?${params.toString()}`);
        return res.data.results || [];
    }

}