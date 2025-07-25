import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { ScrollToTop } from '@/components/ScrollTop'
import { NowPlayingPage } from '@/pages/NowPlaying';
import { ProximamentePage } from '@/pages/Proximamente';
import { PopularPage } from '@/pages/Popular';
import { TopRatedPage } from '@/pages/TopRaiting';  
import { MovieDetails } from '@/pages/MovieDetails'
import { SearchResults } from '@/pages/SearchResults';
import { Chat } from '@/pages/Chat';
import { NotFound404 } from '@/pages/NotFound404';

export default function RouterPage() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/now-playing" element={<NowPlayingPage />} />
        <Route path="/category/upcoming" element={<ProximamentePage />} />
        <Route path="/category/popular" element={<PopularPage />} />
        <Route path="/category/top-rated" element={<TopRatedPage />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
}