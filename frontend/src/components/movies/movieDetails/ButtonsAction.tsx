import { Eye, Clock, Star } from "lucide-react";

interface ButtonsActionProps {
    movie: MovieDetail;
    seen: boolean;
    watchlist: boolean;
    favorite: boolean;
    setSeen: (value: boolean) => void;
    setWatchlist: (value: boolean) => void;
    setFavorite: (value: boolean) => void;
    handleToggleMovie: (action: "toWatch" | "watched" | "favorites", movie: MovieDetail) => void;
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

export function ButtonsAction({ movie, seen, watchlist, favorite, setSeen, setWatchlist, setFavorite, handleToggleMovie }: ButtonsActionProps) {

    return (
        <div className="flex items-center gap-3">
            <button
            onClick={() => {handleToggleMovie("watched", movie); setSeen(!seen)}}
            className={`
                p-2 rounded-full border
                border-gray-400/40 dark:border-white/20
                hover:scale-110 transition
                ${seen 
                ? 'bg-green-500 text-black' 
                : 'bg-gray-200 text-black dark:bg-white/10 dark:text-white'}
            `}
            title={seen ? "Marcado como visto" : "Marcar como visto"}
            >
            <Eye size={20} />
            </button>

            <button
            onClick={() => {handleToggleMovie("toWatch", movie); setWatchlist(!watchlist)}}
            className={`
                p-2 rounded-full border
                border-gray-400/40 dark:border-white/20
                hover:scale-110 transition
                ${watchlist 
                ? 'bg-blue-500 text-black' 
                : 'bg-gray-200 text-black dark:bg-white/10 dark:text-white'}
            `}
            title={watchlist ? "En tu watchlist" : "Agregar a watchlist"}
            >
            <Clock size={20} />
            </button>

            <button
            onClick={() => {handleToggleMovie("favorites", movie); setFavorite(!favorite)}}
            className={`
                p-2 rounded-full border
                border-gray-400/40 dark:border-white/20
                hover:scale-110 transition
                ${favorite 
                ? 'bg-yellow-400 text-black' 
                : 'bg-gray-200 text-black dark:bg-white/10 dark:text-white'}
            `}
            title={favorite ? "En favoritos" : "Agregar a favoritos"}
            >
            <Star size={20} />
            </button>
        </div>
    );
}