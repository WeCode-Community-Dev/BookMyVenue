import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bmv_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (loginResponse) => {
    const userData = {
      userId: loginResponse.userId,
      firstName: loginResponse.firstName,
      email: loginResponse.email,
      phone: loginResponse.phone,
      city: loginResponse.city,
      role: loginResponse.role,
      token: loginResponse.token
    };

    setUser(userData);

    localStorage.setItem(
      "bmv_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "bmv_token",
      loginResponse.token
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bmv_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}