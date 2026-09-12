// profile.source.json を PROFILE_JSON_B64 に貼れる1行へ変換して出力する。
//
//   npm run profile:secret
//
// 出力は base64 だが、これは暗号化ではない。誰でも元に戻せる。
// 中身を守っているのは GitHub Secrets の側であって、base64 の側ではない。
// base64 にしているのは、改行や記号を含む JSON を Secrets の1行の入力欄へ
// 貼れる形にするためだけである。
//
// したがって、この出力をチャットやIssueや画面共有に出さないこと。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformProfileForDisplay } from '../src/utils/profileTransform.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, '..', 'src', 'pages', 'profile.source.json');

if (!fs.existsSync(sourcePath)) {
  console.error(
    `${path.relative(process.cwd(), sourcePath)} がありません。\n` +
    '正本（実データ）をこの場所に置いてから実行してください。\n' +
    'このファイルは .gitignore 対象なので、コミットされることはありません。'
  );
  process.exit(1);
}

const raw = fs.readFileSync(sourcePath, 'utf-8');

// 貼る前に、変換が通ることを確かめる。
// ここで落ちるなら CI でも落ちる。Secrets に貼ってから気づくより早い。
try {
  transformProfileForDisplay(JSON.parse(raw));
} catch (error) {
  console.error('この内容は CI でビルドに失敗します。貼る前に直してください。\n');
  console.error(error.message);
  process.exit(1);
}

console.error('✓ 変換を通過しました。以下の1行を PROFILE_JSON_B64 に貼ってください。');
console.error('  （この値は暗号化されていません。画面共有・チャット・Issueに出さないこと）\n');

process.stdout.write(`${Buffer.from(raw, 'utf-8').toString('base64')}\n`);
