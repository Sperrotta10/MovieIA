import { Home } from "./pages/home"
import Navbar from "./components/NavBar"

function App() {

  return (
    <>
      <Navbar isLoggedIn={false} />
      <Home />
    </>
  )
}

export default App
