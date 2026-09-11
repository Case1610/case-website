import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { works } from '../data/works';

function Works() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Works
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        作ったもの。
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {works.map((work) => (
          <Card key={work.id} sx={{ display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {work.title}
              </Typography>
              {work.period && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {work.period}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {work.summary}
              </Typography>
              {work.tags && work.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {work.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </CardContent>
            {(work.repo || work.url) && (
              <CardActions>
                {work.repo && (
                  <Button
                    size="small"
                    startIcon={<GitHubIcon />}
                    href={`https://github.com/${work.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Button>
                )}
                {work.url && (
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    見る
                  </Button>
                )}
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default Works;
