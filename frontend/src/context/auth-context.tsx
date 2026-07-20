'use client';
import React, { createContext, useContext } from 'react';
const AuthContext = createContext<any>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
export const useAuthContext = () => useContext(AuthContext);