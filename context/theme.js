import React, { createContext, useState, useContext } from 'react';

export const Themes = {
  blue:  { bg: '#121217', card: '#2A2A35', accent: '#4E90FF', textMuted: '#A0A0B0' },
  red:   { bg: '#171212', card: '#352A2A', accent: '#FF4E4E', textMuted: '#B0A0A0' },
  grey:  { bg: '#1A1A1A', card: '#2D2D2D', accent: '#E0E0E0', textMuted: '#999999' },
  pink:  { bg: '#171216', card: '#352A32', accent: '#FF4EBD', textMuted: '#B0A0A8' },
  green: { bg: '#121713', card: '#2A352C', accent: '#4EFF7E', textMuted: '#A0B0A4' },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      cardBg: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.25)',
      cardBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
      text: '#FFFFFF', 
      subText: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
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