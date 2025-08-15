import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Intenta recuperar la preferencia guardada
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    try {
      const className = "dark";
      const html = window.document.documentElement;

      if (isDark) {
        html.classList.add(className);
        localStorage.setItem("darkMode", "true");
      } else {
        html.classList.remove(className);
        localStorage.setItem("darkMode", "false");
      }
    } catch (error) {
      console.error("Error al establecer el modo oscuro:", error);
    }
    
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
