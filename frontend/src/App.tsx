import RouterPage from "./routes/routes";
import Navbar from "./components/NavBar/NavBar"
import { useDarkMode } from "./hooks/ModeOscuro"

function App() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <>
      <Navbar 
        isLoggedIn={false}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)} />
      <RouterPage />
    </>
  )
}

export default App
