import { useState, useEffect } from 'react';
import { LoadMovies } from '@/components/LoadMovies';
import { fetchNowPlayingMovies } from '@/services/tmdb';

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
    <div className="min-h-screen bg-darkBg text-white p-8 max-w-[1325px] mx-auto">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-[0_0_6px_#00ffff]">
        🎬 Películas en cartelera
      </h1>

      <LoadMovies
        movies={movies.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ?? ''
        }))}
        handleAddToWatchlist={handleAddToWatchlist}
        fetchMoreMovies={fetchMoreMovies}
        hasMore={hasMore}
      />

    </div>
  );
}


