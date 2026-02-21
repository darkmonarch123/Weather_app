import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(!isDarkMode),
    colors: {
      cardBg: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.25)',
      cardBorder: 'rgba(255, 255, 255, 0.2)',
      text: '#FFFFFF',
      subText: 'rgba(255, 255, 255, 0.7)',
    }
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};