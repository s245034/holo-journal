# 日記の古いラベル列（label_ids）を削除する

## 先にしていただくこと（設定の変更）

1. 画面上部の Cloud（バックエンド）画面を開く
2. ツール設定（tool preferences / エージェントの権限）を開く
3. 「Execute backward incompatible database migrations」を「Never allow」から「Ask each time」に変更する

「Ask each time」にすると、削除の前に毎回SQLを見せて承認をお願いする形になります。

## 前提の確認

- 今のアプリはこの列を読み書きしていません。ただし公開中のサイトが古い版のままだと列の削除で壊れるため、先に最新版を公開してください。

## 実行する内容

```sql
ALTER TABLE public.journal_entries DROP COLUMN label_ids;
```

- 実行時に承認画面が出るので、内容を確認して承認してください。
- 型定義は自動で再生成されます。他のファイルは変更しません。

## 確認

- 列が消えたことをデータベースで確認
- ログインした状態で日記一覧・ラベル表示・絞り込みが今まで通り動くことを確認
