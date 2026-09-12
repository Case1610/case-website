/**
 * デザインシステム（別リポジトリ）のトークンの**写し**。
 *
 * 原本は向こうの `src/tokens/themes.css.ts`。ここにあるのは生成規則
 * （明度・彩度・色相と、それを組む式）をそのまま持ってきたもので、
 * 値の一覧を貼ったものではない。値を貼ると、向こうで明度を1ポイント動かしたときに
 * こちらの差分が「意味のない16進の羅列」になって、何が変わったのか読めなくなる。
 *
 * **なぜ依存（npm パッケージ）にしないか**
 * 依存を先に張ると、片方を触るたびに両方を動かす羽目になる。
 * デザインシステムはまだ毎週かたちが変わる段階なので、いまは写しで受け、
 * ずれたら手で揃える。揃える作業が面倒になった時点が、依存に切り替える合図。
 *
 * 写した時点: 2026-09-12 / 原本 c38c376
 */

import { oklchToHex } from './oklch';

/**
 * 色相。原本では `--ds-hue` という CSS 変数で実行時に差し替えられるが、
 * こちらは MUI に16進を渡す都合で、ビルド時に1つへ固定する（既定値と同じ 265）。
 */
const HUE = 265;

const NEUTRAL_CHROMA = 0.008;
const BRAND_CHROMA = 0.17;

const neutral = (lightness: number) => oklchToHex(lightness, NEUTRAL_CHROMA, HUE);
const brand = (lightness: number, chroma = BRAND_CHROMA) => oklchToHex(lightness, chroma, HUE);

/** 状態色の色相。「赤は危険」は計算で導ける値ではなく、学習された慣習 */
const STATUS_HUE = { danger: 27, warning: 70, success: 150, info: 245 } as const;
type StatusName = keyof typeof STATUS_HUE;

const status = (name: StatusName, lightness: number, chroma: number) =>
  oklchToHex(lightness, chroma, STATUS_HUE[name]);

const statusTokens = (lightness: number, chroma: number, subtleL: number, subtleC: number) => ({
  danger: status('danger', lightness, chroma),
  dangerSubtle: status('danger', subtleL, subtleC),
  warning: status('warning', lightness, chroma),
  warningSubtle: status('warning', subtleL, subtleC),
  success: status('success', lightness, chroma),
  successSubtle: status('success', subtleL, subtleC),
  info: status('info', lightness, chroma),
  infoSubtle: status('info', subtleL, subtleC),
});

export const lightColors = {
  bg: neutral(0.97),
  surface: neutral(1.0),
  border: neutral(0.88),
  textMuted: neutral(0.54),
  text: neutral(0.35),
  textStrong: neutral(0.2),

  brand: brand(0.55),
  brandHover: brand(0.45),
  onBrand: neutral(1.0),
  brandSubtle: brand(0.95, 0.03),

  ...statusTokens(0.45, 0.15, 0.94, 0.04),
  onStatus: neutral(1.0),
};

export const darkColors: typeof lightColors = {
  bg: neutral(0.15),
  surface: neutral(0.21),
  border: neutral(0.32),
  textMuted: neutral(0.62),
  text: neutral(0.85),
  textStrong: neutral(0.96),

  brand: brand(0.65, 0.15),
  brandHover: brand(0.8, 0.15),
  onBrand: neutral(0.15),
  brandSubtle: brand(0.28, 0.05),

  ...statusTokens(0.72, 0.13, 0.27, 0.05),
  onStatus: neutral(0.15),
};

export type ColorTokens = typeof lightColors;

/**
 * 320px〜1440px の間を線形に補間する clamp を作る。
 *
 * 中間項が `rem + vw` なのが肝。`vw` だけだとブラウザの文字サイズ設定に追従しない
 * （ズームには効くが設定には効かない）。
 */
const MIN_VW = 320;
const MAX_VW = 1440;
const ROOT = 16;

const fluid = (minPx: number, maxPx: number) => {
  const slope = (maxPx - minPx) / (MAX_VW - MIN_VW);
  const vw = +(slope * 100).toFixed(4);
  const rem = +((minPx - slope * MIN_VW) / ROOT).toFixed(4);
  return `clamp(${(minPx / ROOT).toFixed(4)}rem, ${rem}rem + ${vw}vw, ${(maxPx / ROOT).toFixed(4)}rem)`;
};

/** 型。ビューポートで連続的に変わる */
export const text = {
  xs: fluid(12, 13),
  sm: fluid(14, 15),
  base: fluid(16, 17),
  lg: fluid(18, 21),
  xl: fluid(22, 27),
  '2xl': fluid(27, 35),
  '3xl': fluid(33, 45),
};

/** 余白。型と違い、ビューポートでは変えない */
export const space = {
  '3xs': '0.125rem',
  '2xs': '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

/**
 * 書体。まだデザインシステムにトークンが無いので、向こうのショーケースが
 * 使っている指定に合わせてある（向こうでトークンになったら、ここもそれに従う）。
 * 日本語のフォールバックはこちらで足した。
 */
export const fontFamily =
  'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif';
