-- Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Add UPDATE policy for subscriptions table (allow users to update their own subscription status)
CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add DELETE policy for subscriptions table
CREATE POLICY "Users can delete their own subscriptions"
ON public.subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Add UPDATE policy for favorite_widgets table
CREATE POLICY "Users can update their own favorites"
ON public.favorite_widgets
FOR UPDATE
USING (auth.uid() = user_id);