import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Play, Copy, Check, Lock, Globe, Terminal,
  Zap, BookOpen, Code2, AlertCircle, CheckCircle2, Loader2, ExternalLink
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─────────────────────────────────────────────
// Tool definitions — mirrors the MCP server
// ─────────────────────────────────────────────
const MCP_ENDPOINT = 'https://pibinmzsiwzatfljqkiu.supabase.co/functions/v1/widgetify-mcp';

interface ToolParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
}

interface MCPTool {
  name: string;
  description: string;
  requiresAuth: boolean;
  category: string;
  params: ToolParam[];
  example: object;
  exampleResponse: object;
}

const TOOLS: MCPTool[] = [
  {
    name: 'list_widget_types',
    description: 'Returns the full catalogue of widget types supported by Widgetify (70+ types across 10 categories). No authentication required.',
    requiresAuth: false,
    category: 'Discovery',
    params: [
      { name: 'category', type: 'string', required: false, description: "Optional category filter e.g. 'Social', 'Ecommerce', 'Utility'" },
    ],
    example: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'list_widget_types', arguments: { category: 'Social' } } },
    exampleResponse: { total: 12, categories: ['Social', 'Communication', 'Ecommerce'], widgets: [{ type: 'whatsapp', category: 'Social', description: 'WhatsApp chat button' }] },
  },
  {
    name: 'list_templates',
    description: 'Lists custom widget templates on the platform with pagination support. No authentication required.',
    requiresAuth: false,
    category: 'Discovery',
    params: [
      { name: 'limit', type: 'number', required: false, description: 'Max results (default 20, max 100)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset (default 0)' },
    ],
    example: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'list_templates', arguments: { limit: 10, offset: 0 } } },
    exampleResponse: { total: 42, offset: 0, limit: 10, templates: [{ id: 'uuid', name: 'WhatsApp Support', title: 'Chat with us', position: 'bottom-right', size: 'medium' }] },
  },
  {
    name: 'get_template',
    description: 'Fetches the full configuration of a single custom widget template by its UUID. No authentication required.',
    requiresAuth: false,
    category: 'Discovery',
    params: [
      { name: 'template_id', type: 'string', required: true, description: 'UUID of the custom widget template' },
    ],
    example: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_template', arguments: { template_id: 'your-template-uuid' } } },
    exampleResponse: { id: 'uuid', name: 'WhatsApp Support', title: 'Chat with us', description: 'Support chat', button_text: '💬 Chat', button_color: '#25D366', position: 'bottom-right' },
  },
  {
    name: 'list_widgets',
    description: "Lists all custom widgets belonging to the authenticated user with full configuration details.",
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT (can also pass in Authorization header)' },
      { name: 'limit', type: 'number', required: false, description: 'Max results (default 20, max 100)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset (default 0)' },
    ],
    example: { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'list_widgets', arguments: { limit: 20 } } },
    exampleResponse: { total: 5, offset: 0, limit: 20, widgets: [{ id: 'uuid', name: 'Support Chat', title: 'Need help?', position: 'bottom-right', size: 'medium' }] },
  },
  {
    name: 'get_widget',
    description: 'Fetches the complete configuration of a specific custom widget by its UUID. Requires ownership.',
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'widget_id', type: 'string', required: true, description: 'UUID of the widget' },
    ],
    example: { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_widget', arguments: { widget_id: 'your-widget-uuid' } } },
    exampleResponse: { id: 'uuid', name: 'Support Chat', title: 'Need help?', description: 'We reply in 5 min', button_text: '💬 Chat', button_color: '#25D366', position: 'bottom-right', size: 'medium' },
  },
  {
    name: 'create_widget',
    description: 'Creates a new custom widget for the authenticated user. Returns the created widget with its generated UUID.',
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'name', type: 'string', required: true, description: 'Internal widget name' },
      { name: 'title', type: 'string', required: true, description: 'Visible popup/widget title' },
      { name: 'button_text', type: 'string', required: true, description: 'Label on the trigger button' },
      { name: 'description', type: 'string', required: false, description: 'Optional description shown in popup' },
      { name: 'button_color', type: 'string', required: false, description: 'Hex color for the button (default #9b87f5)' },
      { name: 'text_color', type: 'string', required: false, description: 'Hex text color (default #1A1F2C)' },
      { name: 'background_color', type: 'string', required: false, description: 'Popup background hex color (default #ffffff)' },
      { name: 'position', type: 'string', required: false, description: 'Position on page', enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'] },
      { name: 'size', type: 'string', required: false, description: 'Widget size', enum: ['small', 'medium', 'large'] },
      { name: 'border_radius', type: 'string', required: false, description: "CSS border-radius (default '12px')" },
      { name: 'button_action', type: 'string', required: false, description: 'URL triggered on button click' },
      { name: 'custom_css', type: 'string', required: false, description: 'Extra CSS injected into the widget' },
    ],
    example: { jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'create_widget', arguments: { name: 'WhatsApp Support', title: 'Chat with us on WhatsApp', description: 'We usually reply in under 5 minutes.', button_text: '💬 WhatsApp', button_color: '#25D366', position: 'bottom-right', size: 'medium', button_action: 'https://wa.me/1234567890' } } },
    exampleResponse: { success: true, message: 'Widget created.', widget: { id: 'new-uuid', name: 'WhatsApp Support', title: 'Chat with us on WhatsApp' } },
  },
  {
    name: 'update_widget',
    description: 'Updates one or more properties of an existing custom widget. Only the provided fields are changed.',
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'widget_id', type: 'string', required: true, description: 'UUID of the widget to update' },
      { name: 'name', type: 'string', required: false, description: 'New internal name' },
      { name: 'title', type: 'string', required: false, description: 'New popup title' },
      { name: 'button_text', type: 'string', required: false, description: 'New button label' },
      { name: 'button_color', type: 'string', required: false, description: 'New button hex color' },
      { name: 'position', type: 'string', required: false, description: 'New position', enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'] },
      { name: 'size', type: 'string', required: false, description: 'New size', enum: ['small', 'medium', 'large'] },
      { name: 'button_action', type: 'string', required: false, description: 'New action URL' },
    ],
    example: { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'update_widget', arguments: { widget_id: 'your-widget-uuid', button_color: '#FF5722', title: 'New Title!' } } },
    exampleResponse: { success: true, message: 'Widget updated.', widget: { id: 'uuid', title: 'New Title!', button_color: '#FF5722' } },
  },
  {
    name: 'delete_widget',
    description: 'Permanently deletes a custom widget. This action is irreversible and cannot be undone.',
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'widget_id', type: 'string', required: true, description: 'UUID of the widget to delete' },
    ],
    example: { jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'delete_widget', arguments: { widget_id: 'your-widget-uuid' } } },
    exampleResponse: { success: true, message: 'Widget your-widget-uuid deleted.' },
  },
  {
    name: 'generate_widget_code',
    description: "Generates a ready-to-paste HTML embed snippet for a custom widget plus a direct preview URL.",
    requiresAuth: true,
    category: 'Widget Management',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'widget_id', type: 'string', required: true, description: 'UUID of the widget' },
    ],
    example: { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'generate_widget_code', arguments: { widget_id: 'your-widget-uuid' } } },
    exampleResponse: { widget_id: 'uuid', widget_name: 'Support Chat', preview_url: 'https://widgetify.lovable.app/?widget=uuid', embed_code: '<script>/* ... */</script>', instructions: 'Paste embed_code before </body> on any HTML page.' },
  },
  {
    name: 'get_lastset_profile',
    description: "Fetches the LastSet link-in-bio profile for a given username. Public profiles are readable without auth.",
    requiresAuth: false,
    category: 'LastSet',
    params: [
      { name: 'username', type: 'string', required: true, description: "The unique LastSet username e.g. 'johndoe'" },
    ],
    example: { jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'get_lastset_profile', arguments: { username: 'johndoe' } } },
    exampleResponse: { username: 'johndoe', display_name: 'John Doe', bio: 'Builder. Creator.', theme: 'aurora', shape: 'pill', links: [{ label: 'Website', url: 'https://johndoe.com', icon: 'Globe' }], view_count: 421, public_url: 'https://widgetify.lovable.app/l/johndoe' },
  },
  {
    name: 'upsert_lastset_profile',
    description: "Creates or updates the authenticated user's LastSet link-in-bio profile. Uses upsert — safe to call multiple times.",
    requiresAuth: true,
    category: 'LastSet',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'username', type: 'string', required: true, description: 'Unique URL slug (lowercase, alphanumeric + hyphens)' },
      { name: 'display_name', type: 'string', required: true, description: 'Name shown on the profile page' },
      { name: 'bio', type: 'string', required: false, description: 'Short bio / tagline' },
      { name: 'avatar_url', type: 'string', required: false, description: 'URL to avatar image' },
      { name: 'theme', type: 'string', required: false, description: 'Visual theme', enum: ['glass', 'neon', 'aurora', 'minimal'] },
      { name: 'shape', type: 'string', required: false, description: 'Button shape style', enum: ['rounded', 'pill', 'sharp'] },
      { name: 'is_public', type: 'boolean', required: false, description: 'Whether profile is publicly accessible' },
      { name: 'links', type: 'array', required: false, description: 'Array of { label, url, icon? } link objects' },
    ],
    example: { jsonrpc: '2.0', id: 11, method: 'tools/call', params: { name: 'upsert_lastset_profile', arguments: { username: 'johndoe', display_name: 'John Doe', bio: 'Builder. Creator. Coffee addict.', theme: 'aurora', shape: 'pill', links: [{ label: 'My Website', url: 'https://johndoe.com', icon: 'Globe' }, { label: 'Twitter', url: 'https://twitter.com/johndoe', icon: 'Twitter' }] } } },
    exampleResponse: { success: true, profile: { username: 'johndoe', display_name: 'John Doe', theme: 'aurora' }, public_url: 'https://widgetify.lovable.app/l/johndoe' },
  },
  {
    name: 'list_ab_tests',
    description: "Lists all A/B tests created by the authenticated user, optionally filtered by status.",
    requiresAuth: true,
    category: 'A/B Testing',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'status', type: 'string', required: false, description: 'Optional status filter', enum: ['draft', 'running', 'paused', 'completed'] },
    ],
    example: { jsonrpc: '2.0', id: 12, method: 'tools/call', params: { name: 'list_ab_tests', arguments: { status: 'running' } } },
    exampleResponse: { total: 2, tests: [{ id: 'uuid', name: 'CTA Color Test', status: 'running', start_date: '2026-01-01' }] },
  },
  {
    name: 'get_ab_test',
    description: "Fetches details and all variation configs for a specific A/B test by its UUID.",
    requiresAuth: true,
    category: 'A/B Testing',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
      { name: 'test_id', type: 'string', required: true, description: 'UUID of the A/B test' },
    ],
    example: { jsonrpc: '2.0', id: 13, method: 'tools/call', params: { name: 'get_ab_test', arguments: { test_id: 'your-test-uuid' } } },
    exampleResponse: { test: { id: 'uuid', name: 'CTA Color Test', status: 'running' }, variations: [{ id: 'v1', name: 'Control', traffic_percentage: 50 }, { id: 'v2', name: 'Variant A', traffic_percentage: 50 }] },
  },
  {
    name: 'get_subscription_status',
    description: "Returns the current subscription plan and status for the authenticated user.",
    requiresAuth: true,
    category: 'Account',
    params: [
      { name: 'jwt', type: 'string', required: false, description: 'User JWT' },
    ],
    example: { jsonrpc: '2.0', id: 14, method: 'tools/call', params: { name: 'get_subscription_status', arguments: {} } },
    exampleResponse: { has_active_subscription: true, plan: 'pro', subscription: { plan_type: 'pro', status: 'active', start_date: '2026-01-01', amount: 999, currency: 'INR' } },
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(TOOLS.map(t => t.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  Discovery: 'bg-accent/40 text-accent-foreground border-accent',
  'Widget Management': 'bg-primary/15 text-primary border-primary/30',
  LastSet: 'bg-secondary/60 text-secondary-foreground border-secondary',
  'A/B Testing': 'bg-muted text-muted-foreground border-border',
  Account: 'bg-primary/10 text-primary border-primary/20',
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className={cn('p-1.5 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground', className)}>
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/50">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border/40">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-xs overflow-x-auto bg-muted/20 text-foreground font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamBadge({ required }: { required: boolean }) {
  return required
    ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">required</span>
    : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">optional</span>;
}

// ─────────────────────────────────────────────
// Live Try-It Panel
// ─────────────────────────────────────────────
function TryItPanel({ tool }: { tool: MCPTool }) {
  const [jwt, setJwt] = useState('');
  const [body, setBody] = useState(() => JSON.stringify(tool.example, null, 2));
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const run = useCallback(async () => {
    setStatus('loading');
    setResponse(null);
    try {
      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(body); } catch { setStatus('error'); setResponse('Invalid JSON — check your request body.'); return; }

      // Inject JWT into params.arguments if provided
      if (jwt && parsed.params && typeof parsed.params === 'object') {
        const params = parsed.params as Record<string, unknown>;
        if (params.arguments && typeof params.arguments === 'object') {
          (params.arguments as Record<string, unknown>).jwt = jwt;
        }
      }

      const res = await fetch(MCP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(parsed),
      });

      const text = await res.text();
      // Parse SSE or JSON
      let display = text;
      try {
        // Try to extract JSON from SSE data lines
        const dataLines = text.split('\n').filter(l => l.startsWith('data: '));
        if (dataLines.length > 0) {
          const jsonParts: unknown[] = [];
          for (const line of dataLines) {
            try { jsonParts.push(JSON.parse(line.slice(6))); } catch { /* skip */ }
          }
          if (jsonParts.length > 0) {
            display = JSON.stringify(jsonParts.length === 1 ? jsonParts[0] : jsonParts, null, 2);
          }
        } else {
          display = JSON.stringify(JSON.parse(text), null, 2);
        }
      } catch { /* keep raw */ }

      setResponse(display);
      setStatus(res.ok ? 'success' : 'error');
    } catch (e: unknown) {
      setStatus('error');
      setResponse(e instanceof Error ? e.message : 'Network error — check CORS or endpoint availability.');
    }
  }, [body, jwt]);

  return (
    <div className="space-y-4">
      {tool.requiresAuth && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> JWT Bearer Token
          </label>
          <Input
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={jwt}
            onChange={e => setJwt(e.target.value)}
            className="font-mono text-xs h-8"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Sign in to Widgetify and copy your JWT from the browser's session storage, or obtain it via <code className="bg-muted px-1 rounded">supabase.auth.getSession()</code>.</p>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <Terminal className="w-3 h-3" /> Request Body (JSON-RPC 2.0)
        </label>
        <Textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          className="font-mono text-xs min-h-[180px] resize-y"
          spellCheck={false}
        />
      </div>

      <Button onClick={run} disabled={status === 'loading'} className="w-full gap-2">
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {status === 'loading' ? 'Sending...' : 'Send Request'}
      </Button>

      <AnimatePresence>
        {response !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              {status === 'success'
                ? <CheckCircle2 className="w-4 h-4 text-primary" />
                : <AlertCircle className="w-4 h-4 text-destructive" />}
              <span className={cn('text-xs font-semibold', status === 'success' ? 'text-primary' : 'text-destructive')}>
                {status === 'success' ? 'Response received' : 'Error'}
              </span>
              <CopyButton text={response} className="ml-auto" />
            </div>
            <pre className={cn(
              'p-3 rounded-lg border text-xs font-mono leading-relaxed overflow-x-auto max-h-64 overflow-y-auto',
              status === 'success' ? 'bg-primary/10 border-primary/20 text-foreground' : 'bg-destructive/10 border-destructive/20 text-destructive'
            )}>
              {response}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tool Card
// ─────────────────────────────────────────────
function ToolCard({ tool, index }: { tool: MCPTool; index: number }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'schema' | 'example' | 'try'>('schema');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-shadow',
        open ? 'shadow-elegant border-primary/30' : 'border-border/60 hover:border-border'
      )}
    >
      {/* Header */}
      <button
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-bold text-primary font-mono">{tool.name}</code>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', CATEGORY_COLORS[tool.category] ?? 'bg-muted text-muted-foreground border-border')}>
              {tool.category}
            </span>
            {tool.requiresAuth
              ? <span className="flex items-center gap-1 text-[10px] text-chart-4 font-semibold"><Lock className="w-3 h-3" /> Auth required</span>
              : <span className="flex items-center gap-1 text-[10px] text-primary font-semibold"><Globe className="w-3 h-3" /> Public</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40">
              {/* Tabs */}
              <div className="flex gap-0 border-b border-border/40">
                {(['schema', 'example', 'try'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      'px-4 py-2.5 text-xs font-semibold transition-colors capitalize border-b-2 -mb-px',
                      tab === t
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t === 'schema' ? 'Input Schema' : t === 'example' ? 'Examples' : 'Try It ▶'}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {tab === 'schema' && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      Endpoint: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">POST {MCP_ENDPOINT}</code>
                    </p>
                    {tool.params.length === 0
                      ? <p className="text-sm text-muted-foreground italic">No parameters required.</p>
                      : (
                        <div className="space-y-2">
                          {tool.params.map(p => (
                            <div key={p.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <code className="text-sm font-mono font-semibold text-foreground">{p.name}</code>
                                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">{p.type}</span>
                                  <ParamBadge required={p.required} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                                {p.enum && (
                                  <div className="flex gap-1 flex-wrap mt-1.5">
                                    {p.enum.map(v => (
                                      <code key={v} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">{v}</code>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {tab === 'example' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Request</h4>
                      <CodeBlock code={JSON.stringify(tool.example, null, 2)} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Example Response</h4>
                      <CodeBlock code={JSON.stringify(tool.exampleResponse, null, 2)} />
                    </div>
                    {tool.requiresAuth && (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 flex gap-2">
                        <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>This tool requires authentication. Pass your JWT in the <code>Authorization: Bearer &lt;token&gt;</code> header or as the <code>jwt</code> argument.</span>
                      </div>
                    )}
                  </div>
                )}

                {tab === 'try' && (
                  <TryItPanel tool={tool} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const MCPDocs: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const openAuthModal = (mode: 'signin' | 'signup') => { setAuthMode(mode); setShowAuthModal(true); };

  const filtered = TOOLS.filter(t => {
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(MCP_ENDPOINT);
    toast.success('Endpoint copied!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <Navigation onAuthModalOpen={openAuthModal} />

      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs font-mono">MCP Server v1.0</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
              Widgetify MCP API
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-6">
              Model Context Protocol server exposing all Widgetify capabilities as structured tools for AI agents, LLM clients, and automated pipelines.
            </p>

            {/* Endpoint pill */}
            <div className="inline-flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-4 py-2.5 font-mono text-sm max-w-full overflow-x-auto">
              <span className="text-primary font-bold text-xs">POST</span>
              <span className="text-foreground truncate">{MCP_ENDPOINT}</span>
              <button onClick={handleCopyEndpoint} className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
          >
            {[
              { label: 'Total Tools', value: '14' },
              { label: 'Public Tools', value: String(TOOLS.filter(t => !t.requiresAuth).length) },
              { label: 'Auth Tools', value: String(TOOLS.filter(t => t.requiresAuth).length) },
              { label: 'Widget Types', value: '70+' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Auth section */}
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-sm text-foreground">Authentication</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform ml-auto" />
            </summary>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">User-scoped tools require a valid Widgetify JWT. Pass it in the HTTP header <strong>or</strong> as the <code className="bg-muted px-1 rounded text-foreground">jwt</code> field inside the tool arguments.</p>
              <CodeBlock
                language="bash"
                code={`# Get a JWT via Supabase Auth
curl -X POST 'https://pibinmzsiwzatfljqkiu.supabase.co/auth/v1/token?grant_type=password' \\
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"user@example.com","password":"yourpassword"}'

# Then use it:
curl -X POST '${MCP_ENDPOINT}' \\
  -H 'Authorization: Bearer <your_jwt>' \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_widgets","arguments":{}}}'`}
              />
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300 flex gap-2">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Connect to Claude / Cursor / Windsurf: add <code className="bg-blue-900/30 px-1 rounded">{`{ "mcpServers": { "widgetify": { "url": "${MCP_ENDPOINT}", "headers": { "Authorization": "Bearer <jwt>" } } } }`}</code> to your MCP client config.</span>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Tools list */}
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-grow">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search tools…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="sm:max-w-xs h-9 text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''} {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}
          </h2>
          <a
            href="https://widgetify.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" /> Open Widgetify App
          </a>
        </div>

        <div className="space-y-3">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <Terminal className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tools match your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>
  );
};

export default MCPDocs;
