import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '@/components/MovieCard';
import { useIsMobile } from '@/hooks/IsMovil';
import { useScrollRestoration } from '@/hooks/useScrollRestoration'

interface LoadMoviesProps {
    movies: {
        id: number;
        title: string;
        poster_path: string;
        vote_average: number;
    }[];
    handleAddToWatchlist: (movieId: number) => void;
    fetchMoreMovies: () => Promise<any>;
    hasMore: boolean;
}


export function LoadMovies({ movies, handleAddToWatchlist, fetchMoreMovies, hasMore }: LoadMoviesProps) {
  const isMobile = useIsMobile();
  useScrollRestoration();

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
            imageUrl={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "/no-image.png"
            }
            rating={movie.vote_average}
            onAddToWatchlist={() => handleAddToWatchlist(movie.id)}
            horizontal={isMobile}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
