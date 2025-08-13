
interface ButtonsMobileProps {
    sections: Array<"toWatch" | "watched" | "favorites">;
    activeSection: "toWatch" | "watched" | "favorites";
    setActiveSection: (section: "toWatch" | "watched" | "favorites") => void;
}

export function ButtonsMobile({ sections, activeSection, setActiveSection }: ButtonsMobileProps) {

    const labels = {
        toWatch: "🎯 Quiero ver",
        watched: "✅ Vistas",
        favorites: "⭐ Favoritas",
    };

    return(
        <div className="md:hidden fixed left-0 right-0 p-2 flex justify-around z-40 border-b border-zinc-700">
            {sections.map((section) => (
            <button
                key={section}
                className={`px-3 py-2 rounded-lg transition font-semibold ${
                activeSection === section
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700"
                }`}
                onClick={() => setActiveSection(section)}
            >
                {labels[section]}
            </button>
            ))}
        </div>
    )
}