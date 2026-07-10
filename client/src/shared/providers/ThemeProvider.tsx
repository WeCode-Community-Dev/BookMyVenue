import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {children}
    </div>
  );
}
