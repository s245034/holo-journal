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

INSERT INTO public.entry_labels (entry_id, label_id, user_id)
SELECT DISTINCT e.id, l.id, e.user_id
FROM public.journal_entries e
CROSS JOIN LATERAL unnest(e.label_ids) AS lid
JOIN public.labels l ON l.id = lid AND l.user_id = e.user_id
ON CONFLICT DO NOTHING;