import { writeFileSync } from 'node:fs';
const L = '/tmp/claude-0/-home-user/0f2976a0-1dd9-50dd-bdb0-e71d9424caea/scratchpad/logo2';
const INK = '#14161a', BRAND = '#3f69d3';
const glyph = {
  C: 'M 87 13 H 13 V 127 H 87',
  A: 'M 13 127 V 13 H 87 V 127 M 13 74 H 87',
  S: 'M 87 13 H 13 V 70 H 87 V 127 H 13',
  E: 'M 87 13 H 13 V 127 H 87 M 13 70 H 62',
};
const word = (letters, x, y, scale, color, sw) =>
  letters.split('').map((ch, i) =>
    `<g transform="translate(${x + i * 118 * scale} ${y}) scale(${scale})">` +
    `<path d="${glyph[ch]}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter"/></g>`
  ).join('\n  ');
const svg = (w, h, b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">\n  ${b}\n</svg>\n`;

/* 小さいところ用のマーク。中身の高さぶんだけ壁が欠けている */
const markPath = (sw, notchTop, notchBottom) =>
  `<path d="M 416 ${notchTop} V 112 H 112 V 400 H 416 V ${notchBottom}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="butt" stroke-linejoin="miter"/>`;

// S1: マーク（favicon / 小さいところ）
writeFileSync(`${L}/S1.svg`, svg(512, 512, markPath(64, 214, 298)));

// S2: 箱＋中身としての CASE（1段）。開口部の高さ＝文字の高さ
writeFileSync(`${L}/S2.svg`, svg(512, 512,
  `${markPath(52, 214, 298)}\n  ${word('CASE', 120, 214, 0.6, BRAND, 30)}`));

// S3: 箱の中に CASE 2段。開口部には中身が嵌まっている
writeFileSync(`${L}/S3.svg`, svg(512, 512, `
  <path d="M 416 214 V 112 H 112 V 400 H 416 V 298" fill="none" stroke="${INK}" stroke-width="52" stroke-linecap="butt" stroke-linejoin="miter"/>
  <rect x="390" y="214" width="60" height="84" fill="${BRAND}"/>
  ${word('CA', 168, 158, 0.56, INK, 30)}
  ${word('SE', 168, 268, 0.56, INK, 30)}`));

// S4: 横長ロックアップ（マーク＋CASE）
writeFileSync(`${L}/S4.svg`, svg(1240, 512,
  `${markPath(64, 214, 298)}\n  ${word('CASE', 570, 186, 1.0, INK, 26)}`));
console.log('ok');
