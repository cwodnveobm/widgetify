
-- LastSet: Link-in-bio profiles table
CREATE TABLE IF NOT EXISTS public.lastset_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'glass',
  shape TEXT NOT NULL DEFAULT 'rounded',
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lastset_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public profiles (for the public /l/:username page)
CREATE POLICY "Anyone can view public lastset profiles"
  ON public.lastset_profiles FOR SELECT
  USING (is_public = true);

-- Owners can view their own (even private)
CREATE POLICY "Users can view own lastset profile"
  ON public.lastset_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lastset profile"
  ON public.lastset_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lastset profile"
  ON public.lastset_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lastset profile"
  ON public.lastset_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_lastset_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER lastset_profiles_updated_at
  BEFORE UPDATE ON public.lastset_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_lastset_updated_at();

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_lastset_profiles_username ON public.lastset_profiles (username);
CREATE INDEX IF NOT EXISTS idx_lastset_profiles_user_id ON public.lastset_profiles (user_id);
