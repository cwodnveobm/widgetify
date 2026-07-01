-- Close the creator_verifications self-escalation vector by removing the
-- user UPDATE policy entirely. Users can INSERT a pending application, but
-- once submitted only admins can modify it (existing admin policy remains).
DROP POLICY IF EXISTS "Users can update pending applications" ON public.creator_verifications;