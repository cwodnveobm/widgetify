-- Create creator verifications table
CREATE TABLE public.creator_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    instagram_handle TEXT NOT NULL,
    follower_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    earning_multiplier NUMERIC NOT NULL DEFAULT 1.0,
    badge_type TEXT NOT NULL DEFAULT 'none' CHECK (badge_type IN ('none', 'verified', 'premium', 'elite')),
    rejection_reason TEXT,
    application_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification status
CREATE POLICY "Users can view their own verification"
ON public.creator_verifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can apply for verification (insert)
CREATE POLICY "Users can apply for verification"
ON public.creator_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending applications
CREATE POLICY "Users can update pending applications"
ON public.creator_verifications
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Create trigger for updated_at
CREATE TRIGGER update_creator_verifications_updated_at
BEFORE UPDATE ON public.creator_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user is verified creator
CREATE OR REPLACE FUNCTION public.is_verified_creator(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.creator_verifications
    WHERE user_id = p_user_id AND status = 'approved'
  )
$$;

-- Create function to get creator earning multiplier
CREATE OR REPLACE FUNCTION public.get_creator_multiplier(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT earning_multiplier FROM public.creator_verifications
     WHERE user_id = p_user_id AND status = 'approved'),
    1.0
  )
$$;