import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MovieCard } from '@/components/movies/Cards/MovieCard';
import { useIsMobile } from '@/hooks/IsMovil';
//import { useScrollRestoration } from '@/hooks/useScrollRestoration'
import movie_unknow from "@/assets/movie_unknow.jpg";

interface LoadMoviesProps {
    movies: {
        id: number;
        title: string;
        poster_path: string;
        vote_average: number;
    }[];
    fetchMoreMovies: () => Promise<any>;
    hasMore: boolean;
}


export function LoadMovies({ movies, fetchMoreMovies, hasMore }: LoadMoviesProps) {
  const isMobile = useIsMobile();
  const [restored, setRestored] = useState(false);
  
  useEffect(() => {
    const savedMoviesCount = Number(sessionStorage.getItem("moviesLoaded"));
    const savedScroll = sessionStorage.getItem("scrollPosition");

    if (!restored && savedMoviesCount && movies.length < savedMoviesCount && hasMore) {
      // Si aún no tenemos todas las películas que el usuario había cargado, pedimos más
      fetchMoreMovies?.();
    } 
    else if (!restored && savedScroll) {
      // Cuando ya hay suficientes películas cargadas, restauramos el scroll
      window.scrollTo({ top: Number(savedScroll), behavior: "instant" });
      sessionStorage.removeItem("scrollPosition");
      sessionStorage.removeItem("moviesLoaded");
      setRestored(true);
    }
  }, [movies.length, hasMore, fetchMoreMovies, restored]);

  return (
    <InfiniteScroll
      dataLength={movies.length}
      next={fetchMoreMovies ?? (() => {})}
      hasMore={hasMore}
      loader={<p className="text-center py-4">Cargando más películas...</p>}
    >
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 place-items-center' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'}`}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id.toString()}
            title={movie.title}
            poster_path={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : movie_unknow
            }
            vote_average={movie.vote_average}
            horizontal={isMobile}
            moviesCount={movies.length}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
