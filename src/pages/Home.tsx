
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Masonry from '@mui/lab/Masonry';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import { useProfile } from '../data/ProfileProvider';
import { ProfileGate } from '../components/ProfileGate';

const galleryItems = [
  { type: 'image' as const, src: '/gallery/A64_2023-08-16_13.26.18.000_+0900.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-04-07_12.03.22.000_+0900_.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-04-14_13.39.20-.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-11-04_11.38.41_2.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-11-16_16.49.24_1.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-11-24_16.58.20_1.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-11-24_17.02.44_1.jpg' },
  { type: 'image' as const, src: '/gallery/A64_2024-11-24_17.08.08_1.jpg' },
  { type: 'video' as const, src: '/gallery/IMG_7505.MOV' },
];


function Home() {
  const [modal, setModal] = useState<{ open: boolean; src: string; type: 'image' | 'video' } | null>(null);

  const profileState = useProfile();
  if (profileState.status !== 'ready') return <ProfileGate state={profileState} />;
  // 層2から受け取った時点で表示用へ変換済み。削るのは送り出す側の仕事（Issue #7）
  const displayedProfile = profileState.profile;
  const { basicInfo, biography, social_links } = displayedProfile;

  return (
    <Container maxWidth="lg">
      {/* シンプルなヒーローセクション */}
      <Box sx={{ 
        textAlign: 'center', 
        py: { xs: 6, md: 10 },
        mb: 8,
      }}>
        <ProfileAvatar
          size={150}
          borderColor="transparent"
          borderWidth={0}
          fallbackText={`${basicInfo.name.ja.first[0]}${basicInfo.name.ja.last[0]}`}
          sx={{
            mx: 'auto',
            mb: 4,
            backgroundColor: 'primary.main',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        />
        
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          fontWeight="300"
          sx={{ 
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2,
            color: 'text.primary'
          }}
        >
          {basicInfo.name.ja.last} {basicInfo.name.ja.first}
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            opacity: 0.8,
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'text.secondary'
          }}
        >
          {biography.short}
        </Typography>

        {/* ナビゲーションボタン */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          mb: 6
        }}>
          <Button
            component={Link}
            to="/about"
            variant="outlined"
            size="large"
            sx={{ 
              minWidth: 140,
              borderRadius: 25,
              textTransform: 'none',
              fontSize: '1.1rem',
              py: 1.5,
              px: 3,
            }}
          >
            About
          </Button>
          <Button
            component={Link}
            to="/works"
            variant="contained"
            size="large"
            sx={{ 
              minWidth: 140,
              borderRadius: 25,
              textTransform: 'none',
              fontSize: '1.1rem',
              py: 1.5,
              px: 3,
            }}
          >
            Works
          </Button>
          <Button
            component={Link}
            to="/contact"
            variant="outlined"
            size="large"
            sx={{ 
              minWidth: 140,
              borderRadius: 25,
              textTransform: 'none',
              fontSize: '1.1rem',
              py: 1.5,
              px: 3,
            }}
          >
            Contact
          </Button>
        </Box>

        {/* ソーシャルリンク */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {social_links.map((link, index) => (
            <IconButton
              key={index}
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {link.platform === 'Twitter' ? <TwitterIcon /> : <EmailIcon />}
            </IconButton>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 8 }} />

      {/* ギャラリーセクション */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          fontWeight="300"
          sx={{ 
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Gallery
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          sx={{ 
            mb: 6, 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Sony α6400で撮影した写真や動画をご覧ください
        </Typography>
        
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={3}
        >
          {galleryItems.map((item, idx) => (
            <Card 
              key={idx} 
              sx={{ 
                borderRadius: 4, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                overflow: 'hidden', 
                mb: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea onClick={() => setModal({ open: true, src: item.src, type: item.type })}>
                {item.type === 'image' ? (
                  <CardMedia
                    component="img"
                    image={item.src}
                    alt={`Gallery ${idx + 1}`}
                    sx={{ width: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <CardMedia
                    component="video"
                    src={item.src}
                    controls
                    sx={{ width: '100%', height: 320, objectFit: 'cover' }}
                  />
                )}
              </CardActionArea>
            </Card>
          ))}
        </Masonry>
      </Box>

      {/* モーダル表示 */}
      <Dialog open={!!modal} onClose={() => setModal(null)} maxWidth="xl" PaperProps={{ sx: { bgcolor: 'black', p: 0 } }}>
        <IconButton onClick={() => setModal(null)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }} aria-label="閉じる">
          <CloseIcon />
        </IconButton>
        {modal?.type === 'image' ? (
          <Box component="img" src={modal.src} alt="拡大画像" sx={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', bgcolor: 'black' }} />
        ) : modal?.type === 'video' ? (
          <Box component="video" src={modal.src} controls autoPlay sx={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', bgcolor: 'black' }} />
        ) : null}
      </Dialog>
    </Container>
  );
}

export default Home;
