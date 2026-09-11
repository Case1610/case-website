// サイトに載せる作品のリスト。
//
// ここに書くのは「見せる意志」だけで、データの複製ではない。
// GitHub にあるものは repo を書いておき、説明は自分の言葉で書く
// （GitHub の description は開発者向けの1行であって、ここで見せたいものとは別物）。
//
// リポジトリ側にタグを付けて自動収集する方式は採らない。
// 便利のために作ったものに「展示用」というラベルを貼ると、作る動機の方が変質するため。
// 何を見せるかの判断は、見せる場所であるこのサイト側に閉じておく。

export interface Work {
  id: string;
  title: string;
  /** 自分の言葉での説明。GitHub の description をそのまま写さない */
  summary: string;
  /** "2022-03 〜 2022-07" のような期間。進行中なら省略可 */
  period?: string;
  /** GitHub にあるもの。"owner/repo" 形式 */
  repo?: string;
  /** GitHub 以外の外部リンク */
  url?: string;
  tags?: string[];
}

export const works: Work[] = [
  {
    id: 'case-design-system',
    title: 'case-design-system',
    summary:
      '自分が作るもの全般（見せるサイト・使うアプリ）に使うデザインシステムを、' +
      '一人で構築しているプロジェクト。抽象的な原則から入るのではなく、' +
      '具体的なトレードオフの場面を先に置いて、そこから原則を逆算する進め方を採っている。' +
      '原則に反する判断をしたときは、その根拠を判断ログとして残している。' +
      'このサイト自体も、いずれここで決めたトークンの上に載せ替える予定。',
    repo: 'Case1610/case-design-system',
    tags: ['React', 'React Aria', 'vanilla-extract', 'TypeScript'],
  },
];
