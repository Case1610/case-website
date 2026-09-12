/**
 * 静的アセットの配信に加えて、層2（R2）の中身を同一オリジンで配る。
 *
 * ブラウザから R2 を直接叩かせない理由:
 * - 同一オリジンなので CORS の設定が要らない
 * - R2 のバケットを公開しなくて済む（Worker 経由でしか読めない）
 * - 配る前に検査する場所ができる
 */

interface Env {
  ASSETS: Fetcher;
  CONTENT: R2Bucket;
}

/** 決め打ちのパス。プロフィールと、その検査に使うスキーマ */
const FIXED_ROUTES: Record<string, string> = {
  '/api/profile.json': 'profile.json',
  '/api/schema.json': 'schema.json',
};

/** 画像・動画。数が増えるので表引きにせず前方一致で受ける */
const MEDIA_PREFIX = '/api/media/';

/**
 * キャッシュの持たせ方を中身で変える。
 *
 * 画像はファイル名に幅が入っており、中身が変われば別の名前になる前提で作っている
 * （scripts/build-media.mjs）。だから長く持たせてよい。
 * プロフィールは同じ名前のまま中身が変わるので、短く持って裏で更新させる。
 */
const CACHE_MEDIA = 'public, max-age=31536000, immutable';
const CACHE_JSON = 'public, max-age=60, stale-while-revalidate=600';

const CONTENT_TYPES: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  json: 'application/json; charset=utf-8',
  mov: 'video/quicktime',
  mp4: 'video/mp4',
};

const contentTypeFor = (key: string): string =>
  CONTENT_TYPES[key.split('.').pop()?.toLowerCase() ?? ''] ?? 'application/octet-stream';

const serve = async (env: Env, key: string, cacheControl: string, request: Request) => {
  // 動画は途中から再生されるので Range に応えられる必要がある。
  // R2 の get に range を渡すと、その部分だけ読んでくれる。
  const range = request.headers.get('range');
  const object = await env.CONTENT.get(key, range ? { range: request.headers } : undefined);

  // 中身が無いときに空オブジェクトや既定の画像を返さない。
  // 「それらしいもの」で埋めると、欠けていることに気づけなくなる。
  if (!object) {
    return Response.json(
      { error: `content not found: ${key}` },
      { status: 503, headers: { 'cache-control': 'no-store' } }
    );
  }

  const headers = new Headers({
    'content-type': contentTypeFor(key),
    'cache-control': cacheControl,
    etag: object.httpEtag,
    'accept-ranges': 'bytes',
  });

  if (object.range && 'offset' in object.range) {
    const start = object.range.offset ?? 0;
    const length = object.range.length ?? object.size - start;
    headers.set('content-range', `bytes ${start}-${start + length - 1}/${object.size}`);
    return new Response(object.body, { status: 206, headers });
  }

  return new Response(object.body, { headers });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const fixed = FIXED_ROUTES[url.pathname];
    if (fixed) return serve(env, fixed, CACHE_JSON, request);

    if (url.pathname.startsWith(MEDIA_PREFIX)) {
      const key = decodeURIComponent(url.pathname.slice(MEDIA_PREFIX.length));

      // 上位ディレクトリへ抜ける鍵を受け取らない。
      // R2 の鍵空間は平坦だが、将来 prefix を足したときに効く
      if (!key || key.includes('..') || key.startsWith('/')) {
        return Response.json({ error: 'invalid media key' }, { status: 400 });
      }

      const cache = key.endsWith('.json') ? CACHE_JSON : CACHE_MEDIA;
      return serve(env, `media/${key}`, cache, request);
    }

    return env.ASSETS.fetch(request);
  },
};
