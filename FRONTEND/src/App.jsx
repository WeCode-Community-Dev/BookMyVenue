import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"

function App() {

  return (
    <div className="Main-Container">      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
