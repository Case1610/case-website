// 作ったものの一覧。
// 並び順は作った順（新しいものが上）で、並べ替えは data/works.ts 側で行っている。
// ブラウザでそのまま動くものも、GitHub にあるものも、ここに混ぜて並べる（Issue #8）。

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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link as RouterLink } from 'react-router-dom';

import { works } from '../../data/works';

function Works() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Works
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        作ったもの。新しいものが上です。まだ整理中のため、順次追加していきます。
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
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'baseline', flexWrap: 'wrap', mb: 0.5 }}
              >
                <Typography variant="h6" component="h2">
                  {work.title}
                </Typography>
                {work.path && (
                  // 「その場で触れる」は盛れない証拠として強いので、一覧でも分かるようにする
                  <Chip label="ここで動く" size="small" color="primary" />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {work.period ?? work.created}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: work.why ? 1.5 : 2 }}>
                {work.summary}
              </Typography>
              {/* なぜ作ったか。本人の言葉が無いものは、埋めずに空けてある */}
              {work.why && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {work.why}
                </Typography>
              )}
              {work.tags && work.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {work.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </CardContent>
            {(work.path || work.repo || work.url) && (
              <CardActions>
                {work.path && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    component={RouterLink}
                    to={work.path}
                  >
                    触ってみる
                  </Button>
                )}
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
