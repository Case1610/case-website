import { writeFileSync } from 'node:fs';
const L = import.meta.dirname;

/* ───────── 寸法はすべて φ から出す。図も設計図も同じ定数からしか描かない ───────── */
const PHI = (1 + Math.sqrt(5)) / 2;
const A = 1000;                       // 外形の一辺（すべての出発点）
const H = Math.round(A / PHI);        // 中身の一辺・文字の高さ   618
const M = Math.round((A - H) / 2);    // 箱の壁の厚み             191
const S = Math.round(H / PHI ** 3);   // 線の太さ                 146
const TAB = Math.round(H / PHI ** 2); // 合わせ目（C の開口）の高さ 236
const LW = Math.round(H / PHI);       // 走る文字の幅             382
const GAP = Math.round(S / PHI);      // 字間                     90

const INK = '#14161a', PAPER = '#ffffff', BRAND = '#3f69d3';
export const DIM = { PHI, A, S, M, H, TAB, LW, GAP };

/* ───────── マーク：箱（インク）＋中身（インク）＋その隙間（白）が C になる ───────── */
const o0 = M, o1 = A - M, i0 = M + S, i1 = A - M - S;
const t0 = (A - TAB) / 2, t1 = (A + TAB) / 2;

export const markBody = (ground = INK, gap = PAPER, inner = ground) => `
  <rect width="${A}" height="${A}" fill="${ground}"/>
  <path fill="${gap}" d="M ${o0} ${o0} H ${o1} V ${t0} H ${i1} V ${i0} H ${i0} V ${i1} H ${i1} V ${t1} H ${o1} V ${o1} H ${o0} Z"/>
  <rect x="${i0}" y="${i0}" width="${i1 - i0}" height="${i1 - i0}" fill="${inner}"/>`;

/** 中身を抜いた状態。C は消え、ただの空き箱に戻る */
export const emptyBody = (ground = INK, gap = PAPER) => `
  <rect width="${A}" height="${A}" fill="${ground}"/>
  <rect x="${o0}" y="${o0}" width="${o1 - o0}" height="${o1 - o0}" fill="${gap}"/>`;

/* ───────── ステンシルの CASE。白抜きなので、閉じた面は必ず地につながる ───────── */
const bars = {
  // [x, y, w, h] を文字枠 LW × H の中で
  C: [[0, 0, LW, S], [0, 0, S, H], [0, H - S, LW, S]],
  // 横棒は黄金分割の高さに。中央を切って、上の面を下へつなぐ（ステンシルの切れ目）
  A: (() => {
    const y = Math.round(H / PHI) - S / 2;          // 横棒は黄金分割の高さ
    const brk = Math.round(S / PHI ** 2);           // ステンシルの切れ目（= 56）
    const half = (LW - brk) / 2;
    return [[0, 0, LW, S], [0, 0, S, H], [LW - S, 0, S, H],
            [0, y, half, S], [half + brk, y, half, S]];
  })(),
  S: [[0, 0, LW, S], [0, 0, S, (H + S) / 2], [0, (H - S) / 2, LW, S],
      [LW - S, (H - S) / 2, S, (H + S) / 2], [0, H - S, LW, S]],
  E: [[0, 0, LW, S], [0, 0, S, H], [0, (H - S) / 2, Math.round(LW / PHI), S], [0, H - S, LW, S]],
};
const rects = (list, color, dx, dy) =>
  list.map(([x, y, w, h]) => `<rect x="${+(x + dx).toFixed(1)}" y="${+(y + dy).toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" fill="${color}"/>`).join('');

export const wordWidth = 4 * LW + 3 * GAP;
export const wordBody = (color, dx, dy) =>
  'CASE'.split('').map((ch, i) => rects(bars[ch], color, dx + i * (LW + GAP), dy)).join('');

const svg = (w, h, b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${b}</svg>\n`;

writeFileSync(`${L}/mark.svg`, svg(A, A, markBody()));
writeFileSync(`${L}/mark-brand.svg`, svg(A, A, markBody(INK, PAPER, BRAND)));
writeFileSync(`${L}/mark-empty.svg`, svg(A, A, emptyBody()));

/* 白抜きの CASE（地＝インクの帯） */
const barW = wordWidth + 2 * M, barH = H + 2 * M;
writeFileSync(`${L}/word-reversed.svg`,
  svg(barW, barH, `<rect width="${barW}" height="${barH}" fill="${INK}"/>${wordBody(PAPER, M, M)}`));
/* 通常（インクの文字、地は紙） */
writeFileSync(`${L}/word.svg`, svg(wordWidth, H, wordBody(INK, 0, 0)));

/* ロックアップ：マーク＋白抜きの CASE。同じ地の帯の上に並ぶ */
const lockW = A + Math.round(M * 1.2) + wordWidth + M;
writeFileSync(`${L}/lockup.svg`, svg(lockW, A, `
  ${markBody()}
  ${wordBody(INK, A + Math.round(M * 1.2), M)}`));

console.log(JSON.stringify(DIM, null, 1));
