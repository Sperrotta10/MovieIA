import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { ScrollToTop } from '@/components/ScrollTop'
import { NowPlayingPage } from '@/pages/NowPlaying';
import { ProximamentePage } from '@/pages/Proximamente';
import { PopularPage } from '@/pages/Popular';
import { TopRatedPage } from '@/pages/TopRaiting';  
import MovieDetails from '@/components/MovieDetails'

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
      </Routes>
    </>
  );
}