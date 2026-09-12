import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultMarkdown = `# Markdown サンドボックス

左側でMarkdownを編集すると、右側にプレビューが表示されます。

- **太字**
- *斜体*
- [リンク](https://example.com)

| 見出し1 | 見出し2 |
| ------- | ------- |
| セル1   | セル2   |
| セル3   | セル4   |
`;

function MarkdownSandbox() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 4, flexDirection: { xs: 'column', md: 'row' } }}>
      <Paper sx={{ flex: 1, p: 2, minHeight: 400 }}>
        <Typography variant="h6" mb={1}>Markdown編集</Typography>
        <TextField
          multiline
          minRows={16}
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Paper>
      <Paper sx={{ flex: 1, p: 2, minHeight: 400, overflow: 'auto' }}>
        <Typography variant="h6" mb={1}>プレビュー</Typography>
        <Box component="hr" sx={{ border: 0, borderTop: '1px solid', borderColor: 'divider', mb: 2 }} />
        <Box sx={{ 
          fontSize: 16, 
          '& table': { 
            borderCollapse: 'collapse', 
            width: '100%', 
            my: 2 
          }, 
          '& th, & td': { 
            border: '1px solid', 
            borderColor: 'divider',
            px: 2, 
            py: 1 
          }, 
          '& th': { 
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
            color: 'text.primary'
          }, 
          '& pre': { 
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
            color: 'text.primary',
            p: 2, 
            borderRadius: 2, 
            overflowX: 'auto', 
            my: 2 
          }, 
          '& code': { 
            fontFamily: 'monospace', 
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
            color: 'text.primary',
            px: 0.5, 
            borderRadius: 1 
          } 
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode; [key: string]: any }) {
                // props.inline は react-markdown の実行時に渡されるが型定義にはない
                return inline ? (
                  <code style={{ 
                    background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], 
                    color: theme.palette.text.primary, 
                    borderRadius: 2, 
                    padding: '2px 4px' 
                  }} {...props}>{children}</code>
                ) : (
                  <pre style={{ 
                    background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100], 
                    color: theme.palette.text.primary, 
                    borderRadius: 4, 
                    padding: 12, 
                    overflowX: 'auto' 
                  }}>
                    <code>{children}</code>
                  </pre>
                );
              }
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
}

export default MarkdownSandbox;
