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
const readSource = () => {
  if (process.env.PROFILE_JSON_B64) {
    console.log('Source: PROFILE_JSON_B64 environment variable.');
    return JSON.parse(Buffer.from(process.env.PROFILE_JSON_B64, 'base64').toString('utf-8'));
  }
  if (fs.existsSync(localSourcePath)) {
    console.log('Source: profile.source.json (local, gitignored).');
    return JSON.parse(fs.readFileSync(localSourcePath, 'utf-8'));
  }
  console.log('Source: profile.sample.json (no PROFILE_JSON_B64, no profile.source.json).');
  return JSON.parse(fs.readFileSync(samplePath, 'utf-8'));
};

const displayable = transformProfileForDisplay(readSource());
fs.writeFileSync(outPath, `${JSON.stringify(displayable, null, 2)}\n`);
console.log('profile.json written with redactions already applied.');
