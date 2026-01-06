-- Fix 1: Update ab_test_metrics INSERT policy to validate variation_id exists
-- First drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert metrics" ON public.ab_test_metrics;

-- Create a more secure INSERT policy that validates variation exists
-- Note: For widget tracking, we need to allow anonymous inserts but ensure the variation is valid
CREATE POLICY "Anyone can insert metrics for valid variations" 
ON public.ab_test_metrics 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.widget_variations 
    WHERE widget_variations.id = variation_id
  )
);

-- Fix 2: Create a rate limiting function for email captures
-- Add a function to check recent submissions from same source
CREATE OR REPLACE FUNCTION public.check_email_rate_limit(p_email text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Check if this email was submitted in the last hour
  SELECT COUNT(*) INTO recent_count
  FROM public.email_captures
  WHERE email = p_email
    AND created_at > now() - interval '1 hour';
  
  -- Allow if less than 3 submissions in the last hour
  RETURN recent_count < 3;
END;
$$;

-- Fix 3: Update email_captures INSERT policy to include rate limiting
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_captures;

-- Create a more secure INSERT policy with rate limiting
CREATE POLICY "Anyone can subscribe with rate limit" 
ON public.email_captures 
FOR INSERT 
WITH CHECK (
  -- Basic validation: email must be provided
  email IS NOT NULL 
  AND length(email) > 0 
  AND length(email) < 255
  -- Rate limiting: max 3 submissions per email per hour
  AND public.check_email_rate_limit(email)
);