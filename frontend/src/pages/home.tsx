import MovieCarousel from "@/components/MovieCarousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Home() {

    const navigate = useNavigate();

  return (
    <div className="min-h-scree">

        <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-[1325px] mx-auto px-4">
                <div className="flex justify-between items-center ml-4 mr-4">
                    <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#00ffff]">
                    🎬 Películas en Cartelera
                    </h2>
                    <Button className="" onClick={() => navigate('/category/now-playing')}>Ver Todas</Button>
                </div>
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                <div className="flex justify-between items-center ml-4 mr-4">
                    <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#39ff14]">
                    🎬 Películas Recomendadas
                    </h2>
                    <Button className="">Ver Todas</Button>
                </div>
                
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                
                <div className="flex justify-between items-center ml-4 mr-4">
                    <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#ff00ff]">
                    🎬 Películas Recomendadas
                    </h2>
                    <Button className="">Ver Todas</Button>
                </div>
                <MovieCarousel />
            </div>
        </div>
    </div>
  );
}
