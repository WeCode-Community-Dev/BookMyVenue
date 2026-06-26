import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");

    if (savedToken) {
      const decodedToken = jwtDecode(savedToken);

      setToken(savedToken);
      setCurrentUser({
        id: decodedToken.sub,
        role: decodedToken.role,
      });
    }

    setLoading(false);
  }, []);

  function login(newToken) {
    if (!newToken) return;

    const decodedToken = jwtDecode(newToken);

    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setCurrentUser({
      id: decodedToken.sub,
      role: decodedToken.role,
    });
  }

  function logout() {
    localStorage.removeItem("authToken");
    setToken(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, currentUser, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}