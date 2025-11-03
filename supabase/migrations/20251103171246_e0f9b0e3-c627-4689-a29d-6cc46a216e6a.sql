-- Create storage bucket for widget logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('widget-logos', 'widget-logos', true);

-- Create storage policies for widget logos
CREATE POLICY "Users can upload their own widget logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'widget-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own widget logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'widget-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own widget logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'widget-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own widget logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'widget-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Widget logos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'widget-logos');

-- Create custom_widgets table
CREATE TABLE public.custom_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  button_text TEXT NOT NULL,
  button_color TEXT NOT NULL DEFAULT '#9b87f5',
  text_color TEXT NOT NULL DEFAULT '#1A1F2C',
  background_color TEXT NOT NULL DEFAULT '#ffffff',
  position TEXT NOT NULL DEFAULT 'bottom-right',
  size TEXT NOT NULL DEFAULT 'medium',
  logo_url TEXT,
  border_radius TEXT DEFAULT '12px',
  shadow TEXT DEFAULT '0 4px 12px rgba(0,0,0,0.15)',
  font_family TEXT DEFAULT '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  custom_css TEXT,
  button_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_widgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own widgets"
ON public.custom_widgets
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own widgets"
ON public.custom_widgets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own widgets"
ON public.custom_widgets
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own widgets"
ON public.custom_widgets
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_widgets_updated_at
BEFORE UPDATE ON public.custom_widgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();