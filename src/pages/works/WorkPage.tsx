// その場で触れる作品を、単独の URL で開くための枠。
//
// 見出し・説明・一覧への戻り道だけを持ち、中身は children に任せる。
// タイトルや説明は data/works.ts から引く（一覧と別々に書くと必ず片方が古くなる）。

import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';

import { works } from '../../data/works';
import NotFound from '../NotFound';

interface WorkPageProps {
  /** data/works.ts の id */
  id: string;
  children: ReactNode;
}

function WorkPage({ id, children }: WorkPageProps) {
  const work = works.find((w) => w.id === id);
  if (!work) return <NotFound />;

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
      <Button
        component={RouterLink}
        to="/works"
        size="small"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Works
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        {work.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {work.summary}
      </Typography>
      {work.why && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {work.why}
        </Typography>
      )}
      <Box sx={{ mt: 3 }}>{children}</Box>
    </Container>
  );
}

export default WorkPage;
