# 真っ白画面の修正（接続情報の復元）

## 確認した現状
- `.gitignore` の末尾に `# Environment variables` と `.env` の行がある
- サンドボックス内の `.env` には3つの接続情報（URL・公開キー・プロジェクトID）が入っているが、Git管理外のため公開ビルドに含まれず空になる

## 変更内容
1. `.gitignore` から `# Environment variables` と `.env` の2行を削除
2. `.env` を Lovable Cloud の接続情報で書き直す（値は公開用で安全なもの）
   - `VITE_SUPABASE_PROJECT_ID="icecvbbocqerzyfghsbg"`
   - `VITE_SUPABASE_PUBLISHABLE_KEY="<現在の公開キー>"`
   - `VITE_SUPABASE_URL="https://icecvbbocqerzyfghsbg.supabase.co"`
3. その他のコードは変更しない

## 確認
- プレビューを開き、ログイン画面が表示され「supabaseUrl is required.」が出ないことを確認
- 公開サイトへの反映には再公開が必要
