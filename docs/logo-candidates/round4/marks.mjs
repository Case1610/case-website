import { writeFileSync } from 'node:fs';
import { C, A, E, S, PHI } from './type.mjs';
const L = import.meta.dirname;
const INK = '#14161a';
const A0 = 1000, cx = 500, cy = 500;
const svg = (b, w = A0, h = A0) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${b}</svg>\n`;
const R = (n) => Math.round(500 / PHI ** n);   // 500, 309, 191, 118, 73, 45

/* M1  C の懐に a が収まる。a の縦棒が C の開口とそろう */
writeFileSync(`${L}/M1.svg`, svg(
  C(cx, cy, R(0), R(0) - R(1), Math.round(R(1) * 1.5), INK) +
  A(cx, cy, R(2), R(4), INK)));

/* M3  C の懐に a s e が入る。case の残り3文字が中にいる */
{
  const inner = R(1);                 // 懐の半径 309
  const r = Math.round(inner / 2.55); // 3文字が横に並ぶ大きさ
  const w = Math.round(r / PHI ** 2);
  const pitch = Math.round(r * 2.2);
  writeFileSync(`${L}/M3.svg`, svg(
    C(cx, cy, R(0), R(0) - R(1), Math.round(R(1) * 1.5), INK) +
    A(cx - pitch, cy, r, w, INK) + S(cx, cy, r, w, INK) + E(cx + pitch, cy, r, w, Math.round(r * 0.9), INK)));
}

/* M4  c → a → c → a と入れ子にする。比は毎回 φ。開口はすべて右で、白が外から中心まで通る */
{
  const ap = (rr) => Math.round(rr * 1.5);
  writeFileSync(`${L}/M4.svg`, svg(
    C(cx, cy, R(0), R(0) - R(1), ap(R(1)), INK) +
    A(cx, cy, R(2), R(2) - R(3), INK) +
    C(cx, cy, R(4), R(4) - R(5), ap(R(5)), INK)));
}

/* M5  a の中に c。入れ子の向きを逆にした場合 */
writeFileSync(`${L}/M5.svg`, svg(
  A(cx, cy, R(0), R(0) - R(1), INK) +
  C(cx, cy, R(2), R(2) - R(3), Math.round(R(3) * 1.6), INK)));

console.log('R:', [0,1,2,3,4,5].map(R).join(' '));
