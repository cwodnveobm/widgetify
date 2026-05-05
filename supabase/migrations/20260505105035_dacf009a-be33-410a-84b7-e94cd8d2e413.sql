
CREATE TABLE public.lastset_share_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.lastset_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  label text,
  expires_at timestamptz,
  revoked_at timestamptz,
  last_used_at timestamptz,
  use_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lastset_share_tokens_profile ON public.lastset_share_tokens(profile_id);
CREATE INDEX idx_lastset_share_tokens_token ON public.lastset_share_tokens(token);

ALTER TABLE public.lastset_share_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their lastset share tokens"
  ON public.lastset_share_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can create lastset share tokens"
  ON public.lastset_share_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_share_tokens.profile_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Owners can update their lastset share tokens"
  ON public.lastset_share_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their lastset share tokens"
  ON public.lastset_share_tokens FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.validate_lastset_share_token(_username text, _token text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lastset_share_tokens t
    JOIN public.lastset_profiles p ON p.id = t.profile_id
    WHERE p.username = _username
      AND t.token = _token
      AND t.revoked_at IS NULL
      AND (t.expires_at IS NULL OR t.expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.get_lastset_profile_by_token(_username text, _token text)
RETURNS SETOF public.lastset_profiles
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.*
  FROM public.lastset_profiles p
  WHERE p.username = _username
    AND EXISTS (
      SELECT 1 FROM public.lastset_share_tokens t
      WHERE t.profile_id = p.id
        AND t.token = _token
        AND t.revoked_at IS NULL
        AND (t.expires_at IS NULL OR t.expires_at > now())
    );
$$;
