import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * プロフィール画像は層2（R2）から来る。このリポジトリには原本しか無い。
 *
 * 丸で見えているのは実寸 100〜150px なので、2倍の画面でも 320px あれば足りる。
 * 拡大表示のときだけ大きいものを取りに行く。
 * 以前は 2784x1856 の 3.6MB を、100px の丸のために毎回配っていた。
 */
const CIRCLE_SRC = '/api/media/profile-avatar-320.webp';
const CIRCLE_SRCSET =
  '/api/media/profile-avatar-320.webp 320w, /api/media/profile-avatar-640.webp 640w';
const FULL_SRC = '/api/media/profile-avatar-1600.webp';

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  fallbackText?: string;
  sx?: SxProps<Theme>;
  clickable?: boolean;
}

function ProfileAvatar({
  src = CIRCLE_SRC,
  alt = "Profile picture",
  size = 120,
  borderColor = 'white',
  borderWidth = 4,
  fallbackText = "HK",
  sx = {},
  clickable = true,
  ...props
}: ProfileAvatarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const avatarSx = {
    width: size,
    height: size,
    border: `${borderWidth}px solid ${borderColor}`,
    fontSize: `${size / 4}rem`,
    cursor: clickable ? 'pointer' : 'default',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': clickable ? {
      transform: 'scale(1.05)',
    } : {},
    '& img': {
      objectFit: 'cover',
      objectPosition: 'center top',
    },
    ...sx,
  };

  const handleClick = () => {
    if (clickable) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Avatar
        src={src}
        alt={alt}
        sx={avatarSx}
        onClick={handleClick}
        imgProps={{
          srcSet: src === CIRCLE_SRC ? CIRCLE_SRCSET : undefined,
          sizes: `${size}px`,
          decoding: 'async',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
        {...props}
      >
        {fallbackText}
      </Avatar>

      {clickable && (
        <Dialog 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          maxWidth="xl" 
          PaperProps={{ 
            sx: { 
              bgcolor: 'black', 
              p: 0,
              maxWidth: '90vw',
              maxHeight: '90vh',
            } 
          }}
        >
          <IconButton 
            onClick={() => setModalOpen(false)} 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              color: 'white', 
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }} 
            aria-label="閉じる"
          >
            <CloseIcon />
          </IconButton>
          <Box 
            component="img" 
            src={src === CIRCLE_SRC ? FULL_SRC : src} 
            alt="プロフィール画像（拡大）" 
            sx={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              objectFit: 'contain', 
              bgcolor: 'black',
              display: 'block',
            }} 
          />
        </Dialog>
      )}
    </>
  );
}

export default ProfileAvatar;
