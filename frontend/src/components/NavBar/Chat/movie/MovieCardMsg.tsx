import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Movie {
    id: number;
    title: string;
    overview: string;
    imageUrl: string;
    rating: number;
}

export function MovieCardMsg({ movie }: { movie: Movie }) {

    const navigate = useNavigate();

    function handleCardClick(e: React.MouseEvent) {
      e.preventDefault();  // Previene navegación nativa si existiese
      navigate(`movies/${movie.id}`);
    }

    function handleAddToWatchlist() {
        const saved = JSON.parse(localStorage.getItem("watchlistData") || JSON.stringify({ toWatch: [], watched: [], favorites: [] }));

        // Nos aseguramos de que saved sea un objeto con arrays
        if (!saved.toWatch) saved.toWatch = [];

        if (!saved.toWatch.find((m: any) => m.id === Number(movie.id))) {
          saved.toWatch.push({ id: Number(movie.id), title: movie.title, imageUrl: movie.imageUrl, rating: movie.rating });
          localStorage.setItem("watchlistData", JSON.stringify(saved));

          toast.success(`"${movie.title}" se agregó a tu watchlist 🎬`, { duration: 2500 });
        } else {
          toast.error(`"${movie.title}" ya está en tu watchlist.`, { duration: 2000 });
        }
    }

    return(
        <Card onClick={(e) => handleCardClick(e)} key={movie.id} className="p-0">
            <CardContent className="p-2 flex-1 flex flex-col justify-between">
                <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="rounded-lg w-full object-cover mb-2"
                />
                <p className="text-sm font-medium">{movie.title}</p>
                <p className="text-xs text-muted-foreground">⭐ {movie.rating}</p>
                <div className="flex gap-2 mt-2">
                    <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
                        onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(); }}
                    >
                        ➕ WatchList
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}