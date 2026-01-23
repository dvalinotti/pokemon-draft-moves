import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Theme = 'modern' | 'retro';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isRetro: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'pokemon-draft-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'retro' || stored === 'modern') {
        return stored;
      }
    } catch {
      // Ignore
    }
    return 'retro';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update body class for global styles
    if (theme === 'retro') {
      document.body.classList.add('retro-theme');
      document.body.classList.remove('modern-theme');
    } else {
      document.body.classList.add('modern-theme');
      document.body.classList.remove('retro-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'modern' ? 'retro' : 'modern');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isRetro: theme === 'retro' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
