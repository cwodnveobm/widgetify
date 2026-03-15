
CREATE TABLE public.lastset_link_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.lastset_profiles(id) ON DELETE CASCADE,
  link_index integer NOT NULL,
  link_label text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  clicked_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_lastset_link_clicks_profile ON public.lastset_link_clicks(profile_id, link_index);

ALTER TABLE public.lastset_link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a link click"
  ON public.lastset_link_clicks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lastset_profiles
      WHERE id = profile_id AND is_public = true
    )
  );

CREATE POLICY "Profile owner can view their link clicks"
  ON public.lastset_link_clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lastset_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );
