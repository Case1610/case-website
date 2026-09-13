import { createContext, useContext } from 'react';
import type { ProfileData } from '../types/profile';

/**
 * 取得の途中も含めた3状態。`ready` 以外のときに profile は存在しない。
 *
 * 「空のプロフィール」を作って loading 中もそれを渡す、という形にしていない。
 * 空欄は「まだ無い」と読めるが、それらしい既定値で埋めた画面は
 * 「これが事実だ」と読まれてしまう。
 */
export type ProfileState =
  | { status: 'loading' }
  | { status: 'ready'; profile: ProfileData }
  | { status: 'error'; message: string };

export const ProfileContext = createContext<ProfileState>({ status: 'loading' });

export const useProfile = () => useContext(ProfileContext);
