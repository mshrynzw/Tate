# TateGen

テキストから背景色透明のSVG画像を生成するWebWebアプリです。

## 機能

- ✅ 任意のテキストを入力
- ✅ フォントサイズを数値で指定（px単位）
- ✅ カラーピッカーで色を選択（react-colorful使用）
- ✅ Google Fontsから任意のフォントを選択（検索可能なコンボボックス）
- ✅ リアルタイムプレビュー
- ✅ 背景色透明のSVG画像をダウンロード

## 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - UIコンポーネントライブラリ
- **react-colorful** - カラーピッカー
- **Google Fonts API** - フォント取得

## セットアップ

### 前提条件

- Node.js 18.0.0以上
- npm または yarn

### インストール

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 使い方

1. テキストボックスに任意の文字列を入力
2. フォントサイズを数値で指定（px単位）
3. カラーピッカーでテキストの色を選択
4. フォント選択コンボボックスからGoogle Fontsのフォントを選択（検索可能）
5. プレビューエリアでリアルタイムに確認
6. 「SVGをダウンロード」ボタンをクリックして背景色透明のSVG画像をダウンロード

## デザイン

- 白・黒・グレーのモノクロデザイン
- shadcn/uiを使用したモダンなUI

## プロジェクト構造

```
tategen/
├── app/
│   ├── page.tsx          # メインページ
│   ├── layout.tsx        # レイアウト
│   └── globals.css       # グローバルスタイル
├── components/
│   ├── ui/               # shadcn/uiコンポーネント
│   ├── ColorPicker.tsx   # カラーピッカーコンポーネント
│   ├── FontSelector.tsx  # フォント選択コンポーネント
│   └── PreviewArea.tsx   # プレビューエリアコンポーネント
└── lib/
    ├── utils.ts          # ユーティリティ関数
    └── google-fonts.ts   # Google Fonts API連携
```

## ライセンス

MIT
