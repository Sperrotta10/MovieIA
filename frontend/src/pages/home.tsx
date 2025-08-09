import MovieCarousel from "@/components/movies/MovieCarousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchNowPlayingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies} from "@/services/tmdb";
import { useState, useEffect } from "react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { env } from "@/config/enviroment";

const API_KEY = env.VITE_API_KEY ?? ''; // Reemplaza aquí tu key

type ApiMovie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

export function Home() {

    useScrollRestoration();
    
    const navigate = useNavigate();
    const [nowPlayingMovies, setNowPlayingMovies] = useState<ApiMovie[]>([]);
    const [popularMovies, setPopularMovies] = useState<ApiMovie[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<ApiMovie[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<ApiMovie[]>([]);
    const [page] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            const nowPlaying = await fetchNowPlayingMovies(page, API_KEY);
            const popular = await fetchPopularMovies(page, API_KEY);
            const topRated = await fetchTopRatedMovies(page, API_KEY);
            const upcoming = await fetchUpcomingMovies(page, API_KEY);

            setNowPlayingMovies(nowPlaying.results);
            setPopularMovies(popular.results);
            setTopRatedMovies(topRated.results);
            setUpcomingMovies(upcoming.results);
        };

        fetchData();
    }, []);


    const formatMovies = (movies: ApiMovie[]) => {
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "/no-image.png",
            vote_average: movie.vote_average ?? 0,
        }));
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">

                <div className="w-full max-w-[1325px] mx-auto px-4">
                    <div className="flex justify-between items-center ml-4 mr-4">
                        <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#00ffff]">
                        🎬 Películas en Cartelera
                        </h2>
                        <Button className="" onClick={() => navigate('/category/now-playing')}>Ver Todas</Button>
                    </div>
                    <MovieCarousel movies={formatMovies(nowPlayingMovies)} />
                </div>

                <div className="w-full max-w-[1325px] mx-auto px-4">
                    <div className="flex justify-between items-center ml-4 mr-4">
                        <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#39ff14]">
                        🎬 Películas Populares
                        </h2>
                        <Button className="" onClick={() => navigate('/category/popular')}>Ver Todas</Button>
                    </div>

                    <MovieCarousel movies={formatMovies(popularMovies)} />
                </div>

                <div className="w-full max-w-[1325px] mx-auto px-4">
                    
                    <div className="flex justify-between items-center ml-4 mr-4">
                        <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#ff00ff]">
                        🎬 Películas Top Raiting
                        </h2>
                        <Button className="" onClick={() => navigate('/category/top-rated')}>Ver Todas</Button>
                    </div>
                    <MovieCarousel movies={formatMovies(topRatedMovies)} />
                </div>

                <div className="w-full max-w-[1325px] mx-auto px-4">
                    
                    <div className="flex justify-between items-center ml-4 mr-4">
                        <h2 className="text-3xl font-bold text-left py-6 drop-shadow-[0_0_6px_#ff00ff]">
                        🎬 Películas Proximamente
                        </h2>
                        <Button className="" onClick={() => navigate('/category/upcoming')}>Ver Todas</Button>
                    </div>
                    <MovieCarousel movies={formatMovies(upcomingMovies)} />
                </div>
            </div>
        </div>
    );
}
