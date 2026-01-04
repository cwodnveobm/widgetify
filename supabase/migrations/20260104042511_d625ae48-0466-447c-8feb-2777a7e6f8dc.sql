-- Create email captures table for storing subscriber information
CREATE TABLE public.email_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'returning_user',
  user_segment TEXT,
  widget_preferences JSONB,
  browsing_data JSONB,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT email_captures_email_unique UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for public email capture)
CREATE POLICY "Anyone can subscribe" 
ON public.email_captures 
FOR INSERT 
WITH CHECK (true);

-- Policy: Only authenticated users can view their own email
CREATE POLICY "Users can view their own subscription" 
ON public.email_captures 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_email_captures_updated_at
BEFORE UPDATE ON public.email_captures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();