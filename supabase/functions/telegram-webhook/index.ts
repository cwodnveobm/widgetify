// Telegram Admin Bot — receives commands and executes admin actions.
// Only messages from TELEGRAM_ADMIN_CHAT_ID are accepted.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

async function sendMessage(chatId: number | string, text: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return;
  // Telegram has a 4096 char limit — chunk long replies.
  const chunks: string[] = [];
  let buf = text;
  while (buf.length > 3800) {
    const cut = buf.lastIndexOf("\n", 3800);
    const idx = cut > 1000 ? cut : 3800;
    chunks.push(buf.slice(0, idx));
    buf = buf.slice(idx);
  }
  chunks.push(buf);
  for (const c of chunks) {
    await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text: c, parse_mode: "HTML", disable_web_page_preview: true }),
    }).catch((e) => console.error("sendMessage", e));
  }
}

const HELP_TEXT = `<b>🤖 Widgetify Admin Bot</b>

<b>📊 Info & Monitoring</b>
/stats — platform counts
/health — db & function health
/revenue [days] — revenue in period (default 30)
/growth — weekly new signups
/find &lt;query&gt; — search users by email/name

<b>👤 User Details</b>
/user &lt;email&gt; — full profile snapshot
/users [n] — recent n users (default 10)
/subs [n] — recent subscriptions
/support [n] — recent support tickets
/notifs &lt;email&gt; — user's recent notifications

<b>🎁 User Actions</b>
/grant &lt;email&gt; [days] — grant premium (default 30)
/revoke &lt;email&gt; — revoke premium
/credits &lt;email&gt; &lt;amount&gt; — add credits (negative deducts)
/reset_credits &lt;email&gt; — zero out credits
/notify &lt;email&gt; | &lt;message&gt; — in-app notification
/suspend &lt;email&gt; — revoke premium + notify

<b>🏆 Creators</b>
/pending_creators — list pending applications
/approve_creator &lt;handle&gt; — approve
/reject_creator &lt;handle&gt; | &lt;reason&gt; — reject

<b>📈 Content</b>
/top_widgets [n] — most-used embed widgets
/top_lastset [n] — most-viewed bio profiles
/recent_widgets [n] — latest embed widgets
/recent_lastset [n] — latest bio profiles

<b>📣 Broadcast</b>
/broadcast &lt;message&gt; — banner (info)
/broadcast_warn &lt;message&gt; — warning banner
/broadcast_error &lt;message&gt; — critical banner
/announce_clear — remove active banners
/reminder — notify all expiring subs (≤3 days)
/notify_all &lt;title&gt; | &lt;message&gt; — in-app to every user

<b>🎫 Support</b>
/resolve_support &lt;id&gt; — mark ticket resolved
/reply_support &lt;id&gt; | &lt;message&gt; — reply + resolve

<b>🗑️ Delete</b>
/delete_widget &lt;id&gt;
/delete_lastset &lt;username&gt;

<b>🔧 Admin Roles</b>
/admins — list all admins
/make_admin &lt;email&gt; — grant admin role
/remove_admin &lt;email&gt; — revoke admin role

<b>💸 Payouts &amp; Referrals</b>
/payouts [n] — pending payout requests
/approve_payout &lt;id&gt; — mark payout paid
/reject_payout &lt;id&gt; | &lt;reason&gt;
/top_referrers [n]
/referrals &lt;email&gt; — user's referral stats

<b>🔗 LastSet Ops</b>
/lastset &lt;username&gt; — profile snapshot
/toggle_lastset &lt;username&gt; — flip public/private
/submissions &lt;username&gt; [n] — form submissions
/clicks &lt;username&gt; [n] — recent link clicks
/lastset_token &lt;username&gt; — generate share token
/revoke_lastset_tokens &lt;username&gt;

<b>🧩 Embed Widget Ops</b>
/widget &lt;id&gt; — widget snapshot
/toggle_widget &lt;id&gt; — flip public/private
/interactions &lt;widget_id&gt; [n]
/purge_interactions &lt;widget_id&gt; — clear analytics
/searchwidget &lt;query&gt;

<b>📣 Announcements &amp; Subs</b>
/banners — list active banners
/extend &lt;email&gt; &lt;days&gt; — extend active sub
/sub_status &lt;email&gt;
/webhooks [n] — active webhook subs
/revoke_webhook &lt;id&gt;

<b>🛠️ System</b>
/db — table row counts snapshot
/version — bot version

/help — this menu`;

async function findUserByEmail(admin: any, email: string) {
  const { data } = await admin
    .from("profiles")
    .select("user_id, email, full_name, created_at")
    .ilike("email", email.trim())
    .limit(1)
    .maybeSingle();
  return data;
}

function fmt(v: unknown) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

async function handleCommand(text: string, _chatId: number | string, admin: any): Promise<string> {
  const trimmed = text.trim();
  const [cmdRaw, ...rest] = trimmed.split(/\s+/);
  const cmd = cmdRaw.toLowerCase().split("@")[0];
  const args = rest.join(" ").trim();

  try {
    switch (cmd) {
      case "/start":
      case "/help":
        return HELP_TEXT;

      /* ============ Info & Monitoring ============ */
      case "/stats": {
        const [u, s, w, l, sm, ann, cv] = await Promise.all([
          admin.from("profiles").select("*", { count: "exact", head: true }),
          admin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
          admin.from("embed_widgets").select("*", { count: "exact", head: true }),
          admin.from("lastset_profiles").select("*", { count: "exact", head: true }),
          admin.from("support_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
          admin.from("system_announcements").select("*", { count: "exact", head: true }).eq("active", true),
          admin.from("creator_verifications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        ]);
        return `<b>📊 Stats</b>
Users: <b>${u.count ?? 0}</b>
Active subs: <b>${s.count ?? 0}</b>
Embed widgets: <b>${w.count ?? 0}</b>
LastSet profiles: <b>${l.count ?? 0}</b>
Open support: <b>${sm.count ?? 0}</b>
Live banners: <b>${ann.count ?? 0}</b>
Pending creators: <b>${cv.count ?? 0}</b>`;
      }

      case "/health": {
        const t0 = Date.now();
        const { error: e1 } = await admin.from("profiles").select("user_id").limit(1);
        const dbMs = Date.now() - t0;
        const gatewayOk = !!(Deno.env.get("LOVABLE_API_KEY") && Deno.env.get("TELEGRAM_API_KEY"));
        return `<b>🩺 Health</b>
DB read: ${e1 ? `❌ ${e1.message}` : `✅ ${dbMs}ms`}
Telegram gateway: ${gatewayOk ? "✅ configured" : "❌ missing key"}
Service role: ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "✅" : "❌"}
Uptime: ${new Date().toISOString()}`;
      }

      case "/revenue": {
        const days = Math.min(Math.max(parseInt(args) || 30, 1), 365);
        const since = new Date(Date.now() - days * 86400000).toISOString();
        const { data } = await admin
          .from("subscriptions")
          .select("amount, currency, created_at, status")
          .gte("created_at", since);
        const total = (data ?? []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
        const active = (data ?? []).filter((r: any) => r.status === "active").length;
        return `<b>💰 Revenue — last ${days}d</b>
Total: <b>₹${total.toFixed(0)}</b>
New subscriptions: <b>${data?.length ?? 0}</b>
Currently active from period: <b>${active}</b>`;
      }

      case "/growth": {
        const since = new Date(Date.now() - 7 * 86400000).toISOString();
        const [{ count: newUsers }, { count: newSubs }, { count: newWidgets }] = await Promise.all([
          admin.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", since),
          admin.from("subscriptions").select("*", { count: "exact", head: true }).gte("created_at", since),
          admin.from("embed_widgets").select("*", { count: "exact", head: true }).gte("created_at", since),
        ]);
        return `<b>📈 Last 7 days</b>
New users: <b>${newUsers ?? 0}</b>
New subs: <b>${newSubs ?? 0}</b>
New widgets: <b>${newWidgets ?? 0}</b>`;
      }

      case "/find": {
        if (!args) return "Usage: /find &lt;query&gt;";
        const { data } = await admin
          .from("profiles")
          .select("email, full_name")
          .or(`email.ilike.%${args}%,full_name.ilike.%${args}%`)
          .limit(15);
        if (!data?.length) return `No match for "${args}"`;
        return `<b>🔎 Matches (${data.length})</b>\n` +
          data.map((u: any) => `• ${u.email} — ${fmt(u.full_name)}`).join("\n");
      }

      /* ============ User Details ============ */
      case "/user": {
        if (!args) return "Usage: /user &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const [sub, cred, wc, lc] = await Promise.all([
          admin.from("subscriptions").select("plan_type, status, end_date").eq("user_id", user.user_id).eq("status", "active").maybeSingle(),
          admin.from("user_credits").select("total_credits, redeemed_credits").eq("user_id", user.user_id).maybeSingle(),
          admin.from("embed_widgets").select("*", { count: "exact", head: true }).eq("user_id", user.user_id),
          admin.from("lastset_profiles").select("*", { count: "exact", head: true }).eq("user_id", user.user_id),
        ]);
        return `<b>👤 ${fmt(user.full_name)}</b>
Email: ${user.email}
Joined: ${user.created_at?.slice(0, 10)}
Sub: ${sub.data ? `${sub.data.plan_type} → ${sub.data.end_date?.slice(0, 10) ?? "—"}` : "Free"}
Credits: ${cred.data ? `${Number(cred.data.total_credits ?? 0) - Number(cred.data.redeemed_credits ?? 0)} available` : "—"}
Widgets: ${wc.count ?? 0}
LastSet profiles: ${lc.count ?? 0}`;
      }

      case "/users": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("profiles").select("email, full_name, created_at").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No users.";
        return `<b>👥 Recent users</b>\n` + data.map((u: any) => `• ${u.email} — ${fmt(u.full_name)}`).join("\n");
      }

      case "/subs": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("subscriptions").select("user_id, amount, status, end_date").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No subscriptions.";
        return `<b>💳 Recent subs</b>\n` + data.map((s: any) => `• ₹${s.amount} ${s.status} → ${s.end_date?.slice(0, 10) ?? "—"}`).join("\n");
      }

      case "/support": {
        const n = Math.min(parseInt(args) || 5, 15);
        const { data } = await admin.from("support_messages").select("id, name, email, subject, status, created_at").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No messages.";
        return `<b>📩 Support</b>\n` + data.map((m: any) =>
          `• <code>${m.id.slice(0, 8)}</code> [${m.status}] ${m.name} (${m.email})\n  → ${m.subject}`
        ).join("\n\n");
      }

      case "/notifs": {
        if (!args) return "Usage: /notifs &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const { data } = await admin.from("user_notifications").select("title, message, created_at").eq("user_id", user.user_id).order("created_at", { ascending: false }).limit(10);
        if (!data?.length) return `No notifications for ${args}`;
        return `<b>🔔 ${args}</b>\n` + data.map((n: any) => `• ${n.title} — ${n.created_at?.slice(0, 10)}\n  ${n.message?.slice(0, 100)}`).join("\n\n");
      }

      /* ============ User Actions ============ */
      case "/grant": {
        const [email, dStr] = args.split(/\s+/);
        const days = Math.min(Math.max(parseInt(dStr) || 30, 1), 365);
        if (!email) return "Usage: /grant &lt;email&gt; [days]";
        const user = await findUserByEmail(admin, email);
        if (!user) return `User not found: ${email}`;
        const { error } = await admin.from("subscriptions").insert({
          user_id: user.user_id, amount: 0, currency: "INR", plan_type: "premium",
          status: "active", start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + days * 86400000).toISOString(),
        });
        if (error) return `Error: ${error.message}`;
        return `✅ Granted ${days}-day premium to ${email}`;
      }

      case "/revoke": {
        if (!args) return "Usage: /revoke &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const { error } = await admin.from("subscriptions").update({ status: "cancelled" }).eq("user_id", user.user_id).eq("status", "active");
        if (error) return `Error: ${error.message}`;
        return `✅ Revoked premium from ${args}`;
      }

      case "/suspend": {
        if (!args) return "Usage: /suspend &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        await admin.from("subscriptions").update({ status: "cancelled" }).eq("user_id", user.user_id).eq("status", "active");
        await admin.from("user_notifications").insert({
          user_id: user.user_id, title: "Account action",
          message: "Your premium subscription has been suspended. Contact support if you believe this is a mistake.",
        });
        return `🚫 Suspended ${args} and notified them`;
      }

      case "/credits": {
        const [email, amtStr] = args.split(/\s+/);
        const amt = parseInt(amtStr);
        if (!email || !Number.isFinite(amt) || amt === 0) return "Usage: /credits &lt;email&gt; &lt;amount&gt;";
        const user = await findUserByEmail(admin, email);
        if (!user) return `User not found: ${email}`;
        await admin.from("user_credits").upsert({ user_id: user.user_id }, { onConflict: "user_id" });
        const { data: cur } = await admin.from("user_credits").select("total_credits").eq("user_id", user.user_id).maybeSingle();
        const newBal = Number(cur?.total_credits ?? 0) + amt;
        const { error } = await admin.from("user_credits").update({ total_credits: newBal }).eq("user_id", user.user_id);
        if (error) return `Error: ${error.message}`;
        return `✅ ${email} now has ${newBal} total credits (${amt > 0 ? "+" : ""}${amt})`;
      }

      case "/reset_credits": {
        if (!args) return "Usage: /reset_credits &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const { error } = await admin.from("user_credits").update({ total_credits: 0, redeemed_credits: 0 }).eq("user_id", user.user_id);
        if (error) return `Error: ${error.message}`;
        return `✅ Reset credits for ${args}`;
      }

      case "/notify": {
        const [emailPart, ...msgParts] = args.split("|").map((s) => s.trim());
        const msg = msgParts.join("|");
        if (!emailPart || !msg) return "Usage: /notify &lt;email&gt; | &lt;message&gt;";
        const user = await findUserByEmail(admin, emailPart);
        if (!user) return `User not found: ${emailPart}`;
        const { error } = await admin.from("user_notifications").insert({
          user_id: user.user_id, title: "Message from admin", message: msg,
        });
        if (error) return `Error: ${error.message}`;
        return `✅ Notified ${emailPart}`;
      }

      case "/notify_all": {
        const [titlePart, ...msgParts] = args.split("|").map((s) => s.trim());
        const msg = msgParts.join("|");
        if (!titlePart || !msg) return "Usage: /notify_all &lt;title&gt; | &lt;message&gt;";
        const { data: users } = await admin.from("profiles").select("user_id");
        if (!users?.length) return "No users.";
        const rows = users.map((u: any) => ({ user_id: u.user_id, title: titlePart, message: msg }));
        // Insert in batches of 500 to avoid payload limits.
        for (let i = 0; i < rows.length; i += 500) {
          await admin.from("user_notifications").insert(rows.slice(i, i + 500));
        }
        return `📢 Notification sent to ${rows.length} user(s)`;
      }

      /* ============ Creators ============ */
      case "/pending_creators": {
        const { data } = await admin.from("creator_verifications")
          .select("instagram_handle, follower_count, application_note, created_at")
          .eq("status", "pending").order("created_at", { ascending: false }).limit(20);
        if (!data?.length) return "No pending applications.";
        return `<b>🏆 Pending creators</b>\n` + data.map((c: any) =>
          `• @${c.instagram_handle} — ${fmt(c.follower_count)} followers\n  ${(c.application_note ?? "").slice(0, 120)}`
        ).join("\n\n");
      }

      case "/approve_creator": {
        if (!args) return "Usage: /approve_creator &lt;handle&gt;";
        const handle = args.replace(/^@/, "");
        const { data: row } = await admin.from("creator_verifications").select("id, follower_count").eq("instagram_handle", handle).eq("status", "pending").maybeSingle();
        if (!row) return `No pending application for @${handle}`;
        const followers = Number(row.follower_count ?? 0);
        let badge = "verified", mult = 1.5;
        if (followers >= 50000) { badge = "elite"; mult = 2.0; }
        else if (followers >= 10000) { badge = "premium"; mult = 1.75; }
        const { error } = await admin.from("creator_verifications").update({
          status: "approved", badge_type: badge, earning_multiplier: mult,
          verified_at: new Date().toISOString(), rejection_reason: null,
        }).eq("id", row.id);
        if (error) return `Error: ${error.message}`;
        return `✅ @${handle} approved as <b>${badge}</b> (${mult}x)`;
      }

      case "/reject_creator": {
        const [handlePart, ...reasonParts] = args.split("|").map((s) => s.trim());
        const reason = reasonParts.join("|") || "Did not meet criteria";
        if (!handlePart) return "Usage: /reject_creator &lt;handle&gt; | &lt;reason&gt;";
        const handle = handlePart.replace(/^@/, "");
        const { error } = await admin.from("creator_verifications").update({
          status: "rejected", rejection_reason: reason, badge_type: "none", earning_multiplier: 1.0,
        }).eq("instagram_handle", handle).eq("status", "pending");
        if (error) return `Error: ${error.message}`;
        return `❌ @${handle} rejected: ${reason}`;
      }

      /* ============ Content ============ */
      case "/top_widgets": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("embed_widgets")
          .select("id, name, widget_type, user_id, created_at")
          .order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No widgets.";
        return `<b>📈 Recent widgets</b>\n` + data.map((w: any) =>
          `• <code>${w.id.slice(0, 8)}</code> [${w.widget_type}] ${fmt(w.name)}`
        ).join("\n");
      }

      case "/top_lastset": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("lastset_profiles")
          .select("username, display_name, view_count")
          .order("view_count", { ascending: false }).limit(n);
        if (!data?.length) return "No profiles.";
        return `<b>🌟 Top LastSet</b>\n` + data.map((p: any) =>
          `• @${p.username} — ${p.view_count ?? 0} views (${fmt(p.display_name)})`
        ).join("\n");
      }

      case "/recent_widgets": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("embed_widgets")
          .select("id, name, widget_type, created_at")
          .order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No widgets.";
        return `<b>🆕 Recent widgets</b>\n` + data.map((w: any) =>
          `• <code>${w.id.slice(0, 8)}</code> ${w.widget_type} — ${fmt(w.name)}`
        ).join("\n");
      }

      case "/recent_lastset": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("lastset_profiles")
          .select("username, display_name, created_at")
          .order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No profiles.";
        return `<b>🆕 Recent LastSet</b>\n` + data.map((p: any) =>
          `• @${p.username} — ${fmt(p.display_name)}`
        ).join("\n");
      }

      /* ============ Broadcast ============ */
      case "/broadcast":
      case "/broadcast_warn":
      case "/broadcast_error": {
        if (!args) return `Usage: ${cmd} &lt;message&gt;`;
        const level = cmd === "/broadcast_warn" ? "warning" : cmd === "/broadcast_error" ? "error" : "info";
        const { error } = await admin.from("system_announcements").insert({
          message: args, level, active: true, created_by: "telegram",
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        });
        if (error) return `Error: ${error.message}`;
        return `📣 ${level.toUpperCase()} banner live (7 days)`;
      }

      case "/announce_clear": {
        const { error, count } = await admin.from("system_announcements")
          .update({ active: false }, { count: "exact" }).eq("active", true);
        if (error) return `Error: ${error.message}`;
        return `🧹 Cleared ${count ?? 0} banner(s)`;
      }

      case "/reminder": {
        const cutoff = new Date(Date.now() + 3 * 86400000).toISOString();
        const { data } = await admin.from("subscriptions")
          .select("user_id, end_date").eq("status", "active").lte("end_date", cutoff);
        if (!data?.length) return "No subscriptions expiring within 3 days.";
        const rows = data.map((s: any) => ({
          user_id: s.user_id, title: "Subscription expiring soon",
          message: `Your premium expires on ${s.end_date?.slice(0, 10)}. Renew to keep your benefits.`,
        }));
        const { error } = await admin.from("user_notifications").insert(rows);
        if (error) return `Error: ${error.message}`;
        return `⏰ Sent ${rows.length} reminder(s)`;
      }

      /* ============ Support ============ */
      case "/resolve_support": {
        if (!args) return "Usage: /resolve_support &lt;id&gt;";
        const { error } = await admin.from("support_messages").update({ status: "resolved" }).eq("id", args);
        if (error) return `Error: ${error.message}`;
        return `✅ Ticket ${args.slice(0, 8)} resolved`;
      }

      case "/reply_support": {
        const [idPart, ...msgParts] = args.split("|").map((s) => s.trim());
        const msg = msgParts.join("|");
        if (!idPart || !msg) return "Usage: /reply_support &lt;id&gt; | &lt;message&gt;";
        const { data: ticket } = await admin.from("support_messages").select("email, subject").eq("id", idPart).maybeSingle();
        if (!ticket) return `Ticket ${idPart.slice(0, 8)} not found`;
        const user = await findUserByEmail(admin, ticket.email);
        if (user) {
          await admin.from("user_notifications").insert({
            user_id: user.user_id, title: `Re: ${ticket.subject}`, message: msg,
          });
        }
        await admin.from("support_messages").update({ status: "resolved" }).eq("id", idPart);
        return `✉️ Replied to ${ticket.email}${user ? "" : " (no account — logged only)"} and resolved ticket`;
      }

      /* ============ Delete ============ */
      case "/delete_widget": {
        if (!args) return "Usage: /delete_widget &lt;id&gt;";
        const { error } = await admin.from("embed_widgets").delete().eq("id", args);
        if (error) return `Error: ${error.message}`;
        return `🗑️ Widget ${args} deleted`;
      }

      case "/delete_lastset": {
        if (!args) return "Usage: /delete_lastset &lt;username&gt;";
        const { error } = await admin.from("lastset_profiles").delete().eq("username", args.replace(/^@/, ""));
        if (error) return `Error: ${error.message}`;
        return `🗑️ LastSet @${args} deleted`;
      }

      default:
        return `Unknown command: ${cmd}\nSend /help for the menu.`;
    }
  } catch (e) {
    return `Error: ${(e as Error).message}`;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  try {
    const update = await req.json();
    const message = update.message ?? update.edited_message;
    const chatId = message?.chat?.id;
    const text: string | undefined = message?.text;
    if (!chatId || !text) return new Response(JSON.stringify({ ok: true }));

    const adminChatId = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
    if (String(chatId) !== String(adminChatId)) {
      await sendMessage(chatId, "⛔ Unauthorized. This bot is admin-only.");
      return new Response(JSON.stringify({ ok: true }));
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const reply = await handleCommand(text, chatId, admin);
    await sendMessage(chatId, reply);
    return new Response(JSON.stringify({ ok: true }));
  } catch (e) {
    console.error("telegram-webhook", e);
    return new Response(JSON.stringify({ ok: true }));
  }
});
