/**
 * OKLCH を sRGB の16進に変換する。
 *
 * なぜ必要か: デザインシステムは色を `oklch(55% 0.17 265)` という式で持っている。
 * ところが MUI の `createTheme` は、渡された色を自分で明暗に振ったり
 * 透明度を掛けたりする（`alpha()` / `lighten()`）。その実装
 * （@mui/system の decomposeColor）が受け付けるのは #nnn / rgb() / hsl() / color() だけで、
 * `oklch()` も `var(--x)` も投げると例外になる。
 *
 * つまり「CSS 変数をそのまま MUI に渡す」は成立しない。
 * 変換をどこかでやる必要があり、ここでやっている。
 *
 * 色域外（sRGB に収まらない）の指定は、明度と色相を保ったまま彩度だけを
 * 二分探索で落として収める。ブラウザが `oklch()` に対してやっているのと同じ方針で、
 * **明度＝コントラストを動かさない**ことを優先する。
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** 線形 sRGB → ガンマ補正済み sRGB */
const encodeGamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

type LinearRgb = [number, number, number];

/** OKLCH → OKLab → LMS → 線形 sRGB（Björn Ottosson の係数） */
function toLinearRgb(l: number, c: number, hDeg: number): LinearRgb {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const lCube = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCube = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCube = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube,
    -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube,
    -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube,
  ];
}

const EPSILON = 1e-4;
const inGamut = (rgb: LinearRgb) => rgb.every((v) => v >= -EPSILON && v <= 1 + EPSILON);

/**
 * @param lightness 0〜1（デザインシステムの「55%」は 0.55）
 * @param chroma 0〜0.4 程度
 * @param hue 度
 */
export function oklchToHex(lightness: number, chroma: number, hue: number): string {
  let c = chroma;

  if (!inGamut(toLinearRgb(lightness, c, hue))) {
    // 収まる彩度の上限を二分探索する。明度と色相は動かさない
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i += 1) {
      const mid = (lo + hi) / 2;
      if (inGamut(toLinearRgb(lightness, mid, hue))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }

  const hex = toLinearRgb(lightness, c, hue)
    .map((v) => Math.round(clamp01(encodeGamma(clamp01(v))) * 255))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');

  return `#${hex}`;
}

/** WCAG の相対輝度。コントラスト比の確認用（テスト・検証から使う） */
export function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** WCAG のコントラスト比 */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
