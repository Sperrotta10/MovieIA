import MovieCard from "./movieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Movie = {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
};

const movies: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    imageUrl: "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    rating: 8.7,
  },
  {
    id: 2,
    title: "The Batman",
    imageUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 8.1,
  },
  {
    id: 3,
    title: "Oppenheimer",
    imageUrl: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    rating: 8.5,
  },
  {
    id: 4,
    title: "Barbie",
    imageUrl: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    rating: 7.2,
  },
  {
    id: 5,
    title: "The Flash",
    imageUrl: "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    rating: 6.5,
  },
  {
    id: 6,
    title: "Dune: Part Two",
    imageUrl: "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    rating: 8.7,
  },
  {
    id: 7,
    title: "The Batman",
    imageUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 8.1,
  },
  {
    id: 8,
    title: "Oppenheimer",
    imageUrl: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    rating: 8.5,
  },
  {
    id: 9,
    title: "Barbie",
    imageUrl: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    rating: 7.2,
  },
  {
    id: 10,
    title: "The Flash",
    imageUrl: "https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    rating: 6.5,
  },
];

export default function MovieCarousel() {
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
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0">
            <MovieCard
              title={movie.title}
              imageUrl={movie.imageUrl}
              rating={movie.rating}
              onAddToWatchlist={() => alert(`Agregado: ${movie.title}`)}
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
