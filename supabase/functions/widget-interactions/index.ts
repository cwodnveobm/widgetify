// Public interaction tracker: POST /widget-interactions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_EVENTS = new Set([
  "view", "click", "submit", "open", "close", "trigger_fired", "chat_message",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return json({ error: "Invalid body" }, 400);

    const widget_id = String(body.widget_id ?? "");
    const event_type = String(body.event_type ?? "");
    const event_data = body.event_data ?? {};
    const session_id = body.session_id ? String(body.session_id).slice(0, 64) : null;
    const referrer = body.referrer ? String(body.referrer).slice(0, 500) : null;

    if (!/^[0-9a-f-]{36}$/i.test(widget_id)) return json({ error: "Invalid widget_id" }, 400);
    if (!ALLOWED_EVENTS.has(event_type)) return json({ error: "Invalid event_type" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify widget exists and is active (cheap guard)
    const { data: w } = await supabase
      .from("embed_widgets")
      .select("id")
      .eq("id", widget_id)
      .eq("is_active", true)
      .maybeSingle();
    if (!w) return json({ error: "Widget not found" }, 404);

    const ua = req.headers.get("user-agent")?.slice(0, 300) ?? null;

    await supabase.from("widget_interactions").insert({
      widget_id,
      event_type,
      event_data,
      session_id,
      referrer,
      user_agent: ua,
    });

    return json({ ok: true });
  } catch {
    return json({ ok: true }); // silent failure for tracking
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
