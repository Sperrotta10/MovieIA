import MovieCarousel from "@/components/MovieCarousel";

export function Home() {
  return (
    <div className="min-h-scree">

        <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-neonBlue drop-shadow-[0_0_6px_#00ffff]">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-neonGreen drop-shadow-[0_0_6px_#39ff14]">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-neonPink drop-shadow-[0_0_6px_#ff00ff]">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>
        </div>
    </div>
  );
}
