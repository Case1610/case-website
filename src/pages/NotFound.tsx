import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { text } from '../tokens';

function NotFound() {
  return (
    <Box 
      sx={{ 
        maxWidth: 700, 
        width: '100%', 
        mx: 'auto', 
        mt: 4, 
        p: 4 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          minHeight: '60vh', 
          borderRadius: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', my: 4 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          ページが見つかりません
        </Typography>
        <Typography variant="body1" paragraph>
          お探しのページは存在しないか、移動した可能性があります。
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          size="large" 
          sx={{ mt: 3, fontSize: text.lg }}
        >
          トップページへ戻る
        </Button>
      </Paper>
    </Box>
  );
}

export default NotFound;
