/** 層2（R2）の media/manifest.json の形。正本は scripts/build-media.mjs（出す側） */

export interface MediaVariant {
  /** 中身のハッシュ入りのファイル名。中身が変われば名前も変わる */
  key: string;
  width: number;
  type: string;
}

export interface MediaItem {
  id: string;
  sourceWidth: number;
  sourceHeight: number;
  aspectRatio: number;
  fallback: string;
  variants: MediaVariant[];
}

export interface MediaManifest {
  schemaVersion: string;
  items: MediaItem[];
  avatar: MediaItem | null;
}

export const MEDIA = '/api/media/';

/** 同じ形式の variant を srcSet の文字列にする */
export const srcSetFor = (item: MediaItem, type: string) =>
  item.variants
    .filter((v) => v.type === type)
    .map((v) => `${MEDIA}${v.key} ${v.width}w`)
    .join(', ');

/** 一番小さい webp。丸いアバターのように実寸が小さいところの既定に使う */
export const smallestWebp = (item: MediaItem) => {
  const webp = item.variants.filter((v) => v.type === 'image/webp');
  return webp.length > 0
    ? `${MEDIA}${webp.reduce((a, b) => (a.width < b.width ? a : b)).key}`
    : `${MEDIA}${item.fallback}`;
};

/** 一番大きい webp。拡大表示のときだけ取りに行く */
export const largestWebp = (item: MediaItem) => {
  const webp = item.variants.filter((v) => v.type === 'image/webp');
  return webp.length > 0
    ? `${MEDIA}${webp.reduce((a, b) => (a.width > b.width ? a : b)).key}`
    : `${MEDIA}${item.fallback}`;
};
