import axios from 'axios';
import { env } from '../config/enviroment';

const API_URL = axios.create({ baseURL: env.VITE_URL_API_TMDB });

export async function fetchNowPlayingMovies(page: number, apiKey: string) {
  const res = await API_URL.get(`/movie/now_playing`, {
    params: { language: 'en-US', page, api_key: apiKey }
  });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to fetch movies');
  return res.data;
}

export async function fetchPopularMovies(page: number, apiKey: string) {
  const res = await API_URL.get(`/movie/popular`, {
    params: { language: 'en-US', page, api_key: apiKey }
  });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to fetch popular movies');
  return res.data;
}

export async function fetchTopRatedMovies(page: number, apiKey: string) {
  const res = await API_URL.get(`/movie/top_rated`, {
    params: { language: 'en-US', page, api_key: apiKey }
  });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to fetch top rated movies');
  return res.data;
}

export async function fetchUpcomingMovies(page: number, apiKey: string) {
  const res = await API_URL.get(`/movie/upcoming`, {
    params: { language: 'en-US', page, api_key: apiKey }
  });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to fetch upcoming movies');
  return res.data;
}

export async function fetchMovieDetails(id: string, apiKey: string) {
  const res = await API_URL.get(`/movie/${id}`, {
    params: { api_key: apiKey, language: 'en-US' }
  });
  if (res.status < 200 || res.status >= 300) throw new Error('Failed to fetch movie details');
  return res.data;
}

export async function fetchSearchMovies(query: string, apiKey: string, page: number = 1) {
  if (!query) return [];
  const res = await API_URL.get(`/search/movie`, {
    params: { api_key: apiKey, query: encodeURIComponent(query), page }
  });
  if (res.status < 200 || res.status >= 300) throw new Error("Failed to search movies");
  return res.data;
}
