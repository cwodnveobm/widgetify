import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

/**
 * Public / private shareable widget page.
 * Loads embed.js with the given widget id (and optional ?token=… for private widgets).
 *   Public:  /w/:id
 *   Private: /w/:id?token=…
 */
export default function EmbedWidgetView() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      setError("Invalid widget ID");
      return;
    }
    if (token && !/^[a-f0-9]{16,128}$/i.test(token)) {
      setError("Invalid share token");
      return;
    }
    const existing = document.querySelector(`script[data-widgetify-id="${id}"]`);
    if (existing) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `${window.location.origin}/embed.js`;
    s.setAttribute("data-id", id);
    s.setAttribute("data-widgetify-id", id);
    if (token) s.setAttribute("data-token", token);
    s.onerror = () => setError("Failed to load widget script");
    document.body.appendChild(s);
    return () => {
      document.querySelectorAll(`[data-widgetify-id="${id}"]`).forEach((n) => n.remove());
    };
  }, [id, token]);

  return (
    <>
      <SEOHead title="Widget Preview — Widgetify" description="Live shareable preview of a Widgetify embed widget." />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Live preview
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Widget preview</h1>
          <p className="text-muted-foreground">
            This page hosts your widget so anyone with the link can interact with it.
            Triggers, forms and AI chat run exactly as they would on a customer site.
          </p>
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Widget ID: <code className="font-mono">{id}</code>
            </p>
          )}
        </div>
      </main>
    </>
  );
}
