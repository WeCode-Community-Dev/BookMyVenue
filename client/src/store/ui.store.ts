import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => {
  const getInitialMode = (): ThemeMode => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-mode') as ThemeMode;
      if (stored === 'light' || stored === 'dark') return stored;

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  };

  const initialMode = getInitialMode();

  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', initialMode === 'dark');
  }

  return {
    themeMode: initialMode,
    sidebarOpen: false,
    toggleThemeMode: () =>
      set((state) => {
        const nextMode = state.themeMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme-mode', nextMode);
        document.documentElement.classList.toggle('dark', nextMode === 'dark');
        return { themeMode: nextMode };
      }),
    setThemeMode: (mode: ThemeMode) => {
      localStorage.setItem('theme-mode', mode);
      document.documentElement.classList.toggle('dark', mode === 'dark');
      set({ themeMode: mode });
    },
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  };
});
