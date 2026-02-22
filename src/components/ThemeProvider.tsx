'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('laura-theme') as Theme | null;
      return saved === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Enable transitions only after first theme is applied
    if (!ready) {
      requestAnimationFrame(() => {
        document.body.classList.add('theme-ready');
        setReady(true);
      });
    }
  }, [theme, ready]);

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('laura-theme', t);
  };

  const toggleTheme = () => {
    handleSetTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
