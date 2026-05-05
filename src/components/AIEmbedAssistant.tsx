import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

type WidgetType = "popup" | "lead-form" | "ai-chat";

interface Generated {
  widget_type: WidgetType;
  name: string;
  rationale?: string;
  config: Record<string, unknown>;
}

const EXAMPLES = [
  "An exit-intent popup offering 10% off for first-time SaaS visitors",
  "A lead form for a real estate agency that captures contact info for tour bookings",
  "An AI chatbot that answers product questions for a Shopify electronics store",
  "A scroll-triggered popup announcing our new pricing on the homepage",
];

export function AIEmbedAssistant({ onCreated }: { onCreated: () => void }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Generated | null>(null);
  const [saving, setSaving] = useState(false);

  async function generate() {
    if (!description.trim()) {
      toast.error("Describe the widget you want");
      return;
    }
    setLoading(true);
    setDraft(null);
    try {
      const { data, error } = await supabase.functions.invoke("widget-ai-assistant", {
        body: { description: description.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setDraft(data as Generated);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate widget");
    } finally {
      setLoading(false);
    }
  }

  async function accept() {
    if (!draft) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in");
        return;
      }
      const { error } = await supabase.from("embed_widgets").insert([{
        user_id: user.id,
        name: draft.name,
        widget_type: draft.widget_type,
        config: draft.config as never,
      }]);
      if (error) throw error;
      toast.success("AI-generated widget created");
      setDraft(null);
      setDescription("");
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mb-6 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Embed Assistant
        </CardTitle>
        <CardDescription>
          Describe what you want — the AI picks the widget type, writes the copy, and tunes the triggers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. An AI chatbot for my fitness coaching site that answers questions and books trials"
          rows={3}
          maxLength={2000}
          disabled={loading || saving}
          className="text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setDescription(ex)}
              disabled={loading || saving}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition min-h-[32px]"
            >
              {ex.length > 56 ? ex.slice(0, 53) + "…" : ex}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={generate} disabled={loading || saving} className="w-full sm:w-auto">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate widget</>}
          </Button>
        </div>

        {draft && (
          <Card className="bg-background">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{draft.widget_type}</Badge>
                <CardTitle className="text-base">{draft.name}</CardTitle>
              </div>
              {draft.rationale && (
                <CardDescription className="mt-2">{draft.rationale}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
                  View generated config
                </summary>
                <pre className="mt-2 p-3 rounded-md bg-muted overflow-auto text-[11px] max-h-64">
                  {JSON.stringify(draft.config, null, 2)}
                </pre>
              </details>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={accept} disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Create widget
                </Button>
                <Button variant="outline" onClick={() => setDraft(null)} disabled={saving} className="w-full sm:w-auto">
                  <X className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button variant="ghost" onClick={generate} disabled={loading || saving} className="w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 mr-2" /> Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
