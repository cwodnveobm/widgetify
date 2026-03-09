/**
 * Widgetify MCP Server
 * =====================
 * A production-ready Model Context Protocol (MCP) server exposing all core
 * Widgetify capabilities as structured tools for AI agents and external clients.
 *
 * Tools exposed:
 *   Widget CRUD   : list_widgets, get_widget, create_widget, update_widget, delete_widget
 *   Code gen      : generate_widget_code
 *   Widget types  : list_widget_types
 *   Templates     : list_templates, get_template
 *   LastSet       : get_lastset_profile, upsert_lastset_profile
 *   A/B Tests     : list_ab_tests, get_ab_test
 *   Subscriptions : get_subscription_status
 *
 * Authentication
 *   Pass a valid Widgetify JWT in the `Authorization: Bearer <token>` header.
 *   Anonymous tools (list_widget_types, list_templates, get_template) work without auth.
 *
 * Transport : Streamable HTTP (mcp-lite)
 * Endpoint  : POST /functions/v1/widgetify-mcp
 */

import { Hono } from "npm:hono@^4.0.0";
import { McpServer, StreamableHttpTransport } from "npm:mcp-lite@^0.10.0";
import { createClient } from "npm:@supabase/supabase-js@^2";

// ---------------------------------------------------------------------------
// CORS headers – required for browser clients
// ---------------------------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ---------------------------------------------------------------------------
// Supabase admin client (service-role for privileged reads in tools)
// ---------------------------------------------------------------------------
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// ---------------------------------------------------------------------------
// Helper – build a user-scoped client from a JWT
// ---------------------------------------------------------------------------
function userClient(jwt: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );
}

// ---------------------------------------------------------------------------
// Helper – extract JWT from request headers
// ---------------------------------------------------------------------------
function extractJwt(req: Request): string | null {
  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Helper – verify JWT and return user_id
// ---------------------------------------------------------------------------
async function verifyJwt(jwt: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.getUser(jwt);
  if (error || !data?.user) return null;
  return data.user.id;
}

// ---------------------------------------------------------------------------
// Static widget type catalogue (mirrors src/types/index.ts)
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
  { type: "email-signature-generator", category: "Lead Generation", description: "Email signature tool" },
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
  { type: "share-page", category: "Utility", description: "Native share / copy URL" },
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
  { type: "video-testimonial", category: "Social Proof", description: "Video testimonial display" },
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
// Build the MCP server
// ---------------------------------------------------------------------------
const mcp = new McpServer({
  name: "widgetify-mcp",
  version: "1.0.0",
});

// ===== TOOL: list_widget_types ===========================================
mcp.tool({
  name: "list_widget_types",
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
      ? WIDGET_TYPES.filter(
          (w) => w.category.toLowerCase() === category.toLowerCase()
        )
      : WIDGET_TYPES;

    const categories = [...new Set(WIDGET_TYPES.map((w) => w.category))];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              total: filtered.length,
              categories,
              widgets: filtered,
            },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ===== TOOL: list_templates ==============================================
mcp.tool({
  name: "list_templates",
  description:
    "Lists all available custom widget templates saved in the platform. No authentication required for public view.",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of templates to return (default 20, max 100).",
      },
      offset: { type: "number", description: "Pagination offset (default 0)." },
    },
  },
  handler: async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }) => {
    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safeOffset = Number(offset) || 0;

    // Custom widgets are user-scoped – return public metadata via admin client
    const { data, error, count } = await supabaseAdmin
      .from("custom_widgets")
      .select("id, name, title, description, position, size, button_text, created_at", {
        count: "exact",
      })
      .range(safeOffset, safeOffset + safeLimit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: error.message }) }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ total: count, offset: safeOffset, limit: safeLimit, templates: data }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: get_template ================================================
mcp.tool({
  name: "get_template",
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

    if (error || !data) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: "Template not found" }) }],
        isError: true,
      };
    }

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ===== TOOL: list_widgets ================================================
mcp.tool({
  name: "list_widgets",
  description: "Lists all custom widgets belonging to the authenticated user.",
  inputSchema: {
    type: "object",
    properties: {
      jwt: { type: "string", description: "User JWT. Pass via Authorization header or this field." },
      limit: { type: "number", description: "Max results (default 20, max 100)." },
      offset: { type: "number", description: "Pagination offset (default 0)." },
    },
  },
  handler: async (
    args: { jwt?: string; limit?: number; offset?: number },
    extra: { request?: Request }
  ) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: "Authentication required. Provide a JWT." }) }],
        isError: true,
      };
    }

    const userId = await verifyJwt(jwt);
    if (!userId) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: "Invalid or expired JWT." }) }],
        isError: true,
      };
    }

    const safeLimit = Math.min(Number(args.limit) || 20, 100);
    const safeOffset = Number(args.offset) || 0;

    const db = userClient(jwt);
    const { data, error, count } = await db
      .from("custom_widgets")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(safeOffset, safeOffset + safeLimit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: error.message }) }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ total: count, offset: safeOffset, limit: safeLimit, widgets: data }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: get_widget ==================================================
mcp.tool({
  name: "get_widget",
  description: "Fetches the full configuration of a specific custom widget by ID.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
      widget_id: { type: "string", description: "UUID of the widget." },
    },
  },
  handler: async (args: { jwt?: string; widget_id: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    const { data, error } = await db
      .from("custom_widgets")
      .select("*")
      .eq("id", args.widget_id)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "Widget not found." }) }], isError: true };
    }

    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ===== TOOL: create_widget ===============================================
mcp.tool({
  name: "create_widget",
  description:
    "Creates a new custom widget for the authenticated user. Returns the created widget with its assigned ID.",
  inputSchema: {
    type: "object",
    required: ["name", "title", "button_text"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
      name: { type: "string", description: "Internal widget name (e.g. 'My WhatsApp Button')." },
      title: { type: "string", description: "Visible popup/widget title." },
      description: { type: "string", description: "Optional description shown in the widget popup." },
      button_text: { type: "string", description: "Label on the trigger button." },
      button_color: { type: "string", description: "Hex colour for the button (default #9b87f5)." },
      text_color: { type: "string", description: "Hex text colour (default #1A1F2C)." },
      background_color: { type: "string", description: "Popup background hex colour (default #ffffff)." },
      position: {
        type: "string",
        enum: ["bottom-right", "bottom-left", "top-right", "top-left"],
        description: "Position on the page (default bottom-right).",
      },
      size: {
        type: "string",
        enum: ["small", "medium", "large"],
        description: "Widget size (default medium).",
      },
      border_radius: { type: "string", description: "CSS border-radius (default '12px')." },
      button_action: { type: "string", description: "URL or action triggered when the button is clicked." },
      custom_css: { type: "string", description: "Extra CSS injected into the widget." },
    },
  },
  handler: async (
    args: {
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
    },
    extra: { request?: Request }
  ) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

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

    if (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, message: "Widget created successfully.", widget: data }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: update_widget ===============================================
mcp.tool({
  name: "update_widget",
  description: "Updates one or more properties of an existing custom widget.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
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
  handler: async (
    args: {
      jwt?: string;
      widget_id: string;
      [key: string]: unknown;
    },
    extra: { request?: Request }
  ) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const { widget_id, jwt: _jwt, ...updates } = args;
    if (Object.keys(updates).length === 0) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "No fields to update provided." }) }], isError: true };
    }

    const db = userClient(jwt);
    const { data, error } = await db
      .from("custom_widgets")
      .update(updates)
      .eq("id", widget_id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, message: "Widget updated.", widget: data }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: delete_widget ===============================================
mcp.tool({
  name: "delete_widget",
  description: "Permanently deletes a custom widget. This action is irreversible.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
      widget_id: { type: "string", description: "UUID of the widget to delete." },
    },
  },
  handler: async (args: { jwt?: string; widget_id: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    const { error } = await db
      .from("custom_widgets")
      .delete()
      .eq("id", args.widget_id)
      .eq("user_id", userId);

    if (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, message: `Widget ${args.widget_id} deleted.` }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: generate_widget_code ========================================
mcp.tool({
  name: "generate_widget_code",
  description:
    "Generates a ready-to-paste HTML embed snippet for a custom widget by its ID. Also returns the direct preview URL.",
  inputSchema: {
    type: "object",
    required: ["widget_id"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
      widget_id: { type: "string", description: "UUID of the widget." },
    },
  },
  handler: async (args: { jwt?: string; widget_id: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    const { data: widget, error } = await db
      .from("custom_widgets")
      .select("*")
      .eq("id", args.widget_id)
      .eq("user_id", userId)
      .single();

    if (error || !widget) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "Widget not found." }) }], isError: true };
    }

    const embedCode = `<!-- Widgetify: ${widget.name} -->
<script>
  (function(){
    var w = {
      title: ${JSON.stringify(widget.title)},
      description: ${JSON.stringify(widget.description ?? "")},
      buttonText: ${JSON.stringify(widget.button_text)},
      buttonColor: ${JSON.stringify(widget.button_color)},
      textColor: ${JSON.stringify(widget.text_color)},
      backgroundColor: ${JSON.stringify(widget.background_color)},
      position: ${JSON.stringify(widget.position)},
      size: ${JSON.stringify(widget.size)},
      borderRadius: ${JSON.stringify(widget.border_radius)},
      buttonAction: ${JSON.stringify(widget.button_action ?? "")},
    };
    var btn = document.createElement('button');
    btn.innerText = w.buttonText;
    btn.style.cssText = [
      'position:fixed', w.position.includes('bottom') ? 'bottom:24px' : 'top:24px',
      w.position.includes('right') ? 'right:24px' : 'left:24px',
      'background:' + w.buttonColor, 'color:' + w.textColor,
      'border:none', 'border-radius:' + w.borderRadius,
      'padding:12px 20px', 'cursor:pointer', 'z-index:9999',
      'font-size:14px', 'font-weight:600',
      'box-shadow:0 4px 12px rgba(0,0,0,0.18)'
    ].join(';');
    btn.onclick = function(){ if(w.buttonAction) window.open(w.buttonAction,'_blank'); };
    document.body.appendChild(btn);
  })();
</script>`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1] ?? "";
    const previewUrl = `https://${projectId}.supabase.co/functions/v1/widget-preview?id=${widget.id}`;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              widget_id: widget.id,
              widget_name: widget.name,
              preview_url: previewUrl,
              embed_code: embedCode,
              instructions: "Paste the embed_code before </body> on any HTML page.",
            },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ===== TOOL: get_lastset_profile =========================================
mcp.tool({
  name: "get_lastset_profile",
  description: "Fetches the LastSet link-in-bio profile for a given username. Public profiles are readable without authentication.",
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
      .select("username, display_name, bio, avatar_url, theme, shape, links, is_public, view_count, created_at")
      .eq("username", username.toLowerCase())
      .eq("is_public", true)
      .single();

    if (error || !data) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "Profile not found or is private." }) }], isError: true };
    }

    const appUrl = Deno.env.get("APP_URL") ?? "https://widgetify.lovable.app";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { ...data, public_url: `${appUrl}/l/${data.username}` },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ===== TOOL: upsert_lastset_profile ======================================
mcp.tool({
  name: "upsert_lastset_profile",
  description: "Creates or updates the authenticated user's LastSet link-in-bio profile.",
  inputSchema: {
    type: "object",
    required: ["username", "display_name"],
    properties: {
      jwt: { type: "string", description: "User JWT." },
      username: { type: "string", description: "Unique URL slug (lowercase, alphanumeric + hyphens)." },
      display_name: { type: "string", description: "Displayed name on the profile page." },
      bio: { type: "string", description: "Short bio / tagline." },
      avatar_url: { type: "string", description: "URL to avatar image." },
      theme: { type: "string", enum: ["glass", "neon", "aurora", "minimal"], description: "Visual theme." },
      shape: { type: "string", enum: ["rounded", "pill", "sharp"], description: "Button shape style." },
      is_public: { type: "boolean", description: "Whether the profile is publicly accessible (default true)." },
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
  handler: async (
    args: {
      jwt?: string;
      username: string;
      display_name: string;
      bio?: string;
      avatar_url?: string;
      theme?: string;
      shape?: string;
      is_public?: boolean;
      links?: Array<{ label: string; url: string; icon?: string }>;
    },
    extra: { request?: Request }
  ) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

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

    if (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
    }

    const appUrl = Deno.env.get("APP_URL") ?? "https://widgetify.lovable.app";
    return {
      content: [
        {
          type: "text",
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

// ===== TOOL: list_ab_tests ===============================================
mcp.tool({
  name: "list_ab_tests",
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
  handler: async (args: { jwt?: string; status?: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    let query = db
      .from("ab_tests")
      .select("id, name, description, status, start_date, end_date, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (args.status) query = query.eq("status", args.status);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };

    return { content: [{ type: "text", text: JSON.stringify({ total: data?.length ?? 0, tests: data }, null, 2) }] };
  },
});

// ===== TOOL: get_ab_test =================================================
mcp.tool({
  name: "get_ab_test",
  description: "Fetches details and variations for a specific A/B test.",
  inputSchema: {
    type: "object",
    required: ["test_id"],
    properties: {
      jwt: { type: "string" },
      test_id: { type: "string", description: "UUID of the A/B test." },
    },
  },
  handler: async (args: { jwt?: string; test_id: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    const { data: test, error: testError } = await db
      .from("ab_tests")
      .select("*")
      .eq("id", args.test_id)
      .eq("user_id", userId)
      .single();

    if (testError || !test) {
      return { content: [{ type: "text", text: JSON.stringify({ error: "A/B test not found." }) }], isError: true };
    }

    const { data: variations } = await db
      .from("widget_variations")
      .select("*")
      .eq("ab_test_id", args.test_id);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ test, variations: variations ?? [] }, null, 2),
        },
      ],
    };
  },
});

// ===== TOOL: get_subscription_status =====================================
mcp.tool({
  name: "get_subscription_status",
  description: "Returns the current subscription status for the authenticated user.",
  inputSchema: {
    type: "object",
    properties: {
      jwt: { type: "string", description: "User JWT." },
    },
  },
  handler: async (args: { jwt?: string }, extra: { request?: Request }) => {
    const jwt = args.jwt ?? extractJwt(extra?.request ?? new Request("http://localhost"));
    if (!jwt) return { content: [{ type: "text", text: JSON.stringify({ error: "Authentication required." }) }], isError: true };

    const userId = await verifyJwt(jwt);
    if (!userId) return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid JWT." }) }], isError: true };

    const db = userClient(jwt);
    const { data, error } = await db
      .from("subscriptions")
      .select("id, plan_type, status, start_date, end_date, amount, currency")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              has_active_subscription: !!data,
              subscription: data ?? null,
              plan: data?.plan_type ?? "free",
            },
            null,
            2
          ),
        },
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Hono app + Streamable HTTP transport
// ---------------------------------------------------------------------------
const app = new Hono();
const transport = new StreamableHttpTransport();

app.options("/*", (c) => {
  return new Response(null, { status: 204, headers: corsHeaders });
});

app.all("/*", async (c) => {
  const response = await transport.handleRequest(c.req.raw, mcp);
  // Attach CORS headers to every response
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
  return new Response(response.body, { status: response.status, headers });
});

Deno.serve(app.fetch);
