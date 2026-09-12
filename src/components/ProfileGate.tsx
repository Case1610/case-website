import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import { text } from '../tokens';

/**
 * プロフィールを取得できていない間の表示。
 *
 * 失敗したときに空のプロフィールを描かない。
 * 空欄は「まだ無い」と読めるが、それらしい値で埋めると「これが事実だ」と読まれる。
 * 取れていないなら、取れていないと言う。
 */
export function ProfileGate({ state }: { state: { status: 'loading' } | { status: 'error'; message: string } }) {
  if (state.status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress aria-label="プロフィールを読み込み中" />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Alert severity="warning">
        <AlertTitle>プロフィールを読み込めませんでした</AlertTitle>
        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0, fontSize: text.xs }}>
          {state.message}
        </Box>
      </Alert>
    </Container>
  );
}
