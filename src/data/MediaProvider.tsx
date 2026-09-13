import { useEffect, useState, type ReactNode } from 'react';
import { MediaContext, type MediaState } from './mediaContext';
import { MEDIA, type MediaManifest } from './mediaTypes';

/**
 * 画像の一覧を層2（R2）から一度だけ取る。
 *
 * **ファイル名を画面側に書かない。** 名前には中身のハッシュが入っていて、
 * 写真を焼き直すたびに変わる。書いた瞬間に、そこが古くなる番になる。
 * 何があるかを知っているのは変換した側なので、一覧もそちらから受け取る。
 */
export function MediaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MediaState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch(`${MEDIA}manifest.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((manifest: MediaManifest) => {
        if (!cancelled) setState({ status: 'ready', manifest });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => { cancelled = true; };
  }, []);

  return <MediaContext.Provider value={state}>{children}</MediaContext.Provider>;
}
