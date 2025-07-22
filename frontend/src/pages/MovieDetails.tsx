import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMovieDetails } from '@/services/tmdb'; // Asegúrate de que esta función esté definida en tu servicio

const API_KEY = import.meta.env.VITE_API_KEY ?? ''; // Reemplaza aquí tu key

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

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-white text-center p-8">Cargando...</div>;
  if (!movie) return <div className="text-white text-center p-8">No encontrado</div>;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-[60vh] bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black via-black/80 to-transparent" />

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
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">{movie.release_date} • {movie.runtime} min</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-lg">{movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({movie.vote_count} votos)</span>
          </div>

          {/* Géneros */}
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre: any) => (
              <span
                key={genre.id}
                className="bg-white/10 text-sm px-3 py-1 rounded-full border border-white/20"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Descripción */}
          <p className="text-gray-300">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
