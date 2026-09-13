// 写真の原本から配信用を作る。
//
//   node scripts/build-media.mjs
//
// 原本（originals/gallery/、1枚 10〜15MB、6000x4000）はそのまま配らない。
// 訪問者に必要なのは画面に映る大きさであって、撮影時の解像度ではない。
// 原本を捨てるわけではなく、**配信用を別に作る**（Issue #2 / #7）。
//
// 出力は media/ 以下に置き、R2 バケット case-content へ上げる。
// このスクリプトは変換だけを行い、アップロードはしない。役割を分けておくと、
// 変換をやり直したいときにアップロードの都合を考えなくて済む。

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// public/ ではなく originals/ に置いてある。public/ は Vite が dist/ へ丸ごと写す場所で、
// 原本をそこに置くと配信物に 120MB が混ざる（誰も参照していなくても、毎回アップロードされる）。
// 原本は「変換の入力」であって「配るもの」ではない。置き場所でそれを言っている
const SRC_DIR = 'originals/gallery';
const OUT_DIR = 'media';

// プロフィール画像。原本はまだ public/ にある（サイトが今も直接参照しているため）。
// R2 に上がったことを確かめてから参照先を切り替え、そのとき originals/ へ移す。
// 先に動かすと、配信用が上がる前にサイトが 404 を出す数分が生まれる
const AVATAR_SRC = 'public/profile/avatar.jpg';

// 丸いアバターは実寸 120〜200px（2倍で 400px まで）。拡大表示のときだけ大きいものが要る。
// ギャラリーと同じ 640〜2560 を作るのは、誰も見ない大きさを作ることになる
const AVATAR_WIDTHS = [320, 640, 1600];
const AVATAR_FALLBACK_WIDTH = 640;

// 実測して決めた（2026-09-12、A64_2024-11-04_11.38.41_2.jpg で比較）。
//
//   1920px  avif@50:139KB  avif@60:203KB  webp@72:193KB  webp@80:240KB  jpeg@78:290KB
//
// avif@60 を主にする。50 との差は 64KB だが、写真の階調が残る方を採った。
// webp は avif を読めない環境向け。jpeg は picture 要素を解釈しない環境向けに1枚だけ。
const WIDTHS = [640, 1280, 1920, 2560];
const AVIF = { quality: 60 };
const WEBP = { quality: 80 };
const JPEG = { quality: 80, mozjpeg: true };
const FALLBACK_WIDTH = 1280;

const slug = (name) =>
  path.basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const sources = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort();

let totalOut = 0;
let totalIn = 0;

/** 1枚の原本から、指定した幅の avif / webp と、fallback の jpeg を1枚作る */
const convert = async (src, id, widths, fallbackWidth) => {
  const meta = await sharp(src).metadata();
  totalIn += fs.statSync(src).size;

  const variants = [];

  for (const width of widths) {
    // 原本より大きくしない。引き伸ばしてもデータが増えるだけで情報は増えない
    if (width > meta.width) continue;

    for (const [ext, fmt, opt] of [
      ['avif', 'avif', AVIF],
      ['webp', 'webp', WEBP],
    ]) {
      const key = `${id}-${width}.${ext}`;
      const buf = await sharp(src).resize({ width }).toFormat(fmt, opt).toBuffer();
      fs.writeFileSync(path.join(OUT_DIR, key), buf);
      totalOut += buf.length;
      variants.push({ key, width, type: `image/${ext}` });
    }
  }

  const fbKey = `${id}-${fallbackWidth}.jpg`;
  const fbBuf = await sharp(src).resize({ width: fallbackWidth }).toFormat('jpeg', JPEG).toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, fbKey), fbBuf);
  totalOut += fbBuf.length;

  console.log(`${path.basename(src)} → ${variants.length + 1} 個`);

  return {
    id,
    source: path.basename(src),
    sourceWidth: meta.width,
    sourceHeight: meta.height,
    aspectRatio: +(meta.width / meta.height).toFixed(4),
    fallback: fbKey,
    variants,
  };
};

const manifest = [];
for (const file of sources) {
  manifest.push(await convert(path.join(SRC_DIR, file), slug(file), WIDTHS, FALLBACK_WIDTH));
}

// アバターはギャラリーとは別枠。一覧に混ぜると「写真の一覧」を出したときに顔写真が並ぶ
const avatar = fs.existsSync(AVATAR_SRC)
  ? await convert(AVATAR_SRC, 'profile-avatar', AVATAR_WIDTHS, AVATAR_FALLBACK_WIDTH)
  : null;

// 一覧はサイト側で書かず、変換した側が出す。
// 何があるかを知っているのは変換した側であり、手で二重に書くとズレる。
fs.writeFileSync(
  path.join(OUT_DIR, 'manifest.json'),
  `${JSON.stringify({ schemaVersion: '1.1.0', items: manifest, avatar }, null, 2)}\n`
);

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`\n原本 ${mb(totalIn)}MB → 配信用 ${mb(totalOut)}MB（全サイズ・全形式の合計）`);
console.log(`1枚あたりに実際に配られるのは1サイズ1形式だけ。`);
