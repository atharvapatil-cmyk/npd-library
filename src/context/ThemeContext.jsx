import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('npd-theme');
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
  }, []);

  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('npd-theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
