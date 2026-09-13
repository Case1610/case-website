import { writeFileSync } from 'node:fs';
const L = import.meta.dirname;
const K = '#14161a';
const svg = (b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${b}</svg>\n`;
const box = (w) => `<rect x="${12+w/2}" y="${12+w/2}" width="${76-w}" height="${76-w}" fill="none" stroke="${K}" stroke-width="${w}"/>`;
const tray = (w) => `<path d="M ${12+w/2} ${10} V ${88-w/2} H ${88-w/2} V ${10}" fill="none" stroke="${K}" stroke-width="${w}"/>`;

const V = {
  // 34系：枠の中の丸。残った白が c に読める
  d01: box(8)  + `<circle cx="70" cy="50" r="22" fill="${K}"/>`,
  d02: box(8)  + `<circle cx="67" cy="50" r="25" fill="${K}"/>`,
  d03: box(8)  + `<circle cx="64" cy="50" r="28" fill="${K}"/>`,
  d04: box(12) + `<circle cx="67" cy="50" r="25" fill="${K}"/>`,
  d05: box(6)  + `<circle cx="67" cy="50" r="25" fill="${K}"/>`,
  d06: box(8)  + `<circle cx="74" cy="50" r="25" fill="${K}"/>`,
  d07: `<rect x="12" y="12" width="76" height="76" fill="${K}"/><circle cx="67" cy="50" r="25" fill="#fff"/>`,
  d08: `<rect x="12" y="12" width="76" height="76" rx="10" fill="none" stroke="${K}" stroke-width="8"/><circle cx="67" cy="50" r="25" fill="${K}"/>`,
  d09: tray(8) + `<circle cx="67" cy="54" r="25" fill="${K}"/>`,
  d10: box(8)  + `<circle cx="67" cy="50" r="25" fill="none" stroke="${K}" stroke-width="9"/>`,
  // 32系：縁にまたがる丸
  d11: box(8)  + `<circle cx="88" cy="50" r="17" fill="${K}"/>`,
  d12: box(8)  + `<circle cx="88" cy="50" r="23" fill="${K}"/>`,
  d13: box(12) + `<circle cx="88" cy="50" r="20" fill="${K}"/>`,
  d14: box(8)  + `<circle cx="88" cy="50" r="20" fill="#fff" stroke="${K}" stroke-width="8"/>`,
};
Object.entries(V).forEach(([k, b]) => writeFileSync(`${L}/${k}.svg`, svg(b)));
console.log(Object.keys(V).length);
