
-- Drop privilege-escalating policies
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;

DROP POLICY IF EXISTS "Users can insert their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

DROP POLICY IF EXISTS "Users can update their own referrals" ON public.referrals;

DROP POLICY IF EXISTS "Anyone can update their chat session" ON public.embed_chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat sessions for active widgets" ON public.embed_chat_sessions;

DROP POLICY IF EXISTS "Anyone can increment view count on public profiles" ON public.lastset_profiles;

-- Column-level PII restriction
REVOKE SELECT (email) ON public.donations FROM anon, authenticated;
REVOKE SELECT (payer_email) ON public.lastset_payments FROM anon, authenticated;

-- Safe view-count increment via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.increment_lastset_view_count(_profile_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.lastset_profiles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = _profile_id AND is_public = true;
$$;
REVOKE EXECUTE ON FUNCTION public.increment_lastset_view_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_lastset_view_count(uuid) TO anon, authenticated;

-- Self-init helper for user_credits
CREATE OR REPLACE FUNCTION public.ensure_user_credits()
RETURNS public.user_credits
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.user_credits;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  INSERT INTO public.user_credits (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO _row FROM public.user_credits WHERE user_id = auth.uid();
  RETURN _row;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.ensure_user_credits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_user_credits() TO authenticated;

-- Tighten EXECUTE on SECURITY DEFINER helpers (revoke PUBLIC, grant minimal)
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_lastset_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_email_rate_limit(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_verified_creator(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_creator_multiplier(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_widget_share_token(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_lastset_share_token(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_lastset_profile_by_token(text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_verified_creator(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_creator_multiplier(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_widget_share_token(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_lastset_share_token(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_lastset_profile_by_token(text, text) TO anon, authenticated;

-- Storage: drop overly broad SELECT policies that allow listing public buckets.
-- Files remain accessible via their public CDN URLs (public buckets serve objects directly).
DROP POLICY IF EXISTS "Anyone can view lastset avatars" ON storage.objects;
DROP POLICY IF EXISTS "Widget logos are publicly accessible" ON storage.objects;
