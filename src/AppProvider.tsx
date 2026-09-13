import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { useColorScheme } from './useColorScheme';
import App from './App';
import { ProfileProvider } from './data/ProfileProvider';
import { MediaProvider } from './data/MediaProvider';

const AppProvider: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme.resolved === 'dark' ? darkTheme : lightTheme),
    [colorScheme.resolved]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MediaProvider>
        <ProfileProvider>
          <App colorScheme={colorScheme} />
        </ProfileProvider>
      </MediaProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
