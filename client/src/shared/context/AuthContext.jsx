import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [user, setUser] = useState(() => {

      const auth = localStorage.getItem('auth');

      return auth
         ? JSON.parse(auth)
         : null;

   });

   const login = (data) => {

      localStorage.setItem(
         'auth',
         JSON.stringify(data)
      );

      setUser(data);

   };

   const logout = () => {

      localStorage.removeItem('auth');

      setUser(null);

   };

   return (

      <AuthContext.Provider
         value={{
            user,
            login,
            logout
         }}
      >
         {children}
      </AuthContext.Provider>

   );

};

export const useAuth = () => useContext(AuthContext);