import { useState, useEffect } from "react";
import { MovieCard } from "@/components/movies/Cards/MovieCard";
import { useIsMobile } from "@/hooks/IsMovil"
import { SideBar } from "@/components/NavBar/WhatchList/sidebar/SideBar"
import { ButtonsMobile } from "@/components/NavBar/WhatchList/sidebar/ButtonsMobile";
import type { Movie } from "@/types/movie";


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
                        poster_path={movie.poster_path}
                        vote_average={movie.vote_average}
                        horizontal={isMobile}
                        moviesCount={lists[activeSection].length}
                        />
                    </div>
                    ))}
                </div>
                )}
            </main>
        </div>
    );
}

