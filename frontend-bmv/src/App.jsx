import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bmv_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('bmv_user');
      }
    }
    return null;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    // If already logged in, go to dashboard; otherwise show landing page
    const savedUser = localStorage.getItem('bmv_user');
    return savedUser ? 'dashboard' : 'landing';
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('bmv_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bmv_user');
    setCurrentPage('landing');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-root">
      {currentPage === 'landing' && (
        <LandingPage
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {(currentPage === 'login' || currentPage === 'register') && (
        <div className="app-container">
          <header className="app-header">
            <div className="logo-container">
              <button className="logo-link" onClick={() => handleNavigate('landing')}>
                <span className="logo-text">BookMyVenue</span>
              </button>
            </div>
          </header>

          <main className="app-content">
            {currentPage === 'login' && (
              <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
            )}
            {currentPage === 'register' && (
              <Register onRegisterSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
            )}
          </main>

          <footer className="app-footer-info">
            <p>© {new Date().getFullYear()} BookMyVenue. All rights reserved.</p>
          </footer>
        </div>
      )}

      {currentPage === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
