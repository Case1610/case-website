import { createTheme, type Theme } from '@mui/material/styles';
import type { TypographyVariantsOptions } from '@mui/material/styles';
import { lightColors, darkColors, text, fontFamily, type ColorTokens } from './tokens';

/**
 * デザインシステムのトークンを MUI のテーマへ流し込む。
 *
 * ここに16進のリテラルは1つも無い。色は `tokens/` の式から生成されたものだけを使う。
 * 「ここだけあと少し明るく」をやりたくなったら、トークン側を直すか、
 * トークンを増やす議論をするかの二択になる（デザインシステムの原則3）。
 *
 * 型の大きさは clamp（流体）なので、MUI の variant にそのまま文字列で渡している。
 * ブラウザの文字サイズ設定にも、画面幅にも追従する。
 */

/**
 * 見出しの対応。
 *
 * MUI の見出しは6段階、デザインシステムの型は本文より上が4段階しかない。
 * 足りないのではなく、**4段階で足りる前提で作られている**。
 * だから番号順に機械的に割り当てず、このサイトで実際に何に使われているかで割り当てた。
 *
 * | variant | このサイトでの用途           | トークン |
 * |---------|------------------------------|----------|
 * | h1      | 404 の大きな数字             | 3xl      |
 * | h2      | トップのヒーロー             | 3xl      |
 * | h3      | ページタイトル（About 等）   | 2xl      |
 * | h4      | 節見出し・作品タイトル       | xl       |
 * | h5      | リード文・小節               | lg       |
 * | h6      | カード見出し・ラベル         | base     |
 *
 * h6 は既定の 20px から 16〜17px に下がる。小さくなった分は太さで補う。
 * カードの見出しが本文より一段大きいだけの状態は、並べたときにうるさい。
 */
const typography: TypographyVariantsOptions = {
  fontFamily,
  h1: { fontSize: text['3xl'], fontWeight: 700 },
  h2: { fontSize: text['3xl'], fontWeight: 700 },
  h3: { fontSize: text['2xl'], fontWeight: 600 },
  h4: { fontSize: text.xl, fontWeight: 600 },
  h5: { fontSize: text.lg, fontWeight: 600 },
  h6: { fontSize: text.base, fontWeight: 600 },
  subtitle1: { fontSize: text.base },
  subtitle2: { fontSize: text.sm, fontWeight: 600 },
  body1: { fontSize: text.base },
  body2: { fontSize: text.sm },
  button: { fontSize: text.sm },
  caption: { fontSize: text.xs },
  overline: { fontSize: text.xs },
};

/**
 * MUI の palette は役割の名前がこちらと違う。対応はここ1箇所に閉じてある。
 *
 * `secondary` にブランドの淡い方を当てず、状態色の `info` を当てている。
 * デザインシステムにはブランド色が1つしか無いため。
 * 2つ目のアクセントが要るとなったら、それは向こうで決める話になる。
 */
function paletteFrom(c: ColorTokens, mode: 'light' | 'dark') {
  return {
    mode,
    primary: { main: c.brand, dark: c.brandHover, contrastText: c.onBrand },
    secondary: { main: c.info, contrastText: c.onStatus },
    error: { main: c.danger, contrastText: c.onStatus },
    warning: { main: c.warning, contrastText: c.onStatus },
    success: { main: c.success, contrastText: c.onStatus },
    info: { main: c.info, contrastText: c.onStatus },
    background: { default: c.bg, paper: c.surface },
    text: { primary: c.text, secondary: c.textMuted },
    divider: c.border,
  } as const;
}

function build(c: ColorTokens, mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: paletteFrom(c, mode),
    typography,
    components: {
      MuiCard: {
        styleOverrides: {
          // 面は border で縁取る。影だけで浮かせると、ダークで境界が消える
          root: { borderRadius: 12, border: `1px solid ${c.border}`, backgroundImage: 'none' },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 12, backgroundImage: 'none' } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: c.surface, color: c.text, borderBottom: `1px solid ${c.border}` },
        },
      },
      MuiChip: {
        styleOverrides: {
          // 既定の Chip は1行固定（nowrap・高さ固定）。日本語のラベルは長くなりがちで、
          // ブラウザの文字サイズ設定を上げた人の画面では、そこだけが画面幅を突き破る。
          // 「快適さを我々が決め打ちしない」は、文字を大きくしても壊れないことまで含む
          root: { height: 'auto', maxWidth: '100%' },
          label: { whiteSpace: 'normal', paddingTop: 3, paddingBottom: 3 },
        },
      },
      MuiLink: {
        styleOverrides: { root: { color: c.brand, '&:hover': { color: c.brandHover } } },
      },
    },
  });
}

export const lightTheme = build(lightColors, 'light');
export const darkTheme = build(darkColors, 'dark');
