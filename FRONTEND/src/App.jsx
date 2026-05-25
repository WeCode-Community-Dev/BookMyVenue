import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/Navbar"
import HomePage from "./pages/HomePage"

function App() {

  return (
    <div className="Main-Container">
      <NavBar/>
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
