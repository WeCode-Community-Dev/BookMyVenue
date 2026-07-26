import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { STORAGE_KEYS } from '@/constants';

const TestComponent: React.FC = () => {
  const { themePreference, resolvedTheme, setThemePreference } = useTheme();

  return (
    <div>
      <span data-testid="pref">{themePreference}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setThemePreference('dark')}>Set Dark</button>
      <button onClick={() => setThemePreference('light')}>Set Light</button>
    </div>
  );
};

describe('client ThemeContext & ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should render default light theme when no preference stored', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('pref')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('should update theme preference and add "dark" class to document element', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByText('Set Dark'));

    expect(screen.getByTestId('pref')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark');
  });

  it('should throw error when useTheme is used outside of ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
