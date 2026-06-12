import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const login = (user, accessToken) => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "accessToken",
      accessToken
    );

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);