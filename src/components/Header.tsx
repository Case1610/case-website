
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navigation from './Navigation';
import ColorSchemeToggle from './ColorSchemeToggle';
import type { ColorSchemeState } from '../useColorScheme';
import caseLogo from '/caselogo.svg';

const Header = ({ colorScheme }: { colorScheme: ColorSchemeState }) => (
  <AppBar
    position="fixed"
    color="default"
    elevation={2}
    sx={{ mb: 4, height: 44, minHeight: 44, justifyContent: 'center', zIndex: 1201 }}
  >
    <Toolbar
      sx={{
        minHeight: 44,
        height: 44,
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Box component="img" src={caseLogo} alt="Logo" sx={{ width: 32, height: 32 }} />
        <Typography variant="h6" component="span">ShowCase</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Navigation muiMode={true} />
        <ColorSchemeToggle colorScheme={colorScheme} />
      </Box>
    </Toolbar>
    {/* ヘッダー分の余白をbody上部に追加する場合は、Layout側で <Toolbar /> を挿入してください */}
  </AppBar>
);

export default Header;
