import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMovieDetails, fetchMovieCredits } from '@/services/tmdb';
import { env } from '@/config/enviroment';
import { toast } from 'sonner';
import { InfoMovie } from "@/components/movies/movieDetails/InfoMovie"

const API_KEY = env.VITE_API_KEY ?? '';

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
  const [credits, setCredits] = useState<{ cast: CastMember[]; crew: CrewMember[] } | null>(null);
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

  // obtener el cast + crew de la pelicula
  useEffect(() => {
    async function getCredits() {
      try {
        if (!id) return;
        const creditsData = await fetchMovieCredits(id, API_KEY);
        setCredits(creditsData.results ? creditsData.results[0] : creditsData);
      } catch (error) {
        console.error(error);
      }
    }
    getCredits();
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
        <InfoMovie
          movie={movie}
          seen={seen}
          watchlist={watchlist}
          favorite={favorite}
          setSeen={setSeen}
          setWatchlist={setWatchlist}
          setFavorite={setFavorite}
          handleToggleMovie={handleToggleMovie}
          credits={credits ?? { cast: [], crew: [] }}
        />

      </div>
    </div>
  );

}
