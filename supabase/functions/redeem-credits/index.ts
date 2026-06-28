// Server-side credit redemption: marks credits redeemed and records a transaction.
// The payout_request row itself is still inserted client-side (its RLS allows
// the user to insert their own pending requests).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authErr } = await userClient.auth.getClaims(token);
    if (authErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => null) as
      | { credits_to_redeem?: number; rupees?: number }
      | null;
    const creditsToRedeem = Number(body?.credits_to_redeem);
    const rupees = Number(body?.rupees);
    if (!Number.isFinite(creditsToRedeem) || creditsToRedeem <= 0) {
      return json({ error: "Invalid credits_to_redeem" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: credits } = await admin
      .from("user_credits")
      .select("total_credits, redeemed_credits")
      .eq("user_id", userId)
      .maybeSingle();
    if (!credits) return json({ error: "No credits record" }, 400);

    const available = Number(credits.total_credits) - Number(credits.redeemed_credits);
    if (creditsToRedeem > available + 1e-9) {
      return json({ error: "Insufficient credits" }, 400);
    }

    const newRedeemed = Number(credits.redeemed_credits) + creditsToRedeem;
    const { error: upErr } = await admin
      .from("user_credits")
      .update({ redeemed_credits: newRedeemed })
      .eq("user_id", userId);
    if (upErr) return json({ error: upErr.message }, 500);

    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount: -creditsToRedeem,
      transaction_type: "redeemed",
      description: `Redeemed ${creditsToRedeem} credits${
        Number.isFinite(rupees) ? ` for ₹${rupees}` : ""
      }`,
    });

    return json({ ok: true });
  } catch (e) {
    console.error("redeem-credits error", e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
