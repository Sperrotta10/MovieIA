import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "debounce";
import { fetchSearchMovies } from "@/services/tmdb";
import { env } from "@/config/enviroment";
import { SearchBarDesktop } from "@/components/searchBar/SearchBarDesktop"
import { SearchBarMobile } from "@/components/searchBar/SearchBarMobile";
import { ButtonsNavigation } from "@/components/navigation/ButtonsNavigation";
import { ButtonsNavigationMobile } from "@/components/navigation/ButtonsNavigationMobile";

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

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-zinc-300 transition-colors">
        MovieIA
      </Link>

      {/* Barra de búsqueda desktop */}
      <SearchBarDesktop
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        isSearching={isSearching}
        navigate={navigate}
      />

      {/* Botones right desktop */}
      <ButtonsNavigation
        isLoggedIn={isLoggedIn}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        navigate={navigate}
      />

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

        <SearchBarMobile
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSearchResults={setSearchResults}
          setMenuOpen={setMenuOpen}
          navigate={navigate}
        />

        <ButtonsNavigationMobile
          isLoggedIn={isLoggedIn}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          navigate={navigate}
          setMenuOpen={setMenuOpen}
        />

      </div>
    </nav>
  );
}
