# プロフィール表示制御について

## 概要

プロフィールデータには、サイト上に出したくない情報（完全な生年月日、性別、実際の
所属先など）が含まれる。このプロジェクトでは**ビルド時に**それらを削り、
配信されるJSバンドルには表示可能なデータだけが載るようにしている。

## ファイル構成

| ファイル | 役割 | Git |
|---|---|---|
| `src/pages/profile.source.json` | 実データの原本（ローカル開発用） | `.gitignore` 対象 |
| `PROFILE_JSON_B64`（GitHub Secrets） | 実データの原本（CI用、Base64） | リポジトリ外 |
| `src/pages/profile.sample.json` | サンプル。原本が無いときのフォールバック | コミット対象 |
| `src/pages/profile.json` | **生成物**。バンドルに載る、削除済みのデータ | `.gitignore` 対象 |
| `src/utils/profileTransform.mjs` | 表示制御の設定と変換ロジック（唯一の出所） | コミット対象 |
| `scripts/generate-profile.mjs` | ビルド前に原本から `profile.json` を生成 | コミット対象 |

`profile.json` は `prebuild` / `predev` で毎回作り直される生成物なので、手で編集しない。
編集しても次のビルドで上書きされる。

## 原本の優先順位

`scripts/generate-profile.mjs` は次の順で原本を探す。

1. 環境変数 `PROFILE_JSON_B64`（CI。GitHub Secrets から渡される）
2. `src/pages/profile.source.json`（ローカル開発）
3. `src/pages/profile.sample.json`（フォールバック）

## なぜビルド時に変換するのか（重要）

Vite は `import` された JSON を**静的にJSバンドルへ埋め込む**。
そのため、ブラウザ側で変換しても手遅れになる——実データ全体が訪問者に届いたあとで、
表示だけを削っていることになる。

かつてこのプロジェクトはその状態だった。`PROFILE_DISPLAY_CONFIG` で `false` に
した項目ほど影響を受け、性別・国籍・完全な生年月日・実際の組織名などが
バンドルから読める状態になっていた（実データが配信された事実はない。当時
ビルドが失敗し続けており、実データ入りのバンドルは一度もデプロイされなかった）。

現在は `scripts/generate-profile.mjs` が Node 上で変換を済ませてから
`profile.json` を書き出すため、バンドルには表示可能なデータしか載らない。

`src/pages/*.tsx` 側でも `transformProfileForDisplay` を通しているが、これは
二重の保険にすぎない。変換は冪等（二重に通しても結果は変わらない）に作ってある。

### それでも変わらない原則

**バンドルに載ったものは全て公開される。** 表示制御は「バンドルに載る範囲を絞る」
仕組みであって、載せたうえで隠す仕組みではない。
サイトに出したくないデータは、原本の側に留めておくこと。

## 設定方法

`src/utils/profileTransform.mjs` の `PROFILE_DISPLAY_CONFIG` を編集する。

```javascript
export const PROFILE_DISPLAY_CONFIG = {
  basicInfo: {
    showFullBirthday: false,         // 完全な誕生日を表示するか（falseなら年のみ）
    showGender: false,               // 性別を表示するか
    showNationality: false,          // 国籍を表示するか
  },
  career: {
    showSpecificOrganization: false, // 具体的な組織名を表示するか
    showSpecificDepartment: false,   // 具体的な部署名を表示するか
    showFullDates: true,             // 完全な日付を表示するか
  },
  education: {
    showSpecificSchool: false,       // 具体的な学校名を表示するか
    showResearchLab: false,          // 研究室名を表示するか
  },
  socialLinks: {
    showTwitter: true,               // Twitterリンクを表示するか
    showWantedly: false,             // Wantedlyリンクを表示するか
  },
  certifications: {
    showPersonalAchievements: false, // 個人を特定しやすい実績を表示するか
    showUrls: false,                 // 資格のURLを表示するか
  }
};
```

設定とロジックはこのファイルだけに置く。ビルド時（Node）とブラウザ側の両方が
ここを読む。2箇所に分けると、片方だけ更新されて実名が漏れる。

## `*Display` フィールドは必須（書き忘れるとビルドが失敗する）

`false` にした項目には、対応する表示用の値を必ず書く。

| 設定 | 必要なフィールド |
|---|---|
| `showFullBirthday: false` | `basicInfo.birthdayDisplay` |
| `showSpecificOrganization: false` | `career[].organizationDisplay` |
| `showSpecificDepartment: false` | `career[].departmentDisplay` |
| `showSpecificSchool: false` | `education[].organizationDisplay` |
| `showResearchLab: false` | `education[].departmentDisplay` |

未設定の場合、**実名へフォールバックせずビルドを停止する**。

```
プロフィールの表示用フィールドが未設定です。実名へフォールバックせず処理を中止しました。
  - career[0].organizationDisplay（showSpecificOrganization=false のため必須）
```

以前は `job.organizationDisplay || job.organization` と書かれており、書き忘れると
黙って実名を表示していた。安全側ではなく危険側に倒れる設計だったため、停止する形に変えた。

## 各項目の削り方

| 設定 | 挙動 |
|---|---|
| `showFullBirthday: false` | `birthday` を `birthdayDisplay` の値で置き換える |
| `showGender: false` | `gender` をデータごと削除 |
| `showNationality: false` | `nationality` をデータごと削除 |
| `show*Organization/School: false` | `organization` を `organizationDisplay` の値で置き換える |
| `show*Department/ResearchLab: false` | `department` を `departmentDisplay` の値で置き換える |
| `showTwitter/showWantedly: false` | 該当リンクを配列から除外 |
| `showPersonalAchievements: false` | `isPersonalAchievement: true` の資格を配列から除外 |
| `showUrls: false` | 資格の `description.url` を `null` に置き換える |

`*Display` フィールド自体は変換後も残る（値は既に置換済みなので、二重変換しても
結果が変わらないようにするため）。

## セットアップ

### ローカル開発

```bash
cp src/pages/profile.sample.json src/pages/profile.source.json
# profile.source.json に実データを書く（.gitignore対象）
npm run dev
```

### CI（GitHub Actions）

GitHub Secrets に `PROFILE_JSON_B64` を登録する。値は原本JSONのBase64。

```bash
base64 -w0 profile.source.json
```

未設定でもビルドは通る（`profile.sample.json` にフォールバックし、サイトには
サンプルデータが表示される）。

## 検証方法

変更後は、削ったはずの値がバンドルに残っていないか確認する。

```bash
npm run build
grep -c "隠したはずの値" dist/assets/index-*.js   # 0 であること
```
