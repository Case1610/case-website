import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import type { ColorSchemePreference, ColorSchemeState } from '../useColorScheme';

/**
 * 配色の切り替え。3状態を1つのボタンで回す。
 *
 * 既定は「システムに従う」。OS の設定は、その人が既に表明した快適さなので、
 * まずそれに従う。ただし従うことを強制はしない（OS 全体は暗くしたいが
 * このサイトだけ明るく読みたい、は普通に起きる）。
 *
 * 3状態をアイコンだけで回すと今どれなのか分からなくなるので、
 * ラベルに「いまの状態」と「押したら何になるか」を両方書いてある。
 */
const ORDER: ColorSchemePreference[] = ['system', 'light', 'dark'];

const LABEL: Record<ColorSchemePreference, string> = {
  system: 'システムに従う',
  light: 'ライト',
  dark: 'ダーク',
};

const ICON: Record<ColorSchemePreference, typeof LightModeIcon> = {
  system: BrightnessAutoIcon,
  light: LightModeIcon,
  dark: DarkModeIcon,
};

const ColorSchemeToggle = ({ colorScheme }: { colorScheme: ColorSchemeState }) => {
  const { preference, setPreference, system } = colorScheme;
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
  const Icon = ICON[preference];

  const current =
    preference === 'system' ? `${LABEL.system}（いまは${LABEL[system]}）` : LABEL[preference];
  const label = `配色: ${current}。押すと${LABEL[next]}に切り替わります`;

  return (
    <Tooltip title={label}>
      <IconButton onClick={() => setPreference(next)} color="inherit" size="small" aria-label={label}>
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default ColorSchemeToggle;
