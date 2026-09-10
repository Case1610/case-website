// 非公開項目がバンドルに載るデータへ混入していないことを検証する。
//
// Vite は import された JSON をバンドルへ静的に埋め込むため、変換をブラウザ側に任せると
// 隠したはずの値ごと配信される。この検証は「原本に入れたカナリア値が、生成物である
// profile.json から消えているか」を実際に変換を走らせて確かめる。
//
//   npm run verify:redaction
//
// 新しくフィールドを足したら、ここのカナリアにも足すこと。
// 「型にはあるが画面に出ていない」フィールドは、変換されないまま配信される。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformProfileForDisplay } from '../src/utils/profileTransform.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const samplePath = path.join(__dirname, '..', 'src', 'pages', 'profile.sample.json');

// 隠す設定にしている項目。生成物から消えていなければ失敗。
const MUST_BE_REMOVED = {
  'basicInfo.birthday（完全な生年月日）': '1988-07-04',
  'basicInfo.gender': 'REDACT-GENDER',
  'basicInfo.nationality': 'REDACT-NATIONALITY',
  'career[].organization（実際の組織名）': 'REDACT-CAREER-ORG',
  'career[].department（実際の部署名）': 'REDACT-CAREER-DEPT',
  'education[].organization（実際の学校名）': 'REDACT-EDU-ORG',
  'education[].department（実際の研究室名）': 'REDACT-EDU-DEPT',
  'social_links Wantedly': 'REDACT-WANTEDLY-URL',
  'certifications isPersonalAchievement:true の実績': 'REDACT-PERSONAL-ACHIEVEMENT',
  'certifications description.url': 'REDACT-CERT-URL',
  'strengths_finder.all_ranking（表示しないと決めたフィールド）': 'REDACT-ALL-RANKING'
};

// 表示する項目。消えていたら削りすぎなので失敗。
const MUST_REMAIN = {
  'basicInfo.birthdayDisplay': 'KEEP-BIRTHDAY',
  'career[].organizationDisplay': 'KEEP-CAREER-ORG',
  'career[].departmentDisplay': 'KEEP-CAREER-DEPT',
  'education[].organizationDisplay': 'KEEP-EDU-ORG',
  'education[].departmentDisplay': 'KEEP-EDU-DEPT',
  'social_links Twitter': 'KEEP-TWITTER-URL',
  'certifications[].name（表示対象）': 'KEEP-VISIBLE-CERT'
};

// カナリアが互いに部分文字列だと、片方の存在をもう片方の存在として誤検出する
// （例: "X" は "X-DISPLAY" にマッチする）。検証そのものが嘘をつくので先に潰す。
const assertCanariesAreDistinct = () => {
  const all = Object.entries({ ...MUST_BE_REMOVED, ...MUST_REMAIN });
  const problems = [];
  for (const [labelA, a] of all) {
    for (const [labelB, b] of all) {
      if (labelA === labelB) continue;
      if (a.includes(b)) {
        problems.push(`「${labelB}」のカナリア(${b})が「${labelA}」のカナリア(${a})の部分文字列`);
      }
    }
  }
  if (problems.length > 0) {
    console.error('カナリア値の設計に問題があります（検証結果が信用できません）:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
};

const buildCanaryProfile = () => {
  const profile = JSON.parse(fs.readFileSync(samplePath, 'utf-8'));

  // 上流から誤って供給された場合を模す（型からは外してある）
  profile.strengths_finder.all_ranking = ['REDACT-ALL-RANKING-1', 'REDACT-ALL-RANKING-2'];

  profile.basicInfo.birthday = '1988-07-04';
  profile.basicInfo.birthdayDisplay = 'KEEP-BIRTHDAY';
  profile.basicInfo.gender = 'REDACT-GENDER';
  profile.basicInfo.nationality = 'REDACT-NATIONALITY';

  profile.career = [{
    organization: 'REDACT-CAREER-ORG',
    organizationDisplay: 'KEEP-CAREER-ORG',
    department: 'REDACT-CAREER-DEPT',
    departmentDisplay: 'KEEP-CAREER-DEPT',
    start_date: '2024-4-1',
    end_date: null,
    description: 'canary career'
  }];

  profile.education = [{
    organization: 'REDACT-EDU-ORG',
    organizationDisplay: 'KEEP-EDU-ORG',
    department: 'REDACT-EDU-DEPT',
    departmentDisplay: 'KEEP-EDU-DEPT',
    start_date: '2018-4-1',
    end_date: '2022-3-31',
    description: 'canary education'
  }];

  profile.social_links = [
    { platform: 'Twitter', url: 'https://example.invalid/KEEP-TWITTER-URL' },
    { platform: 'Wantedly', url: 'https://example.invalid/REDACT-WANTEDLY-URL' }
  ];

  profile.certifications = [
    {
      name: 'KEEP-VISIBLE-CERT',
      date: '2020-12',
      isPersonalAchievement: false,
      description: {
        title: 'canary cert title',
        description: 'canary cert description',
        url: 'https://example.invalid/REDACT-CERT-URL'
      }
    },
    {
      name: 'REDACT-PERSONAL-ACHIEVEMENT',
      date: '2021-03',
      isPersonalAchievement: true,
      description: null
    }
  ];

  return profile;
};

assertCanariesAreDistinct();

const failures = [];
const source = buildCanaryProfile();
const redacted = transformProfileForDisplay(source);
const serialized = JSON.stringify(redacted);

console.log('■ 隠す設定の項目が生成物から消えているか');
for (const [label, canary] of Object.entries(MUST_BE_REMOVED)) {
  const leaked = serialized.includes(canary);
  console.log(`  ${leaked ? '✗' : '✓'} ${label}`);
  if (leaked) failures.push(`${label} が生成物に残っている（カナリア: ${canary}）`);
}

console.log('\n■ 表示する項目が残っているか');
for (const [label, canary] of Object.entries(MUST_REMAIN)) {
  const present = serialized.includes(canary);
  console.log(`  ${present ? '✓' : '✗'} ${label}`);
  if (!present) failures.push(`${label} が生成物から消えている（削りすぎ）`);
}

console.log('\n■ 冪等性（ブラウザ側で二重に通しても結果が変わらないこと）');
const twice = JSON.stringify(transformProfileForDisplay(redacted));
if (twice === serialized) {
  console.log('  ✓ 二重変換で不変');
} else {
  console.log('  ✗ 二重変換で結果が変わった');
  failures.push('変換が冪等でない。ブラウザ側の二重適用で表示が壊れる');
}

console.log('\n■ フェイルクローズ（*Display 未設定で停止すること）');
const broken = JSON.parse(JSON.stringify(source));
delete broken.career[0].organizationDisplay;
try {
  const out = transformProfileForDisplay(broken);
  console.log(`  ✗ 停止せず organization="${out.career[0].organization}" を返した`);
  failures.push('*Display 未設定時に停止していない。実名へフォールバックする危険がある');
} catch {
  console.log('  ✓ 停止した');
}

console.log('');
if (failures.length > 0) {
  console.error('検証に失敗しました:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('すべての検証に成功しました。');
