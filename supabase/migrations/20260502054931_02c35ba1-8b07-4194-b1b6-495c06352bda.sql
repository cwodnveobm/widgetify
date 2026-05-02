ALTER TABLE public.embed_widgets ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Replace public-view policy to also require is_public = true
DROP POLICY IF EXISTS "Anyone can view active widgets" ON public.embed_widgets;
CREATE POLICY "Anyone can view active public widgets"
ON public.embed_widgets
FOR SELECT
USING (is_active = true AND is_public = true);