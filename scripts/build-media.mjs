// 写真の原本から配信用を作る。
//
//   node scripts/build-media.mjs
//
// 原本（public/gallery/、1枚 10〜15MB、6000x4000）はそのまま配らない。
// 訪問者に必要なのは画面に映る大きさであって、撮影時の解像度ではない。
// 原本を捨てるわけではなく、**配信用を別に作る**（Issue #2 / #7）。
//
// 出力は media/ 以下に置き、R2 バケット case-content へ上げる。
// このスクリプトは変換だけを行い、アップロードはしない。役割を分けておくと、
// 変換をやり直したいときにアップロードの都合を考えなくて済む。

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/gallery';
const OUT_DIR = 'media';

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

const manifest = [];
let totalOut = 0;
let totalIn = 0;

for (const file of sources) {
  const src = path.join(SRC_DIR, file);
  const id = slug(file);
  const meta = await sharp(src).metadata();
  totalIn += fs.statSync(src).size;

  const variants = [];

  for (const width of WIDTHS) {
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

  const fbKey = `${id}-${FALLBACK_WIDTH}.jpg`;
  const fbBuf = await sharp(src).resize({ width: FALLBACK_WIDTH }).toFormat('jpeg', JPEG).toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, fbKey), fbBuf);
  totalOut += fbBuf.length;

  manifest.push({
    id,
    source: file,
    sourceWidth: meta.width,
    sourceHeight: meta.height,
    aspectRatio: +(meta.width / meta.height).toFixed(4),
    fallback: fbKey,
    variants,
  });

  console.log(`${file} → ${variants.length + 1} 個`);
}

// 一覧はサイト側で書かず、変換した側が出す。
// 何があるかを知っているのは変換した側であり、手で二重に書くとズレる。
fs.writeFileSync(
  path.join(OUT_DIR, 'manifest.json'),
  `${JSON.stringify({ schemaVersion: '1.0.0', items: manifest }, null, 2)}\n`
);

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`\n原本 ${mb(totalIn)}MB → 配信用 ${mb(totalOut)}MB（全サイズ・全形式の合計）`);
console.log(`1枚あたりに実際に配られるのは1サイズ1形式だけ。`);
