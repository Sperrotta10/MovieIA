# 🎬 MovieIA — Recomendador de Películas Inteligente

MovieIA es una aplicación web moderna diseñada para que descubras y explores películas de manera visual, rápida e intuitiva. Su interfaz presenta un elegante carrusel horizontal, que te permite navegar fácilmente entre los títulos más populares y añadirlos a tu Watchlist con un solo clic.

Además, incorpora un ChatBot impulsado por inteligencia artificial, capaz de recomendarte películas personalizadas según los parámetros y preferencias que le indiques en tus mensajes.

---

## ✨ Características

- 🖼️ Carrusel horizontal de películas (scroll o flechas)
- 🌙 Soporte completo para modo oscuro
- 🧠 Preparado para integración con chatbot (IA)
- ✅ Interfaz responsiva y moderna
- 🔖 Funcionalidad para agregar películas a tu Watchlist, peliculas favoritas o peliculas vistas
- 🔍 Buscador de peliculas
- 🎨 Estilo limpio gracias a Tailwind + shadcn/ui

---

## 🛠️ Tecnologías Utilizadas

<table>
  <tr>
    <th>Tecnología</th>
    <th>Descripción</th>
    <th>Enlace</th>
  </tr>
  <tr>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="20" alt="React"> React</td>
    <td>Librería principal para construcción de UI</td>
    <td><a href="https://reactjs.org/">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://vitejs.dev/logo.svg" width="20" alt="Vite"> Vite</td>
    <td>Entorno de desarrollo ultrarrápido</td>
    <td><a href="https://vitejs.dev/">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="20" alt="Tailwind"> Tailwind CSS</td>
    <td>Framework CSS utility-first</td>
    <td><a href="https://tailwindcss.com/">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://ui.shadcn.com/favicon.ico" width="20" alt="shadcn"> shadcn/ui</td>
    <td>Componentes UI elegantes y accesibles</td>
    <td><a href="https://ui.shadcn.com/">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://lucide.dev/favicon.ico" width="20" alt="Lucide"> Lucide Icons</td>
    <td>Set de íconos modernos</td>
    <td><a href="https://lucide.dev/">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://www.themoviedb.org/favicon.ico" width="20" alt="TMDB"> TMDb API</td>
    <td>Base de datos de películas</td>
    <td><a href="https://www.themoviedb.org/documentation/api">🔗</a></td>
  </tr>
  <tr>
    <td><img src="https://console.groq.com/groq-circle.png" width="20" alt="Groq"> Groq</td>
    <td>asistente de inteligencia artificial</td>
    <td><a href="https://groq.com/">🔗</a></td>
  </tr>
</table>

---

## 📁 Estructura del Proyecto

```bash
MovieIA/
├── backend/                       # API y lógica del servidor
│   └── src/
│       ├── app.js                  # Punto de entrada del backend
│       ├── config/
│       │   └── enviroment.js       # Configuración de variables de entorno
│       ├── controller/
│       │   └── chat.controller.js  # Controlador para el chatbot
│       ├── model/
│       │   └── chat.service.js     # Servicio de datos para el chat
│       ├── router/
│       │   └── chat.route.js       # Rutas del chatbot
│       └── service/
│           ├── tmdb.js             # Integración con API de TMDB
│           └── utils/
│               ├── entities.js     # Definiciones y entidades auxiliares
│               └── metodos_aux.js  # Métodos auxiliares
│
├── frontend/                      # Aplicación cliente en React + TailwindCSS
│   ├── vite.svg
│   │
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── vite-env.d.ts
│       │
│       ├── assets/                # Recursos estáticos
│       │   ├── movie_unknow.jpg
│       │   ├── react.svg
│       │   └── user_unknow.jpg
│       │
│       ├── components/            # Componentes reutilizables
│       │   ├── ScrollTop.tsx
│       │   │
│       │   ├── movies/
│       │   │   ├── LoadMovies.tsx
│       │   │   │
│       │   │   ├── Cards/         # Tarjetas para mostrar películas
│       │   │   │   ├── MovieCard.tsx
│       │   │   │   └── MovieCardHorizontal.tsx
│       │   │   │
│       │   │   ├── Home/
│       │   │   │   └── MovieCarousel.tsx
│       │   │   │
│       │   │   └── movieDetails/  # Vista de detalles de película
│       │   │       ├── ButtonsAction.tsx
│       │   │       ├── Cast_crew.tsx
│       │   │       └── InfoMovie.tsx
│       │   │
│       │   ├── NavBar/            # Barra de navegación y subcomponentes
│       │   │   ├── NavBar.tsx
│       │   │   │
│       │   │   ├── Chat/
│       │   │   │   ├── ChatBot.tsx
│       │   │   │   └── movie/
│       │   │   │       └── MovieCardMsg.tsx
│       │   │   │
│       │   │   ├── navigation/
│       │   │   │   ├── ButtonsNavigation.tsx
│       │   │   │   └── ButtonsNavigationMobile.tsx
│       │   │   │
│       │   │   ├── searchBar/
│       │   │   │   ├── SearchBarDesktop.tsx
│       │   │   │   └── SearchBarMobile.tsx
│       │   │   │
│       │   │   └── WhatchList/
│       │   │       └── sidebar/
│       │   │           ├── ButtonsMobile.tsx
│       │   │           └── SideBar.tsx
│       │   │
│       │   └── ui/                 # Componentes UI de bajo nivel
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── input.tsx
│       │       └── sonner.tsx
│       │
│       ├── config/                 # Configuración general
│       │   └── enviroment.tsx
│       │
│       ├── hooks/                  # Hooks personalizados
│       │   ├── IsMovil.tsx
│       │   ├── ModeOscuro.tsx
│       │   ├── useScrollRestoration.tsx
│       │   └── utils.ts
│       │
│       ├── pages/                  # Vistas principales
│       │   ├── home.tsx
│       │   ├── NotFound404.tsx
│       │   │
│       │   ├── movies/
│       │   │   ├── NowPlaying.tsx
│       │   │   ├── Popular.tsx
│       │   │   ├── Proximamente.tsx
│       │   │   ├── TopRaiting.tsx
│       │   │   └── Details/
│       │   │       └── MovieDetails.tsx
│       │   │
│       │   └── navbar/
│       │       ├── Chat.tsx
│       │       ├── SearchResults.tsx
│       │       └── WatchList.tsx
│       │
│       ├── routes/
│       │   └── routes.tsx
│       │
│       ├── services/               # Servicios API
│       │   ├── chat_ia.ts
│       │   └── tmdb.ts
│       │
│       ├── styles/
│       │   └── index.css
│       │
│       └── types/                  # Tipos TypeScript
│           └── movie.ts
│
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

### Pasos para Frontend y Backend

1. Clona el repositorio:

```bash
git clone https://github.com/Sperrotta10/MovieIA
cd frontend
cd backend
```

2. Instalar las dependencias (Frontend and Backend)

```bash
npm install 
```

3. Ejecutar el programa (Frontend and Backend)

```bash
npm run dev
npm start
```

---

## 📌 Próximas mejoras

- 🤖 Permitir que el chatBot puede recomendar series
- 🔐 Login de usuario
- 🫙 Base de datos para almacenar informacion de los usuarios o del sistema

---

## 📃 Licencia

Este proyecto está bajo la licencia MIT.
Puedes usarlo, modificarlo y compartirlo libremente con atribución.
