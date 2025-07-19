
export async function fetchNowPlayingMovies(page: number, apiKey: string) {
  const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchPopularMovies(page: number, apiKey: string) {
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

export async function fetchTopRatedMovies(page: number, apiKey: string) {
  const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch top rated movies');
  return res.json();
}

export async function fetchUpcomingMovies(page: number, apiKey: string) {
  const url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch upcoming movies');
  return res.json();
}