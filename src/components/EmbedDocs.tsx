import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const origin = typeof window !== "undefined" ? window.location.origin : "https://widgetify.vercel.app";

const Code = ({ children }: { children: string }) => (
  <pre className="bg-muted/50 border rounded-lg p-3 overflow-x-auto text-xs font-mono leading-relaxed">
    <code>{children}</code>
  </pre>
);

export function EmbedDocs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          embed.js — usage & integration
          <Badge variant="outline">v1.0</Badge>
        </CardTitle>
        <CardDescription>One async script. Three renderers. Drop into any HTML page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <section>
          <h4 className="font-semibold mb-2">1. Basic install</h4>
          <p className="text-muted-foreground mb-2">
            Paste the snippet just before <code className="font-mono text-xs">&lt;/body&gt;</code>. The script is async, non-blocking, and under 6&nbsp;KB gzipped.
          </p>
          <Code>{`<script async src="${origin}/embed.js" data-id="YOUR_WIDGET_ID"></script>`}</Code>
        </section>

        <section>
          <h4 className="font-semibold mb-2">2. Supported renderer types</h4>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><code className="font-mono text-xs">popup</code> — modal with time-delay, scroll-percent and exit-intent triggers; localStorage cooldown.</li>
            <li><code className="font-mono text-xs">lead-form</code> — floating button that opens a name/email/phone form.</li>
            <li><code className="font-mono text-xs">ai-chat</code> — chat bubble backed by Lovable AI Gateway with 24h session memory.</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            The renderer type is set on the widget itself — you don't pass it in the HTML.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-2">3. Multiple widgets on one page</h4>
          <p className="text-muted-foreground mb-2">Add as many tags as you want — the loader is a singleton and de-dupes by id.</p>
          <Code>{`<script async src="${origin}/embed.js" data-id="POPUP_ID"></script>
<script async src="${origin}/embed.js" data-id="CHAT_ID"></script>`}</Code>
        </section>

        <section>
          <h4 className="font-semibold mb-2">4. Host-page integration hooks</h4>
          <p className="text-muted-foreground mb-2">
            Subscribe to widget events via the global <code className="font-mono text-xs">Widgetify</code> object or DOM <code className="font-mono text-xs">CustomEvent</code>s.
            Both fire for every event: <code className="font-mono text-xs">view</code>, <code className="font-mono text-xs">click</code>, <code className="font-mono text-xs">submit</code>, <code className="font-mono text-xs">open</code>, <code className="font-mono text-xs">close</code>, <code className="font-mono text-xs">trigger_fired</code>, <code className="font-mono text-xs">chat_message</code>.
          </p>
          <Code>{`// Option A: Widgetify bus
Widgetify.on("submit", (payload) => {
  console.log("Lead captured", payload.widgetId, payload.data);
  // payload.data => { name, email, phone }
});

// Option B: window CustomEvent
window.addEventListener("widgetify:click", (e) => {
  // e.detail => { widgetId, data: { cta: "Get started" } }
});`}</Code>
        </section>

        <section>
          <h4 className="font-semibold mb-2">5. Forwarding leads to Google Tag Manager / GA4</h4>
          <Code>{`Widgetify.on("submit", (p) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "widgetify_lead", widget_id: p.widgetId, ...p.data });
});`}</Code>
        </section>

        <section>
          <h4 className="font-semibold mb-2">6. Optional script attributes</h4>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><code className="font-mono text-xs">data-id</code> <strong>(required)</strong> — UUID of the widget configured in this dashboard.</li>
            <li><code className="font-mono text-xs">data-base</code> — override the API base URL (advanced / self-hosted only).</li>
            <li><code className="font-mono text-xs">async</code> — recommended; the loader uses <code className="font-mono text-xs">requestIdleCallback</code> for non-blocking render.</li>
          </ul>
        </section>

        <section>
          <h4 className="font-semibold mb-2">7. Style isolation</h4>
          <p className="text-muted-foreground">
            Every widget renders inside its own Shadow DOM, so host-page CSS can't leak in or out. No conflicts with Tailwind, Bootstrap or custom resets.
          </p>
        </section>

        <section>
          <h4 className="font-semibold mb-2">8. Failure behaviour</h4>
          <p className="text-muted-foreground">
            Network errors are silently retried once. If the widget is inactive or deleted, nothing renders — your page is never blocked or broken.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
