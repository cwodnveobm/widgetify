import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Trash2, Plus, Code2, Activity, Link as LinkIcon, ExternalLink, Lock, Globe } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { InteractionDashboard } from "@/components/InteractionDashboard";
import { EmbedDocs } from "@/components/EmbedDocs";
import { ShareTokensManager } from "@/components/ShareTokensManager";

type WidgetType = "popup" | "lead-form" | "ai-chat";

interface EmbedWidget {
  id: string;
  name: string;
  widget_type: WidgetType;
  config: Record<string, unknown>;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
}

const DEFAULT_CONFIG: Record<WidgetType, Record<string, unknown>> = {
  popup: {
    title: "Welcome!",
    description: "Subscribe to get exclusive updates.",
    ctaText: "Get Started",
    ctaUrl: "https://example.com",
    cooldownMinutes: 1440,
    triggers: { timeDelay: 5, exitIntent: true, scrollPercent: 50 },
  },
  "lead-form": {
    title: "Get in touch",
    description: "Leave your details and we'll reach out.",
    submitText: "Submit",
    successMessage: "Thanks! We'll be in touch soon.",
  },
  "ai-chat": {
    title: "Chat with us",
    welcomeMessage: "Hi there! How can I help you today?",
    systemPrompt: "You are a friendly support assistant. Be concise and helpful.",
    model: "google/gemini-2.5-flash",
  },
};

export default function EmbedWidgets() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<EmbedWidget[]>([]);
  const [interactionCounts, setInteractionCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<EmbedWidget | null>(null);
  const [creating, setCreating] = useState(false);
  const [newType, setNewType] = useState<WidgetType>("popup");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/dashboard");
        return;
      }
      await loadWidgets();
      setLoading(false);
    })();
  }, [navigate]);

  async function loadWidgets() {
    const { data } = await supabase
      .from("embed_widgets")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (data ?? []) as EmbedWidget[];
    setWidgets(list);
    if (list.length) {
      const { data: counts } = await supabase
        .from("widget_interactions")
        .select("widget_id")
        .in("widget_id", list.map((w) => w.id));
      const tally: Record<string, number> = {};
      (counts ?? []).forEach((row: { widget_id: string }) => {
        tally[row.widget_id] = (tally[row.widget_id] ?? 0) + 1;
      });
      setInteractionCounts(tally);
    }
  }

  async function createWidget() {
    if (!newName.trim()) return toast.error("Name is required");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("embed_widgets")
      .insert([{
        user_id: user.id,
        name: newName.trim(),
        widget_type: newType,
        config: DEFAULT_CONFIG[newType] as never,
      }])
      .select()
      .single();
    if (error) return toast.error(error.message);
    toast.success("Widget created");
    setCreating(false);
    setNewName("");
    await loadWidgets();
    setEditing(data as EmbedWidget);
  }

  async function saveWidget(w: EmbedWidget) {
    const { error } = await supabase
      .from("embed_widgets")
      .update({ name: w.name, config: w.config as never, is_active: w.is_active, is_public: w.is_public })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    await loadWidgets();
  }

  async function deleteWidget(id: string) {
    if (!confirm("Delete this widget? This cannot be undone.")) return;
    const { error } = await supabase.from("embed_widgets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setEditing(null);
    await loadWidgets();
  }

  function snippet(id: string) {
    return `<script async src="${window.location.origin}/embed.js" data-id="${id}"></script>`;
  }

  function shareUrl(id: string) {
    return `${window.location.origin}/w/${id}`;
  }

  function copySnippet(id: string) {
    navigator.clipboard.writeText(snippet(id));
    toast.success("Snippet copied to clipboard");
  }

  function copyLink(w: EmbedWidget) {
    if (!w.is_public) {
      toast.error("This widget is private — enable public sharing first");
      return;
    }
    navigator.clipboard.writeText(shareUrl(w.id));
    toast.success("Shareable link copied");
  }

  async function togglePublic(w: EmbedWidget) {
    const next = !w.is_public;
    const { error } = await supabase
      .from("embed_widgets")
      .update({ is_public: next })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Widget is now public" : "Widget is now private");
    setWidgets((ws) => ws.map((x) => (x.id === w.id ? { ...x, is_public: next } : x)));
    if (editing?.id === w.id) setEditing({ ...editing, is_public: next });
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <>
      <SEOHead title="Embed Widgets — Widgetify" description="Manage universal embed widgets: popups, lead forms, AI chat." />
      <Navigation />
      <main className="container mx-auto px-4 py-10 max-w-6xl min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Embed Widgets</h1>
            <p className="text-muted-foreground mt-1">
              One async script. Three widget types. Drop into any site.
            </p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Widget
          </Button>
        </div>

        {creating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Homepage popup" maxLength={100} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as WidgetType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popup">Popup (with triggers)</SelectItem>
                    <SelectItem value="lead-form">Lead Form</SelectItem>
                    <SelectItem value="ai-chat">AI Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createWidget}>Create</Button>
                <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {widgets.length === 0 && !creating && (
          <Card className="text-center py-16">
            <CardContent>
              <Code2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No widgets yet</h3>
              <p className="text-muted-foreground mb-4">Create your first universal embed widget.</p>
              <Button onClick={() => setCreating(true)}><Plus className="w-4 h-4 mr-2" /> Create widget</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {widgets.map((w) => (
            <Card key={w.id} className={editing?.id === w.id ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{w.name}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 mt-1 items-center">
                      <Badge variant="outline">{w.widget_type}</Badge>
                      {w.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                      {w.is_public ? (
                        <Badge variant="outline" className="border-green-500/50 text-green-700 dark:text-green-400">
                          <Globe className="w-3 h-3 mr-1" /> Public link
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
                          <Lock className="w-3 h-3 mr-1" /> Private
                        </Badge>
                      )}
                      <span className="text-xs flex items-center gap-1"><Activity className="w-3 h-3" /> {interactionCounts[w.id] ?? 0}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="default" onClick={() => copyLink(w)} disabled={!w.is_public} title={!w.is_public ? "Enable public sharing first" : undefined}>
                    <LinkIcon className="w-3.5 h-3.5 mr-1" /> Copy link
                  </Button>
                  {w.is_public ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={shareUrl(w.id)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Preview
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled title="Enable public sharing first">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Preview
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => togglePublic(w)}>
                    {w.is_public ? <><Lock className="w-3.5 h-3.5 mr-1" /> Make private</> : <><Globe className="w-3.5 h-3.5 mr-1" /> Make public</>}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => copySnippet(w.id)}>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Snippet
                  </Button>
                  <Button size="sm" onClick={() => setEditing(editing?.id === w.id ? null : w)}>
                    {editing?.id === w.id ? "Close" : "Configure"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteWidget(w.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
                {w.is_public ? (
                  <p className="text-xs text-muted-foreground font-mono truncate" title={shareUrl(w.id)}>
                    {shareUrl(w.id)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Public link disabled. Generate a private share link below to share with specific people.
                  </p>
                )}
                {editing?.id === w.id && (
                  <ConfigEditor widget={editing} onChange={setEditing} onSave={saveWidget} shareUrl={shareUrl(w.id)} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {widgets.length > 0 && (
          <div className="mt-10 space-y-6">
            <InteractionDashboard widgets={widgets.map((w) => ({ id: w.id, name: w.name, widget_type: w.widget_type }))} />
            <EmbedDocs />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function ConfigEditor({
  widget,
  onChange,
  onSave,
  shareUrl,
}: {
  widget: EmbedWidget;
  onChange: (w: EmbedWidget) => void;
  onSave: (w: EmbedWidget) => void;
  shareUrl?: string;
}) {
  const cfg = widget.config as Record<string, unknown>;
  function setCfg(patch: Record<string, unknown>) {
    onChange({ ...widget, config: { ...cfg, ...patch } });
  }
  function setTriggers(patch: Record<string, unknown>) {
    const t = (cfg.triggers as Record<string, unknown>) ?? {};
    onChange({ ...widget, config: { ...cfg, triggers: { ...t, ...patch } } });
  }
  const triggers = (cfg.triggers as Record<string, unknown>) ?? {};

  return (
    <div className="border-t pt-4 mt-4 space-y-4">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          {widget.widget_type === "popup" && <TabsTrigger value="triggers">Triggers</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-3 pt-3">
          <div>
            <Label>Name</Label>
            <Input value={widget.name} onChange={(e) => onChange({ ...widget, name: e.target.value })} maxLength={100} />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={String(cfg.title ?? "")} onChange={(e) => setCfg({ title: e.target.value })} maxLength={120} />
          </div>
          {widget.widget_type === "popup" && (
            <>
              <div>
                <Label>Description</Label>
                <Textarea value={String(cfg.description ?? "")} onChange={(e) => setCfg({ description: e.target.value })} maxLength={500} />
              </div>
              <div>
                <Label>CTA text</Label>
                <Input value={String(cfg.ctaText ?? "")} onChange={(e) => setCfg({ ctaText: e.target.value })} maxLength={40} />
              </div>
              <div>
                <Label>CTA URL</Label>
                <Input value={String(cfg.ctaUrl ?? "")} onChange={(e) => setCfg({ ctaUrl: e.target.value })} placeholder="https://…" maxLength={500} />
              </div>
            </>
          )}
          {widget.widget_type === "lead-form" && (
            <>
              <div>
                <Label>Description</Label>
                <Textarea value={String(cfg.description ?? "")} onChange={(e) => setCfg({ description: e.target.value })} maxLength={500} />
              </div>
              <div>
                <Label>Submit text</Label>
                <Input value={String(cfg.submitText ?? "")} onChange={(e) => setCfg({ submitText: e.target.value })} maxLength={40} />
              </div>
              <div>
                <Label>Success message</Label>
                <Input value={String(cfg.successMessage ?? "")} onChange={(e) => setCfg({ successMessage: e.target.value })} maxLength={200} />
              </div>
            </>
          )}
          {widget.widget_type === "ai-chat" && (
            <>
              <div>
                <Label>Welcome message</Label>
                <Input value={String(cfg.welcomeMessage ?? "")} onChange={(e) => setCfg({ welcomeMessage: e.target.value })} maxLength={300} />
              </div>
              <div>
                <Label>System prompt</Label>
                <Textarea value={String(cfg.systemPrompt ?? "")} onChange={(e) => setCfg({ systemPrompt: e.target.value })} rows={4} maxLength={2000} />
              </div>
              <div>
                <Label>Model</Label>
                <Select value={String(cfg.model ?? "google/gemini-2.5-flash")} onValueChange={(v) => setCfg({ model: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash (fast, free)</SelectItem>
                    <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro (smart)</SelectItem>
                    <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </TabsContent>

        {widget.widget_type === "popup" && (
          <TabsContent value="triggers" className="space-y-3 pt-3">
            <div>
              <Label>Time delay (seconds)</Label>
              <Input type="number" min={0} value={Number(triggers.timeDelay ?? 0)} onChange={(e) => setTriggers({ timeDelay: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Scroll percentage (0–100)</Label>
              <Input type="number" min={0} max={100} value={Number(triggers.scrollPercent ?? 0)} onChange={(e) => setTriggers({ scrollPercent: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={Boolean(triggers.exitIntent)} onCheckedChange={(v) => setTriggers({ exitIntent: v })} />
              <Label>Exit intent (desktop)</Label>
            </div>
            <div>
              <Label>Cooldown (minutes between shows)</Label>
              <Input type="number" min={0} value={Number(cfg.cooldownMinutes ?? 1440)} onChange={(e) => setCfg({ cooldownMinutes: Number(e.target.value) })} />
            </div>
          </TabsContent>
        )}

        <TabsContent value="settings" className="space-y-4 pt-3">
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border">
            <div>
              <Label className="text-sm">Widget active</Label>
              <p className="text-xs text-muted-foreground">Inactive widgets won't render anywhere.</p>
            </div>
            <Switch checked={widget.is_active} onCheckedChange={(v) => onChange({ ...widget, is_active: v })} />
          </div>

          {/* Display mode: inline vs floating */}
          <div className="p-3 rounded-lg border space-y-3">
            <div>
              <Label className="text-sm">Display mode</Label>
              <p className="text-xs text-muted-foreground">Choose how the widget appears on the host page.</p>
            </div>
            <Select
              value={String(cfg.display ?? "floating")}
              onValueChange={(v) => setCfg({ display: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="floating">Floating (fixed corner / overlay)</SelectItem>
                <SelectItem value="inline">Inline (mounted into host element)</SelectItem>
              </SelectContent>
            </Select>
            {String(cfg.display ?? "floating") === "inline" && (
              <p className="text-xs text-muted-foreground">
                Add <code className="font-mono px-1 bg-muted rounded">{`<div data-widgetify-mount="${widget.id}"></div>`}</code> on the host page where you want it to appear.
              </p>
            )}
          </div>

          {/* Auto-open / popup */}
          {(widget.widget_type === "lead-form" || widget.widget_type === "ai-chat") && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border">
              <div>
                <Label className="text-sm">Auto-open on page load</Label>
                <p className="text-xs text-muted-foreground">
                  Pops the widget open automatically (after a short delay) instead of waiting for a click.
                </p>
              </div>
              <Switch
                checked={Boolean(cfg.autoOpen)}
                onCheckedChange={(v) => setCfg({ autoOpen: v })}
              />
            </div>
          )}
          {(widget.widget_type === "lead-form" || widget.widget_type === "ai-chat") && Boolean(cfg.autoOpen) && (
            <div>
              <Label>Auto-open delay (seconds)</Label>
              <Input
                type="number"
                min={0}
                value={Number(cfg.autoOpenDelay ?? 2)}
                onChange={(e) => setCfg({ autoOpenDelay: Number(e.target.value) })}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border">
            <div>
              <Label className="text-sm flex items-center gap-2">
                {widget.is_public ? <Globe className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
                Public shareable link
              </Label>
              <p className="text-xs text-muted-foreground">
                {widget.is_public
                  ? "Anyone with the /w/ link can preview this widget."
                  : "Link is disabled. Only the embed snippet on your own sites will work."}
              </p>
            </div>
            <Switch checked={widget.is_public} onCheckedChange={(v) => onChange({ ...widget, is_public: v })} />
          </div>
          {shareUrl && widget.is_public && (
            <div>
              <Label>Shareable preview link</Label>
              <Input readOnly value={shareUrl} className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
              <p className="text-xs text-muted-foreground mt-1">
                Anyone with this link can interact with the widget — no script install needed.
              </p>
            </div>
          )}
          <ShareTokensManager widgetId={widget.id} />

          {/* Multi-format embed snippets */}
          <div className="space-y-3 pt-2">
            <Label className="text-base">Embed formats</Label>

            <div>
              <Label className="text-xs text-muted-foreground">JavaScript SDK (recommended)</Label>
              <Textarea
                readOnly
                rows={2}
                className="font-mono text-xs"
                value={`<script async src="${window.location.origin}/embed.js" data-id="${widget.id}"></script>`}
              />
            </div>

            {String(cfg.display ?? "floating") === "inline" && (
              <div>
                <Label className="text-xs text-muted-foreground">Inline mount target</Label>
                <Textarea
                  readOnly
                  rows={1}
                  className="font-mono text-xs"
                  value={`<div data-widgetify-mount="${widget.id}"></div>`}
                />
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">iFrame</Label>
              <Textarea
                readOnly
                rows={2}
                className="font-mono text-xs"
                value={`<iframe src="${window.location.origin}/embed/${widget.id}" style="border:0;width:100%;height:560px" loading="lazy" title="${widget.name}"></iframe>`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Best for sandboxed CMS / Notion / no-script environments. Requires public sharing or a token URL.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button className="w-full" onClick={() => onSave(widget)}>Save changes</Button>
    </div>
  );
}
