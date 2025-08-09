import { User, ListVideo, LogIn, Sun, Moon, LucideBotMessageSquare } from "lucide-react";


interface ButtonsNavigationMobileProps {
  isLoggedIn: boolean;
  isDark: boolean;
  toggleDarkMode: () => void;
  navigate: (path: string) => void;
  setMenuOpen: (open: boolean) => void;
}

export function ButtonsNavigationMobile({ isLoggedIn, isDark, toggleDarkMode, navigate, setMenuOpen }: ButtonsNavigationMobileProps) {

    return(
        <>
            <ul className="space-y-4">
            <li>
                <button onClick={() => { navigate("/chat"); setMenuOpen(false); }} className="flex items-center gap-2">
                <LucideBotMessageSquare className="w-5 h-5" /> Chat
                </button>
            </li>
            <li>
                <button onClick={() => { navigate("/watchlist"); setMenuOpen(false); }} className="flex items-center gap-2">
                <ListVideo className="w-5 h-5" /> Watchlist
                </button>
            </li>
            {/*
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
            */}
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
        </>
        
    )
}