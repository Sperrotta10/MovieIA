import { MetodosAuxiliares } from "./metodos_aux.js"
import { environment } from "../../config/enviroment.js"
import axios from "axios";

const api_key = environment.tmdbApiKey;
const base_url = environment.tmdbBaseUrl;

export class EntitiesMovies {

    static async entitiesYear(entities, currentYear) {

        let yearsRequested = [];

        if (Array.isArray(entities.year)) {
            yearsRequested = entities.year.map(y => Number(y));
        } else if (typeof entities.year === 'number') {
            yearsRequested = [entities.year];
        } else if (typeof entities.year === 'string') {
            const yNum = Number(entities.year);
            if (!isNaN(yNum)) {
                yearsRequested = [yNum];
            }
        } else if (typeof entities.year === 'object' && entities.year.from && entities.year.to) {
            for (let y = Number(entities.year.from); y <= Number(entities.year.to); y++) {
                yearsRequested.push(y);
            }
        }

        const futureYears = yearsRequested.filter(y => y > currentYear);
        const currentYearRequested = yearsRequested.includes(currentYear);
        const pastYears = yearsRequested.filter(y => y < currentYear);

        let movies = [];

        // 1) Buscar películas ya estrenadas (pasadas y el año actual si se pidió)
        if (pastYears.length > 0 || currentYearRequested) {
            const yearsToSearch = [...pastYears];
            if (currentYearRequested) yearsToSearch.push(currentYear);
            const pastMovies = await MetodosAuxiliares.fetchMoviesByYears(yearsToSearch);
            movies = movies.concat(pastMovies);
        }

        // 2) Buscar estrenos futuros para años estrictamente mayores que el actual
        if (futureYears.length > 0) {
            const upcomingMovies = await MetodosAuxiliares.fetchUpcomingMovies(futureYears);
            movies = movies.concat(upcomingMovies);
        }

        if (movies.length === 0) {
            return {
                movies: [],
                notice: `No se encontraron películas para el año solicitado. ¿Quieres recomendaciones de años recientes?`
            };
        }

        return {
            movies: movies.map(m => MetodosAuxiliares.formatMovie(m)),
            notice: null
        };
    }

    static async entitiesTitle(entities) {

        const paramsTitle = new URLSearchParams({
                api_key: api_key,
                language: 'en-US',
                query: entities.title,
                page: '1',
            });

        try {
            const searchRes = await axios.get(`${base_url}/search/movie?${paramsTitle.toString()}`);

            if (searchRes.data.results.length > 0) {

                // Tomamos el primer resultado (el más relevante)
                const movieId = searchRes.data.results[0].id;

                // Buscar películas similares
                const similarRes = await axios.get(`${base_url}/movie/${movieId}/similar`, {
                    params: { api_key: api_key, language: 'en-US', page: 1 }
                });

                let similarMovies = similarRes.data.results || [];

                // Si hay filtros de actores o géneros, filtramos similarMovies
                // Para simplificar, filtramos por género aquí (por IDs), y actor si es posible
                if (entities.genre || entities.actor) {
                    const genreList = await MetodosAuxiliares.getGenres();
                    const genreIds = entities.genre
                        ? (Array.isArray(entities.genre) ? entities.genre : [entities.genre])
                            .map(g => genreList.find(genre => genre.name.toLowerCase() === g.toLowerCase())?.id)
                            .filter(Boolean)
                        : [];

                    if (genreIds.length) {
                        similarMovies = similarMovies.filter(movie =>
                            genreIds.some(id => movie.genre_ids.includes(id))
                        );
                    }
                    
                    // Filtrar por actores MÁS PRECISAMENTE
                    if (entities.actor) {
                        const wantedActors = Array.isArray(entities.actor) ? entities.actor : [entities.actor];
                        const wantedActorIds = [];

                        // Obtener IDs de actores buscados
                        for (const actorName of wantedActors) {
                            const actorSearch = await axios.get(`${base_url}/search/person`, {
                                params: { api_key, language: 'en-US', query: actorName }
                            });
                            if (actorSearch.data.results.length > 0) {
                                wantedActorIds.push(actorSearch.data.results[0].id);
                            }
                        }

                        // Filtrar similarMovies consultando cast individualmente
                        const filteredMovies = [];

                        for (const movie of similarMovies) {
                            const cast = await MetodosAuxiliares.getMovieCast(movie.id);
                            const castActorIds = cast.map(c => c.id);
                            // Verificar si alguno de los wantedActorIds está en castActorIds
                            const hasActor = wantedActorIds.some(id => castActorIds.includes(id));
                            if (hasActor) {
                                filteredMovies.push(movie);
                            }
                        }
                        similarMovies = filteredMovies;
                    }
                }

                if (similarMovies.length > 0) {
                    return { movies: similarMovies.map(m => MetodosAuxiliares.formatMovie(m)), notice: null };
                }
                return {
                    movies: [],
                    notice: `No se encontraron películas similares a "${entities.title}" con los filtros aplicados.`
                };
            }
        } catch (e) {
            console.warn(`Error buscando película o similares con título ${entities.title}`, e.message);
            // Continuamos a discover
        }
    }

    static async entities_Genre_Actor(entities) {

        const [genreList, actorSearchResults] = await Promise.all([
            MetodosAuxiliares.getGenres(),
            entities.actor
                ? Promise.all(
                    (Array.isArray(entities.actor) ? entities.actor : [entities.actor])
                    .map(actorName => axios.get(`${base_url}/search/person`, { params: { api_key, language: 'en-US', query: actorName } }))
                )
                : Promise.resolve(null)
        ]);

        return {
            genres: genreList,
            actors: actorSearchResults
        };
    }

    static map_genres(genreList, entities) {
        
        let genreIds = [];
        if (entities.genre) {
            const genres = Array.isArray(entities.genre) ? entities.genre : [entities.genre];
            genreIds = genres
                .map(g => genreList.find(genre => genre.name.toLowerCase() === g.toLowerCase())?.id)
                .filter(Boolean);
        }

        return genreIds;
    }

    static map_actors(actorSearchResults) {

        let actorIds = [];
        if (actorSearchResults) {
            for (const res of actorSearchResults) {
                if (res.data.results.length > 0) {
                    actorIds.push(res.data.results[0].id);
                }
            }
        }

        return actorIds;
    }


    static async request_discover(params, actorIds, genreIds) {
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
}