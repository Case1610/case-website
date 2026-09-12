import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import App from './App';
import { ProfileProvider } from './data/ProfileProvider';

const AppProvider: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProfileProvider>
        <App mode={mode} setMode={setMode} />
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
