import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * 写真は層2（R2）から配る。このリポジトリにあるのは原本だけで、配るのは別物。
 *
 * 何があるかを知っているのは**変換した側**なので、一覧（manifest.json）も
 * 変換した側が出す。サイト側に「この8枚を出す」と手で書くと、写真を足したときに
 * 片方だけ古くなる。
 *
 * 原本は1枚 10〜15MB（6000x4000）。そのまま並べると開いた瞬間に 100MB を
 * 読み込ませることになるので、幅ごとに作った配信用から、画面に必要な1枚だけを取る。
 */

interface Variant {
  key: string;
  width: number;
  type: string;
}

interface Item {
  id: string;
  aspectRatio: number;
  fallback: string;
  variants: Variant[];
}

interface Manifest {
  schemaVersion: string;
  items: Item[];
}

const MEDIA = '/api/media/';

/** グリッドは最大3列。1列あたり ~460px なので、2倍の画面でも 1280 あれば足りる */
const SIZES = '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw';

const srcSetFor = (item: Item, type: string) =>
  item.variants
    .filter((v) => v.type === type)
    .map((v) => `${MEDIA}${v.key} ${v.width}w`)
    .join(', ');

/** 一番大きい webp。拡大表示のときだけ取りに行く */
const largest = (item: Item) => {
  const webp = item.variants.filter((v) => v.type === 'image/webp');
  return webp.length > 0
    ? `${MEDIA}${webp.reduce((a, b) => (a.width > b.width ? a : b)).key}`
    : `${MEDIA}${item.fallback}`;
};

export function PhotoGallery() {
  const [state, setState] = useState<
    { status: 'loading' } | { status: 'ready'; items: Item[] } | { status: 'error' }
  >({ status: 'loading' });
  const [opened, setOpened] = useState<Item | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${MEDIA}manifest.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((manifest: Manifest) => {
        if (!cancelled) setState({ status: 'ready', items: manifest.items ?? [] });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => { cancelled = true; };
  }, []);

  if (state.status === 'loading') return null;

  // 黙って消さない。消えていることに気づけるのは持ち主だけなので
  if (state.status === 'error') {
    return (
      <Typography variant="body2" color="text.secondary">
        写真を読み込めませんでした。
      </Typography>
    );
  }

  if (state.items.length === 0) return null;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {state.items.map((item) => (
          <Box
            key={item.id}
            onClick={() => setOpened(item)}
            sx={{
              position: 'relative',
              // 先に場所を取る。読み込みのたびに下の要素がずれるのを防ぐ
              aspectRatio: String(item.aspectRatio),
              overflow: 'hidden',
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: 'action.hover',
              '& img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
              '&:hover img': { transform: 'scale(1.03)' },
              '& img, &:hover img': { transition: 'transform 0.25s ease-in-out' },
            }}
          >
            <picture>
              <source type="image/avif" srcSet={srcSetFor(item, 'image/avif')} sizes={SIZES} />
              <source type="image/webp" srcSet={srcSetFor(item, 'image/webp')} sizes={SIZES} />
              <img src={`${MEDIA}${item.fallback}`} alt="" loading="lazy" decoding="async" />
            </picture>
          </Box>
        ))}
      </Box>

      <Dialog
        open={opened !== null}
        onClose={() => setOpened(null)}
        maxWidth="xl"
        PaperProps={{ sx: { bgcolor: 'black', p: 0, maxWidth: '95vw', maxHeight: '95vh' } }}
      >
        <IconButton
          onClick={() => setOpened(null)}
          aria-label="閉じる"
          sx={{
            position: 'absolute', top: 8, right: 8, zIndex: 10, color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>
        {opened && (
          <Box
            component="img"
            src={largest(opened)}
            alt=""
            sx={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', display: 'block' }}
          />
        )}
      </Dialog>
    </>
  );
}

export default PhotoGallery;
