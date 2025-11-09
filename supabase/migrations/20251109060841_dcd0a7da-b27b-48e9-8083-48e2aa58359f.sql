-- Create A/B tests table
CREATE TABLE public.ab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  widget_config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed'))
);

-- Create widget variations table
CREATE TABLE public.widget_variations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ab_test_id UUID NOT NULL REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  traffic_percentage INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_traffic CHECK (traffic_percentage >= 0 AND traffic_percentage <= 100)
);

-- Create metrics table
CREATE TABLE public.ab_test_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  variation_id UUID NOT NULL REFERENCES public.widget_variations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_event_type CHECK (event_type IN ('impression', 'click', 'conversion'))
);

-- Enable RLS
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ab_tests
CREATE POLICY "Users can view their own tests"
  ON public.ab_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tests"
  ON public.ab_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests"
  ON public.ab_tests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tests"
  ON public.ab_tests FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for widget_variations
CREATE POLICY "Users can view variations of their tests"
  ON public.widget_variations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ab_tests
    WHERE ab_tests.id = widget_variations.ab_test_id
    AND ab_tests.user_id = auth.uid()
  ));

CREATE POLICY "Users can create variations for their tests"
  ON public.widget_variations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ab_tests
    WHERE ab_tests.id = widget_variations.ab_test_id
    AND ab_tests.user_id = auth.uid()
  ));

CREATE POLICY "Users can update variations of their tests"
  ON public.widget_variations FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.ab_tests
    WHERE ab_tests.id = widget_variations.ab_test_id
    AND ab_tests.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete variations of their tests"
  ON public.widget_variations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.ab_tests
    WHERE ab_tests.id = widget_variations.ab_test_id
    AND ab_tests.user_id = auth.uid()
  ));

-- RLS Policies for ab_test_metrics (public can insert, users can view their own)
CREATE POLICY "Anyone can insert metrics"
  ON public.ab_test_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view metrics for their tests"
  ON public.ab_test_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.widget_variations
    JOIN public.ab_tests ON ab_tests.id = widget_variations.ab_test_id
    WHERE widget_variations.id = ab_test_metrics.variation_id
    AND ab_tests.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX idx_widget_variations_ab_test_id ON public.widget_variations(ab_test_id);
CREATE INDEX idx_ab_test_metrics_variation_id ON public.ab_test_metrics(variation_id);
CREATE INDEX idx_ab_test_metrics_event_type ON public.ab_test_metrics(event_type);
CREATE INDEX idx_ab_test_metrics_created_at ON public.ab_test_metrics(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_ab_tests_updated_at
  BEFORE UPDATE ON public.ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_widget_variations_updated_at
  BEFORE UPDATE ON public.widget_variations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();