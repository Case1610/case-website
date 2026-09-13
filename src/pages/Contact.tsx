import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ProfileAvatar from '../components/ProfileAvatar';
import { useProfile } from '../data/profileContext';
import { ProfileGate } from '../components/ProfileGate';

function Contact() {
  const profileState = useProfile();
  if (profileState.status !== 'ready') return <ProfileGate state={profileState} />;
  // 層2から受け取った時点で表示用へ変換済み。削るのは送り出す側の仕事（Issue #7）
  const displayedProfile = profileState.profile;
  const { basicInfo, social_links } = displayedProfile;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
        <ProfileAvatar
          size={100}
          borderColor="transparent"
          borderWidth={0}
          fallbackText={`${basicInfo.name.ja.first[0]}${basicInfo.name.ja.last[0]}`}
          sx={{
            mx: 'auto',
            mb: 3,
            backgroundColor: 'primary.main',
          }}
        />
        
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Contact Me
        </Typography>
        
        <Typography variant="h5" gutterBottom color="text.secondary">
          {basicInfo.name.ja.last} {basicInfo.name.ja.first}
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mt: 3, mb: 4 }}>
          お仕事のご依頼、コラボレーションのご提案、または単純にご挨拶など、<br />
          どのようなことでもお気軽にお声がけください。
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" color="primary">
            連絡方法
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              sx={{ minWidth: 160 }}
            >
              Email
            </Button>
            
            {social_links.map((link, index) => (
              <Button
                key={index}
                variant="outlined"
                size="large"
                startIcon={link.platform === 'Twitter' ? <TwitterIcon /> : <LinkedInIcon />}
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: 160 }}
              >
                {link.platform}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            専門分野
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip label="写真撮影" color="primary" />
            <Chip label="Web Development" color="primary" />
            <Chip label="UI/UX Design" color="primary" />
            <Chip label="プロジェクトマネジメント" color="primary" />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          通常24時間以内にお返事いたします
        </Typography>
      </Paper>
    </Container>
  );
}

export default Contact;
