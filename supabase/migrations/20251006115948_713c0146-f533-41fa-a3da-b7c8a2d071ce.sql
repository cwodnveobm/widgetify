-- Create favorite_widgets table
CREATE TABLE public.favorite_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  widget_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, widget_type)
);

-- Enable RLS
ALTER TABLE public.favorite_widgets ENABLE ROW LEVEL SECURITY;

-- Create policies for favorite_widgets
CREATE POLICY "Users can view their own favorites"
ON public.favorite_widgets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.favorite_widgets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorite_widgets
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_favorite_widgets_user_id ON public.favorite_widgets(user_id);