import { useState, useEffect } from "react";
import { Menu, X, Search, User, ListVideo, LogIn, Sun, Moon, LucideBotMessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "debounce";
import { fetchSearchMovies } from "@/services/tmdb";
import { env } from "@/config/enviroment";

// Asegúrate de que esta función esté definida en tu servicio
const API_KEY = env.VITE_API_KEY ?? '';

interface NavbarProps {
  isLoggedIn: boolean;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ isLoggedIn, isDark, toggleDarkMode }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // Función para buscar películas con debounce
  const fetchMovies = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetchSearchMovies(query, API_KEY);
      setSearchResults(response.results.slice(0, 5));
    } catch (error) {
      console.error("Error al buscar películas:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Crea versión con debounce para no saturar peticiones
  const debouncedFetch = debounce(fetchMovies, 500);

  useEffect(() => {
    debouncedFetch(searchTerm);

    // Limpia debounce al desmontar o cambiar searchTerm
    return () => {
      if (typeof (debouncedFetch as any).cancel === "function") {
        (debouncedFetch as any).cancel();
      }
    };
  }, [searchTerm]);

  // Render de la barra de búsqueda para desktop
  const SearchBarDesktop = (
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
  );

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-zinc-300 transition-colors">
        MovieIA
      </Link>

      {/* Barra de búsqueda desktop */}
      {SearchBarDesktop}

      {/* Botones right desktop */}
      <div className="hidden md:flex items-center gap-6">

        <button onClick={() => navigate("/chat")} className="flex items-center gap-1 hover:text-zinc-300">
          <LucideBotMessageSquare className="w-5 h-5" /> Chat
        </button>

        <button className="flex items-center gap-1 hover:text-zinc-300">
          <ListVideo className="w-5 h-5" /> Watchlist
        </button>

        {isLoggedIn ? (
          <button className="flex items-center gap-1 hover:text-zinc-300">
            <User className="w-5 h-5" /> Perfil
          </button>
        ) : (
          <button className="flex items-center gap-1 hover:text-zinc-300">
            <LogIn className="w-5 h-5" /> Sign In
          </button>
        )}

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
        <div className="mb-7 mt-6">
          <input
            type="text"
            placeholder="Buscar películas..."
            className="bg-zinc-800 rounded-md px-3 py-2 w-full text-sm text-white focus:outline-none"
            // Si quieres, puedes implementar funcionalidad similar en móvil aquí también
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchTerm.trim()) {
                navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
                setSearchTerm("");
                setSearchResults([]);
                setMenuOpen(false);
              }
            }}
          />
        </div>
        <ul className="space-y-4">
          <li>
            <button onClick={() => navigate("/chat")} className="flex items-center gap-2">
              <LucideBotMessageSquare className="w-5 h-5" /> Chat
            </button>
          </li>
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
          <li>
            <button
              onClick={() => {
                toggleDarkMode();
                setMenuOpen(false);
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
