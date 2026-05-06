
ALTER TABLE public.lastset_profiles
  ADD COLUMN IF NOT EXISTS widgets jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS font_family text NOT NULL DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT '#9b87f5',
  ADD COLUMN IF NOT EXISTS spacing text NOT NULL DEFAULT 'comfortable';

CREATE TABLE IF NOT EXISTS public.lastset_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.lastset_profiles(id) ON DELETE CASCADE,
  widget_id text NOT NULL,
  widget_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lastset_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit on public profiles"
ON public.lastset_submissions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_submissions.profile_id AND p.is_public = true
  )
);

CREATE POLICY "Owners can view their submissions"
ON public.lastset_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_submissions.profile_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete their submissions"
ON public.lastset_submissions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_submissions.profile_id AND p.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_lastset_submissions_profile ON public.lastset_submissions(profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.lastset_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.lastset_profiles(id) ON DELETE CASCADE,
  widget_id text NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  payer_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lastset_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create payment intent on public profiles"
ON public.lastset_payments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_payments.profile_id AND p.is_public = true
  )
);

CREATE POLICY "Owners can view their payments"
ON public.lastset_payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lastset_profiles p
    WHERE p.id = lastset_payments.profile_id AND p.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_lastset_payments_profile ON public.lastset_payments(profile_id, created_at DESC);
