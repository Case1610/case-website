import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useColorScheme } from './useColorScheme';
import App from './App';
import { ProfileProvider } from './data/ProfileProvider';

const AppProvider: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme.resolved === 'dark' ? darkTheme : lightTheme),
    [colorScheme.resolved]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProfileProvider>
        <App colorScheme={colorScheme} />
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
