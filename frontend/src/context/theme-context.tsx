'use client';
import React, { createContext, useContext } from 'react';
const ThemeContext = createContext<any>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
export const useThemeContext = () => useContext(ThemeContext);