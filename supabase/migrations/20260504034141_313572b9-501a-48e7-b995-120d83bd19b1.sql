-- Private share tokens for embed widgets
CREATE TABLE public.embed_widget_share_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id UUID NOT NULL REFERENCES public.embed_widgets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  label TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  use_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_embed_widget_share_tokens_widget ON public.embed_widget_share_tokens(widget_id);
CREATE INDEX idx_embed_widget_share_tokens_token ON public.embed_widget_share_tokens(token);

ALTER TABLE public.embed_widget_share_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their share tokens"
  ON public.embed_widget_share_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can create share tokens for their widgets"
  ON public.embed_widget_share_tokens FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.embed_widgets w
      WHERE w.id = widget_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their share tokens"
  ON public.embed_widget_share_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their share tokens"
  ON public.embed_widget_share_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- Validator function callable by anyone (used by edge function via service role too)
CREATE OR REPLACE FUNCTION public.validate_widget_share_token(_widget_id UUID, _token TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.embed_widget_share_tokens
    WHERE widget_id = _widget_id
      AND token = _token
      AND revoked_at IS NULL
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;