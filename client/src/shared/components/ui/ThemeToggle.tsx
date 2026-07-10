import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';

export default function ThemeToggle() {
  const { themeMode, toggleThemeMode } = useUIStore();

  return (
    <button
      onClick={toggleThemeMode}
      type="button"
      className="relative p-2 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group overflow-hidden"
      aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-5 h-5 text-accent absolute transition-all duration-500 ease-out transform ${
            themeMode === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-5 h-5 text-primary absolute transition-all duration-500 ease-out transform ${
            themeMode === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
}
