
-- 1. Revoke EXECUTE on internal SECURITY DEFINER helpers from anon/authenticated/PUBLIC.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_verified_creator(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_creator_multiplier(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_lastset_updated_at() FROM PUBLIC, anon, authenticated;

-- 2. Replace support_messages "always-true" INSERT policy with validated checks.
DROP POLICY IF EXISTS "Anyone can submit support message" ON public.support_messages;
CREATE POLICY "Anyone can submit support message"
  ON public.support_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name))    BETWEEN 1 AND 100
    AND length(btrim(email)) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(btrim(subject)) BETWEEN 1 AND 200
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND status = 'new'
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- 3. Prevent privilege escalation on creator_verifications via BEFORE UPDATE trigger.
CREATE OR REPLACE FUNCTION public.prevent_creator_verification_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    NEW.status             := OLD.status;
    NEW.earning_multiplier := OLD.earning_multiplier;
    NEW.badge_type         := OLD.badge_type;
    NEW.verified_at        := OLD.verified_at;
    NEW.rejection_reason   := OLD.rejection_reason;
    NEW.user_id            := OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_creator_verification_escalation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_creator_verification_escalation_trg ON public.creator_verifications;
CREATE TRIGGER prevent_creator_verification_escalation_trg
  BEFORE UPDATE ON public.creator_verifications
  FOR EACH ROW EXECUTE FUNCTION public.prevent_creator_verification_escalation();

-- 4. Hide donor email from public viewers.
REVOKE SELECT (email) ON public.donations FROM anon, authenticated;

-- 5. Hide referred user email from referrers.
REVOKE SELECT (referred_email) ON public.referrals FROM anon, authenticated;

-- 6. Restrict widget-logos uploads to authenticated users only.
DROP POLICY IF EXISTS "Users can upload their own widget logos" ON storage.objects;
CREATE POLICY "Users can upload their own widget logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'widget-logos'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
