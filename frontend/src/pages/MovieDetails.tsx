import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '@/services/tmdb';
import { env } from '@/config/enviroment';
import { Star, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

const API_KEY = env.VITE_API_KEY ?? '';

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

type Movie = {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
};

export function MovieDetails() {

  // Declaracion de variables
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para las acciones del usuario
  const [seen, setSeen] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // Obtener detalles de la película
  useEffect(() => {
    async function movieDetails() {
      try {
        if (!id) return;
        const data = await fetchMovieDetails(id, API_KEY);
        setMovie(data.results ? data.results[0] : data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    movieDetails();
  }, [id]);

  // Cargar el estado de las acciones del usuario desde localStorage
  useEffect(() => {
    if (!id) return;

    const savedData = JSON.parse(
      localStorage.getItem("watchlistData") ||
        JSON.stringify({ toWatch: [], watched: [], favorites: [] })
    );

    setSeen(savedData.watched?.some((m: Movie) => m.id === Number(id)) || false);
    setWatchlist(savedData.toWatch?.some((m: Movie) => m.id === Number(id)) || false);
    setFavorite(savedData.favorites?.some((m: Movie) => m.id === Number(id)) || false);
  }, [id]);


  if (loading) return <div className="text-white text-center p-8">Cargando...</div>;
  if (!movie) return <div className="text-white text-center p-8">No encontrado</div>;

  function handleToggleMovie(action: "toWatch" | "watched" | "favorites", movie: MovieDetail) {
    const savedData = JSON.parse(
      localStorage.getItem("watchlistData") ||
        JSON.stringify({ toWatch: [], watched: [], favorites: [] })
    );

    if (!savedData.toWatch) savedData.toWatch = [];
    if (!savedData.watched) savedData.watched = [];
    if (!savedData.favorites) savedData.favorites = [];

    const exists = savedData[action].some((m: Movie) => m.id === movie.id);

    if (exists) {
      savedData[action] = savedData[action].filter((m: Movie) => m.id !== movie.id);
      localStorage.setItem("watchlistData", JSON.stringify(savedData));
      toast.info(`"${movie.title}" se quitó de ${getListName(action)}.`);
      return false; // para setState
    } else {
      savedData[action].push({
        id: movie.id,
        title: movie.title,
        imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average ?? 0
      });
      localStorage.setItem("watchlistData", JSON.stringify(savedData));
      toast.success(`"${movie.title}" se agregó a ${getListName(action)} 🎬`);
      return true;
    }
  }

  // Función para traducir los nombres de las listas
  function getListName(action: "toWatch" | "watched" | "favorites") {
    switch (action) {
      case "toWatch":
        return "Ver más tarde";
      case "watched":
        return "Ya vistas";
      case "favorites":
        return "Favoritas";
      default:
        return "";
    }
  }

  return (
    <div className="relative min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-[60vh] bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg shadow-2xl w-full max-h-[500px] object-cover"
        />

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            
            {/* Botones de acción */}
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
        </div>
      </div>
    </div>
  );

}
