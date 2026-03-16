/**
 * Widgetify MCP Server
 * =====================
 * Model Context Protocol server exposing all core Widgetify capabilities
 * as structured tools for AI agents and external clients.
 *
 * Transport : Streamable HTTP (mcp-lite)
 * Endpoint  : POST /functions/v1/widgetify-mcp
 *
 * Tools:
 *   list_widget_types         – No auth – full widget type catalogue
 *   list_templates            – No auth – custom widget templates
 *   get_template              – No auth – single template config
 *   list_widgets              – Auth    – user's custom widgets
 *   get_widget                – Auth    – single widget config
 *   create_widget             – Auth    – create a new widget
 *   update_widget             – Auth    – update widget properties
 *   delete_widget             – Auth    – delete a widget
 *   generate_widget_code      – Auth    – HTML embed snippet + preview URL
 *   get_lastset_profile       – No auth – public link-in-bio profile
 *   upsert_lastset_profile    – Auth    – create/update link-in-bio page
 *   list_ab_tests             – Auth    – all A/B tests
 *   get_ab_test               – Auth    – A/B test + variations
 *   get_subscription_status   – Auth    – current plan & status
 */

import { Hono } from "npm:hono@^4.0.0";
import { McpServer, StreamableHttpTransport } from "npm:mcp-lite@^0.10.0";
import { createClient } from "npm:@supabase/supabase-js@^2";

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ---------------------------------------------------------------------------
// Supabase clients
// ---------------------------------------------------------------------------
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

function userClient(jwt: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
}

function extractJwt(req: Request): string | null {
  const auth = req.headers.get("authorization") ?? "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

async function verifyJwt(jwt: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(jwt);
  if (error || !data?.user) return null;
  return data.user.id;
}

// ---------------------------------------------------------------------------
// Static widget type catalogue
// ---------------------------------------------------------------------------
const WIDGET_TYPES = [
  { type: "whatsapp", category: "Social", description: "WhatsApp chat button" },
  { type: "facebook", category: "Social", description: "Facebook Messenger button" },
  { type: "instagram", category: "Social", description: "Instagram profile link" },
  { type: "twitter", category: "Social", description: "Twitter/X profile link" },
  { type: "telegram", category: "Social", description: "Telegram chat button" },
  { type: "linkedin", category: "Social", description: "LinkedIn profile link" },
  { type: "youtube", category: "Social", description: "YouTube channel link" },
  { type: "github", category: "Social", description: "GitHub profile link" },
  { type: "discord", category: "Social", description: "Discord server invite" },
  { type: "slack", category: "Social", description: "Slack workspace link" },
  { type: "twitch", category: "Social", description: "Twitch channel link" },
  { type: "social-share", category: "Social", description: "Share page on social media" },
  { type: "call-now", category: "Communication", description: "Click-to-call button" },
  { type: "whatsapp-form", category: "Communication", description: "WhatsApp interactive form" },
  { type: "contact-form", category: "Communication", description: "Embedded contact form" },
  { type: "email-contact", category: "Communication", description: "Email contact button" },
  { type: "live-chat", category: "Communication", description: "Live chat widget" },
  { type: "ai-chatbot", category: "Communication", description: "AI-powered chatbot" },
  { type: "zoom-meeting", category: "Communication", description: "Zoom meeting join button" },
  { type: "lead-capture-popup", category: "Lead Generation", description: "Lead capture popup" },
  { type: "newsletter-signup", category: "Lead Generation", description: "Newsletter signup form" },
  { type: "exit-intent-popup", category: "Lead Generation", description: "Exit-intent popup" },
  { type: "lead-magnet", category: "Lead Generation", description: "Lead magnet download" },
  { type: "booking-calendar", category: "Booking", description: "Appointment booking calendar" },
  { type: "countdown-timer", category: "Ecommerce", description: "Countdown / urgency timer" },
  { type: "flash-sale-banner", category: "Ecommerce", description: "Flash sale announcement" },
  { type: "black-friday-timer", category: "Ecommerce", description: "Black Friday countdown" },
  { type: "cart-abandonment", category: "Ecommerce", description: "Cart abandonment recovery" },
  { type: "price-drop-alert", category: "Ecommerce", description: "Price drop notification" },
  { type: "product-cards", category: "Ecommerce", description: "Product card display" },
  { type: "product-comparison", category: "Ecommerce", description: "Side-by-side product compare" },
  { type: "dodo-payment", category: "Ecommerce", description: "Dodo payment button" },
  { type: "payment", category: "Ecommerce", description: "Generic payment button" },
  { type: "back-to-top", category: "Utility", description: "Scroll back to top button" },
  { type: "scroll-progress", category: "Utility", description: "Reading progress bar" },
  { type: "print-page", category: "Utility", description: "Print current page button" },
  { type: "qr-generator", category: "Utility", description: "QR code generator" },
  { type: "dark-mode-toggle", category: "Utility", description: "Dark / light mode toggle" },
  { type: "cookie-consent", category: "Utility", description: "Cookie consent banner" },
  { type: "age-verification", category: "Utility", description: "Age gate / verification" },
  { type: "click-to-copy", category: "Utility", description: "One-click copy to clipboard" },
  { type: "google-translate", category: "Utility", description: "Google Translate integration" },
  { type: "weather-widget", category: "Info", description: "Local weather display" },
  { type: "calculator", category: "Info", description: "Simple calculator tool" },
  { type: "crypto-prices", category: "Info", description: "Live crypto price ticker" },
  { type: "stock-ticker", category: "Info", description: "Live stock price ticker" },
  { type: "rss-feed", category: "Info", description: "RSS feed reader" },
  { type: "google-maps", category: "Info", description: "Embedded Google Maps" },
  { type: "google-reviews", category: "Info", description: "Google Reviews display" },
  { type: "visitor-counter", category: "Social Proof", description: "Live visitor count" },
  { type: "live-visitor-counter", category: "Social Proof", description: "Animated visitor counter" },
  { type: "social-proof-popup", category: "Social Proof", description: "Recent activity popup" },
  { type: "trust-badge", category: "Social Proof", description: "Trust / security badges" },
  { type: "testimonial-slider", category: "Social Proof", description: "Customer testimonials" },
  { type: "review-now", category: "Social Proof", description: "Leave a review prompt" },
  { type: "feedback-form", category: "Engagement", description: "User feedback form" },
  { type: "multi-step-survey", category: "Engagement", description: "Multi-step survey flow" },
  { type: "smart-faq-chatbot", category: "Engagement", description: "Smart FAQ chatbot" },
  { type: "product-tour", category: "Engagement", description: "Guided product tour" },
  { type: "loyalty-points", category: "Engagement", description: "Loyalty / rewards points" },
  { type: "referral-tracking", category: "Engagement", description: "Referral link tracker" },
  { type: "popup-announcement", category: "Engagement", description: "General announcement popup" },
  { type: "announcement-bar", category: "Engagement", description: "Top announcement bar" },
  { type: "sticky-banner", category: "Engagement", description: "Sticky bottom / top banner" },
  { type: "floating-video", category: "Media", description: "Floating video player" },
  { type: "music-player", category: "Media", description: "Mini music player" },
  { type: "image-gallery", category: "Media", description: "Responsive image gallery" },
  { type: "pdf-viewer", category: "Media", description: "Inline PDF viewer" },
  { type: "spotify-embed", category: "Media", description: "Spotify player embed" },
  { type: "download-app", category: "Mobile", description: "App Store / Play Store links" },
  { type: "lastset", category: "Link in Bio", description: "Link-in-bio page widget" },
];

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------
function errResult(msg: string) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
    isError: true,
  };
}

// ---------------------------------------------------------------------------
// Auth helper — reads JWT from request context stored in globalThis
// ---------------------------------------------------------------------------
function getRequestJwt(argJwt?: string): string | null {
  return argJwt ?? (globalThis as unknown as Record<string, string>).__mcpJwt ?? null;
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const mcp = new McpServer({ name: "widgetify-mcp", version: "1.0.0" });

// ── list_widget_types ────────────────────────────────────────────────────────
mcp.tool("list_widget_types", {
  description:
    "Returns the full catalogue of widget types supported by Widgetify. No authentication required.",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description:
          "Optional category filter (e.g. 'Social', 'Ecommerce', 'Utility'). Omit to get all.",
      },
    },
  },
  handler: async ({ category }: { category?: string }) => {
    const filtered = category
      ? WIDGET_TYPES.filter((w) => w.category.toLowerCase() === category.toLowerCase())
      : WIDGET_TYPES;
    const categories = [...new Set(WIDGET_TYPES.map((w) => w.category))];
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ total: filtered.length, categories, widgets: filtered }, null, 2),
        },
      ],
    };
  },
});

// ── list_templates ───────────────────────────────────────────────────────────
mcp.tool("list_templates", {
  description: "Lists custom widget templates on the platform. No authentication required.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Max results (default 20, max 100)." },
      offset: { type: "number", description: "Pagination offset (default 0)." },
    },
  },
  handler: async ({ limit, offset }: { limit?: number; offset?: number }) => {
    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safeOffset = Number(offset) || 0;
    const { data, error, count } = await supabaseAdmin
      .from("custom_widgets")
      .select("id, name, title, description, position, size, button_text, created_at", {
        count: "exact",
      })
      .range(safeOffset, safeOffset + safeLimit - 1)
      .order("created_at", { ascending: false });
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ total: count, offset: safeOffset, limit: safeLimit, templates: data }, null, 2),
        },
      ],
    };
  },
});

// ── get_template ─────────────────────────────────────────────────────────────
mcp.tool("get_template", {
  description: "Fetches the full configuration of a single custom widget template by its ID.",
  inputSchema: {
    type: "object",
    required: ["template_id"],
    properties: {
      template_id: { type: "string", description: "UUID of the custom widget template." },
    },
  },
  handler: async ({ template_id }: { template_id: string }) => {
    const { data, error } = await supabaseAdmin
      .from("custom_widgets")
      .select("*")
      .eq("id", template_id)
      .single();
    if (error || !data) return errResult("Template not found");
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ── list_widgets ─────────────────────────────────────────────────────────────
mcp.tool("list_widgets", {
  description: "Lists all custom widgets belonging to the authenticated user.",
  inputSchema: {
    type: "object",
    properties: {
      jwt: { type: "string", description: "User JWT. Can also be passed in Authorization header." },
      limit: { type: "number", description: "Max results (default 20, max 100)." },
      offset: { type: "number", description: "Pagination offset (default 0)." },
    },
  },
  handler: async ({ jwt: argJwt, limit, offset }: { jwt?: string; limit?: number; offset?: number }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required. Provide a JWT.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid or expired JWT.");
    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safeOffset = Number(offset) || 0;
    const db = userClient(jwt);
    const { data, error, count } = await db
      .from("custom_widgets")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(safeOffset, safeOffset + safeLimit - 1)
      .order("created_at", { ascending: false });
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ total: count, offset: safeOffset, limit: safeLimit, widgets: data }, null, 2),
        },
      ],
    };
  },
});

// ── get_widget ───────────────────────────────────────────────────────────────
mcp.tool("get_widget", {
  description: "Fetches the full configuration of a specific custom widget by ID.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string" },
      widget_id: { type: "string", description: "UUID of the widget." },
    },
  },
  handler: async ({ jwt: argJwt, widget_id }: { jwt?: string; widget_id: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { data, error } = await db
      .from("custom_widgets")
      .select("*")
      .eq("id", widget_id)
      .eq("user_id", userId)
      .single();
    if (error || !data) return errResult("Widget not found.");
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ── create_widget ────────────────────────────────────────────────────────────
mcp.tool("create_widget", {
  description:
    "Creates a new custom widget for the authenticated user. Returns the created widget with its ID.",
  inputSchema: {
    type: "object",
    required: ["name", "title", "button_text"],
    properties: {
      jwt: { type: "string" },
      name: { type: "string", description: "Internal widget name." },
      title: { type: "string", description: "Visible popup/widget title." },
      description: { type: "string", description: "Optional description shown in the popup." },
      button_text: { type: "string", description: "Label on the trigger button." },
      button_color: { type: "string", description: "Hex colour for the button (default #9b87f5)." },
      text_color: { type: "string", description: "Hex text colour (default #1A1F2C)." },
      background_color: { type: "string", description: "Popup background hex colour (default #ffffff)." },
      position: {
        type: "string",
        enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
        description: "Position on the page.",
      },
      size: {
        type: "string",
        enum: ["small", "medium", "large"],
        description: "Widget size.",
      },
      border_radius: { type: "string", description: "CSS border-radius (default '12px')." },
      button_action: { type: "string", description: "URL or action triggered on button click." },
      custom_css: { type: "string", description: "Extra CSS injected into the widget." },
    },
  },
  handler: async (args: {
    jwt?: string;
    name: string;
    title: string;
    description?: string;
    button_text: string;
    button_color?: string;
    text_color?: string;
    background_color?: string;
    position?: string;
    size?: string;
    border_radius?: string;
    button_action?: string;
    custom_css?: string;
  }) => {
    const jwt = getRequestJwt(args.jwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { data, error } = await db
      .from("custom_widgets")
      .insert({
        user_id: userId,
        name: args.name,
        title: args.title,
        description: args.description ?? null,
        button_text: args.button_text,
        button_color: args.button_color ?? "#9b87f5",
        text_color: args.text_color ?? "#1A1F2C",
        background_color: args.background_color ?? "#ffffff",
        position: args.position ?? "bottom-right",
        size: args.size ?? "medium",
        border_radius: args.border_radius ?? "12px",
        button_action: args.button_action ?? null,
        custom_css: args.custom_css ?? null,
      })
      .select()
      .single();
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ success: true, message: "Widget created.", widget: data }, null, 2),
        },
      ],
    };
  },
});

// ── update_widget ────────────────────────────────────────────────────────────
mcp.tool("update_widget", {
  description: "Updates one or more properties of an existing custom widget.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string" },
      widget_id: { type: "string", description: "UUID of the widget to update." },
      name: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      button_text: { type: "string" },
      button_color: { type: "string" },
      text_color: { type: "string" },
      background_color: { type: "string" },
      position: { type: "string", enum: ["bottom-right", "bottom-left", "top-right", "top-left"] },
      size: { type: "string", enum: ["small", "medium", "large"] },
      border_radius: { type: "string" },
      button_action: { type: "string" },
      custom_css: { type: "string" },
    },
  },
  handler: async (args: { jwt?: string; widget_id: string; [key: string]: unknown }) => {
    const jwt = getRequestJwt(args.jwt as string | undefined);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const { widget_id, jwt: _jwt, ...updates } = args;
    if (Object.keys(updates).length === 0) return errResult("No fields to update provided.");
    const db = userClient(jwt);
    const { data, error } = await db
      .from("custom_widgets")
      .update(updates)
      .eq("id", widget_id as string)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ success: true, message: "Widget updated.", widget: data }, null, 2),
        },
      ],
    };
  },
});

// ── delete_widget ────────────────────────────────────────────────────────────
mcp.tool("delete_widget", {
  description: "Permanently deletes a custom widget. This action is irreversible.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string" },
      widget_id: { type: "string", description: "UUID of the widget to delete." },
    },
  },
  handler: async ({ jwt: argJwt, widget_id }: { jwt?: string; widget_id: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { error } = await db
      .from("custom_widgets")
      .delete()
      .eq("id", widget_id)
      .eq("user_id", userId);
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ success: true, message: `Widget ${widget_id} deleted.` }, null, 2),
        },
      ],
    };
  },
});

// ── generate_widget_code ─────────────────────────────────────────────────────
mcp.tool("generate_widget_code", {
  description:
    "Generates a ready-to-paste HTML embed snippet for a custom widget. Also returns the direct preview URL.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string" },
      widget_id: { type: "string", description: "UUID of the widget." },
    },
  },
  handler: async ({ jwt: argJwt, widget_id }: { jwt?: string; widget_id: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { data: w, error } = await db
      .from("custom_widgets")
      .select("*")
      .eq("id", widget_id)
      .eq("user_id", userId)
      .single();
    if (error || !w) return errResult("Widget not found.");

    const embedCode = `<!-- Widgetify: ${w.name} -->
<script>
  (function(){
    var cfg = {
      title: ${JSON.stringify(w.title)},
      description: ${JSON.stringify(w.description ?? "")},
      buttonText: ${JSON.stringify(w.button_text)},
      buttonColor: ${JSON.stringify(w.button_color)},
      textColor: ${JSON.stringify(w.text_color)},
      bgColor: ${JSON.stringify(w.background_color)},
      position: ${JSON.stringify(w.position)},
      borderRadius: ${JSON.stringify(w.border_radius)},
      action: ${JSON.stringify(w.button_action ?? "")},
    };
    var btn = document.createElement('button');
    btn.innerText = cfg.buttonText;
    btn.style.cssText = [
      'position:fixed',
      cfg.position.includes('bottom') ? 'bottom:24px' : 'top:24px',
      cfg.position.includes('right') ? 'right:24px' : 'left:24px',
      'background:' + cfg.buttonColor,
      'color:' + cfg.textColor,
      'border:none', 'border-radius:' + cfg.borderRadius,
      'padding:12px 20px', 'cursor:pointer', 'z-index:9999',
      'font-size:14px', 'font-weight:600',
      'box-shadow:0 4px 12px rgba(0,0,0,0.18)'
    ].join(';');
    btn.onclick = function(){ if(cfg.action) window.open(cfg.action,'_blank'); };
    document.body.appendChild(btn);
  })();
</script>`;

    const appUrl = "https://widgetifyai.vercel.app";
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              widget_id: w.id,
              widget_name: w.name,
              preview_url: `${appUrl}/?widget=${w.id}`,
              embed_code: embedCode,
              instructions: "Paste embed_code before </body> on any HTML page.",
            },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ── get_lastset_profile ──────────────────────────────────────────────────────
mcp.tool("get_lastset_profile", {
  description:
    "Fetches the LastSet link-in-bio profile for a given username. Public profiles are readable without auth.",
  inputSchema: {
    type: "object",
    required: ["username"],
    properties: {
      username: { type: "string", description: "The unique LastSet username (e.g. 'johndoe')." },
    },
  },
  handler: async ({ username }: { username: string }) => {
    const { data, error } = await supabaseAdmin
      .from("lastset_profiles")
      .select(
        "username, display_name, bio, avatar_url, theme, shape, links, is_public, view_count, created_at"
      )
      .eq("username", username.toLowerCase())
      .eq("is_public", true)
      .single();
    if (error || !data) return errResult("Profile not found or is private.");
    const appUrl = "https://widgetifyai.vercel.app";
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ ...data, public_url: `${appUrl}/l/${data.username}` }, null, 2),
        },
      ],
    };
  },
});

// ── upsert_lastset_profile ───────────────────────────────────────────────────
mcp.tool("upsert_lastset_profile", {
  description:
    "Creates or updates the authenticated user's LastSet link-in-bio profile.",
  inputSchema: {
    type: "object",
    required: ["username", "display_name"],
    properties: {
      jwt: { type: "string" },
      username: { type: "string", description: "Unique URL slug (lowercase, alphanumeric + hyphens)." },
      display_name: { type: "string", description: "Name shown on the profile page." },
      bio: { type: "string", description: "Short bio / tagline." },
      avatar_url: { type: "string", description: "URL to avatar image." },
      theme: {
        type: "string",
        enum: ["glass", "neon", "aurora", "minimal"],
        description: "Visual theme.",
      },
      shape: {
        type: "string",
        enum: ["rounded", "pill", "sharp"],
        description: "Button shape style.",
      },
      is_public: { type: "boolean", description: "Whether the profile is publicly accessible." },
      links: {
        type: "array",
        description: "Array of link objects.",
        items: {
          type: "object",
          required: ["label", "url"],
          properties: {
            label: { type: "string" },
            url: { type: "string" },
            icon: { type: "string" },
          },
        },
      },
    },
  },
  handler: async (args: {
    jwt?: string;
    username: string;
    display_name: string;
    bio?: string;
    avatar_url?: string;
    theme?: string;
    shape?: string;
    is_public?: boolean;
    links?: Array<{ label: string; url: string; icon?: string }>;
  }) => {
    const jwt = getRequestJwt(args.jwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const username = args.username.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const db = userClient(jwt);
    const { data, error } = await db
      .from("lastset_profiles")
      .upsert(
        {
          user_id: userId,
          username,
          display_name: args.display_name,
          bio: args.bio ?? "",
          avatar_url: args.avatar_url ?? "",
          theme: args.theme ?? "glass",
          shape: args.shape ?? "rounded",
          is_public: args.is_public ?? true,
          links: args.links ?? [],
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();
    if (error) return errResult(error.message);
    const appUrl = "https://widgetify.lovable.app";
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { success: true, profile: data, public_url: `${appUrl}/l/${username}` },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ── list_ab_tests ────────────────────────────────────────────────────────────
mcp.tool("list_ab_tests", {
  description: "Lists all A/B tests created by the authenticated user.",
  inputSchema: {
    type: "object",
    properties: {
      jwt: { type: "string" },
      status: {
        type: "string",
        enum: ["draft", "running", "paused", "completed"],
        description: "Optional status filter.",
      },
    },
  },
  handler: async ({ jwt: argJwt, status }: { jwt?: string; status?: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    let query = db
      .from("ab_tests")
      .select("id, name, description, status, start_date, end_date, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ total: data?.length ?? 0, tests: data }, null, 2),
        },
      ],
    };
  },
});

// ── get_ab_test ──────────────────────────────────────────────────────────────
mcp.tool("get_ab_test", {
  description: "Fetches details and variations for a specific A/B test.",
  inputSchema: {
    type: "object",
    required: ["test_id"],
    properties: {
      jwt: { type: "string" },
      test_id: { type: "string", description: "UUID of the A/B test." },
    },
  },
  handler: async ({ jwt: argJwt, test_id }: { jwt?: string; test_id: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { data: test, error: testErr } = await db
      .from("ab_tests")
      .select("*")
      .eq("id", test_id)
      .eq("user_id", userId)
      .single();
    if (testErr || !test) return errResult("A/B test not found.");
    const { data: variations } = await db
      .from("widget_variations")
      .select("*")
      .eq("ab_test_id", test_id);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ test, variations: variations ?? [] }, null, 2),
        },
      ],
    };
  },
});

// ── get_subscription_status ──────────────────────────────────────────────────
mcp.tool("get_subscription_status", {
  description: "Returns the current subscription status for the authenticated user.",
  inputSchema: {
    type: "object",
    properties: {
      jwt: { type: "string" },
    },
  },
  handler: async ({ jwt: argJwt }: { jwt?: string }) => {
    const jwt = getRequestJwt(argJwt);
    if (!jwt) return errResult("Authentication required.");
    const userId = await verifyJwt(jwt);
    if (!userId) return errResult("Invalid JWT.");
    const db = userClient(jwt);
    const { data, error } = await db
      .from("subscriptions")
      .select("id, plan_type, status, start_date, end_date, amount, currency")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return errResult(error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { has_active_subscription: !!data, subscription: data ?? null, plan: data?.plan_type ?? "free" },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Hono app + transport
// ---------------------------------------------------------------------------
const transport = new StreamableHttpTransport();
const httpHandler = transport.bind(mcp);

const app = new Hono();

app.options("/*", (c) => new Response(null, { status: 204, headers: corsHeaders }));

app.all("/*", async (c) => {
  // Stash the JWT in globalThis so tool handlers can access it
  const jwt = extractJwt(c.req.raw);
  (globalThis as unknown as Record<string, string | null>).__mcpJwt = jwt;

  const response = await httpHandler(c.req.raw);
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
  return new Response(response.body, { status: response.status, headers });
});

Deno.serve(app.fetch);
