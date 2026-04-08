import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // User client for auth
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for DB writes
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_type, amount } = await req.json();

    // Verify signature
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const key = new TextEncoder().encode(RAZORPAY_KEY_SECRET);
    const data = new TextEncoder().encode(message);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const expectedSignature = new TextDecoder().decode(hexEncode(new Uint8Array(signatureBuffer)));

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Payment verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Upsert subscription
    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan_type,
        status: "active",
        amount,
        currency: "INR",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
      }, { onConflict: "user_id" });

    if (subError) {
      // If upsert fails (no unique constraint on user_id), try insert
      const { error: insertError } = await supabaseAdmin
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_type,
          status: "active",
          amount,
          currency: "INR",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        });
      
      if (insertError) {
        throw new Error(`Subscription creation failed: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, plan_type }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
