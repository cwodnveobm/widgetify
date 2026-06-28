// Server-side referral credit processing.
// Called after a new user signs up with a referral code in their session.
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
    const userEmail = (claims.claims.email as string | undefined) ?? null;

    const body = await req.json().catch(() => null) as { referral_code?: string } | null;
    const referralCode = String(body?.referral_code ?? "").trim().slice(0, 64);
    if (!referralCode) return json({ error: "Missing referral_code" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: referral } = await admin
      .from("referrals")
      .select("id, referrer_id, status")
      .eq("referral_code", referralCode)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (!referral) return json({ ok: true, credited: false });
    if (referral.referrer_id === userId) return json({ ok: true, credited: false });

    await admin
      .from("referrals")
      .update({
        status: "signed_up",
        referred_user_id: userId,
        converted_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    // Ensure credits row exists
    await admin.from("user_credits").upsert(
      { user_id: referral.referrer_id },
      { onConflict: "user_id", ignoreDuplicates: true },
    );

    const { data: credits } = await admin
      .from("user_credits")
      .select("total_credits, total_referrals")
      .eq("user_id", referral.referrer_id)
      .maybeSingle();
    if (!credits) return json({ ok: true, credited: false });

    const { data: tier } = await admin
      .from("referral_tiers")
      .select("credits_per_referral")
      .lte("min_referrals", credits.total_referrals)
      .order("min_referrals", { ascending: false })
      .limit(1)
      .maybeSingle();
    const perReferral = Number(tier?.credits_per_referral ?? 0.005);

    await admin
      .from("user_credits")
      .update({
        total_credits: Number(credits.total_credits) + perReferral,
        total_referrals: credits.total_referrals + 1,
      })
      .eq("user_id", referral.referrer_id);

    await admin
      .from("referrals")
      .update({ status: "credited", credited_at: new Date().toISOString() })
      .eq("id", referral.id);

    await admin.from("credit_transactions").insert({
      user_id: referral.referrer_id,
      amount: perReferral,
      transaction_type: "earned",
      description: `Referral signup${userEmail ? `: ${userEmail}` : ""}`,
      referral_id: referral.id,
    });

    return json({ ok: true, credited: true, amount: perReferral });
  } catch (e) {
    console.error("award-referral-credits error", e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
