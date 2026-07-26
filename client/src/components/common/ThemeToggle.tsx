import { motion } from 'framer-motion';
import { FiSun, FiMonitor, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import type { ThemePreference } from '@/context/ThemeContext';

const OPTIONS: { value: ThemePreference; icon: typeof FiSun; label: string }[] = [
  { value: 'light', icon: FiSun, label: 'Light' },
  { value: 'system', icon: FiMonitor, label: 'Match system' },
  { value: 'dark', icon: FiMoon, label: 'Dark' },
];

const ThemeToggle = () => {
  const { themePreference, setThemePreference } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-[var(--bg-grey)] bg-[var(--bg-grey)]/30 p-0.5">
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = themePreference === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setThemePreference(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
          >
            {active && (
              <motion.div
                layoutId="theme-toggle-active"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute inset-0 rounded-full border border-[var(--bg-green)]/50 bg-[var(--bg-tertiary)] shadow"
              />
            )}
            <Icon
              className={`relative text-xs transition-colors ${
                active ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
