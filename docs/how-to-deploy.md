# デプロイ手順

`main` ブランチへ push すると、GitHub Actions が Cloudflare Workers へ自動デプロイする。
**手動での操作は不要。**

公開URL: `https://showcase.1610-case.workers.dev`

## 自動デプロイの流れ

`.github/workflows/deploy.yml`

1. `npm ci`
2. `npm run verify:boundary` — 受け取り側の検査が効いているか、プロフィールが
   バンドルへ焼き込まれる経路に戻っていないかを検証。
   **失敗するとここで止まり、デプロイまで進まない**
3. `npm run build` — Vite ビルド。中身の入力は要らない（実行時に層2 から取りに行く）
4. `wrangler deploy` — `dist/` を Cloudflare Workers の静的アセットとして配信

## 必要な GitHub Secrets

| 名前 | 必須 | 用途 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | ✅ | デプロイの認証。Cloudflare の「アカウント API トークン」から発行し、テンプレートは「Edit Cloudflare Workers」を使う |
| ~~`PROFILE_JSON_B64`~~ | — | **2026-09-13 に廃止**。ビルドに中身の入力は要らない（実行時に層2 から取りに行く）。詳細は profile-privacy.md |

## 設定ファイル

`wrangler.jsonc`

```jsonc
{
  "name": "showcase",              // ← 公開URLのサブドメインになる。リポジトリ名とは別
  "compatibility_date": "2026-09-10",
  "assets": { "directory": "./dist" }
}
```

`name` を変えると公開URLが変わる。リポジトリ名（`case-website`）に揃えないこと。

## ローカルでの確認

```sh
npm install
npm run dev              # 開発サーバー
npm run build            # 本番ビルド
npm run preview          # ビルド結果の確認
npm run verify:boundary  # 境界の検査
npx wrangler deploy --dry-run  # デプロイ設定の検証（実際には送らない）
```

## 注意

- `public/` 配下のファイルはそのまま公開される。**dist へ丸ごと写されるので、
  誰も参照していないファイルも毎回アップロードされる。** 画像の原本は `originals/` へ
- プロフィールのデータはこのリポジトリに無い。R2（層2）から実行時に取りに行く
- `.env` など機密情報はコミットしない
