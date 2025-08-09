import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { ScrollToTop } from '@/components/ScrollTop'
import { NowPlayingPage } from '@/pages/movies/NowPlaying';
import { ProximamentePage } from '@/pages/movies/Proximamente';
import { PopularPage } from '@/pages/movies/Popular';
import { TopRatedPage } from '@/pages/movies/TopRaiting';  
import { MovieDetails } from '@/pages/MovieDetails'
import { SearchResults } from '@/pages/navbar/SearchResults';
import { Chat } from '@/pages/navbar/Chat';
import { NotFound404 } from '@/pages/NotFound404';

export default function RouterPage() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/category/now-playing">
          <Route index element={<NowPlayingPage />} />
          <Route path="movies/:id" element={<MovieDetails />} />
        </Route>

        <Route path="/category/upcoming">
          <Route index element={<ProximamentePage />} />
          <Route path="movies/:id" element={<MovieDetails />} />
        </Route>

        <Route path="/category/popular">
          <Route index element={<PopularPage />} />
          <Route path="movies/:id" element={<MovieDetails />} />
        </Route>

        <Route path="/category/top-rated">
          <Route index element={<TopRatedPage />} />
          <Route path="movies/:id" element={<MovieDetails />} />
        </Route>

        <Route path="movies/:id" element={<MovieDetails />} />
        <Route path="/search">
          <Route index element={<SearchResults />} />
          <Route path="movies/:id" element={<MovieDetails />} />
        </Route>
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
}