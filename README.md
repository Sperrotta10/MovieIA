# 🎬 MovieIA — Recomendador de Películas Inteligente

MovieIA es una aplicación web moderna que te permite descubrir y explorar películas de forma visual, rápida e intuitiva. Presenta una interfaz tipo **carrusel horizontal**, donde podrás navegar entre los títulos populares y agregarlos a tu **Watchlist**. Próximamente, se integrará un **chatbot basado en IA** para recomendarte películas según tus gustos.

---

## ✨ Características

- 🖼️ Carrusel horizontal de películas (scroll o flechas)
- 🌙 Soporte completo para modo oscuro
- 🧠 Preparado para integración con chatbot (IA)
- ✅ Interfaz responsiva y moderna
- 🔖 Funcionalidad para agregar películas a tu Watchlist
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
    <td>Base de datos de películas (próximamente)</td>
    <td><a href="https://www.themoviedb.org/documentation/api">🔗</a></td>
  </tr>
</table>

---

## 📁 Estructura del Proyecto

```bash
MovieIA/
├── backend/ # API y lógica del servidor (futuro)
│ └── ...
├── frontend/ # Aplicación React + Tailwind
│ ├── public/
│ ├── src/
│ │ ├── components/ # MovieCard, MovieCarousel, etc.
│ │ ├── pages/ # Páginas (Home, Watchlist, etc.)
│ │ ├── styles/ # Estilos globales
│ │ ├── index.css
│ │ ├── main.tsx
│ ├── tailwind.config.js # Configuración Tailwind (opcional)
│ └── package.json
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

1. Clona el repositorio:

```bash
git clone https://github.com/tuusuario/MovieIA.git
cd MovieIA/frontend
   ```

2. Instalar las dependencias

```bash
npm install
```

3. Ejecutar el programa

```bash
npm run deb
```

---

## 📌 Próximas mejoras

- 🤖 Integración con IA (OpenAI o similar) para recomendaciones personalizadas
- 🔐 Login de usuario + gestión de Watchlist
- 📱 Versión optimizada para dispositivos móviles

---

## 📃 Licencia

Este proyecto está bajo la licencia MIT.
Puedes usarlo, modificarlo y compartirlo libremente con atribución.