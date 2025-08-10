import { useState, useEffect } from "react";
import MovieCard from "@/components/movies/MovieCard";
import { useIsMobile } from "@/hooks/IsMovil"
import { SideBar } from "@/components/NavBar/sidebar/SideBar"
import { ButtonsMobile } from "@/components/NavBar/sidebar/ButtonsMobile";

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
    const isMobile = useIsMobile();

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
        localStorage.setItem("watchlistData", JSON.stringify({
            ...lists,
            [section]: lists[section].filter((movie) => movie.id !== id),
        }));
        
    };

    const moveToList = (from: Section, to: Section, movie: Movie) => {
        setLists((prev) => ({
        ...prev,
        [from]: prev[from].filter((m) => m.id !== movie.id),
        [to]: [...prev[to], movie],
        }));
        localStorage.setItem("watchlistData", JSON.stringify({
            ...lists,
            [from]: lists[from].filter((m) => m.id !== movie.id),
            [to]: [...lists[to], movie],
        }));
    };

    const sections: Section[] = ["toWatch", "watched", "favorites"];
    const labels = {
        toWatch: "🎯 Quiero ver",
        watched: "✅ Vistas",
        favorites: "⭐ Favoritas",
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Desktop */}
            <SideBar
                sections={sections}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Mobile top buttons */}
            <ButtonsMobile
                sections={sections}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* Main content */}
            <main className="flex-1 p-6 pt-20 md:pt-6">
                <h1 className="text-2xl font-semibold mb-4">
                {labels[activeSection]}
                </h1>

                {lists[activeSection].length === 0 ? (
                <p className="text-zinc-400">No tienes películas en esta sección.</p>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {lists[activeSection].map((movie) => (
                    <div key={movie.id} className="relative">
                        <MovieCard
                        id={movie.id.toString()}
                        title={movie.title}
                        imageUrl={movie.imageUrl}
                        rating={movie.rating}
                        horizontal={isMobile}
                        moviesCount={lists[activeSection].length}
                        />

                        {/* Botones de acción */}
                        <div className="absolute top-2 right-7 flex flex-row md:flex-col gap-2 md:gap-1">
                        {activeSection !== "favorites" && (
                            <button
                            className="bg-yellow-500 p-1 md:px-2 md:py-1 rounded text-sm transition-transform hover:scale-110"
                            onClick={() => moveToList(activeSection, "favorites", movie)}
                            >
                            ⭐
                            </button>
                        )}
                        {activeSection !== "watched" && (
                            <button
                            className="bg-green-500 p-1 md:px-2 md:py-1 rounded text-sm transition-transform hover:scale-110"
                            onClick={() => moveToList(activeSection, "watched", movie)}
                            >
                            ✅
                            </button>
                        )}
                        <button
                            className="bg-red-500 p-1 md:px-2 md:py-1 rounded text-sm transition-transform hover:scale-110"
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

