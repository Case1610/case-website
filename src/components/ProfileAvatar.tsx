import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import type { SxProps, Theme } from '@mui/material/styles';
import { useMedia } from '../data/mediaContext';
import { srcSetFor, smallestWebp, largestWebp } from '../data/mediaTypes';

/**
 * プロフィール画像は層2（R2）から来る。このリポジトリには原本しか無い。
 *
 * **URL を直接書かない。** ファイル名には中身のハッシュが入っていて、
 * 焼き直すたびに変わる（Worker が immutable で1年持たせているのはそのため）。
 * どれを取ればいいかは manifest が知っている。
 *
 * 丸で見えているのは実寸 100〜150px。拡大表示のときだけ大きいものを取りに行く。
 */

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
  src,
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
  const media = useMedia();
  const avatar = media.status === 'ready' ? media.manifest.avatar : null;

  // manifest が来るまでは src を持たない。Avatar は fallbackText を出す
  const circleSrc = src ?? (avatar ? smallestWebp(avatar) : undefined);
  const fullSrc = src ?? (avatar ? largestWebp(avatar) : undefined);

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
        src={circleSrc}
        alt={alt}
        sx={avatarSx}
        onClick={handleClick}
        imgProps={{
          srcSet: !src && avatar ? srcSetFor(avatar, 'image/webp') : undefined,
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
            src={fullSrc} 
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
