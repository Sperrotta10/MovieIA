import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { MovieCard } from "@/components/movies/Cards/MovieCard";
import { MovieCardHorizontal } from "@/components/movies/Cards/MovieCardHorizontal";
import { fetchSearchMovies } from "@/services/tmdb";
import { useIsMobile } from '@/hooks/IsMovil';
//import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { env } from "@/config/enviroment";
import type { Movie } from "@/types/movie";

const API_KEY = env.VITE_API_KEY ?? "";

export const SearchResults = () => {
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [restored, setRestored] = useState(false);
  //useScrollRestoration();

  const isMobile = useIsMobile();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const fetchResults = async (pageToFetch = 1) => {
    if (!query) return;

    try {
        const res = await fetchSearchMovies(query, API_KEY, pageToFetch);
        if (!res || !res.results) {
            setHasMore(false);
            return;
        }

        setResults((prev) => {
            const newMovies = res.results.filter(
            (movie: { id: number; }) => !prev.some((m) => m.id === movie.id)
        );
            return [...prev, ...newMovies];
        });

        // Suponemos que si no devuelve 20, no hay más
        if (res.results.length < 20) setHasMore(false);
    } catch (error) {
        console.error("Error fetching movies:", error);
        setHasMore(false);
    }
  };

  useEffect(() => {
    const savedMoviesCount = Number(sessionStorage.getItem("moviesLoaded"));
    const savedScroll = sessionStorage.getItem("scrollPosition");

    if (!restored && savedMoviesCount && results.length < savedMoviesCount && hasMore) {
      fetchMoreData();
    } else if (!restored && savedScroll) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(savedScroll));
      });
      sessionStorage.removeItem("scrollPosition");
      sessionStorage.removeItem("moviesLoaded");
      setRestored(true);
    }
  }, [results.length, hasMore, restored]);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1);
  }, [query]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    fetchResults(nextPage);
    setPage(nextPage);
  };

  return (
    <div className="px-4 md:px-12 py-6">
      <h1 className="text-2xl font-semibold text-white mb-4">
        Resultados para: <span className="text-blue-400">{query}</span>
      </h1>

      <InfiniteScroll
        dataLength={results.length}
        next={fetchMoreData ?? (() => {})}
        hasMore={hasMore}
        loader={<p className="text-white text-center">Cargando...</p>}
        endMessage={
          <p className="text-center text-zinc-400 mt-4">No hay más resultados.</p>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex flex-col gap-4">
          {results.map((movie) => {
            const commonProps = {
              id: movie.id.toString(),
              title: movie.title,
              poster_path: movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "/no-image.png",
              vote_average: movie.vote_average ?? 0,
              moviesCount: results.length,
            };

            return isMobile ? (
              <MovieCard key={movie.id.toString()} {...commonProps} horizontal={isMobile} />
            ) : (
              <MovieCardHorizontal key={movie.id.toString()} {...commonProps} />
            );
          })}

        </div>
      </InfiniteScroll>
    </div>
  );
};
