import { writeFileSync, readFileSync } from 'node:fs';
import { C, A, E, S, PHI } from './type.mjs';
const L = import.meta.dirname;
const INK = '#14161a';
const A0 = 1000, cx = 500, cy = 500;
const svg = (b, w = A0, h = A0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${b}</svg>\n`;
const R = (n) => Math.round(500 / PHI ** n);      // 500 309 191 118 73 45

/* 外側の C は共通。開口は懐の直径の 0.8 倍 */
const OUTER = (ap = Math.round(R(1) * 1.6)) => C(cx, cy, R(0), R(0) - R(1), ap, INK);

/* M3a  懐に a s e が収まる。3文字が懐の円に内接するところまで小さくする */
{
  const inner = R(1) - 24;                 // 懐 309 から少し余白
  const r = Math.round(inner / 3.6);       // 3文字ぶん
  const w = Math.round(r / PHI ** 2);
  const pitch = Math.round(r * 2.35);
  writeFileSync(`${L}/M3a.svg`, svg(
    OUTER() + A(cx - pitch, cy, r, w, INK) + S(cx, cy, r, w, INK) +
    E(cx + pitch, cy, r, w, Math.round(r * 0.9), INK)));
}

/* M7  懐から a s e が開口を通って外へ出る。容れ物と中身が1行になる */
{
  const r = R(2);                            // 191
  const w = Math.round(r / PHI ** 2);
  const pitch = Math.round(r * 2.25);
  const x0 = cx + R(0) - Math.round(r * 0.35);
  const width = x0 + 2 * pitch + r + 60;
  writeFileSync(`${L}/M7.svg`, svg(
    OUTER() + A(x0, cy, r, w, INK) + S(x0 + pitch, cy, r, w, INK) +
    E(x0 + 2 * pitch, cy, r, w, Math.round(r * 0.9), INK), width, A0));
}

/* M1b  懐に a だけ。小さいところ用 */
writeFileSync(`${L}/M1b.svg`, svg(OUTER(Math.round(R(2) * 1.5)) + A(cx, cy, R(2), R(4), INK)));

/* M0  C だけ。ファビコン用 */
writeFileSync(`${L}/M0.svg`, svg(OUTER()));

console.log('ok');

/* ───── M8  ひとつの切り欠きが a でもあり C の口でもある（ルビン型） ───── */
{
  const PAPER = '#ffffff';
  const ringOuter = R(0), ringStroke = ringOuter - R(1);   // 500 / 191
  // 閉じた輪を描き、その右側を白い a で抜く。抜いた形が a、残った形が C
  const closed = `<path fill-rule="evenodd" fill="${INK}" d="
    M ${cx - ringOuter} ${cy} a ${ringOuter} ${ringOuter} 0 1 0 ${2 * ringOuter} 0 a ${ringOuter} ${ringOuter} 0 1 0 ${-2 * ringOuter} 0 Z
    M ${cx - (ringOuter - ringStroke)} ${cy} a ${ringOuter - ringStroke} ${ringOuter - ringStroke} 0 1 0 ${2 * (ringOuter - ringStroke)} 0 a ${ringOuter - ringStroke} ${ringOuter - ringStroke} 0 1 0 ${-2 * (ringOuter - ringStroke)} 0 Z"/>`;
  for (const [name, dx, ar] of [['M8', 250, 236], ['M8b', 300, 280]]) {
    writeFileSync(`${L}/${name}.svg`, svg(
      `${closed}${A(cx + dx, cy, ar, Math.round(ar / PHI ** 2), PAPER)}`));
  }
}

/* ダーク配色用に色を差し替えたものも書き出す */
{
  const LIGHT = '#eff2f7';
  const swap = (name) => {
    const s = readFileSync(`${L}/${name}.svg`, 'utf8').replaceAll(INK, LIGHT);
    writeFileSync(`${L}/${name}-dark.svg`, s);
  };
  ['M0', 'M1b', 'M3a', 'M7'].forEach(swap);
}
