/**
 * デザインシステムのトークンを、MUI に渡せる形（16進・clamp 文字列）に組み立てる。
 *
 * **数値はここに無い。** 写しは `spec.ts` ひとつだけで、その原本は別リポジトリが
 * `/tokens.json` として配信している。このファイルは組み立てるだけ。
 *
 * **ずれたら CI が落ちる。** `npm run verify:tokens` が配信中の原本と写しを
 * 突き合わせ、食い違いを項目ごとに出す。揃えるのは `npm run sync:tokens` の一発。
 */

import { spec } from './spec';
import { oklchToHex } from './oklch';

/**
 * 色相。原本では `--ds-hue` という CSS 変数で実行時に差し替えられるが、
 * こちらは MUI に16進を渡す都合で、ビルド時に1つへ固定する（既定値と同じ）。
 */
const HUE = spec.hue.default;

type Role = { on: 'neutral' | 'brand'; l: number; c?: number };
type StatusName = keyof typeof spec.statusHue;

const roleColor = ({ on, l, c }: Role) =>
  oklchToHex(l / 100, c ?? (on === 'neutral' ? spec.chroma.neutral : spec.chroma.brand), HUE);

const statusColor = (name: StatusName, l: number, c: number) =>
  oklchToHex(l / 100, c, spec.statusHue[name]);

const scheme = (name: 'light' | 'dark') => {
  const { roles, status } = spec.color[name];
  return {
    ...(Object.fromEntries(
      Object.entries(roles).map(([k, v]) => [k, roleColor(v as Role)]),
    ) as Record<keyof typeof roles, string>),
    ...(Object.fromEntries(
      (Object.keys(spec.statusHue) as StatusName[]).flatMap((s) => [
        [s, statusColor(s, status.l, status.c)],
        [`${s}Subtle`, statusColor(s, status.subtleL, status.subtleC)],
      ]),
    ) as Record<StatusName | `${StatusName}Subtle`, string>),
  };
};

export const lightColors = scheme('light');
export const darkColors: typeof lightColors = scheme('dark');

export type ColorTokens = typeof lightColors;

/**
 * 320px〜1440px の間を線形に補間する clamp を作る。
 *
 * 中間項が `rem + vw` なのが肝。`vw` だけだとブラウザの文字サイズ設定に追従しない
 * （ズームには効くが設定には効かない）。
 */
const { minVw: MIN_VW, maxVw: MAX_VW, root: ROOT } = spec.fluid;

const fluid = ([minPx, maxPx]: readonly number[]) => {
  const slope = (maxPx - minPx) / (MAX_VW - MIN_VW);
  const vw = +(slope * 100).toFixed(4);
  const rem = +((minPx - slope * MIN_VW) / ROOT).toFixed(4);
  return `clamp(${(minPx / ROOT).toFixed(4)}rem, ${rem}rem + ${vw}vw, ${(maxPx / ROOT).toFixed(4)}rem)`;
};

/** 型。ビューポートで連続的に変わる */
export const text = Object.fromEntries(
  Object.entries(spec.text).map(([k, v]) => [k, fluid(v)]),
) as Record<keyof typeof spec.text, string>;

/** 余白。型と違い、ビューポートでは変えない */
export const space = spec.space;

/**
 * 書体。まだデザインシステムにトークンが無いので、向こうのショーケースが
 * 使っている指定に合わせてある（向こうでトークンになったら、ここもそれに従う）。
 * 日本語のフォールバックはこちらで足した。
 */
export const fontFamily =
  'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif';
