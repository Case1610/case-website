# デプロイ手順

`main` ブランチへ push すると、GitHub Actions が Cloudflare Workers へ自動デプロイする。
**手動での操作は不要。**

公開URL: `https://showcase.1610-case.workers.dev`

## 自動デプロイの流れ

`.github/workflows/deploy.yml`

1. `npm ci`
2. `npm run verify:redaction` — 非公開項目がバンドルへ混入していないか検証。
   **失敗するとここで止まり、デプロイまで進まない**
3. `npm run build` — `prebuild` で `profile.json` を生成してから Vite ビルド
4. `wrangler deploy` — `dist/` を Cloudflare Workers の静的アセットとして配信

## 必要な GitHub Secrets

| 名前 | 必須 | 用途 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | ✅ | デプロイの認証。Cloudflare の「アカウント API トークン」から発行し、テンプレートは「Edit Cloudflare Workers」を使う |
| `PROFILE_JSON_B64` | — | プロフィール実データ（Base64）。未設定なら `profile.sample.json` にフォールバックする。詳細は profile-privacy.md |

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
npm run verify:redaction # 非公開項目の検証
npx wrangler deploy --dry-run  # デプロイ設定の検証（実際には送らない）
```

## 注意

- `public/` 配下のファイルはそのまま公開される
- `src/pages/profile.json` は生成物。手で編集しても次のビルドで上書きされる
- `.env` など機密情報はコミットしない。実データは GitHub Secrets 経由で渡す
