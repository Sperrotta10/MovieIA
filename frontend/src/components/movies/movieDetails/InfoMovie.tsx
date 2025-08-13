import { CastCrew } from "@/components/movies/MovieDetails/Cast_crew"
import { ButtonsAction } from "@/components/movies/MovieDetails/ButtonsAction"

interface InfoMovieProps {
    movie: MovieDetail;
    seen: boolean;
    watchlist: boolean;
    favorite: boolean;
    setSeen: (value: boolean) => void;
    setWatchlist: (value: boolean) => void;
    setFavorite: (value: boolean) => void;
    handleToggleMovie: (action: "toWatch" | "watched" | "favorites", movie: MovieDetail) => void;
    credits: { cast: CastMember[]; crew: CrewMember[] };
}

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[]; 
  runtime: number;
  vote_count: number;
  genres?: { id: number; name: string }[]; // Géneros opcionales
};

type CastMember = {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
};

type CrewMember = {
  credit_id: string;
  department: string;
  job: string;
  name: string;
  profile_path: string | null;
};

export function InfoMovie({ movie, seen, watchlist, favorite, setSeen, setWatchlist, setFavorite, handleToggleMovie, credits }: InfoMovieProps) {

    return(
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            
            {/* Botones de acción */}
            <ButtonsAction
              movie={movie}
              seen={seen}
              watchlist={watchlist}
              favorite={favorite}
              setSeen={setSeen}
              setWatchlist={setWatchlist}
              setFavorite={setFavorite}
              handleToggleMovie={handleToggleMovie}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            {movie.release_date} • {movie.runtime} min
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-lg">{movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">({movie.vote_count} votos)</span>
          </div>

          {/* Géneros */}
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full border border-gray-400/40 dark:bg-white/10 dark:text-white dark:border-white/20"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Descripción */}
          <p className="text-gray-700 dark:text-gray-300">{movie.overview}</p>

          {/* Cast y Crew */}
          <CastCrew credits={credits} />
          
        </div>
    )
}