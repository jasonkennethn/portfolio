import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const theme = 'light';
  const setTheme = () => {};
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('portfolio-primary') || '#494BD6');
  const [glassmorphism, setGlassmorphism] = useState(() => localStorage.getItem('portfolio-glass') !== 'false');
  const [animatedBg, setAnimatedBg] = useState(() => localStorage.getItem('portfolio-animated-bg') === 'true');
  const [codeTheme, setCodeTheme] = useState(() => localStorage.getItem('portfolio-code-theme') || 'obsidian_light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('portfolio-theme', 'light');
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    localStorage.setItem('portfolio-primary', primaryColor);
  }, [primaryColor]);

  useEffect(() => { localStorage.setItem('portfolio-glass', glassmorphism); }, [glassmorphism]);
  useEffect(() => { localStorage.setItem('portfolio-animated-bg', animatedBg); }, [animatedBg]);
  useEffect(() => { localStorage.setItem('portfolio-code-theme', codeTheme); }, [codeTheme]);

  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, toggleTheme,
      primaryColor, setPrimaryColor,
      glassmorphism, setGlassmorphism,
      animatedBg, setAnimatedBg,
      codeTheme, setCodeTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
