import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { NowPlayingPage } from '@/pages/NowPlaying';

export default function RouterPage() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/now-playing" element={<NowPlayingPage />} />
      {/* Aquí puedes agregar más rutas según sea necesario */}
    </Routes>
  );
}