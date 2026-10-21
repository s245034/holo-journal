# 日記とラベルの関係を中間テーブル entry_labels に移行

画面の見た目と動作は変わりません。保存先だけが変わります。

## マイグレーション1（作成・コピー）

```sql
CREATE TABLE public.entry_labels (
  entry_id   uuid NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  label_id   uuid NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entry_id, label_id)
);
CREATE INDEX entry_labels_label_id_idx ON public.entry_labels(label_id);
CREATE INDEX entry_labels_user_id_idx  ON public.entry_labels(user_id);

GRANT SELECT, INSERT, DELETE ON public.entry_labels TO authenticated;
GRANT ALL ON public.entry_labels TO service_role;

ALTER TABLE public.entry_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own entry_labels" ON public.entry_labels
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own entry_labels" ON public.entry_labels
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.journal_entries e WHERE e.id = entry_id AND e.user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.labels l WHERE l.id = label_id AND l.user_id = auth.uid())
  );

CREATE POLICY "Users delete own entry_labels" ON public.entry_labels
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 既存データのコピー（存在しない/他人のラベルIDは除外）
INSERT INTO public.entry_labels (entry_id, label_id, user_id)
SELECT DISTINCT e.id, l.id, e.user_id
FROM public.journal_entries e
CROSS JOIN LATERAL unnest(e.label_ids) AS lid
JOIN public.labels l ON l.id = lid AND l.user_id = e.user_id
ON CONFLICT DO NOTHING;
```

## マイグレーション2（label_ids 列の削除）

```sql
ALTER TABLE public.journal_entries DROP COLUMN label_ids;
```

注意点:
- 列の削除は、まだ label_ids を読んでいる公開中アプリを壊すため、現在の設定ではブロックされます。手順は「コード切り替え → 公開 → 削除」の順で行います。
- 削除を実行するには、Lovable Cloud のツール設定で「Execute backward incompatible database migrations」を「Ask each time」か「Always allow」に変更していただく必要があります。変更されない場合は、列を残して「非推奨」コメントを付けるだけにします（`COMMENT ON COLUMN public.journal_entries.label_ids IS 'DEPRECATED: replaced by entry_labels';`）。

## 変更するファイル

- `src/stores/journalStore.ts`
  - 読み込み: `journal_entries` を `select('*, entry_labels(label_id)')` で取得し、`labelIds` を組み立て
  - 追加: 日記を作成後、`entry_labels` にまとめて挿入
  - 更新: `labelIds` が変わった時、差分だけ `entry_labels` を削除・追加
  - ラベル削除: 関連行は CASCADE で消えるので、画面上の処理は今のまま
- `src/integrations/supabase/types.ts` — 自動再生成のみ

変更しないファイル（`labelIds` を画面上で使うだけなので見た目・動作はそのまま）:
`src/types/journal.ts`, `EntryCard.tsx`, `WritePage.tsx`, `EntryDetailPage.tsx`, `HomePage.tsx`

## 確認

- マイグレーション後にコピー件数を確認（元の有効なラベルID数と一致すること）
- ログインした状態で、ラベル付き日記の表示・作成・ラベル変更・ラベルでの絞り込みを実際に操作して確認
