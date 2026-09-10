import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'src', 'pages', 'profile.json');
const samplePath = path.join(__dirname, '..', 'src', 'pages', 'profile.sample.json');

if (fs.existsSync(outPath)) {
  console.log('profile.json already exists, skipping generation.');
} else if (process.env.PROFILE_JSON_B64) {
  const decoded = Buffer.from(process.env.PROFILE_JSON_B64, 'base64').toString('utf-8');
  fs.writeFileSync(outPath, decoded);
  console.log('profile.json generated from PROFILE_JSON_B64 environment variable.');
} else {
  fs.copyFileSync(samplePath, outPath);
  console.log('PROFILE_JSON_B64 is not set; falling back to sample profile.json.');
}
