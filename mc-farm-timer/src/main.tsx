import React, { useState, createContext, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

export const ColorModeContext = createContext({ toggle: () => {}, isDark: true });

function Root() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        default: isDark ? '#0f0f0f' : '#f0f0f0',
        paper: isDark ? '#1a1a1a' : '#ffffff',
      },
      primary: { main: '#7eb8f7' },
      secondary: { main: '#81c784' },
      text: {
        primary: isDark ? '#eeeeee' : '#111111',
        secondary: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.6)',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    },
    typography: { fontFamily: 'Galmuri9, sans-serif' },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  });

  return (
    <ColorModeContext.Provider value={{ toggle: () => setIsDark(p => !p), isDark }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Root /></React.StrictMode>
);