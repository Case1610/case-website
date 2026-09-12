import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface NavigationProps {
  muiMode?: boolean;
}

// アプリやページのナビゲーション例
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/works', label: 'Works' },
];

const Navigation: React.FC<NavigationProps> = ({ muiMode = true }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  if (muiMode) {
    if (isMobile) {
      return (
        <>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ ml: 1 }}
            aria-label="メニューを開く"
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="top"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: 0,
                bgcolor: 'background.paper',
                mt: '44px', // ヘッダー分だけ下げる
              },
            }}
            transitionDuration={300}
          >
            <List sx={{ width: '100%' }}>
              {navLinks.map((link) => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    selected={location.pathname === link.to}
                    onClick={() => setOpen(false)}
                    sx={{ justifyContent: 'center', py: 2 }}
                  >
                    <ListItemText primary={link.label} sx={{ textAlign: 'center' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </>
      );
    }
    // PC/タブレット
    return (
      <Stack direction="row" spacing={2}>
        {navLinks.map((link) => (
          <Button
            key={link.to}
            component={Link}
            to={link.to}
            color={location.pathname === link.to ? 'primary' : 'inherit'}
            variant={location.pathname === link.to ? 'contained' : 'text'}
            sx={{ fontWeight: 'bold', fontSize: { xs: 14, sm: 16 } }}
          >
            {link.label}
          </Button>
        ))}
      </Stack>
    );
  }
  // fallback: 従来のnav
  return (
    <nav className="text-center mb-8 flex flex-wrap gap-6 justify-center">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="font-bold text-base hover:text-sky-400 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
