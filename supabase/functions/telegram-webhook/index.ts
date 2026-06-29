// Telegram Admin Bot — receives commands and executes admin actions.
// Only messages from TELEGRAM_ADMIN_CHAT_ID are accepted.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

async function sendMessage(chatId: number | string, text: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return;
  await fetch(`${GATEWAY_URL}/sendMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": TELEGRAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  }).catch((e) => console.error("sendMessage", e));
}

const HELP_TEXT = `<b>🤖 Widgetify Admin Bot</b>

<b>Info</b>
/stats — platform counts
/users [n] — recent n users (default 10)
/subs [n] — recent subscriptions
/support [n] — recent support messages

<b>User Actions</b>
/grant &lt;email&gt; — grant 30-day premium
/revoke &lt;email&gt; — revoke premium
/credits &lt;email&gt; &lt;amount&gt; — add credits
/notify &lt;email&gt; | &lt;message&gt; — send in-app notification

<b>Broadcast</b>
/broadcast &lt;message&gt; — show banner to ALL users
/announce_clear — remove active banners
/reminder — notify all expiring subs (≤3 days)

<b>Delete</b>
/delete_widget &lt;id&gt;
/delete_lastset &lt;username&gt;

/help — this menu`;

async function findUserByEmail(admin: any, email: string) {
  const { data } = await admin.from("profiles").select("user_id, email, full_name").ilike("email", email).limit(1).maybeSingle();
  return data;
}

async function handleCommand(text: string, chatId: number | string, admin: any): Promise<string> {
  const trimmed = text.trim();
  const [cmdRaw, ...rest] = trimmed.split(/\s+/);
  const cmd = cmdRaw.toLowerCase().split("@")[0];
  const args = rest.join(" ");

  try {
    switch (cmd) {
      case "/start":
      case "/help":
        return HELP_TEXT;

      case "/stats": {
        const [u, s, w, l, sm] = await Promise.all([
          admin.from("profiles").select("*", { count: "exact", head: true }),
          admin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
          admin.from("embed_widgets").select("*", { count: "exact", head: true }),
          admin.from("lastset_profiles").select("*", { count: "exact", head: true }),
          admin.from("support_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
        ]);
        return `<b>📊 Stats</b>\nUsers: ${u.count}\nActive Subs: ${s.count}\nWidgets: ${w.count}\nLastSet profiles: ${l.count}\nOpen support: ${sm.count}`;
      }

      case "/users": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("profiles").select("email, full_name, created_at").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No users.";
        return `<b>👥 Recent users</b>\n` + data.map((u: any) => `• ${u.email} — ${u.full_name ?? "—"}`).join("\n");
      }

      case "/subs": {
        const n = Math.min(parseInt(args) || 10, 25);
        const { data } = await admin.from("subscriptions").select("user_id, amount, status, end_date").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No subscriptions.";
        return `<b>💳 Recent subs</b>\n` + data.map((s: any) => `• ₹${s.amount} ${s.status} → ${s.end_date?.slice(0,10) ?? "—"}`).join("\n");
      }

      case "/support": {
        const n = Math.min(parseInt(args) || 5, 15);
        const { data } = await admin.from("support_messages").select("name, email, subject, created_at").order("created_at", { ascending: false }).limit(n);
        if (!data?.length) return "No messages.";
        return `<b>📩 Support</b>\n` + data.map((m: any) => `• ${m.name} (${m.email})\n  → ${m.subject}`).join("\n\n");
      }

      case "/grant": {
        if (!args) return "Usage: /grant &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const { error } = await admin.from("subscriptions").insert({
          user_id: user.user_id, amount: 0, currency: "INR", plan_type: "premium",
          status: "active", start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 86400000).toISOString(),
        });
        if (error) return `Error: ${error.message}`;
        return `✅ Granted 30-day premium to ${args}`;
      }

      case "/revoke": {
        if (!args) return "Usage: /revoke &lt;email&gt;";
        const user = await findUserByEmail(admin, args);
        if (!user) return `User not found: ${args}`;
        const { error } = await admin.from("subscriptions").update({ status: "cancelled" }).eq("user_id", user.user_id).eq("status", "active");
        if (error) return `Error: ${error.message}`;
        return `✅ Revoked premium from ${args}`;
      }

      case "/credits": {
        const [email, amtStr] = args.split(/\s+/);
        const amt = parseInt(amtStr);
        if (!email || !amt) return "Usage: /credits &lt;email&gt; &lt;amount&gt;";
        const user = await findUserByEmail(admin, email);
        if (!user) return `User not found: ${email}`;
        await admin.from("user_credits").upsert({ user_id: user.user_id }, { onConflict: "user_id" });
        const { data: cur } = await admin.from("user_credits").select("balance").eq("user_id", user.user_id).maybeSingle();
        const newBal = (cur?.balance ?? 0) + amt;
        const { error } = await admin.from("user_credits").update({ balance: newBal }).eq("user_id", user.user_id);
        if (error) return `Error: ${error.message}`;
        return `✅ ${email} now has ${newBal} credits (+${amt})`;
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

      case "/broadcast": {
        if (!args) return "Usage: /broadcast &lt;message&gt;";
        const { error } = await admin.from("system_announcements").insert({
          message: args, level: "info", active: true, created_by: "telegram",
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        });
        if (error) return `Error: ${error.message}`;
        return `📣 Banner broadcast live (7 days)`;
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
          message: `Your premium expires on ${s.end_date?.slice(0,10)}. Renew to keep your benefits.`,
        }));
        const { error } = await admin.from("user_notifications").insert(rows);
        if (error) return `Error: ${error.message}`;
        return `⏰ Sent ${rows.length} reminder(s)`;
      }

      case "/delete_widget": {
        if (!args) return "Usage: /delete_widget &lt;id&gt;";
        const { error } = await admin.from("embed_widgets").delete().eq("id", args);
        if (error) return `Error: ${error.message}`;
        return `🗑️ Widget ${args} deleted`;
      }

      case "/delete_lastset": {
        if (!args) return "Usage: /delete_lastset &lt;username&gt;";
        const { error } = await admin.from("lastset_profiles").delete().eq("username", args);
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
