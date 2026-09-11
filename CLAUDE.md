# CLAUDE.md

ポートフォリオサイト **ShowCase** のソース。Cloudflare Workers で公開している。

## 最初に読むもの

- **AGENTS.md** — エージェント共通の作業ルール（1セッション1 Issue、終わる前の書き戻し）
- **docs/status.md** — 現在の状態と、未決のまま残っている判断
- **docs/profile-privacy.md** — プロフィールの非公開制御。**プロフィール周りを触る前に必ず読む**

会話の前提を本人に聞き直す前に、まずこの3つを読むこと。

## 名前の対応

同じものを指す名前が3層あるので、混同しないこと。

| 層 | 名前 |
|---|---|
| GitHubリポジトリ | `case-website` |
| サイトの表示名（ブランド） | `ShowCase` |
| Cloudflare Workers / 公開URL | `showcase` → `showcase.1610-case.workers.dev` |

リポジトリ名とサイト名は意図的に分けてある。片方に揃えないこと。

## プロフィールデータの正本はここに無い

正本は別の非公開リポジトリで Markdown として管理されている。
このリポジトリが受け取るのは、そこから供給される入力（`profile.source.json` /
`PROFILE_JSON_B64`）であって、原本ではない。

**その別リポジトリを読みに行かないこと。** 構造の話だけで足りる。

## 触るときに守ること

- `src/pages/profile.json` は**生成物**。手で編集しても次のビルドで上書きされる
- プロフィール周りを変更したら `npm run verify:redaction` が通ることを確認する
- **バンドルに載ったものは全て公開される。** 表示制御は「載せたうえで隠す」仕組みではなく
  「載る範囲を絞る」仕組み。サイトに出したくないデータは正本の側に留める
- 型にはあるが画面に出ていないフィールドは、変換されないまま配信される。
  フィールドを足すときはこれを疑うこと（実際に一度起きている。docs/status.md 参照）

## デプロイ

`main` への push で GitHub Actions が走り、Cloudflare Workers へ自動デプロイされる。
手順は docs/how-to-deploy.md。

## 技術スタック

React 19 + TypeScript + Vite 7 + Material-UI 7 / React Router DOM 7 /
デプロイは Cloudflare Workers（静的アセット配信）
