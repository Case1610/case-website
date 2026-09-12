# プロフィール表示制御について

## 概要

プロフィールデータには、サイト上に出したくない情報（完全な生年月日、性別、実際の
所属先など）が含まれる。このプロジェクトでは**ビルド時に**それらを削り、
配信されるJSバンドルには表示可能なデータだけが載るようにしている。

## 正本はこのリポジトリの外にある

プロフィールの正本は、持ち主が別の非公開リポジトリで Markdown として管理している。
そちらの方針は「原本は Markdown、JSON は生成物」。

```
Markdown の正本（別リポジトリ・非公開）
  └─→ profile.source.json / PROFILE_JSON_B64   ← このリポジトリへの入力
        └─→ profile.json                        ← 非公開項目を削除済み。バンドルに載る
```

`profile.source.json` と `PROFILE_JSON_B64` は**上流から供給される中間ファイル**であって、
最上流の原本ではない。ここを直接編集しても正本には反映されず、次に上流から
供給された時点で失われる。内容を変えたいときは正本の側を直すこと。

上流との同期方法（手動コピーか生成スクリプトか）は持ち主が決める。

## ファイル構成

| ファイル | 役割 | Git |
|---|---|---|
| `src/pages/profile.source.json` | 上流から供給される入力（ローカル開発用）。正本ではない | `.gitignore` 対象 |
| `PROFILE_JSON_B64`（GitHub Secrets） | 上流から供給される入力（CI用、Base64）。正本ではない | リポジトリ外 |
| `src/pages/profile.sample.json` | サンプル。入力が無いときのフォールバック | コミット対象 |
| `src/pages/profile.json` | **生成物**。バンドルに載る、削除済みのデータ | `.gitignore` 対象 |
| `src/utils/profileTransform.mjs` | 表示制御の設定と変換ロジック（唯一の出所） | コミット対象 |
| `scripts/generate-profile.mjs` | ビルド前に入力から `profile.json` を生成 | コミット対象 |
| `scripts/verify-redaction.mjs` | 非公開項目が生成物へ混入しないことの回帰テスト | コミット対象 |

`profile.json` は `prebuild` / `predev` で毎回作り直される生成物なので、手で編集しない。
編集しても次のビルドで上書きされる。

## 入力の優先順位

`scripts/generate-profile.mjs` は次の順で入力を探す。

1. 環境変数 `PROFILE_JSON_B64`（CI。GitHub Secrets から渡される）
2. `src/pages/profile.source.json`（ローカル開発）
3. `src/pages/profile.sample.json` — **`PROFILE_ALLOW_SAMPLE=1` を明示したときだけ**

3 は自動のフォールバックではない。1 も 2 も無く、フラグも立っていなければ
**ビルドは失敗する**。

2026-09-11 まではここが自動フォールバックで、原本が無いと黙って架空の人物のデータを
使い、それが公開サイトに出ていた。データが足りないときに「それらしいもの」で埋めると、
間違いが間違いの顔をしなくなる。落ちるのは、気づけるからである。

`PROFILE_ALLOW_SAMPLE=1` はサンプルでのビルドを禁止しないための逃げ道であって、
サンプルで動いていることを**見えるようにする**ための宣言である。
CI で立っていれば、公開サイトがサンプルを表示しているという意味になる。

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
サイトに出したくないデータは、上流の正本の側に留めておくこと。

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
# 上流の正本から profile.source.json を用意する（.gitignore対象）
npm run dev
```

正本が手元に無い場合は、サンプルで動かすことを明示する。

```bash
PROFILE_ALLOW_SAMPLE=1 npm run dev
```

`cp profile.sample.json profile.source.json` でも動くが、勧めない。
サンプルが原本の場所に座ると、後から見て区別がつかなくなる。
`profile.source.json` は gitignore 対象なので、中身が本物か架空かは開いてみるまで
分からない。フラグなら、実行した本人にもログにも「架空である」と残る。

### CI（GitHub Actions）

GitHub Secrets に `PROFILE_JSON_B64` を登録する。値は入力JSONのBase64。

```bash
base64 -w0 profile.source.json
```

**未設定だとビルドは失敗する。** これは意図した挙動である（上記「入力の優先順位」参照）。

2026-09-12 に登録済み。値は正本側（別リポジトリ）の `公開用/profile.source.json` から
`npm run profile:secret` で生成したもので、**原本の「公開時の表示」列だけで作られている**。
実データ列は使っていないため、この Secret には守るべき値が入っていない。

サンプルのまま公開してよい場合に限り、ワークフローで `PROFILE_ALLOW_SAMPLE: '1'` を
立てられるが、現在は立てていない。立てない限り、Secret が失われればビルドが落ちる。

## 検証方法

```bash
npm run verify:redaction
```

カナリア値を入れた入力を変換し、隠す設定の項目が生成物から消えていること、
表示対象が残っていること、変換が冪等であること、`*Display` 未設定で停止することを
まとめて確認する。CI でもビルド前に実行され、失敗するとデプロイまで進まない。

フィールドを追加したら `scripts/verify-redaction.mjs` のカナリアにも追加すること。
カナリア値どうしが部分文字列になっていると誤検出するため、スクリプト側で
その検査も行っている。

バンドルを直接確認したい場合:

```bash
npm run build
grep -c "隠したはずの値" dist/assets/index-*.js   # 0 であること
```

## 未解決: 表示されないまま配信されるフィールド

型定義に存在し、入力に実データが入るが、**どのコンポーネントも表示しておらず、
変換対象にもなっていない**フィールドがある。表示されないだけで配信はされるため、
今回直したのと同じ形の問題が残っている。

| フィールド | 状態 |
|---|---|
| ~~`strengths_finder.all_ranking`~~ | **解決済み**。表示しない方針が決まり、型から外して変換でも落とす |
| `biography['short-values']` | 未表示・未変換 |
| `certifications[].description.title` | 未表示・未変換。`description.description` のみ表示されている |

扱いは持ち主が決める（入力から外す／設定項目を足して削る／実際に表示する）。
決まるまでは、これらに機微な内容を入れないこと。

`all_ranking` は「上流から供給しない」方針だが、混ざった場合に備えて
変換側でも削除している（型定義からも外してある）。

なお `basicInfo.nationality` は `showNationality: false` で削除される一方、
`About.tsx` が表示しようとしているため区切り文字だけが残る。
表示するなら設定を、しないなら表示側を直す必要がある。
