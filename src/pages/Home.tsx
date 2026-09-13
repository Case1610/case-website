
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import { useProfile } from '../data/profileContext';
import { ProfileGate } from '../components/ProfileGate';
import { text } from '../tokens';


function Home() {

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
          sx={{ mb: 2, color: 'text.primary' }}
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
              fontSize: text.lg,
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
              fontSize: text.lg,
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
              fontSize: text.lg,
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

      {/* 写真ギャラリーは一旦外した（2026-09-12、Issue #2）。
          撮ったものであって作ったものではないため Works には入れず、
          Home に置くと初期表示で 120MB を読み込ませることになるため残しもしない。
          縮めて R2 へ移す作業（Issue #2）の中で、専用の置き場ごと作り直す。
          originals/gallery/ のファイルは消していない。 */}
    </Container>
  );
}

export default Home;
