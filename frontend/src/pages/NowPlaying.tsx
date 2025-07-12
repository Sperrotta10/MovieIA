import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '@/components/MovieCard';

const API_KEY = import.meta.env.VITE_API_KEY ?? ''; // Reemplaza aquí tu key

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  // add other fields if needed
};

export function NowPlayingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchMoreMovies() {
    try {
      if (!API_KEY) {
        throw new Error('API_KEY is missing. Please set your API key.');
      }
      const data = await fetchNowPlayingMovies(page, API_KEY);

      setMovies(prev => {
        const movieMap = new Map<number, Movie>();
        [...prev, ...data.results].forEach((movie) => {
            movieMap.set(movie.id, movie); // Si ya existía, lo sobrescribe
        });
        return Array.from(movieMap.values());
      });

      setPage(prev => prev + 1);

      if (data.page >= data.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  }

  useEffect(() => {
    fetchMoreMovies();
  }, []);


  function handleAddToWatchlist(movieId: number) {
    // Aquí puedes implementar la lógica para agregar a watchlist
    alert(`Añadiste la película ${movieId} a la watchlist!`);
  }


  return (
    <div className="min-h-screen bg-darkBg text-white p-8">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-[0_0_6px_#00ffff]">
        🎬 Películas en cartelera
      </h1>

      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMoreMovies}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Cargando más películas...</p>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              imageUrl={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "/no-image.png"
              }
              rating={movie.vote_average}
              onAddToWatchlist={() => handleAddToWatchlist(movie.id)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

async function fetchNowPlayingMovies(page: number, apiKey: string) {
  const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}
