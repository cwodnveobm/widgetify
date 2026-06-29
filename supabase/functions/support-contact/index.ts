import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function notifyAdmin(event: string, data: Record<string, unknown>): void {
  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-admin`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: Deno.env.get("SUPABASE_ANON_KEY") ?? "" },
    body: JSON.stringify({ event, data }),
  }).catch((e) => console.error("notify-admin failed", e));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    const { data, error } = await supabase.from("support_messages")
      .insert({ user_id: userId, name, email, subject, message })
      .select().single();
    if (error) throw error;

    notifyAdmin("📩 Support Message", {
      id: data.id, name, email, subject, message,
      user_id: userId ?? "guest",
    });

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
