interface SideBarProps {
    sections: Array<"toWatch" | "watched" | "favorites">;
    activeSection: "toWatch" | "watched" | "favorites";
    setActiveSection: (section: "toWatch" | "watched" | "favorites") => void;
}

export function SideBar({ sections, activeSection, setActiveSection }: SideBarProps) {
    const labels = {
        toWatch: "🎯 Quiero ver",
        watched: "✅ Vistas",
        favorites: "⭐ Favoritas",
    };

    return (
        <aside className="hidden md:flex w-64 h-screen dark:bg-zinc-900 bg-zinc-100 p-6 flex-col gap-4 sticky top-0">
            <h2 className="text-xl font-bold mb-6">🎬 Mi Watchlist</h2>
            {sections.map((section) => (
                <button
                    key={section}
                    className={`text-left px-3 py-2 rounded-lg transition w-full ${
                        activeSection === section ? "bg-blue-600" : "hover:bg-zinc-700"
                    }`}
                    onClick={() => setActiveSection(section)}
                >
                    {labels[section]}
                </button>
            ))}
        </aside>
    );
}