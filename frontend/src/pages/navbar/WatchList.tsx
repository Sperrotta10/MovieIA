import { useState, useEffect } from "react";
import MovieCard from "@/components/movies/MovieCard";

type Movie = {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
};

type Section = "toWatch" | "watched" | "favorites";

export function WatchlistPage() {
    const [activeSection, setActiveSection] = useState<Section>("toWatch");
    const [lists, setLists] = useState<Record<Section, Movie[]>>({
        toWatch: [],
        watched: [],
        favorites: [],
    });

    // Cargar listas desde localStorage
    useEffect(() => {
    const saved = localStorage.getItem("watchlistData");
    if (saved) {
        try {
        setLists(JSON.parse(saved));
        } catch {
        setLists({
            toWatch: [],
            watched: [],
            favorites: [],
        });
        }
    }
    }, []);

    const removeFromList = (section: Section, id: number) => {
        setLists((prev) => ({
        ...prev,
        [section]: prev[section].filter((movie) => movie.id !== id),
        }));
    };

    const moveToList = (from: Section, to: Section, movie: Movie) => {
        setLists((prev) => ({
        ...prev,
        [from]: prev[from].filter((m) => m.id !== movie.id),
        [to]: [...prev[to], movie],
        }));
    };

    return (
        <div className="flex h-screen bg-zinc-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-800 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-6">🎬 Mi Watchlist</h2>
            <button
            className={`text-left px-3 py-2 rounded-lg transition ${
                activeSection === "toWatch" ? "bg-blue-600" : "hover:bg-zinc-700"
            }`}
            onClick={() => setActiveSection("toWatch")}
            >
            🎯 Quiero ver
            </button>
            <button
            className={`text-left px-3 py-2 rounded-lg transition ${
                activeSection === "watched" ? "bg-blue-600" : "hover:bg-zinc-700"
            }`}
            onClick={() => setActiveSection("watched")}
            >
            ✅ Vistas
            </button>
            <button
            className={`text-left px-3 py-2 rounded-lg transition ${
                activeSection === "favorites" ? "bg-blue-600" : "hover:bg-zinc-700"
            }`}
            onClick={() => setActiveSection("favorites")}
            >
            ⭐ Favoritas
            </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold mb-4">
            {activeSection === "toWatch" && "🎯 Películas que quiero ver"}
            {activeSection === "watched" && "✅ Películas vistas"}
            {activeSection === "favorites" && "⭐ Mis favoritas"}
            </h1>

            {lists[activeSection].length === 0 ? (
            <p className="text-zinc-400">No tienes películas en esta sección.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {lists[activeSection].map((movie) => (
                <div key={movie.id} className="relative">
                    <MovieCard
                    id={movie.id.toString()}
                    title={movie.title}
                    imageUrl={movie.imageUrl}
                    rating={movie.rating}
                    moviesCount={lists[activeSection].length}
                    />

                    {/* Acción contextual */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {activeSection !== "favorites" && (
                        <button
                        className="bg-yellow-500 px-2 py-1 rounded text-sm"
                        onClick={() =>
                            moveToList(activeSection, "favorites", movie)
                        }
                        >
                        ⭐
                        </button>
                    )}
                    {activeSection !== "watched" && (
                        <button
                        className="bg-green-500 px-2 py-1 rounded text-sm"
                        onClick={() =>
                            moveToList(activeSection, "watched", movie)
                        }
                        >
                        ✅
                        </button>
                    )}
                    <button
                        className="bg-red-500 px-2 py-1 rounded text-sm"
                        onClick={() => removeFromList(activeSection, movie.id)}
                    >
                        🗑
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </main>
        </div>
    );
}
