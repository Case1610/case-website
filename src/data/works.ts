// サイトに載せるもののリスト。
//
// ここに書くのは「見せる意志」だけで、データの複製ではない。
// GitHub にあるものは repo を書いておき、説明は自分の言葉で書く
// （GitHub の description は開発者向けの1行であって、ここで見せたいものとは別物）。
//
// リポジトリ側にタグを付けて自動収集する方式は採らない。
// 便利のために作ったものに「展示用」というラベルを貼ると、作る動機の方が変質するため。
// 何を見せるかの判断は、見せる場所であるこのサイト側に閉じておく。
//
// このサイトは「証拠を置く場所」である（Issue #8）。
// したがってここには次の2つを書かない。
//   1. 「〜ができます」という能力の申告。書くのは「これを作った」だけ
//   2. 推測で書いた動機。`why` は本人の言葉でしか埋めない（分からないものは空のまま）
//
// ブラウザでそのまま動くもの（旧 /tools）も、ここに一緒に並べる。
// 動くかどうかは実装の都合であって、読む人には関係ないため、ページは分けない。

export interface Work {
  id: string;
  title: string;
  /** 何であるかの説明。GitHub の description をそのまま写さない */
  summary: string;
  /**
   * なぜ作ったか。1〜2行。
   * **本人の言葉、または本人が書いた文書からしか埋めない。**
   * 推測で埋めると、本人が言っていないことを本人の名前で公開することになる。
   * 空のときは画面にも何も出さない（埋まっていないことが分かる方がよい）。
   */
  why?: string;
  /** 並び順の軸。作った順に並べるためのキー。"YYYY-MM" */
  created: string;
  /** "2022-03 〜 2022-07" のような期間。画面に出す表示用 */
  period?: string;
  /** GitHub にあるもの。"owner/repo" 形式 */
  repo?: string;
  /** GitHub 以外の外部リンク */
  url?: string;
  /** このサイトの中でそのまま動くもの。例: "/works/markdown-sandbox" */
  path?: string;
  tags?: string[];
}

// 並び順は `created` の降順（新しいものが上）に固定する。
// 書いた順ではなく作った順で出したいので、並べ替えはコード側で行い、
// 下の配列の記述順には意味を持たせない。
const entries: Work[] = [
  {
    id: 'case-design-system',
    title: 'case-design-system',
    summary:
      '自分が作るもの全般（見せるサイト・使うアプリ）に使うデザインシステム。' +
      '抽象的な原則から入るのではなく、具体的なトレードオフの場面を先に置いて、' +
      'そこから原則を逆算する進め方を採っている。' +
      '原則に反する判断をしたときは、その根拠を判断ログとして残している。',
    why:
      '目的は学習とポートフォリオ。作るもの全般に共通して使えるものを、一人で組み立てている。' +
      '（本人が書いた case-design-system の CLAUDE.md より）',
    created: '2026-08',
    repo: 'Case1610/case-design-system',
    url: 'https://design-system.1610-case.workers.dev',
    tags: ['React', 'React Aria', 'vanilla-extract', 'TypeScript'],
  },
  {
    id: 'markdown-sandbox',
    title: 'Markdown サンドボックス',
    summary:
      '左に Markdown を書くと、右に整形結果がそのまま出る。表やチェックリスト（GFM）にも対応。' +
      'ブラウザの中だけで動き、入力した内容はどこにも送らない。',
    // why: 本人に未確認（Issue #5）。推測で埋めない
    created: '2025-06',
    path: '/works/markdown-sandbox',
    tags: ['React', 'TypeScript'],
  },
  {
    id: 'social-style-test',
    title: 'ソーシャルスタイル診断',
    summary:
      '12問に答えると、ソーシャルスタイル理論の4分類（ドライビング / エクスプレッシブ / ' +
      'エミアブル / アナリティカル）のどれに近いかを判定して、特徴と補足を出す。' +
      'こちらもブラウザの中だけで動く。',
    // why: 本人に未確認（Issue #5）。推測で埋めない
    created: '2025-06',
    path: '/works/social-style-test',
    tags: ['React', 'TypeScript'],
  },
];

export const works: Work[] = [...entries].sort((a, b) => b.created.localeCompare(a.created));
