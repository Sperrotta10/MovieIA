import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom";

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

    return(
        <Card onClick={handleCardClick} key={movie.id} className="p-0">
            <CardContent className="p-2">
                <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="rounded-lg w-full object-cover mb-2"
                />
                <p className="text-sm font-medium">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                ⭐ {movie.rating}
                </p>
            </CardContent>
        </Card>
    )
}