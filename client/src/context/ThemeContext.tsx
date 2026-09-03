import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants';

// What the user picked (persisted as-is) vs. what's actually painted on
// screen ('system' always resolves to 'light' or 'dark' before being applied).
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? getSystemTheme() : preference;

// Default is 'light' — system detection only kicks in if the user explicitly
// picks "System", not automatically on a first visit.
const getInitialPreference = (): ThemePreference => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'light';
};

const applyTheme = (theme: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themePreference, setPreferenceState] = useState<ThemePreference>(getInitialPreference);
  // The blocking script in index.html already applied the right class before
  // mount — this just needs to agree with it, not re-apply it.
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(themePreference)
  );

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setPreferenceState(preference);
    const resolved = resolveTheme(preference);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    localStorage.setItem(STORAGE_KEYS.THEME, preference);
  }, []);

  // Only "System" stays live-synced to OS changes — an explicit Light/Dark
  // choice is not affected by the OS switching.
  useEffect(() => {
    if (themePreference !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      applyTheme(next);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [themePreference]);

  return (
    <ThemeContext.Provider value={{ themePreference, resolvedTheme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};
