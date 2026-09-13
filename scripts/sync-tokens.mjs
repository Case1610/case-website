// 配信中の原本から src/tokens/spec.ts を作り直す。
//
//   npm run sync:tokens
//
// 作り直すだけで、commit はしない。**差分を git で読んでから入れること。**
// 明度が1ポイント動いたなら、こちらの画面も1ポイント動く。それを見ずに通さない。

import fs from 'node:fs';
import { fetchOrigin, parseLocal, compare, render, LOCAL } from './verify-tokens.mjs';

const origin = await fetchOrigin();
const before = fs.readFileSync(LOCAL, 'utf-8');
const next = render(origin);

if (before === next) {
  console.log('変更はありません。写しは原本と一致しています。');
  process.exit(0);
}

let diffs = [];
try {
  diffs = compare(origin, parseLocal());
} catch {
  console.log('（写しが読み戻せない形でした。値の差分は出せません）');
}

fs.writeFileSync(LOCAL, next);
console.log(`${LOCAL} を作り直しました。`);
for (const d of diffs) console.log(`  ${d.key}  ${d.kind}  原本: ${d.origin}  写し: ${d.copy}`);
console.log('\ngit diff で中身を読んでから commit すること。');
