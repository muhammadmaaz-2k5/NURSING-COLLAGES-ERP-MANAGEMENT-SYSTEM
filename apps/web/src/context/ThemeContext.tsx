'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system' | 'contrast';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  isHighContrast: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('erp_theme') as Theme | null;
    if (saved && (saved === 'dark' || saved === 'light' || saved === 'system' || saved === 'contrast')) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeResolved: 'dark' | 'light' = 'dark';
      let contrast = false;

      if (theme === 'system') {
        activeResolved = mediaQuery.matches ? 'dark' : 'light';
      } else if (theme === 'contrast') {
        activeResolved = 'dark';
        contrast = true;
      } else {
        activeResolved = theme;
      }

      setResolvedTheme(activeResolved);
      setIsHighContrast(contrast);

      root.classList.remove('dark', 'light', 'contrast-theme');
      root.removeAttribute('data-contrast');

      if (activeResolved === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }

      if (contrast) {
        root.classList.add('contrast-theme');
        root.setAttribute('data-contrast', 'true');
      }

      root.setAttribute('data-theme', theme);
    };

    applyTheme();

    const handler = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('erp_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, isHighContrast, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
