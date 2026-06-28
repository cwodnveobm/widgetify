// Sends an admin notification to Telegram via the Lovable connector gateway.
// Public endpoint (verify_jwt=false) so it can be invoked from other edge
// functions, webhooks, or the client without a session. Treat the `event`
// and `data` payload as informational only.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMessage(event: string, data: Record<string, unknown>): string {
  const lines = [`<b>🔔 ${escapeHtml(event)}</b>`];
  for (const [k, v] of Object.entries(data ?? {})) {
    if (v === null || v === undefined || v === "") continue;
    const val = typeof v === "object" ? JSON.stringify(v) : String(v);
    lines.push(`<b>${escapeHtml(k)}:</b> ${escapeHtml(val)}`);
  }
  lines.push(`<i>${new Date().toISOString()}</i>`);
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !CHAT_ID) {
      return new Response(
        JSON.stringify({
          error: "Telegram admin notifications not fully configured",
          missing: {
            LOVABLE_API_KEY: !LOVABLE_API_KEY,
            TELEGRAM_API_KEY: !TELEGRAM_API_KEY,
            TELEGRAM_ADMIN_CHAT_ID: !CHAT_ID,
          },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const event = typeof body.event === "string" ? body.event : "Notification";
    const data = (body.data && typeof body.data === "object") ? body.data : {};
    const text = formatMessage(event, data);

    const tg = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const tgBody = await tg.json().catch(() => ({}));
    if (!tg.ok) {
      console.error("Telegram API error", tg.status, tgBody);
      return new Response(
        JSON.stringify({ error: "Telegram send failed", status: tg.status, details: tgBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message_id: tgBody?.result?.message_id ?? null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("notify-admin error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
