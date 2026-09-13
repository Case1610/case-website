import { writeFileSync } from 'node:fs';
import { DIM, markBody, emptyBody } from './system.mjs';
const L = import.meta.dirname;
const { A, S, M, H, TAB } = DIM;

const W = 2340, HT = 1560;
const OX = 700, OY = 300;                    // 図の左上（1000 単位のまま置く）
const GRID = '#dcdfe6', LINE = '#8f96a3', HARD = '#3f69d3', TXT = '#4a4f58', INK = '#1c1f24';
const t0 = (A - TAB) / 2, t1 = (A + TAB) / 2;

const el = [];
const line = (x1, y1, x2, y2, c = LINE, w = 1, dash = '') =>
  el.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
const circle = (cx, cy, r, c = HARD, w = 1.8) =>
  el.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/>`);
const txt = (x, y, t, size = 22, c = TXT, anchor = 'start', weight = 400) =>
  el.push(`<text x="${x}" y="${y}" font-size="${size}" font-family="sans-serif" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${t}</text>`);
const dimH = (x1, x2, y, label, c = INK) => {
  line(x1, y, x2, y, c, 1.5); line(x1, y - 10, x1, y + 10, c, 1.5); line(x2, y - 10, x2, y + 10, c, 1.5);
  txt((x1 + x2) / 2, y - 16, label, 21, c, 'middle');
};
const dimV = (y1, y2, x, label, c = INK) => {
  line(x, y1, x, y2, c, 1.5); line(x - 10, y1, x + 10, y1, c, 1.5); line(x - 10, y2, x + 10, y2, c, 1.5);
  txt(x + 20, (y1 + y2) / 2 + 7, label, 21, c);
};

/* グリッド（1/10） */
for (let i = 0; i <= 10; i++) {
  const v = (A / 10) * i;
  line(OX + v, OY, OX + v, OY + A, GRID);
  line(OX, OY + v, OX + A, OY + v, GRID);
}
/* マーク本体 */
el.push(`<g transform="translate(${OX} ${OY})">${markBody('#23272e', '#ffffff', '#23272e')}</g>`);

/* φ の刻み */
for (const v of [M, M + S, A - M - S, A - M]) {
  line(OX + v, OY - 130, OX + v, OY + A + 130, LINE, 1.3, '8 7');
  line(OX - 70, OY + v, OX + A + 190, OY + v, LINE, 1.3, '8 7');
}
for (const v of [t0, t1]) line(OX - 40, OY + v, OX + A + 290, OY + v, HARD, 1.4, '8 7');

/* 黄金分割の円 */
circle(OX + A / 2, OY + A / 2, A / 2);
circle(OX + A / 2, OY + A / 2, H / 2);
circle(OX + A / 2, OY + A / 2, TAB / 2);
circle(OX + A / 2, OY + A / 2, 6, HARD, 4);

/* 寸法 */
dimH(OX, OX + A, OY - 78, 'A = 1000');
dimH(OX + M, OX + A - M, OY - 160, `H = A / φ = ${H}`);
dimH(OX, OX + M, OY + A + 78, `M = ${M}`);
dimH(OX + M, OX + M + S, OY + A + 78, `S = ${S}`);
dimH(OX + M + S, OX + A - M - S, OY + A + 160, `中身 = H − 2S = ${H - 2 * S}`);
dimV(OY + t0, OY + t1, OX + A + 290, `TAB = H / φ² = ${TAB}`, HARD);

/* 見出しと導出 */
txt(70, 92, 'ShowCase — construction', 40, INK, 'start', 700);
txt(70, 136, '2026-09-13', 22);
line(70, 170, 600, 170, '#c2c8d2', 1.5);

txt(70, 226, '考え方', 24, INK, 'start', 700);
[
  '箱（外枠）と中身（内側の面）は同じ色。',
  'そのあいだにできた白い隙間だけが C の形をしている。',
  '',
  '右側で隙間が途切れ、そこで中身が箱につながる。',
  'これが仕立ての合わせ目であり、C の開口部でもある。',
  '',
  '中身を抜くと隙間はただの四角に戻り、C は消える。',
  '置くことではじめて名前になる。',
].forEach((t, i) => txt(70, 268 + i * 34, t, 22));

txt(70, 620, '寸法の連鎖', 24, INK, 'start', 700);
[
  ['A', '= 1000', '外形の一辺。すべての出発点'],
  ['H', `= A / φ = ${H}`, '中身の一辺・文字の高さ'],
  ['M', `= (A − H) / 2 = ${M}`, '箱の壁の厚み'],
  ['S', `= H / φ³ = ${S}`, '線の太さ'],
  ['TAB', `= H / φ² = ${TAB}`, '合わせ目（C の開口）'],
].forEach(([k, v, note], i) => {
  txt(70, 664 + i * 38, k, 22, INK, 'start', 700);
  txt(150, 664 + i * 38, v, 22, INK);
  txt(380, 664 + i * 38, note, 21);
});

txt(70, 900, 'φ = (1 + √5) / 2 = 1.6180339887…', 22, HARD);
txt(70, 940, 'この図はロゴと同じ定数から生成している。', 21);
txt(70, 972, '別々に描くと、片方を直したときにもう片方が嘘になる。', 21);

/* 中身なしの状態を小さく並べる */
el.push(`<g transform="translate(70 1060) scale(0.2)">${emptyBody('#23272e', '#ffffff')}</g>`);
el.push(`<g transform="translate(330 1060) scale(0.2)">${markBody('#23272e', '#ffffff', '#23272e')}</g>`);
txt(70, 1290, '空の箱', 21);
txt(330, 1290, '置くと C が現れる', 21);
line(285, 1160, 315, 1160, INK, 2);
line(305, 1152, 315, 1160, INK, 2);
line(305, 1168, 315, 1160, INK, 2);

writeFileSync(`${L}/blueprint.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${HT}">
  <rect width="${W}" height="${HT}" fill="#f4f5f7"/>
  <rect x="28" y="28" width="${W - 56}" height="${HT - 56}" fill="none" stroke="#c2c8d2"/>
  ${el.join('\n  ')}
</svg>\n`);
console.log('ok');
