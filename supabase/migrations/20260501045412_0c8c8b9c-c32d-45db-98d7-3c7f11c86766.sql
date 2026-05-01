-- Widget type enum
CREATE TYPE public.embed_widget_type AS ENUM ('popup', 'lead-form', 'ai-chat');

-- Main widget config table
CREATE TABLE public.embed_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  widget_type public.embed_widget_type NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.embed_widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active widgets"
  ON public.embed_widgets FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can view all their widgets"
  ON public.embed_widgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert their widgets"
  ON public.embed_widgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their widgets"
  ON public.embed_widgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their widgets"
  ON public.embed_widgets FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_embed_widgets_updated_at
  BEFORE UPDATE ON public.embed_widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Interactions / analytics
CREATE TABLE public.widget_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES public.embed_widgets(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  session_id text,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_widget_interactions_widget ON public.widget_interactions(widget_id, created_at DESC);

ALTER TABLE public.widget_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert interactions for active widgets"
  ON public.widget_interactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.embed_widgets
      WHERE embed_widgets.id = widget_interactions.widget_id
        AND embed_widgets.is_active = true
    )
    AND length(event_type) > 0
    AND length(event_type) < 64
  );

CREATE POLICY "Owners can view interactions for their widgets"
  ON public.widget_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.embed_widgets
      WHERE embed_widgets.id = widget_interactions.widget_id
        AND embed_widgets.user_id = auth.uid()
    )
  );

-- Short-term chat memory
CREATE TABLE public.embed_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES public.embed_widgets(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  UNIQUE (widget_id, session_id)
);

CREATE INDEX idx_chat_sessions_lookup ON public.embed_chat_sessions(widget_id, session_id);

ALTER TABLE public.embed_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat sessions for active widgets"
  ON public.embed_chat_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.embed_widgets
      WHERE embed_widgets.id = embed_chat_sessions.widget_id
        AND embed_widgets.is_active = true
        AND embed_widgets.widget_type = 'ai-chat'
    )
  );

CREATE POLICY "Anyone can update their chat session"
  ON public.embed_chat_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.embed_widgets
      WHERE embed_widgets.id = embed_chat_sessions.widget_id
        AND embed_widgets.is_active = true
    )
  );

CREATE POLICY "Owners can view their chat sessions"
  ON public.embed_chat_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.embed_widgets
      WHERE embed_widgets.id = embed_chat_sessions.widget_id
        AND embed_widgets.user_id = auth.uid()
    )
  );

CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON public.embed_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();