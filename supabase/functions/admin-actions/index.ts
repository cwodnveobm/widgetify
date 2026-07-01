// Web Admin Dashboard backend.
// Mirrors the Telegram bot commands and runs every action with the
// service role, but only after verifying the caller is an admin.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

async function findUserByEmail(admin: ReturnType<typeof createClient>, email: string) {
  const { data } = await admin
    .from("profiles")
    .select("user_id, email, full_name")
    .ilike("email", email.trim())
    .limit(1)
    .maybeSingle();
  return data as { user_id: string; email: string; full_name: string | null } | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // 1. Validate caller's JWT.
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "missing token" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: "unauthorized" }, 401);

  // 2. Admin role check (via service role to avoid RLS).
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: role } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!role) return json({ error: "forbidden" }, 403);

  // 3. Dispatch action.
  let body: { action?: string; payload?: Record<string, unknown>; reauth_password?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const action = String(body.action ?? "");
  const p = (body.payload ?? {}) as Record<string, any>;

  // 3a. Sensitive actions require a fresh password re-authentication (2FA-style step-up).
  const SENSITIVE = new Set([
    "grant_premium", "revoke_premium", "add_credits",
    "delete_widget", "delete_lastset", "broadcast", "clear_announcements",
  ]);
  if (SENSITIVE.has(action)) {
    const pw = String(body.reauth_password ?? "");
    const email = userData.user.email;
    if (!pw || !email) {
      return json({ error: "reauth_required", message: "Password re-auth required for this action." }, 401);
    }
    const reauthClient = createClient(SUPABASE_URL, ANON_KEY);
    const { error: reauthErr } = await reauthClient.auth.signInWithPassword({ email, password: pw });
    if (reauthErr) {
      return json({ error: "reauth_failed", message: "Password re-authentication failed." }, 401);
    }
  }


  try {
    switch (action) {
      case "stats": {
        const [u, s, w, l, sm, ann] = await Promise.all([
          admin.from("profiles").select("*", { count: "exact", head: true }),
          admin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
          admin.from("embed_widgets").select("*", { count: "exact", head: true }),
          admin.from("lastset_profiles").select("*", { count: "exact", head: true }),
          admin.from("support_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
          admin.from("system_announcements").select("*", { count: "exact", head: true }).eq("active", true),
        ]);
        return json({
          users: u.count ?? 0,
          activeSubs: s.count ?? 0,
          widgets: w.count ?? 0,
          lastsetProfiles: l.count ?? 0,
          openSupport: sm.count ?? 0,
          activeAnnouncements: ann.count ?? 0,
        });
      }

      case "list_users": {
        const limit = Math.min(Number(p.limit) || 25, 100);
        const search = String(p.search ?? "").trim();
        let q = admin
          .from("profiles")
          .select("user_id, email, full_name, created_at")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (search) q = q.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        const { data, error } = await q;
        if (error) throw error;
        return json({ users: data });
      }

      case "list_subscriptions": {
        const limit = Math.min(Number(p.limit) || 25, 100);
        const { data, error } = await admin
          .from("subscriptions")
          .select("id, user_id, plan_type, amount, currency, status, start_date, end_date, created_at")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        return json({ subscriptions: data });
      }

      case "list_support": {
        const limit = Math.min(Number(p.limit) || 25, 100);
        const { data, error } = await admin
          .from("support_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        return json({ messages: data });
      }

      case "list_announcements": {
        const { data, error } = await admin
          .from("system_announcements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) throw error;
        return json({ announcements: data });
      }

      case "grant_premium": {
        const email = String(p.email ?? "").trim();
        const days = Math.min(Math.max(Number(p.days) || 30, 1), 365);
        if (!email) return json({ error: "email required" }, 400);
        const user = await findUserByEmail(admin, email);
        if (!user) return json({ error: "user not found" }, 404);
        const { error } = await admin.from("subscriptions").insert({
          user_id: user.user_id,
          amount: 0,
          currency: "INR",
          plan_type: "premium",
          status: "active",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + days * 86400000).toISOString(),
        });
        if (error) throw error;
        return json({ ok: true, message: `Granted ${days}-day premium to ${email}` });
      }

      case "revoke_premium": {
        const email = String(p.email ?? "").trim();
        if (!email) return json({ error: "email required" }, 400);
        const user = await findUserByEmail(admin, email);
        if (!user) return json({ error: "user not found" }, 404);
        const { error } = await admin
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", user.user_id)
          .eq("status", "active");
        if (error) throw error;
        return json({ ok: true, message: `Revoked premium from ${email}` });
      }

      case "add_credits": {
        const email = String(p.email ?? "").trim();
        const amount = Math.trunc(Number(p.amount));
        if (!email || !Number.isFinite(amount) || amount === 0)
          return json({ error: "email and non-zero amount required" }, 400);
        const user = await findUserByEmail(admin, email);
        if (!user) return json({ error: "user not found" }, 404);
        await admin.from("user_credits").upsert({ user_id: user.user_id }, { onConflict: "user_id" });
        const { data: cur } = await admin
          .from("user_credits")
          .select("balance")
          .eq("user_id", user.user_id)
          .maybeSingle();
        const newBal = Number(cur?.balance ?? 0) + amount;
        const { error } = await admin
          .from("user_credits")
          .update({ balance: newBal })
          .eq("user_id", user.user_id);
        if (error) throw error;
        return json({ ok: true, message: `${email} balance: ${newBal}` });
      }

      case "notify_user": {
        const email = String(p.email ?? "").trim();
        const title = String(p.title ?? "Message from admin").slice(0, 120);
        const message = String(p.message ?? "").trim().slice(0, 2000);
        if (!email || !message) return json({ error: "email and message required" }, 400);
        const user = await findUserByEmail(admin, email);
        if (!user) return json({ error: "user not found" }, 404);
        const { error } = await admin
          .from("user_notifications")
          .insert({ user_id: user.user_id, title, message });
        if (error) throw error;
        return json({ ok: true, message: `Notified ${email}` });
      }

      case "broadcast": {
        const message = String(p.message ?? "").trim().slice(0, 500);
        const level = ["info", "success", "warning", "error"].includes(String(p.level))
          ? String(p.level)
          : "info";
        const days = Math.min(Math.max(Number(p.days) || 7, 1), 60);
        if (!message) return json({ error: "message required" }, 400);
        const { error, data } = await admin
          .from("system_announcements")
          .insert({
            message,
            level,
            active: true,
            created_by: userData.user.email ?? "admin",
            expires_at: new Date(Date.now() + days * 86400000).toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        return json({ ok: true, announcement: data });
      }

      case "deactivate_announcement": {
        const id = String(p.id ?? "");
        if (!id) return json({ error: "id required" }, 400);
        const { error } = await admin
          .from("system_announcements")
          .update({ active: false })
          .eq("id", id);
        if (error) throw error;
        return json({ ok: true });
      }

      case "clear_announcements": {
        const { error, count } = await admin
          .from("system_announcements")
          .update({ active: false }, { count: "exact" })
          .eq("active", true);
        if (error) throw error;
        return json({ ok: true, cleared: count ?? 0 });
      }

      case "send_expiry_reminders": {
        const cutoff = new Date(Date.now() + 3 * 86400000).toISOString();
        const { data } = await admin
          .from("subscriptions")
          .select("user_id, end_date")
          .eq("status", "active")
          .lte("end_date", cutoff);
        if (!data?.length) return json({ ok: true, sent: 0 });
        const rows = data.map((s: any) => ({
          user_id: s.user_id,
          title: "Subscription expiring soon",
          message: `Your premium expires on ${String(s.end_date).slice(0, 10)}. Renew to keep your benefits.`,
        }));
        const { error } = await admin.from("user_notifications").insert(rows);
        if (error) throw error;
        return json({ ok: true, sent: rows.length });
      }

      case "delete_widget": {
        const id = String(p.id ?? "");
        if (!id) return json({ error: "id required" }, 400);
        const { error } = await admin.from("embed_widgets").delete().eq("id", id);
        if (error) throw error;
        return json({ ok: true });
      }

      case "delete_lastset": {
        const username = String(p.username ?? "").trim();
        if (!username) return json({ error: "username required" }, 400);
        const { error } = await admin.from("lastset_profiles").delete().eq("username", username);
        if (error) throw error;
        return json({ ok: true });
      }

      case "update_support_status": {
        const id = String(p.id ?? "");
        const status = ["open", "in_progress", "resolved"].includes(String(p.status))
          ? String(p.status)
          : "resolved";
        if (!id) return json({ error: "id required" }, 400);
        const { error } = await admin
          .from("support_messages")
          .update({ status })
          .eq("id", id);
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: `unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error("admin-actions", action, e);
    return json({ error: (e as Error).message }, 500);
  }
});
