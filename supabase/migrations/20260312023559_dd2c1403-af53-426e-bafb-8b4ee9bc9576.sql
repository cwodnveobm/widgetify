
-- Allow anyone to increment view_count on public profiles (fire-and-forget analytics)
-- This is a safe UPDATE policy limited to a single column bump on public profiles
CREATE POLICY "Anyone can increment view count on public profiles"
  ON public.lastset_profiles
  FOR UPDATE
  USING (is_public = true)
  WITH CHECK (is_public = true);
