import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardHorizontalProps {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  onAddToWatchlist: () => void;
  moviesCount: number; // Para manejar el scroll y restaurar la posición
}

function MovieCardHorizontal({ id, title, imageUrl, rating, onAddToWatchlist, moviesCount }: MovieCardHorizontalProps) {

  const navigate = useNavigate();

  function handleCardClick() {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    sessionStorage.setItem("moviesLoaded", moviesCount.toString());
    navigate(`movies/${id}`);
  }

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-zinc-900"
    >
      <div
        className="
            w-full
            aspect-[2/3]
            md:w-[150px]
            md:h-[200px]
            md:aspect-auto
            overflow-hidden
            relative
        "
        >
            <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>


      <div className="flex flex-col justify-between flex-1">
        <CardContent className="p-4 space-y-2 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h2>

          <div className="flex items-center gap-1 text-yellow-400 mt-1">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {rating.toFixed(1)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWatchlist();
            }}
            variant="secondary"
            className="w-full md:w-auto"
          >
            + Watchlist
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default MovieCardHorizontal;
