import { writeFileSync } from 'node:fs';
import { C, A, E, S, PHI } from './type.mjs';
const L = import.meta.dirname;
const INK = '#14161a';
const R = 200, W = Math.round(R / PHI ** 2), AP = Math.round(R * 0.9);
const pitch = 2 * R + Math.round(W * 1.4);
const body = ['C', 'A', 'S', 'E'].map((ch, i) => {
  const cx = R + 40 + i * pitch, cy = R + 40;
  return { C: () => C(cx, cy, R, W, AP, INK), A: () => A(cx, cy, R, W, INK),
           S: () => S(cx, cy, R, W, INK), E: () => E(cx, cy, R, W, AP, INK) }[ch]();
}).join('\n');
const w = 80 + 4 * pitch - Math.round(W * 1.4), h = 2 * R + 80;
writeFileSync(`${L}/alphabet.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>\n`);
console.log('R',R,'W',W,'AP',AP);
