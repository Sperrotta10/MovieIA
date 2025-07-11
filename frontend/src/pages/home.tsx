import MovieCarousel from "@/components/MovieCarousel";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">

        <div className="container mx-auto px-4 py-8">
            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-zinc-900 dark:text-white">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-zinc-900 dark:text-white">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>

            <div className="w-full max-w-[1325px] mx-auto px-4">
                <h2 className="text-3xl font-bold text-left py-6 text-zinc-900 dark:text-white">
                🎬 Películas Recomendadas
                </h2>
                <MovieCarousel />
            </div>
        </div>
    </div>
  );
}
