# ShowCase - ポートフォリオサイト

## 概要

React + TypeScript + Vite + Material-UI (MUI) で構築したミニマルデザインのポートフォリオサイトです。
ダークモード/ライトモード切り替え機能とレスポンシブデザインに対応し、Sony α6400で撮影した写真ギャラリーが特徴です。

## 技術スタック

- **フロントエンド**: React 19.1.0 + TypeScript
- **ビルドツール**: Vite 7.0.0
- **UIフレームワーク**: Material-UI (MUI) 7.1.2
- **ルーティング**: React Router DOM 7.6.2
- **その他**: 
  - React Markdown (Markdownレンダリング)
  - React Masonry CSS (グリッドレイアウト)

## 主な機能

### 🎨 ミニマルデザイン
- 洗練されたホームページデザイン
- 情報の階層化による使いやすいナビゲーション
- プロフィール画像のクリック拡大機能

### 🖼️ プロフィール画像システム
- **ProfileAvatarコンポーネント**: 再利用可能なアバター表示
- モーダル表示による拡大機能
- 全ページで統一されたデザイン

### 📷 ギャラリー機能
- Sony α6400で撮影した写真・動画のみを表示
- マソナリーレイアウトによる美しい配置
- モーダル表示による拡大表示機能
- レスポンシブ対応（モバイル・タブレット・デスクトップ）

### 📄 ページ構成
- **Home**: ミニマルなランディングページ（アバター、名前、ナビゲーション、ギャラリー）
- **About**: 詳細なプロフィール情報（経歴、スキル、価値観等）
- **Tools**: 開発したツールや作品の展示
- **Contact**: 連絡先情報とソーシャルリンク

### 🛠️ ツール機能
- Markdownサンドボックス（リアルタイムプレビュー）
- ソーシャルスタイルテスト

### 📱 レスポンシブデザイン
- モバイルファーストなデザイン
- ハンバーガーメニュー（モバイル）
- 各画面サイズに最適化されたレイアウト

## ディレクトリ構成

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── Footer.tsx      # フッターコンポーネント
│   ├── Layout.tsx      # レイアウトコンポーネント
│   ├── Navigation.tsx  # ナビゲーションコンポーネント
│   └── ProfileAvatar.tsx # プロフィール画像コンポーネント（モーダル対応）
├── pages/              # ページコンポーネント
│   ├── Home.tsx        # ホームページ（ミニマルデザイン）
│   ├── About.tsx       # 自己紹介ページ（詳細プロフィール）
│   ├── Contact.tsx     # お問い合わせページ
│   ├── NotFound.tsx    # 404ページ
│   ├── profile.json    # 表示用プロフィールデータ（ビルド時に生成。docs/profile-privacy.md 参照）
│   └── tools/          # ツールページ群
├── assets/             # 静的ファイル
│   └── gallery/        # ギャラリー画像（Sony α6400のみ）
├── hooks/              # カスタムフック
├── utils/              # ユーティリティ関数
├── types/              # 型定義
├── constants/          # 定数定義
├── theme.ts           # MUIテーマ設定
└── AppProvider.tsx    # アプリケーション全体のプロバイダー
```

### 静的アセット
```
public/
├── profile/            # プロフィール関連
│   └── avatar.jpg     # プロフィール画像
└── gallery/           # ギャラリー（Sony α6400で撮影）
    ├── A64_*.jpg      # 写真ファイル群
    └── IMG_*.MOV      # 動画ファイル
```

## 開発・起動方法

### 環境要件
- Node.js 20.19.0以上 または 22.12.0以上
- npm 10.x以上

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー（ビルド後）
npm run preview

# リンター実行
npm run lint
```

## ギャラリー画像の追加方法

1. 画像ファイルを `public/gallery/` フォルダに配置
2. `src/pages/Home.tsx` の `galleryItems` 配列に画像情報を追加

```typescript
const galleryItems = [
  { type: 'image' as const, src: '/gallery/your-image.jpg' },
  // 他の画像...
];
```

## カスタマイズ

### テーマのカスタマイズ
`src/theme.ts` でライト/ダークテーマの色やスタイルを変更できます。

### 新しいページの追加
詳細は `docs/how-to-add-page.md` を参照してください。

## デプロイ

詳細は `docs/how-to-deploy.md` を参照してください。

## ドキュメント

- [プロジェクト構造](docs/project-structure.md)
- [コンポーネント追加方法](docs/how-to-add-component.md)
- [ページ追加方法](docs/how-to-add-page.md)
- [デプロイ方法](docs/how-to-deploy.md)
- [CSSガイド](docs/css-guide.md)
- [タスク状況](docs/task-status.md)

## ライセンス

このプロジェクトは学習・ポートフォリオ用途で作成されています。
