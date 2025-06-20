'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/styles/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Контекст темы
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Хук для доступа к контексту темы
export const useTheme = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

// Провайдер темы
export const ThemeProvider = ({ children }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Автоматическое переключение темы по времени
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      // Темная тема с 22:00 до 10:00
      setIsDarkMode(hour >= 22 || hour < 10);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Проверка каждую минуту

    // Очистка интервала
    return () => clearInterval(interval);
  }, []);

  // Ручное переключение темы
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
