import MovieCard from "./MovieCard"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

interface MovieCarouselProps {
  movies: Movie[];
  onAddToWatchlist?: (movieId: number) => void;
}

export default function MovieCarousel({ movies, onAddToWatchlist }: MovieCarouselProps) {

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const firtsTenMovies = movies.slice(0, 10);

  return (
    <div className="relative w-full max-w-[1325px] mx-auto px-4">
      {/* Flecha Izquierda */}
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
      >
        {firtsTenMovies.map((movie) => (
          <div key={movie.id} className="shrink-0">
            <MovieCard
              title={movie.title}
              imageUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "/no-image.png"}
              rating={movie.vote_average ?? 0}
              onAddToWatchlist={() => onAddToWatchlist?.(movie.id)}
            />
          </div>
        ))}
      </div>

      {/* Flecha Derecha */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
