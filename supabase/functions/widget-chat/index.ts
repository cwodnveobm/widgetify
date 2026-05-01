// Floating AI chat backend with short-term memory.
// POST { widget_id, session_id, message } -> { reply }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_MEMORY = 16; // last N messages kept

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return json({ error: "Invalid body" }, 400);

    const widget_id = String(body.widget_id ?? "");
    const session_id = String(body.session_id ?? "").slice(0, 64);
    const message = String(body.message ?? "").slice(0, 2000);

    if (!/^[0-9a-f-]{36}$/i.test(widget_id)) return json({ error: "Invalid widget_id" }, 400);
    if (!session_id || !message) return json({ error: "Missing fields" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: widget } = await supabase
      .from("embed_widgets")
      .select("id, config, widget_type")
      .eq("id", widget_id)
      .eq("is_active", true)
      .maybeSingle();
    if (!widget || widget.widget_type !== "ai-chat") return json({ error: "Widget not found" }, 404);

    const cfg = (widget.config ?? {}) as Record<string, unknown>;
    const systemPrompt = String(cfg.systemPrompt ?? "You are a helpful assistant for this website. Be concise and friendly.");
    const model = String(cfg.model ?? "google/gemini-2.5-flash");

    // Load short-term memory
    const { data: session } = await supabase
      .from("embed_chat_sessions")
      .select("messages")
      .eq("widget_id", widget_id)
      .eq("session_id", session_id)
      .maybeSingle();

    const history: Array<{ role: string; content: string }> = Array.isArray(session?.messages)
      ? (session!.messages as Array<{ role: string; content: string }>)
      : [];

    history.push({ role: "user", content: message });
    const trimmed = history.slice(-MAX_MEMORY);

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...trimmed],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error", aiRes.status, txt);
      if (aiRes.status === 429) return json({ error: "Rate limited, try again shortly." }, 429);
      if (aiRes.status === 402) return json({ error: "AI credits exhausted." }, 402);
      return json({ error: "AI request failed" }, 500);
    }

    const aiJson = await aiRes.json();
    const reply = aiJson?.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond.";

    const newHistory = [...trimmed, { role: "assistant", content: reply }].slice(-MAX_MEMORY);

    await supabase
      .from("embed_chat_sessions")
      .upsert(
        { widget_id, session_id, messages: newHistory, expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString() },
        { onConflict: "widget_id,session_id" },
      );

    return json({ reply });
  } catch (e) {
    console.error(e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
