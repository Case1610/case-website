import { writeFileSync } from 'node:fs';
import { DIM, markBody, wordBody, wordWidth } from './system.mjs';
const L = import.meta.dirname;
const { A, M, H } = DIM;
const INK = '#14161a', PAPER = '#ffffff', LIGHT = '#eff2f7', DARKBG = '#16181c';

const svg = (w, h, b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${b}</svg>\n`;

/* ライト：地＝インクの四角、隙間＝紙の色 */
writeFileSync(`${L}/u-mark-light.svg`, svg(A, A, markBody(INK, PAPER, INK)));
/* ダーク：地＝明るい四角、隙間＝背景の色。図と地が入れ替わっても関係は同じ */
writeFileSync(`${L}/u-mark-dark.svg`, svg(A, A, markBody(LIGHT, DARKBG, LIGHT)));

const lockW = A + Math.round(M * 1.4) + wordWidth;
writeFileSync(`${L}/u-lockup-light.svg`, svg(lockW, A,
  `${markBody(INK, PAPER, INK)}${wordBody(INK, A + Math.round(M * 1.4), (A - H) / 2)}`));
writeFileSync(`${L}/u-lockup-dark.svg`, svg(lockW, A,
  `${markBody(LIGHT, DARKBG, LIGHT)}${wordBody(LIGHT, A + Math.round(M * 1.4), (A - H) / 2)}`));

/* 「Show」＋マーク の案は文字が要るので、ここではロックアップのみ出す */
console.log('lockW', lockW);
