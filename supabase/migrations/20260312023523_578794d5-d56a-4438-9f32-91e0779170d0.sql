
-- Drop all existing lastset_profiles policies (they were RESTRICTIVE which means ALL must pass — wrong for sharing)
DROP POLICY IF EXISTS "Anyone can view public lastset profiles" ON public.lastset_profiles;
DROP POLICY IF EXISTS "Users can delete own lastset profile" ON public.lastset_profiles;
DROP POLICY IF EXISTS "Users can insert own lastset profile" ON public.lastset_profiles;
DROP POLICY IF EXISTS "Users can update own lastset profile" ON public.lastset_profiles;
DROP POLICY IF EXISTS "Users can view own lastset profile" ON public.lastset_profiles;

-- Re-create as PERMISSIVE (default) so any matching policy grants access
-- Public read: anyone can view public profiles (no auth needed)
CREATE POLICY "Public profiles are viewable by anyone"
  ON public.lastset_profiles
  FOR SELECT
  USING (is_public = true);

-- Owners can always view their own profile (even private)
CREATE POLICY "Owners can view their own lastset profile"
  ON public.lastset_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Owners can insert their own profile
CREATE POLICY "Owners can insert their own lastset profile"
  ON public.lastset_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owners can update their own profile
CREATE POLICY "Owners can update their own lastset profile"
  ON public.lastset_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Owners can delete their own profile
CREATE POLICY "Owners can delete their own lastset profile"
  ON public.lastset_profiles
  FOR DELETE
  USING (auth.uid() = user_id);
