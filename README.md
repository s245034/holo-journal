# Holo Journal

日々の振り返りや気分の記録、そして書く習慣を身につけるための日記アプリです。

**デモ:** https://holo-daily-spark.lovable.app/

## 主な機能

- **日記の作成・編集・削除** — タイトル・本文・日付・時刻を記録。下書き保存にも対応
- **気分の記録** — 5段階（😞 😐 🙂 😊 🤩）で、その日の気分を残せる
- **ラベル分類** — 色と絵文字つきのラベルを自由に作成し、日記に複数付与できる（新規登録時に「仕事」「プライベート」「健康」「学び」「感謝」を自動作成）
- **検索** — 記録した日記をキーワードで検索
- **週ごとの一覧表示** — ホーム画面で日記を週単位にまとめて表示
- **継続のしくみ** — 連続記録日数（ストリーク）、最長連続記録、7日・30日・100日のマイルストーン
- **ヒートマップカレンダー** — 記録した日を一覧で可視化
- **オンボーディング** — 初回利用時に使い方を案内
- **アカウント認証** — メールアドレスとパスワードで登録・ログイン。データはユーザーごとにクラウドへ保存

## 技術スタック

| 分類 | 使用技術 |
| --- | --- |
| フロントエンド | React 18 / TypeScript / Vite |
| UI | Tailwind CSS / shadcn/ui（Radix UI）/ Framer Motion / lucide-react |
| 状態管理 | Zustand / TanStack Query |
| ルーティング | React Router v6 |
| バックエンド | Supabase（認証・PostgreSQL） |
| テスト | Vitest / Testing Library |
| 開発環境 | Lovable |

## データ設計

Supabase上に3つのテーブルを持ちます。すべてのテーブルで行レベルセキュリティ（RLS）を有効にしており、ユーザーは自分のデータのみ参照・編集できます。

| テーブル | 内容 |
| --- | --- |
| `profiles` | 表示名などのユーザー情報 |
| `labels` | ユーザーが作成したラベル（タイトル・色・絵文字） |
| `journal_entries` | 日記本文・気分・日付・付与ラベル・下書きフラグ |

スキーマ定義は `supabase/migrations/` にあります。

## 画面構成

| パス | 画面 |
| --- | --- |
| `/auth/login`, `/auth/signup` | ログイン・新規登録 |
| `/` | ホーム（ストリーク・検索・週ごとの日記一覧） |
| `/write`, `/write/:id` | 日記の新規作成・編集 |
| `/entry/:id` | 日記の詳細 |
| `/profile` | プロフィール（マイルストーン・統計・ヒートマップ・ラベル管理） |

## ローカルでの起動

```sh
git clone https://github.com/s245034/holo-journal.git
cd holo-journal
npm install
npm run dev
```

ルートに `.env` を置き、Supabaseの接続情報を設定してください。

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLintによる静的解析 |
| `npm run test` | Vitestによるテスト実行 |
