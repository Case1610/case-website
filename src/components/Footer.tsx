
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
  <Box component="footer" py={4} textAlign="center" color="text.secondary" mt="auto">
    {/* 年は公開年で固定する。現在年を出すと毎年勝手に変わり、何の年か分からなくなるため */}
    <Typography variant="body2">
      &copy; 2025 ShowCase
    </Typography>
  </Box>
);

export default Footer;
