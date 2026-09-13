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

## プロフィールデータはこのリポジトリに無い

正本は別の非公開リポジトリで Markdown として管理されている。
配信用の JSON は R2（層2）にあり、サイトは**実行時に** `/api/profile.json` で取りに行く。
バンドルにはデータが1バイトも載らない。

**その別リポジトリを読みに行かないこと。** 構造の話だけで足りる。

## 触るときに守ること

- **このリポジトリは削らない。届いたものを検査するだけ。** 削るのは正本の側。
  非公開の判断をこちらに持ち込むと、同じ規則が2箇所になる
- プロフィール周りを変更したら `npm run verify:boundary` が通ることを確認する
- **JSON を `import` しないこと。** Vite は import された JSON をバンドルへ
  静的に埋め込む。データを焼き込む経路はこれで一度壊れている（verify:boundary が見張る）
- 契約（`schema.json`）は「あるべき形」と「あってはいけないキー」の両方を書く。
  前者だけだと「書かれていないものは何でも通る」という意味になる
- 中身（画像の原本を含む）を `public/` に置かないこと。`public/` は dist へ丸ごと
  写されるので、誰も参照していなくても配信物に混ざる。原本は `originals/`

## デプロイ

`main` への push で GitHub Actions が走り、Cloudflare Workers へ自動デプロイされる。
手順は docs/how-to-deploy.md。

## 技術スタック

React 19 + TypeScript + Vite 7 + Material-UI 7 / React Router DOM 7 /
デプロイは Cloudflare Workers（静的アセット配信）
