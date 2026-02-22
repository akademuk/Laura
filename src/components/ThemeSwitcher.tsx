'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

/**
 * Compact theme toggle button (dark ↔ light).
 * Can be placed anywhere — Header already includes its own toggle,
 * so this component is available for other UIs if needed.
 */
export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:border-[var(--fg)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
      aria-label={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-[var(--fg)]" />
      ) : (
        <Moon size={16} className="text-[var(--fg)]" />
      )}
    </button>
  );
}
