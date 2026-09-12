import Header from './Header';
import Footer from './Footer';
import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import type { ColorSchemeState } from '../useColorScheme';



interface LayoutProps {
  children: React.ReactNode;
  colorScheme: ColorSchemeState;
}

const Layout: React.FC<LayoutProps> = ({ children, colorScheme }) => {
  return (
    <Box minHeight="100vh" bgcolor="background.default" color="text.primary" display="flex" flexDirection="column">
      <Header colorScheme={colorScheme} />
      {/* ヘッダー分の余白を確保 */}
      <Box sx={{ height: 44 }} />
      <Container maxWidth={false} sx={{ width: '100%', maxWidth: '1600px', flex: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>{children}</main>
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
