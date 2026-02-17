'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'neo' | 'luxury' | 'minimal' | 'pop' | 'retro';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('neo');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('laura-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('laura-theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
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
