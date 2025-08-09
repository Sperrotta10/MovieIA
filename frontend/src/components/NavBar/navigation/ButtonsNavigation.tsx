import { User, ListVideo, LogIn, Sun, Moon, LucideBotMessageSquare } from "lucide-react";


interface ButtonsNavigationProps {
  isLoggedIn: boolean;
  isDark: boolean;
  toggleDarkMode: () => void;
  navigate: (path: string) => void;
}

export function ButtonsNavigation({ isLoggedIn, isDark, toggleDarkMode, navigate }: ButtonsNavigationProps) {

    return(
    
        <div className="hidden md:flex items-center gap-6">

            <button onClick={() => navigate("/chat")} className="flex items-center gap-1 hover:text-zinc-300">
            <LucideBotMessageSquare className="w-5 h-5" /> Chat
            </button>

            <button onClick={() => navigate("/watchlist")} className="flex items-center gap-1 hover:text-zinc-300">
            <ListVideo className="w-5 h-5" /> 
            <p>Watchlist</p>
            </button>

            {/*
            {isLoggedIn ? (
            <button className="flex items-center gap-1 hover:text-zinc-300">
                <User className="w-5 h-5" /> 
                <p>Perfil</p>
            </button>
            ) : (
            <button className="flex items-center gap-1 hover:text-zinc-300">
                <LogIn className="w-5 h-5" /> 
                <p>Sign In</p>
            </button>
            )}
            */}

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
    )
}