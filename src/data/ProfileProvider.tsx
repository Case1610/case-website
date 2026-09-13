import { useEffect, useState, type ReactNode } from 'react';
import { validateAgainstSchema } from './profileSchema.mjs';
import { ProfileContext, type ProfileState } from './profileContext';
import type { ProfileData } from '../types/profile';

/**
 * プロフィールを層2（R2）から実行時に取得する。
 *
 * ビルド時に焼き込まない理由は、中身を変えるたびにサイトを作り直したくないため。
 * 中身とサイトを別の層として扱う（Issue #7）。
 *
 * 取得に失敗したときに、それらしい既定値で埋めない。
 * 空欄は「まだ無い」と読めるが、埋めた値は「これが事実だ」と読まれてしまう。
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [profileRes, schemaRes] = await Promise.all([
          fetch('/api/profile.json'),
          fetch('/api/schema.json'),
        ]);

        if (!profileRes.ok) throw new Error(`プロフィールを取得できませんでした (${profileRes.status})`);
        if (!schemaRes.ok) throw new Error(`スキーマを取得できませんでした (${schemaRes.status})`);

        const [profile, schema] = await Promise.all([profileRes.json(), schemaRes.json()]);

        // 受け取った側でも検査する。送り出す側の検査が壊れていても、ここで止まる。
        const problems = validateAgainstSchema(profile, schema);
        if (problems.length > 0) {
          throw new Error(`受け取ったデータがスキーマに合いません:\n${problems.join('\n')}`);
        }

        if (!cancelled) setState({ status: 'ready', profile: profile as ProfileData });
      } catch (error) {
        if (!cancelled) {
          setState({ status: 'error', message: error instanceof Error ? error.message : String(error) });
        }
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  return <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>;
}
