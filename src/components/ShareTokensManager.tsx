import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Plus, Trash2, KeyRound, Clock } from "lucide-react";

interface ShareToken {
  id: string;
  widget_id: string;
  token: string;
  label: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
  use_count: number;
  created_at: string;
}

const EXPIRY_OPTIONS = [
  { value: "0", label: "Never expires" },
  { value: "1", label: "1 day" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
];

export function ShareTokensManager({ widgetId }: { widgetId: string }) {
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [expiryDays, setExpiryDays] = useState("30");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("embed_widget_share_tokens" as never)
      .select("*")
      .eq("widget_id", widgetId)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setTokens((data ?? []) as ShareToken[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [widgetId]);

  function shareUrl(token: string) {
    return `${window.location.origin}/w/${widgetId}?token=${token}`;
  }

  async function createToken() {
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreating(false); return; }
    const days = Number(expiryDays);
    const expires_at = days > 0 ? new Date(Date.now() + days * 86400_000).toISOString() : null;
    const { error } = await supabase
      .from("embed_widget_share_tokens" as never)
      .insert([{
        widget_id: widgetId,
        user_id: user.id,
        label: label.trim() || null,
        expires_at,
      } as never]);
    setCreating(false);
    if (error) return toast.error(error.message);
    setLabel("");
    toast.success("Private share link created");
    await load();
  }

  async function revoke(id: string) {
    if (!confirm("Revoke this share link? Anyone using it will lose access immediately.")) return;
    const { error } = await supabase
      .from("embed_widget_share_tokens" as never)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Link revoked");
    await load();
  }

  function copy(token: string) {
    navigator.clipboard.writeText(shareUrl(token));
    toast.success("Private link copied");
  }

  function isExpired(t: ShareToken) {
    return t.expires_at != null && new Date(t.expires_at).getTime() < Date.now();
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm">Private share links</h4>
        <Badge variant="outline" className="ml-auto text-xs">{tokens.length}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Share with specific people without making the widget public. Each link can be revoked anytime.
      </p>

      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
        <div>
          <Label className="text-xs">Label (optional)</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Acme Corp review"
            maxLength={80}
          />
        </div>
        <div>
          <Label className="text-xs">Expires</Label>
          <Select value={expiryDays} onValueChange={setExpiryDays}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EXPIRY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={createToken} disabled={creating} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Generate
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : tokens.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No private links yet.</p>
      ) : (
        <div className="space-y-2">
          {tokens.map((t) => {
            const expired = isExpired(t);
            return (
              <div key={t.id} className="border rounded-md p-3 bg-background space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{t.label || "Untitled link"}</span>
                  {expired ? (
                    <Badge variant="destructive" className="text-xs">Expired</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-green-500/50 text-green-700 dark:text-green-400">Active</Badge>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" />
                    {t.expires_at ? `Expires ${new Date(t.expires_at).toLocaleDateString()}` : "No expiry"}
                  </span>
                </div>
                <Input
                  readOnly
                  value={shareUrl(t.token)}
                  className="font-mono text-xs"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Used {t.use_count}× </span>
                  {t.last_used_at && <span>· last {new Date(t.last_used_at).toLocaleString()}</span>}
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copy(t.token)} disabled={expired}>
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => revoke(t.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
