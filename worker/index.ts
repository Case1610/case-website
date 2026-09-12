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

const CONTENT_ROUTES: Record<string, string> = {
  '/api/profile.json': 'profile.json',
  '/api/schema.json': 'schema.json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = CONTENT_ROUTES[url.pathname];

    if (!key) {
      return env.ASSETS.fetch(request);
    }

    const object = await env.CONTENT.get(key);

    // 中身が無いときに空オブジェクトや既定値を返さない。
    // 「それらしいもの」で埋めると、欠けていることに気づけなくなる。
    if (!object) {
      return Response.json(
        { error: `content not found: ${key}` },
        { status: 503, headers: { 'cache-control': 'no-store' } }
      );
    }

    return new Response(object.body, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // 層2を貼り替えたら次の訪問者には新しいものが出てほしい。
        // ただし毎回R2まで往復すると遅いので、短く持って裏で更新させる。
        'cache-control': 'public, max-age=60, stale-while-revalidate=600',
        etag: object.httpEtag,
      },
    });
  },
};
