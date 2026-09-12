import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * デザインシステム（別リポジトリ）の `src/theme/useColorScheme.ts` の写し。
 * 中身は同じ。向こうは vanilla-extract のクラス名を返すが、こちらは MUI の
 * テーマを差し替えるので、返り値の使い先だけが違う。
 *
 * 写した時点: 2026-09-12 / 原本 c38c376
 */

/**
 * 閲覧者が選べる3つの状態。既定は 'system'。
 *
 * OS の設定は、その人が既に表明した快適さである（原則1）。
 * だから初期値を明るい／暗いのどちらかに決め打ちせず、まず従う。
 * ただし従うことを強制もしない。OS 全体は暗くしたいがこのサイトだけ明るく読みたい、
 * という状況は普通に起きるため、上書きの口を常に開けておく。
 */
export type ColorSchemePreference = 'system' | 'light' | 'dark';

/** 実際に適用される値。'system' はここまでに解決されている */
export type ResolvedColorScheme = 'light' | 'dark';

const QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'color-scheme';

function subscribeToSystem(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function readSystem(): ResolvedColorScheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

function isPreference(value: unknown): value is ColorSchemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/**
 * 保存された選択を読む。
 *
 * localStorage はプライベートウィンドウや設定次第で読み書き自体が例外を投げる。
 * 落ちるくらいなら既定の 'system' に戻す方がよい。設定の永続化は利便であって、
 * ページが表示できることの前提ではない。
 */
function readStoredPreference(): ColorSchemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export interface ColorSchemeState {
  /** 閲覧者の選択。'system' を含む */
  preference: ColorSchemePreference;
  setPreference: (next: ColorSchemePreference) => void;
  /** 実際に適用される値 */
  resolved: ResolvedColorScheme;
  /** OS が今どちらを指しているか。'system' を選んだときの表示に使う */
  system: ResolvedColorScheme;
}

export function useColorScheme(): ColorSchemeState {
  const system = useSyncExternalStore(subscribeToSystem, readSystem, () => 'light' as const);
  const [preference, setPreferenceState] = useState<ColorSchemePreference>(readStoredPreference);

  const resolved: ResolvedColorScheme = preference === 'system' ? system : preference;

  const setPreference = useCallback((next: ColorSchemePreference) => {
    setPreferenceState(next);
    try {
      if (next === 'system') {
        // 'system' は「保存しない」で表現する。値として保存すると、既定を将来変えたときに
        // 明示的に選んだ人と何もしていない人の区別がつかなくなる。
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // 保存できなくても、このセッションの表示は切り替わる
    }
  }, []);

  /**
   * ブラウザ自身が描く部分（スクロールバー、フォーム部品の既定、選択範囲）は
   * CSS 変数では届かない。color-scheme を :root に立てて初めて追従する。
   */
  useEffect(() => {
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  return { preference, setPreference, resolved, system };
}
