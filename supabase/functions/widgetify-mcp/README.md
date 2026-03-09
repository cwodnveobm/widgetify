# Widgetify MCP Server

A **Model Context Protocol (MCP)** server exposing the full Widgetify widget-creation platform as structured tools for AI agents, LLM clients, and automated pipelines.

---

## Endpoint

```
POST https://pibinmzsiwzatfljqkiu.supabase.co/functions/v1/widgetify-mcp
```

---

## Authentication

All **user-scoped tools** require a valid Widgetify JWT.  
Pass it in the HTTP header **or** as the `jwt` field inside the MCP tool call arguments.

```http
Authorization: Bearer <your_jwt_token>
```

To obtain a JWT, sign in via the Widgetify app or call Supabase Auth directly:

```bash
curl -X POST 'https://pibinmzsiwzatfljqkiu.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: <ANON_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password"}'
```

---

## Available Tools

| Tool | Auth | Description |
|------|------|-------------|
| `list_widget_types` | No | Full catalogue of supported widget types |
| `list_templates` | No | Custom widget templates on the platform |
| `get_template` | No | Full config of a single template |
| `list_widgets` | Yes | All widgets owned by the user |
| `get_widget` | Yes | Full config of one widget |
| `create_widget` | Yes | Create a new custom widget |
| `update_widget` | Yes | Update widget properties |
| `delete_widget` | Yes | Permanently delete a widget |
| `generate_widget_code` | Yes | HTML embed snippet + preview URL |
| `get_lastset_profile` | No | Public link-in-bio profile by username |
| `upsert_lastset_profile` | Yes | Create / update your link-in-bio page |
| `list_ab_tests` | Yes | All A/B tests for the user |
| `get_ab_test` | Yes | A/B test details + variations |
| `get_subscription_status` | Yes | Current subscription plan & status |

---

## Example MCP Requests

### List widget types (no auth)

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_widget_types",
    "arguments": { "category": "Social" }
  }
}
```

### Create a widget

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "create_widget",
    "arguments": {
      "jwt": "<your_jwt>",
      "name": "WhatsApp Support Button",
      "title": "Chat with us on WhatsApp",
      "description": "We usually reply in under 5 minutes.",
      "button_text": "💬 WhatsApp",
      "button_color": "#25D366",
      "position": "bottom-right",
      "size": "medium",
      "button_action": "https://wa.me/1234567890"
    }
  }
}
```

### Generate embed code

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "generate_widget_code",
    "arguments": {
      "jwt": "<your_jwt>",
      "widget_id": "widget-uuid-here"
    }
  }
}
```

### Upsert a LastSet link-in-bio profile

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "upsert_lastset_profile",
    "arguments": {
      "jwt": "<your_jwt>",
      "username": "johndoe",
      "display_name": "John Doe",
      "bio": "Builder. Creator. Coffee addict.",
      "theme": "aurora",
      "shape": "pill",
      "links": [
        { "label": "My Website", "url": "https://johndoe.com", "icon": "Globe" },
        { "label": "Twitter", "url": "https://twitter.com/johndoe", "icon": "Twitter" }
      ]
    }
  }
}
```

---

## MCP Inspector (local testing)

```bash
npx @modelcontextprotocol/inspector
```

Point it to: `https://pibinmzsiwzatfljqkiu.supabase.co/functions/v1/widgetify-mcp`

---

## Connecting to Claude / Cursor / Windsurf

Add to your MCP client config:

```json
{
  "mcpServers": {
    "widgetify": {
      "url": "https://pibinmzsiwzatfljqkiu.supabase.co/functions/v1/widgetify-mcp",
      "headers": {
        "Authorization": "Bearer <your_jwt>"
      }
    }
  }
}
```

---

## Error Responses

All tools return structured errors:

```json
{
  "content": [{ "type": "text", "text": "{\"error\": \"Authentication required. Provide a JWT.\"}" }],
  "isError": true
}
```

Common error codes:
- `Authentication required` – missing JWT
- `Invalid or expired JWT` – bad/expired token
- `Widget not found` – wrong ID or wrong owner
- `<supabase error message>` – database-level error

---

## Extensibility

To add a new tool:

1. Call `mcp.tool({ name, description, inputSchema, handler })` in `index.ts`
2. The handler receives `(args, extra)` where `extra.request` is the raw HTTP request
3. Always return `{ content: [{ type: "text", text: JSON.stringify(result) }] }`
4. Set `isError: true` for failures

---

## Environment Variables (set automatically via Lovable Cloud)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (for cross-user reads) |
| `APP_URL` | Production app URL for building public links |
