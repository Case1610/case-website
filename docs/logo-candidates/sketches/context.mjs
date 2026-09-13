import { writeFileSync, readFileSync } from 'node:fs';
const L = import.meta.dirname;

/* 実際に置かれる場所を描く。判断はここでしかできない */
const MONO = 'DejaVu Sans Mono, monospace';
const SANS = 'DejaVu Sans, sans-serif';
const INK = '#14161a', MUT = '#8a8f98', LINE = '#d5d7dd', BG = '#eef0f4';

/** マークの中身だけ取り出して、指定サイズ・位置に置く */
const place = (file, x, y, size) => {
  const raw = readFileSync(`${L}/${file}`, 'utf8');
  const body = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<g transform="translate(${x} ${y}) scale(${size / 100})">${body}</g>`;
};

/* ワードマークだけの案（マーク無し） */
const wordmark = (x, y, size, color = INK) =>
  `<text x="${x}" y="${y + size * 0.75}" font-size="${size}" font-family="${MONO}" font-weight="bold" fill="${color}" letter-spacing="${-size * 0.03}">case</text>`;

const tabStrip = (markFile, W = 330) => {
  const tabs = [
    { t: 'github.com', fav: `<circle cx="8" cy="8" r="7" fill="#c4c9d2"/>` },
    { t: 'ShowCase', me: true },
    { t: 'figma.com', fav: `<rect x="2" y="1" width="12" height="14" rx="2" fill="#c4c9d2"/>` },
  ];
  let x = 6, out = `<rect width="${W}" height="42" fill="${BG}"/>`;
  tabs.forEach((tab) => {
    const w = 104;
    const active = tab.me;
    out += `<path d="M ${x} 42 V 12 a6 6 0 0 1 6 -6 h ${w - 12} a6 6 0 0 1 6 6 V 42 Z" fill="${active ? '#fff' : '#e2e5ea'}"/>`;
    out += tab.me
      ? (markFile ? place(markFile, x + 12, 15, 16) : `<text x="${x + 12}" y="27" font-size="13" font-family="${MONO}" font-weight="bold" fill="${INK}">c</text>`)
      : `<g transform="translate(${x + 12} 15)">${tab.fav}</g>`;
    out += `<text x="${x + 36}" y="28" font-size="11.5" font-family="${SANS}" fill="${active ? INK : MUT}">${tab.t}</text>`;
    x += w + 3;
  });
  return { w: W, h: 42, body: out };
};

const avatars = (markFile, W = 330) => {
  const names = ['tanaka-k', 'Case1610', 'sasaki'];
  let out = `<rect width="${W}" height="150" fill="#fff"/>`;
  names.forEach((n, i) => {
    const y = 10 + i * 46, me = n === 'Case1610';
    out += `<clipPath id="cp${i}"><circle cx="28" cy="${y + 18}" r="18"/></clipPath>`;
    out += `<circle cx="28" cy="${y + 18}" r="18" fill="${me ? '#fff' : '#dfe3e9'}" stroke="${LINE}"/>`;
    if (me) out += markFile
      ? `<g clip-path="url(#cp${i})">${place(markFile, 10, y, 36)}</g>`
      : `<g clip-path="url(#cp${i})"><rect x="10" y="${y}" width="36" height="36" fill="${INK}"/><text x="28" y="${y + 25}" font-size="17" font-family="${MONO}" font-weight="bold" fill="#fff" text-anchor="middle">c</text></g>`;
    out += `<text x="58" y="${y + 16}" font-size="12.5" font-family="${SANS}" fill="${INK}">${n}</text>`;
    out += `<text x="58" y="${y + 31}" font-size="11" font-family="${SANS}" fill="${MUT}">pushed to main</text>`;
  });
  return { w: W, h: 150, body: out };
};

const header = (markFile, W = 330) => {
  let out = `<rect width="${W}" height="46" fill="#fff" stroke="${LINE}"/>`;
  out += markFile ? place(markFile, 12, 7, 32) : '';
  const tx = markFile ? 52 : 12;
  out += `<text x="${tx}" y="29" font-size="15" font-family="${MONO}" font-weight="bold" fill="${INK}" letter-spacing="-0.4">ShowCase</text>`;
  ['HOME', 'ABOUT', 'WORKS'].forEach((t, i) =>
    out += `<text x="${W - 150 + i * 50}" y="28" font-size="9.5" font-family="${SANS}" fill="${MUT}" letter-spacing="1">${t}</text>`);
  return { w: W, h: 46, body: out };
};

const OPTIONS = [
  { key: 'd02', label: 'A  枠に丸' },
  { key: 'd07', label: 'B  反転' },
  { key: 'd12', label: 'C  縁にまたがる' },
  { key: null,  label: 'D  マーク無し' },
];

const COLW = 350, ROWS = [
  { name: 'ブラウザのタブ（16px）', fn: tabStrip, h: 42 },
  { name: 'GitHub のアバター（36px）', fn: avatars, h: 150 },
  { name: 'サイトのヘッダー（32px）', fn: header, h: 46 },
];
const HEADH = 46, LABELH = 26, GAP = 28;
const totalH = HEADH + ROWS.reduce((a, r) => a + LABELH + r.h + GAP, 0);
const W = COLW * OPTIONS.length;

let body = `<rect width="${W}" height="${totalH}" fill="#fff"/>`;
OPTIONS.forEach((o, ci) =>
  body += `<text x="${ci * COLW + 12}" y="26" font-size="14" font-family="${MONO}" fill="${INK}">${o.label}</text>`);

let y = HEADH;
ROWS.forEach((row) => {
  body += `<text x="12" y="${y + 16}" font-size="12" font-family="${SANS}" fill="${MUT}">${row.name}</text>`;
  y += LABELH;
  OPTIONS.forEach((o, ci) => {
    const c = row.fn(o.key ? `${o.key}.svg` : null);
    body += `<g transform="translate(${ci * COLW + 12} ${y})">${c.body}</g>`;
  });
  y += row.h + GAP;
});

writeFileSync(`${L}/context.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${totalH}" width="${W}" height="${totalH}">${body}</svg>\n`);
console.log('ok', W, totalH);
