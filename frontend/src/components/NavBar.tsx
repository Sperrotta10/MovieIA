import { useState, useEffect } from "react";
import { Menu, X, Search, User, ListVideo, LogIn, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import debounce from "debounce";
import { fetchSearchMovies } from "@/services/tmdb"; // Asegúrate de que esta función esté definida en tu servicio

const API_KEY = import.meta.env.VITE_API_KEY ?? ''; // Reemplaza aquí tu key

interface NavbarProps {
  isLoggedIn: boolean;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ isLoggedIn, isDark, toggleDarkMode }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (query: string) => {
    if (!query) return setSearchResults([]);
    setIsSearching(true);
    try {
      const response = await fetchSearchMovies(query, API_KEY);
      console.log("Search results:", response);
      setSearchResults(response.results.slice(0, 5)); // los 5 primeros
    } catch (error) {
      console.error("Error al buscar películas:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetch = debounce(fetchMovies, 500);

  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => {
      if (typeof (debouncedFetch as any).cancel === "function") {
        (debouncedFetch as any).cancel();
      }
    };
  }, [searchTerm]);
  

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-zinc-300 transition-colors">
        MovieIA
      </Link>

      {/* Search Bar */}
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
                  navigate(`/movie/${movie.id}`);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 cursor-pointer transition-colors"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
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


      {/* Right Buttons (desktop) */}
      <div className="hidden md:flex items-center gap-6">
        {/* Watchlist */}
        <button className="flex items-center gap-1 hover:text-zinc-300">
          <ListVideo className="w-5 h-5" /> Watchlist
        </button>

        {/* Login/Profile */}
        {isLoggedIn ? (
          <button className="flex items-center gap-1 hover:text-zinc-300">
            <User className="w-5 h-5" /> Perfil
          </button>
        ) : (
          <button className="flex items-center gap-1 hover:text-zinc-300">
            <LogIn className="w-5 h-5" /> Sign In
          </button>
        )}

        {/* Toggle Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-1 px-3 py-1 bg-neonBlue text-white rounded hover:bg-neonGreen transition"
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDark ? " Claro" : " Oscuro"}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden z-20"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-3/4 bg-zinc-900 text-white p-6 transform transition-transform duration-300 z-10 shadow-lg ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar películas..."
            className="bg-zinc-800 rounded-md px-3 py-2 w-full text-sm text-white focus:outline-none"
          />
        </div>
        <ul className="space-y-4">
          <li>
            <button className="flex items-center gap-2">
              <ListVideo className="w-5 h-5" /> Watchlist
            </button>
          </li>
          <li>
            {isLoggedIn ? (
              <button className="flex items-center gap-2">
                <User className="w-5 h-5" /> Perfil
              </button>
            ) : (
              <button className="flex items-center gap-2">
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            )}
          </li>
          {/* Toggle Dark Mode - móvil */}
          <li>
            <button
              onClick={() => {
                toggleDarkMode();
                setMenuOpen(false); // cierra menú al cambiar modo
              }}
              className="flex items-center gap-2"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDark ? " Claro" : " Oscuro"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
