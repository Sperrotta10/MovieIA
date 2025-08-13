import { Search } from "lucide-react";
import movie_unknow from "@/assets/movie_unknow.jpg";

interface SearchBarDesktopProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  isSearching: boolean;
  navigate: (path: string) => void;
}

export function SearchBarDesktop({ searchTerm, setSearchTerm, searchResults, setSearchResults, isSearching, navigate }: SearchBarDesktopProps) {
  return (
    <div className="hidden md:flex flex-col items-start relative w-full max-w-md">
      <div className="flex items-center gap-2 w-full bg-zinc-800 rounded-md px-3 py-2 shadow-inner">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar películas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchTerm.trim()) {
              navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
              setSearchTerm("");
              setSearchResults([]);
            }
          }}
          className="bg-transparent outline-none w-full text-sm text-white placeholder-zinc-400"
        />
      </div>

      {/* Resultados */}
      {searchTerm && searchResults.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-zinc-800 rounded-md shadow-lg max-h-72 overflow-auto z-50 animate-fade-in">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              onClick={() => {
                navigate(`movies/${movie.id}`);
                setSearchTerm("");
                setSearchResults([]);
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 cursor-pointer transition-colors"
            >
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : movie_unknow}
                alt={movie.title}
                className="w-10 h-16 object-cover rounded"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{movie.title}</p>
                <p className="text-xs text-zinc-400">{movie.release_date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Indicador de búsqueda */}
      {isSearching && (
        <div className="absolute top-full mt-2 text-white text-sm">Buscando...</div>
      )}
    </div>
  );
}
