// 層2（R2）から受け取るデータの検査が、期待どおりに効いているかを確かめる。
//
//   npm run verify:boundary
//
// 見ているのは3つ。
//
// 1. 受け取り側の検査器（src/data/profileSchema.mjs）が、契約の書き方を正しく解釈するか
// 2. その検査器の振る舞いが、**送り出す側と食い違っていないか**（契約の指紋と突き合わせる）
// 3. プロフィールのデータが、ビルド時にバンドルへ焼き込まれる経路に戻っていないか
//
// 2 が要るのは、この経路が**一度あったから**。以前はビルド時に実データを
// 読み込んで JSON を作り、それを import していた。import された JSON は
// バンドルへ静的に埋め込まれるため、画面に出していない項目まで全部配信されていた。
// いまは実行時に取りに行く形になっていて、バンドルにはデータが1バイトも載らない。
// 「載らない」は構造の性質であって、放っておいても保たれる保証ではない。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAgainstSchema } from '../src/data/profileSchema.mjs';
import { runCases, checkFingerprint, cases } from './boundary-cases.mjs';

/**
 * 契約は層2（R2）にある。CI もそこから取りに来る。
 *
 * 手元に `dev-data/schema.json` があればそれを使う（開発サーバと同じ規則）。
 * 無ければ公開されている層2 を読みに行く。**どちらも駄目なら止める。**
 * 契約を確かめずに配るくらいなら、配らないほうがいい。
 */
const SCHEMA_URL = process.env.SCHEMA_URL ?? 'https://showcase.1610-case.workers.dev/api/schema.json';
const LOCAL_SCHEMA = 'dev-data/schema.json';

const loadContract = async () => {
  if (fs.existsSync(LOCAL_SCHEMA)) {
    return { schema: JSON.parse(fs.readFileSync(LOCAL_SCHEMA, 'utf-8')), from: LOCAL_SCHEMA };
  }
  const res = await fetch(SCHEMA_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${SCHEMA_URL} が ${res.status} を返しました`);
  return { schema: await res.json(), from: SCHEMA_URL };
};

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

console.log('■ 受け取り側の検査器が、契約の書き方を正しく解釈するか');
const brokenChecker = runCases(validateAgainstSchema);
for (const c of cases) {
  const failed = brokenChecker.find((f) => f.startsWith(c.name));
  console.log(`  ${failed ? '✗' : '✓'} ${c.name}`);
}
failures.push(...brokenChecker);

console.log('\n■ 送り出す側と振る舞いが食い違っていないか');
try {
  const { schema, from } = await loadContract();
  const drift = checkFingerprint(schema, validateAgainstSchema);
  console.log(`  ${drift ? '✗' : '✓'} 契約の指紋と一致（契約の取得元: ${from}）`);
  if (drift) failures.push(drift);
} catch (error) {
  console.log('  ✗ 契約を取得できなかった');
  failures.push(
    `契約（schema.json）を取得できませんでした: ${error instanceof Error ? error.message : String(error)}\n` +
    `     → 手元で確かめるなら ${LOCAL_SCHEMA} を置く。`
  );
}

console.log('\n■ プロフィールがバンドルへ焼き込まれる経路に戻っていないか');

// (a) src/ の中に、プロフィールの JSON が置かれていないこと
const strays = fs
  .readdirSync(path.join(root, 'src', 'pages'))
  .filter((f) => /^profile.*\.json$/.test(f));
if (strays.length > 0) {
  console.log(`  ✗ src/pages/ に ${strays.join(', ')} がある`);
  failures.push(`src/pages/${strays.join(', ')} がある。JSON を src/ に置くと import できてしまう`);
} else {
  console.log('  ✓ src/pages/ にプロフィールの JSON が無い');
}

// (b) どのソースからも .json を import していないこと
const sources = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|mts|mjs|js|jsx)$/.test(entry.name)) sources.push(full);
  }
};
walk(path.join(root, 'src'));

const importers = sources.filter((f) =>
  /(^|\n)\s*import[^\n;]*['"][^'"\n]*\.json['"]/.test(fs.readFileSync(f, 'utf-8'))
);
if (importers.length > 0) {
  for (const f of importers) console.log(`  ✗ ${path.relative(root, f)} が JSON を import している`);
  failures.push(`JSON を import しているファイルがある: ${importers.map((f) => path.relative(root, f)).join(', ')}`);
} else {
  console.log('  ✓ どのソースも JSON を import していない');
}

console.log('');
if (failures.length > 0) {
  console.error('検証に失敗しました:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('すべての検証に成功しました。');
