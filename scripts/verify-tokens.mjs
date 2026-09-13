// デザインシステムのトークンの写し（src/tokens/spec.ts）が、
// 配信中の原本とずれていないかを確かめる。
//
//   npm run verify:tokens
//
// ずれていたら、**どの項目がどう違うか**を出して落ちる。
// 揃えるのは `npm run sync:tokens` の一発。
//
// なぜ写しを持っているのか、なぜ依存にしないのかは src/tokens/spec.ts の冒頭に書いた。
// **この検査が落ちた回数が、依存に切り替える合図の計測になる。**
//
// 指紋（ハッシュ1本）ではなく、値そのものを配って項目ごとに比べている。
// 境界の検査器（verify-boundary.mjs）で指紋を使ったのは、比べたいものが
// **振る舞い**で、配れる形に書き出せなかったから。ここで比べたいのは**データ**で、
// そのまま配れる。配れるものをハッシュに畳むと「どこが違うか」を捨てるだけ損になる。
//
// 写しを .json ではなく .ts にしてあるのは、このリポジトリが
// 「src/ のどのソースも .json を import しない」を検査しているため（verify-boundary.mjs）。
// あれはプロフィールがバンドルへ焼き込まれた事故の再発を止める見張りで、
// トークンは焼き込んでよい、という理由で穴を開けると、**見張りが例外表になる。**
// 見張りはそのままにして、こちら側が .json を使わない形に寄せた。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKENS_URL =
  process.env.TOKENS_URL ?? 'https://design-system.1610-case.workers.dev/tokens.json';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LOCAL = path.join(root, 'src/tokens/spec.ts');

const HEAD = `/**
 * デザインシステム（別リポジトリ）のトークンの数値。**写しであって原本ではない。**
 *
 * 原本は向こうの \`public/tokens.json\` で、
 * https://design-system.1610-case.workers.dev/tokens.json として配信されている。
 *
 * **このファイルは手で書かない。** \`npm run sync:tokens\` が原本から作り直す。
 * ずれたまま配られないよう、CI が \`npm run verify:tokens\` で突き合わせて落とす。
 *
 * なぜ依存（npm パッケージ）にしないか: 依存を先に張ると、片方を触るたびに
 * 両方を動かす羽目になる。デザインシステムはまだ毎週かたちが変わる段階なので、
 * いまは写しで受け、ずれたら揃える。**揃える回数が増えてきた時点が、依存に切り替える合図。**
 */
export const spec = `;

const TAIL = ' as const;\n';

/** 原本から、このファイルの中身をそのまま作る。生成が決定的なので、比較は文字列で足りる */
export const render = (origin) => `${HEAD}${JSON.stringify(origin, null, 2)}${TAIL}`;

/** 生成した形をしているので、逆に読み戻せる。手書きの TypeScript を解釈しているわけではない */
export const parseLocal = () => {
  const src = fs.readFileSync(LOCAL, 'utf-8');
  const start = src.indexOf(HEAD);
  if (start < 0 || !src.endsWith(TAIL)) {
    throw new Error(`${LOCAL} が生成された形をしていません。npm run sync:tokens で作り直してください`);
  }
  return JSON.parse(src.slice(start + HEAD.length, src.length - TAIL.length));
};

/** 原本は配信されているものを見る。取れなければ止める（確かめずに配るくらいなら配らない） */
export const fetchOrigin = async (url = TOKENS_URL) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} が ${res.status} を返しました`);
  return res.json();
};

/** 入れ子をたどって「a.b.c」形式の平らな地図にする。比較の粒度を項目まで落とすため */
const flatten = (value, prefix = '', out = {}) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out[prefix] = Array.isArray(value) ? JSON.stringify(value) : value;
  }
  return out;
};

/** $comment は説明欄なので比較しない。書き方が変わっても値は変わらない */
export const compare = (origin, copy) => {
  const a = flatten(origin);
  const b = flatten(copy);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .filter((k) => !k.startsWith('$comment'))
    .sort();

  return keys.flatMap((k) => {
    if (!(k in a)) return [{ key: k, kind: '原本に無い', origin: '—', copy: b[k] }];
    if (!(k in b)) return [{ key: k, kind: '写しに無い', origin: a[k], copy: '—' }];
    if (a[k] !== b[k]) return [{ key: k, kind: '値が違う', origin: a[k], copy: b[k] }];
    return [];
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const copy = parseLocal();
  const origin = await fetchOrigin();
  const diffs = compare(origin, copy);
  const versionMoved = origin.specVersion !== copy.specVersion;

  if (versionMoved) {
    console.error(
      `✗ spec の版が違います（原本 ${origin.specVersion} / 写し ${copy.specVersion}）。\n` +
        '  版が動いたときは形そのものが変わっている。sync だけで済ませず、\n' +
        '  src/tokens/index.ts が新しい形を読めるか確かめること。\n',
    );
  }

  if (diffs.length === 0 && !versionMoved) {
    // 値が同じでも、ファイルが生成どおりでなければ手書きが混ざっている
    if (fs.readFileSync(LOCAL, 'utf-8') !== render(origin)) {
      console.error(`✗ ${path.relative(root, LOCAL)} が生成結果と一致しません（値は同じ）。`);
      console.error('  手で直した箇所があります。npm run sync:tokens で作り直してください。');
      process.exit(1);
    }
    console.log(`✓ トークンの写しは原本と一致しています（${TOKENS_URL}）`);
    process.exit(0);
  }

  if (diffs.length > 0) {
    console.error(`✗ トークンの写しが原本とずれています（${diffs.length}件）\n`);
    const w = Math.max(...diffs.map((d) => d.key.length));
    for (const d of diffs) {
      console.error(`  ${d.key.padEnd(w)}  ${d.kind}  原本: ${d.origin}  写し: ${d.copy}`);
    }
    console.error(
      `\n  原本は ${TOKENS_URL}\n` +
        '  揃えるには npm run sync:tokens を実行し、**差分を読んでから** commit すること。\n' +
        '  向こうで明度が1ポイント動いたなら、こちらの画面も1ポイント動く。',
    );
  }
  process.exit(1);
}
