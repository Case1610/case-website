import { writeFileSync } from 'node:fs';
import { C, A, E, S, PHI } from './type.mjs';
const L = import.meta.dirname;

const R = 200, W = Math.round(R / PHI ** 2), AP = Math.round(R * 0.9);
const INK = '#23272e', GUIDE = '#aab0bb', HARD = '#3f69d3', TXT = '#4a4f58', HEAD = '#1c1f24';
const PANEL = 520, TOP = 250, PH = 560;
const W_ALL = 60 + 4 * PANEL, H_ALL = TOP + PH + 330;

const el = [];
const t = (x, y, s, size = 22, c = TXT, anchor = 'start', weight = 400) =>
  el.push(`<text x="${x}" y="${y}" font-size="${size}" font-family="sans-serif" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${s}</text>`);
const guideCircle = (cx, cy, r, c = GUIDE, dash = '7 7') =>
  el.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="${dash}"/>`);
const guideLine = (x1, y1, x2, y2, c = GUIDE, dash = '7 7') =>
  el.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-dasharray="${dash}"/>`);

const panels = [
  { ch: 'c', op: '右を開ける', draw: (cx, cy) => C(cx, cy, R, W, AP, INK),
    guides: (cx, cy) => { guideLine(cx, cy - AP / 2, cx + R + 60, cy - AP / 2, HARD); guideLine(cx, cy + AP / 2, cx + R + 60, cy + AP / 2, HARD); } },
  { ch: 'a', op: '右に縦棒を足す', draw: (cx, cy) => A(cx, cy, R, W, INK),
    guides: (cx, cy) => { guideLine(cx + R - W, cy - R - 60, cx + R - W, cy + R + 60, HARD); guideLine(cx + R, cy - R - 60, cx + R, cy + R + 60, HARD); } },
  { ch: 's', op: '半径を半分にして2つ', draw: (cx, cy) => S(cx, cy, R, W, INK),
    guides: (cx, cy) => { guideCircle(cx, cy - R / 2, R / 2, HARD); guideCircle(cx, cy + R / 2, R / 2, HARD); } },
  { ch: 'e', op: '横棒を入れて右下を開ける', draw: (cx, cy) => E(cx, cy, R, W, AP, INK),
    guides: (cx, cy) => { guideLine(cx - R - 60, cy, cx + R + 60, cy, HARD); } },
];

panels.forEach((p, i) => {
  const cx = 60 + i * PANEL + PANEL / 2 - 30, cy = TOP + PH / 2 - 40;
  // 共通の下地：外円・内円・十字
  guideCircle(cx, cy, R);
  guideCircle(cx, cy, R - W);
  guideLine(cx - R - 60, cy, cx + R + 60, cy);
  guideLine(cx, cy - R - 60, cx, cy + R + 60);
  p.guides(cx, cy);
  el.push(p.draw(cx, cy));
  t(cx, cy + R + 120, p.ch, 46, HEAD, 'middle', 700);
  t(cx, cy + R + 162, p.op, 21, TXT, 'middle');
  if (i < 3) el.push(`<line x1="${60 + (i + 1) * PANEL - 20}" y1="${TOP - 40}" x2="${60 + (i + 1) * PANEL - 20}" y2="${TOP + PH + 120}" stroke="#d3d8e0"/>`);
});

t(60, 96, 'case — ひとつの円から', 42, HEAD, 'start', 700);
t(60, 140, 'c・a・e は同じ円を違う切り方にしただけのもの。s だけが半径を半分にした2つの円から出る。', 23);
t(60, 176, '外円の半径 R、線の太さ W = R / φ²。φ = (1 + √5) / 2', 23, HARD);

t(60, H_ALL - 190, '開口 AP = R × 0.9　（c と e で共通）', 22);
t(60, H_ALL - 152, '字間 = W × 1.4', 22);
t(60, H_ALL - 114, 'この図は書体と同じ関数から描いている。形を直せば図も直る。', 22);
t(60, H_ALL - 60, '2026-09-13', 21);

writeFileSync(`${L}/blueprint.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W_ALL} ${H_ALL}">
  <rect width="${W_ALL}" height="${H_ALL}" fill="#f4f5f7"/>
  <rect x="28" y="28" width="${W_ALL - 56}" height="${H_ALL - 56}" fill="none" stroke="#c2c8d2"/>
  ${el.join('\n  ')}
</svg>\n`);
console.log('ok', W_ALL, H_ALL);
