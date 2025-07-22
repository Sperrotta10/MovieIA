import InfiniteScroll from 'react-infinite-scroll-component';
import MovieCard from '@/components/MovieCard';


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


    return (
        <InfiniteScroll
        dataLength={movies.length}
        next={fetchMoreMovies ?? (() => {})}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Cargando más películas...</p>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              id={movie.id.toString()}
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
    )
}
