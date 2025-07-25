import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");

    if (savedPosition) {
      const scrollToSavedPosition = () => {
        const position = parseInt(savedPosition);
        if (document.body.scrollHeight >= position) {
          window.scrollTo({ top: position, behavior: "smooth" });
          sessionStorage.removeItem("scrollPosition");
        } else {
          // Esperar un poco más si aún no está todo el contenido cargado
          setTimeout(scrollToSavedPosition, 50);
        }
      };

      scrollToSavedPosition();
    }
  }, [location.key]);

}
