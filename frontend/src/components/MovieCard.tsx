import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react"; // Ícono de estrella
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  onAddToWatchlist: () => void;
  horizontal?: boolean;
}

export default function MovieCard({ id, title, imageUrl, rating, onAddToWatchlist, horizontal }: MovieCardProps) {
  const navigate = useNavigate();

  if (horizontal) {
    return (
      <Card onClick={() => navigate(`/movies/${id}`)} className="flex flex-row w-full h-[140px] rounded-xl overflow-hidden shadow-md bg-white dark:bg-zinc-900">
        <img src={imageUrl} alt={title} className="w-[100px] h-full object-cover" />

        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h2 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</h2>
            <div className="flex items-center gap-1 text-yellow-400 mt-1">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rating.toFixed(1)}</span>
            </div>
          </div>
          <Button onClick={(e) => { e.stopPropagation(); onAddToWatchlist(); }} variant="secondary" className="w-full text-sm">
            + Watchlist
          </Button>
        </div>
      </Card>
    );
  }

  // vertical version (actual)
  return (
    <Card onClick={() => navigate(`/movies/${id}`)} className="w-[200px] h-[500px] flex flex-col justify-between rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg bg-white dark:bg-zinc-900">
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
        <Button onClick={(e) => { e.stopPropagation(); onAddToWatchlist(); }} className="w-full" variant="secondary">
          + Watchlist
        </Button>
      </CardFooter>
    </Card>
  );
}