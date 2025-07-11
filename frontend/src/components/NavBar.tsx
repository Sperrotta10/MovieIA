// components/Navbar.tsx
import { useState } from "react";
import { Menu, X, Search, User, ListVideo, LogIn } from "lucide-react";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <div className="text-2xl font-bold">MovieIA</div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 w-1/2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar películas..."
          className="bg-zinc-800 rounded-md px-3 py-1 w-full text-sm text-white focus:outline-none"
        />
      </div>

      {/* Right Buttons (desktop) */}
      <div className="hidden md:flex items-center gap-6">
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
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden z-20"
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
        </ul>
      </div>
    </nav>
  );
}
