import RouterPage from "./routes/routes";
import Navbar from "./components/NavBar"
import { useDarkMode } from "./hooks/ModeOscuro"
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <Router>
      <Navbar 
        isLoggedIn={false}
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)} />
      <RouterPage />
    </Router>
  )
}

export default App
