// AI Embed Assistant — turns a natural-language description into a ready-to-use embed widget config.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SYSTEM_PROMPT = `You are the Widgetify Embed Assistant. The user describes the widget they want to embed on their site.
Return a single tool call to "generate_widget" with these fields:
- widget_type: one of "popup" | "lead-form" | "ai-chat".
- name: short descriptive label (max 60 chars).
- config: a JSON object matching the widget_type schema below.

Schemas:
popup => { title, description, ctaText, ctaUrl, cooldownMinutes (number), triggers: { timeDelay (sec), exitIntent (bool), scrollPercent (0-100) }, display ("floating"|"inline") }
lead-form => { title, description, submitText, successMessage, display, autoOpen (bool), autoOpenDelay (sec) }
ai-chat => { title, welcomeMessage, systemPrompt, model ("google/gemini-2.5-flash"|"google/gemini-2.5-pro"|"openai/gpt-5-mini"), display, autoOpen, autoOpenDelay }

Pick the most fitting widget_type from the description. Be concise, friendly, and professional in copy. Use sensible defaults when unspecified.`;

const TOOL = {
  type: "function",
  function: {
    name: "generate_widget",
    description: "Generate a complete Widgetify embed widget configuration.",
    parameters: {
      type: "object",
      properties: {
        widget_type: { type: "string", enum: ["popup", "lead-form", "ai-chat"] },
        name: { type: "string" },
        rationale: { type: "string", description: "1-2 sentence explanation for the user." },
        config: { type: "object", additionalProperties: true },
      },
      required: ["widget_type", "name", "config"],
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string" || description.length > 2000) {
      return new Response(JSON.stringify({ error: "description required (<=2000 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: description },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "generate_widget" } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: "AI error", detail: text }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) {
      return new Response(JSON.stringify({ error: "AI did not return a widget" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const args = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
