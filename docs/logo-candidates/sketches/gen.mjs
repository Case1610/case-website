import { writeFileSync } from 'node:fs';
const L = import.meta.dirname;
const K = '#14161a';
const V = 100;
const s = [];   // { id, body }
const add = (body) => s.push(body);

/* ── 部品 ── */
const box   = (x,y,w,h,sw=8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="${sw}"/>`;
const fill  = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${K}"/>`;
const line  = (x1,y1,x2,y2,sw=8) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${K}" stroke-width="${sw}"/>`;
const dot   = (cx,cy,r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}"/>`;
const ring  = (cx,cy,r,sw=7) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${K}" stroke-width="${sw}"/>`;
const cArc  = (cx,cy,r,sw=7) => `<path d="M ${(cx+r*.71).toFixed(1)} ${(cy-r*.71).toFixed(1)} A ${r} ${r} 0 1 0 ${(cx+r*.71).toFixed(1)} ${(cy+r*.71).toFixed(1)}" fill="none" stroke="${K}" stroke-width="${sw}" stroke-linecap="butt"/>`;
const tray  = (x,y,w,h,sw=8) => `<path d="M ${x} ${y} V ${y+h} H ${x+w} V ${y}" fill="none" stroke="${K}" stroke-width="${sw}"/>`;
const slotR = (x,y,w,h,gy,gh,sw=8) => `<path d="M ${x+w} ${gy} V ${y} H ${x} V ${y+h} H ${x+w} V ${gy+gh}" fill="none" stroke="${K}" stroke-width="${sw}"/>`;

/* ── 点で字を描く。1=丸を置く ── */
const GLYPH5 = {
  c: ['.###.','#....','#....','#....','.###.'],
  a: ['.##..','...#.','.####','#..#.','.####'],
  s: ['.###.','#....','.###.','....#','.###.'],
  e: ['.###.','#...#','####.','#....','.###.'],
};
const matrix = (rows, x, y, cell, r, showGrid, useRing=false) =>
  rows.map((row,ri)=>row.split('').map((ch,ci)=>{
    const cx = x + cell*ci + cell/2, cy = y + cell*ri + cell/2;
    if (ch === '#') return useRing ? ring(cx,cy,r,cell*0.24) : dot(cx,cy,r);
    return showGrid ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${K}" stroke-width="1.4" opacity=".28"/>` : '';
  }).join('')).join('');

/* ══ 群1  枠＋ひとつの中身 ══ */
add(box(12,12,76,76) + dot(50,50,20));
add(box(12,12,76,76) + ring(50,50,20));
add(box(12,12,76,76) + cArc(50,50,20));
add(tray(14,10,72,78) + dot(50,54,20));
add(slotR(12,12,76,76,38,24) + dot(50,50,18));
add(fill(12,12,76,76) + `<circle cx="50" cy="50" r="20" fill="#fff"/>`);
add(fill(12,12,76,76) + `<path d="M 64 36 A 20 20 0 1 0 64 64" fill="none" stroke="#fff" stroke-width="8"/>`);
add(box(12,12,76,76,14) + dot(50,50,14));
add(box(12,12,76,76) + dot(50,50,32));

/* ══ 群2  2分割・黄金分割 ══ */
add(box(12,12,76,76) + line(59,12,59,88) + dot(36,50,13));
add(box(12,12,76,76) + line(59,12,59,88) + dot(36,50,13) + ring(74,50,8,5));
add(box(12,12,76,76) + line(12,59,88,59) + dot(50,36,13));
add(box(12,12,76,76) + line(50,12,50,88) + dot(31,50,12) + dot(69,50,12));
add(box(12,12,76,76) + line(59,12,59,88) + fill(59,12,29,76));
add(box(12,12,76,76) + line(59,12,59,88) + cArc(36,50,13,6));
add(tray(14,10,72,78) + line(56,10,56,88) + dot(35,52,13));

/* ══ 群3  4分割・9分割 ══ */
add(box(12,12,76,76) + line(50,12,50,88) + line(12,50,88,50) + dot(31,31,11));
add(box(12,12,76,76) + line(50,12,50,88) + line(12,50,88,50) + dot(31,31,11) + dot(69,69,11));
add(box(12,12,76,76) + line(50,12,50,88) + line(12,50,88,50) + dot(31,31,11) + ring(69,31,11,6) + dot(31,69,11));
add(box(12,12,76,76) + line(50,12,50,88) + line(12,50,88,50) + fill(50,50,38,38));
add(box(12,12,76,76,6) + line(37,12,37,88,6) + line(62,12,62,88,6) + line(12,37,88,37,6) + line(12,62,88,62,6) + dot(24,24,7) + dot(50,50,7) + dot(75,75,7));
add(box(12,12,76,76,6) + line(37,12,37,88,6) + line(62,12,62,88,6) + line(12,37,88,37,6) + line(12,62,88,62,6) + dot(50,50,9));

/* ══ 群4  不等分（活字ケース） ══ */
add(box(10,10,80,80,6) + line(44,10,44,90,6) + line(44,50,90,50,6) + line(10,64,44,64,6) + dot(27,37,10) + dot(67,30,10) + dot(67,70,10) + dot(27,77,7));
add(box(10,10,80,80,6) + line(52,10,52,90,6) + line(52,44,90,44,6) + line(52,67,90,67,6) + dot(31,50,14) + dot(71,27,7) + dot(71,55,7) + dot(71,78,7));
add(box(10,10,80,80,6) + line(10,44,90,44,6) + line(34,44,34,90,6) + line(62,44,62,90,6) + dot(50,27,12) + dot(22,67,7) + dot(48,67,7) + dot(76,67,7));
add(box(10,10,80,80,6) + line(36,10,36,90,6) + line(63,10,63,90,6) + line(36,50,90,50,6) + dot(23,50,10) + dot(49,30,8) + dot(49,70,8) + dot(76,30,8) + dot(76,70,8));

/* ══ 群5  入れ子 ══ */
add(box(8,8,84,84,7) + box(26,26,48,48,7) + dot(50,50,11));
add(box(8,8,84,84,7) + box(26,26,48,48,7) + ring(50,50,11,6));
add(box(8,8,84,84,7) + box(26,26,48,48,7) + cArc(50,50,11,6));
add(box(8,8,84,84,7) + ring(50,50,26,7) + dot(50,50,9));
add(fill(8,8,84,84) + `<rect x="26" y="26" width="48" height="48" fill="#fff"/>` + dot(50,50,11));

/* ══ 群6  はみ出し・欠け ══ */
add(box(12,12,76,76) + dot(88,50,17));
add(slotR(12,12,76,76,33,34) + dot(80,50,17));
add(box(12,12,76,76) + `<circle cx="70" cy="50" r="22" fill="${K}"/>`);
add(tray(14,10,72,78) + dot(50,22,15));
add(box(12,12,76,76) + line(12,59,88,59) + dot(50,76,13) + ring(50,33,13,6));

/* ══ 群7  点で c を描く（区画に中身を置くと名前になる） ══ */
add(matrix(GLYPH5.c, 14, 14, 14.4, 5.4, false));
add(matrix(GLYPH5.c, 14, 14, 14.4, 5.4, true));
add(matrix(GLYPH5.c, 14, 14, 14.4, 6.6, false));
add(box(6,6,88,88,5) + matrix(GLYPH5.c, 16, 16, 13.6, 5, false));
add(box(6,6,88,88,5) + matrix(GLYPH5.c, 16, 16, 13.6, 5, true));
add(matrix(GLYPH5.c, 14, 14, 14.4, 5.4, false, true));
add(matrix(['.##.','#...','#...','.##.'], 18, 18, 16, 6, false));
add(matrix(['.##.','#...','#...','.##.'], 18, 18, 16, 6, true));
add(box(6,6,88,88,5) + matrix(['.##.','#...','#...','.##.'], 20, 20, 15, 5.6, false));
add(matrix(['.###.','#....','#....','#....','.###.'].map(r=>r), 14, 14, 14.4, 4.2, true, false));

/* ══ 群8  正方＋活字1本（sort） ══ */
add(box(12,12,76,76) + fill(40,26,20,48));
add(box(12,12,76,76) + fill(40,26,20,48) + `<circle cx="50" cy="50" r="7" fill="#fff"/>`);
add(box(12,12,76,76) + fill(26,40,48,20));
add(tray(14,10,72,78) + fill(30,30,18,48) + fill(52,30,18,48));
add(tray(14,10,72,78) + fill(28,36,14,44) + fill(46,28,14,52) + fill(64,44,14,36));

/* ── 書き出し ── */
s.forEach((body, i) =>
  writeFileSync(`${L}/s${String(i+1).padStart(2,'0')}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">${body}</svg>\n`));
console.log(s.length);
