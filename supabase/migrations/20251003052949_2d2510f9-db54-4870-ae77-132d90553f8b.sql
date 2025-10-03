-- Fix the search_path security issue for the has_active_subscription function
DROP FUNCTION IF EXISTS public.has_active_subscription(uuid);

CREATE OR REPLACE FUNCTION public.has_active_subscription(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = user_id_param
      AND status = 'active'
      AND (end_date IS NULL OR end_date > now())
  );
END;
$$;