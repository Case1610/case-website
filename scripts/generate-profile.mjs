import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformProfileForDisplay } from '../src/utils/profileTransform.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const outPath = path.join(pagesDir, 'profile.json');
const localSourcePath = path.join(pagesDir, 'profile.source.json');
const samplePath = path.join(pagesDir, 'profile.sample.json');

// 原本（実データ）と生成物（配信されるデータ）を分ける。
// Vite は import された JSON をバンドルへ静的に埋め込むため、変換をブラウザ側に任せると
// 隠したはずの値ごと配信されてしまう。バンドルに載る前のここで削る。
// profile.json は毎回作り直す。既存ファイルがあってもスキップしない
// （変換前のデータが置かれていた場合、素通りさせると露出につながるため）。
//
// 原本が無いときにサンプルへ落ちない。
// 2026-09-11 まで、原本が無いと黙って profile.sample.json（架空の人物）を使い、
// それが公開サイトに出ていた。データが足りないときに「それらしいもの」で埋めると、
// 間違いが間違いの顔をしなくなる。落ちるのは、気づけるからである。
//
// サンプルを使いたい場合は PROFILE_ALLOW_SAMPLE=1 を明示する。
// 明示を要求するのは、サンプルでのビルドを禁止したいからではなく、
// サンプルで動いていることを見えるようにしたいため。
const readSource = () => {
  if (process.env.PROFILE_JSON_B64) {
    console.log('Source: PROFILE_JSON_B64 environment variable.');
    return JSON.parse(Buffer.from(process.env.PROFILE_JSON_B64, 'base64').toString('utf-8'));
  }

  if (fs.existsSync(localSourcePath)) {
    console.log('Source: profile.source.json (local, gitignored).');
    return JSON.parse(fs.readFileSync(localSourcePath, 'utf-8'));
  }

  if (process.env.PROFILE_ALLOW_SAMPLE === '1') {
    console.warn(
      '⚠ Source: profile.sample.json — 架空の人物のデータです。\n' +
      '  PROFILE_ALLOW_SAMPLE=1 が明示されているため続行します。\n' +
      '  このビルドを公開すると、サイトにはサンプルの人物が表示されます。'
    );
    return JSON.parse(fs.readFileSync(samplePath, 'utf-8'));
  }

  throw new Error(
    'プロフィールの原本が見つかりません。サンプルへフォールバックせず処理を中止しました。\n' +
    '\n' +
    '  次のどれかを用意してください:\n' +
    '    - 環境変数 PROFILE_JSON_B64（原本を base64 にしたもの）\n' +
    `    - ${path.relative(process.cwd(), localSourcePath)}（ローカル用。gitignore 済み）\n` +
    '\n' +
    '  中身が架空でよい場合（開発・動作確認・外部からのクローン）は、\n' +
    '  PROFILE_ALLOW_SAMPLE=1 を付けて実行してください。\n' +
    '    PROFILE_ALLOW_SAMPLE=1 npm run build\n'
  );
};

const displayable = transformProfileForDisplay(readSource());
fs.writeFileSync(outPath, `${JSON.stringify(displayable, null, 2)}\n`);
console.log('profile.json written with redactions already applied.');
