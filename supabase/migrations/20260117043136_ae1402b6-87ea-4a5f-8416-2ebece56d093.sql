-- Drop the overly permissive policy
DROP POLICY "Anyone can insert donations" ON public.donations;

-- Create a more restrictive insert policy - require valid data
CREATE POLICY "Users can insert donations with valid data"
ON public.donations
FOR INSERT
WITH CHECK (
  display_name IS NOT NULL 
  AND length(display_name) > 0 
  AND length(display_name) < 100
  AND amount > 0
);