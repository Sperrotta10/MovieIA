import { Home } from "./pages/home"
import Navbar from "./components/NavBar"
import { useDarkMode } from "./hooks/ModeOscuro"

function App() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <>
      <Navbar
        isLoggedIn={false}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
      />
      <Home />
    </>
  )
}

export default App
