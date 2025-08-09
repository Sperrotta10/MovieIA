import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react"; // Ícono de estrella
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  horizontal?: boolean;
  moviesCount: number; // Para manejar el scroll y restaurar la posición
}

export default function MovieCard({ id, title, imageUrl, rating, horizontal, moviesCount }: MovieCardProps) {
    const navigate = useNavigate();

    function handleCardClick(e: React.MouseEvent) {
      e.preventDefault();  // Previene navegación nativa si existiese
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      sessionStorage.setItem("moviesLoaded", moviesCount.toString());
      navigate(`movies/${id}`);
    }

    function handleAddToWatchlist() {
        const saved = JSON.parse(localStorage.getItem("watchlistData") || JSON.stringify({ toWatch: [], watched: [], favorites: [] }));

        // Nos aseguramos de que saved sea un objeto con arrays
        if (!saved.toWatch) saved.toWatch = [];

        if (!saved.toWatch.find((m: any) => m.id === Number(id))) {
          saved.toWatch.push({ id: Number(id), title, imageUrl, rating });
          localStorage.setItem("watchlistData", JSON.stringify(saved));

          toast.success(`"${title}" se agregó a tu watchlist 🎬`, { duration: 2500 });
        } else {
          toast.error(`"${title}" ya está en tu watchlist.`, { duration: 2000 });
        }
    }

    if (horizontal) {
      return (
        <Card onClick={(e) => handleCardClick(e)} className="flex flex-row w-full h-[140px] rounded-xl overflow-hidden shadow-md bg-white dark:bg-zinc-900">
          <img src={imageUrl} alt={title} className="w-[100px] h-full object-cover" />

          <div className="flex flex-col justify-between p-4 flex-1">
            <div>
              <h2 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</h2>
              <div className="flex items-center gap-1 text-yellow-400 mt-1">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rating.toFixed(1)}</span>
              </div>
            </div>
            <Button onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(); }} variant="secondary" className="w-full text-sm">
              + Watchlist
            </Button>
          </div>
        </Card>
      );
    }

    // vertical version (actual)
    return (
      <Card onClick={(e) => handleCardClick(e)} className="w-[200px] h-[500px] flex flex-col justify-between rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg bg-white dark:bg-zinc-900">
        <img src={imageUrl} alt={title} className="w-full h-[320px] object-cover" />

        <CardContent className="p-4 space-y-2 text-center flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400 mt-2">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 mt-auto">
          <Button onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(); }} className="w-full" variant="secondary">
            + Watchlist
          </Button>
        </CardFooter>
      </Card>
    );
}