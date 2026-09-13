/**
 * c / a / e は「ひとつの円の切り方違い」である、という構造から組む。
 *
 *   円環（リング）        ← 出発点
 *     右を開ける      → c
 *     右に縦棒を足す  → a（1階建て）
 *     横棒を入れて
 *     右下を開ける    → e
 *     半径を半分にして
 *     上下で向きを変える → s
 *
 * だから4文字は別々の形ではなく、ひとつの円に対する4つの操作になる。
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

let uid = 0;
const id = () => `m${++uid}`;

const ring = (cx, cy, r, w) =>
  `<path fill-rule="evenodd" fill="#fff" d="M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z
     M ${cx - r + w} ${cy} a ${r - w} ${r - w} 0 1 0 ${2 * (r - w)} 0 a ${r - w} ${r - w} 0 1 0 ${-2 * (r - w)} 0 Z"/>`;
const box = (x, y, w, h, c = '#fff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;

/** マスクで「足す（白）」「引く（黒）」を組み合わせ、1色の図形として返す */
const FIELD = 20000;
const glyph = (add, cut, color) => {
  const m = id();
  return `<mask id="${m}" maskUnits="userSpaceOnUse" x="${-FIELD / 2}" y="${-FIELD / 2}" width="${FIELD}" height="${FIELD}">
      ${add.join('\n      ')}
      ${cut.map((s) => s.replace(/fill="#fff"/g, 'fill="#000"')).join('\n      ')}
    </mask>
    <rect x="${-FIELD / 2}" y="${-FIELD / 2}" width="${FIELD}" height="${FIELD}" fill="${color}" mask="url(#${m})"/>`;
};

/**
 * @param r 外半径  @param w 線の太さ  @param ap 開口の高さ（縦の切り欠き）
 */
export const C = (cx, cy, r, w, ap, color) =>
  glyph([ring(cx, cy, r, w)], [box(cx, cy - ap / 2, r + w, ap)], color);

export const A = (cx, cy, r, w, color) =>
  glyph([ring(cx, cy, r, w), box(cx + r - w, cy - r, w, 2 * r)], [], color);

export const E = (cx, cy, r, w, ap, color) =>
  glyph([ring(cx, cy, r, w), box(cx - r, cy - w / 2, 2 * r, w)],
        [box(cx + r * 0.18, cy + w / 2, r + w, ap)], color);

/**
 * s だけは1つの円から出ない。半径を半分にした輪を2つ、上下で向きを変えてつなぐ。
 * 円弧を線で描く。終端は 30° / 150° で落とす（直角だと鉤に見える）
 */
export const S = (cx, cy, r, w, color) => {
  const h = r / 2;
  const rr = h - w / 2;
  const top = cy - h, bot = cy + h;
  const rad = (d) => (d * Math.PI) / 180;
  const p = (ccx, ccy, deg) =>
    `${(ccx + rr * Math.cos(rad(deg))).toFixed(2)} ${(ccy + rr * Math.sin(rad(deg))).toFixed(2)}`;
  return `<path fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="butt" d="
    M ${p(cx, top, 30)}
    A ${rr} ${rr} 0 1 0 ${p(cx, top, 90)}
    A ${rr} ${rr} 0 1 1 ${p(cx, bot, 150)}"/>`;
};
