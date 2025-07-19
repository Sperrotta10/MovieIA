import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hace scroll al top de la página cada vez que cambia la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
