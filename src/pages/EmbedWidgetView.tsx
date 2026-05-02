import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

/**
 * Public shareable widget page.
 * Loads embed.js with the given widget id so the widget renders on this host page.
 * Share URL: https://widgetify.lovable.app/w/:id
 */
export default function EmbedWidgetView() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      setError("Invalid widget ID");
      return;
    }
    const existing = document.querySelector(`script[data-widgetify-id="${id}"]`);
    if (existing) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `${window.location.origin}/embed.js`;
    s.setAttribute("data-id", id);
    s.setAttribute("data-widgetify-id", id);
    s.onerror = () => setError("Failed to load widget script");
    document.body.appendChild(s);
    return () => {
      // Clean up rendered widget host between navigations
      document.querySelectorAll(`[data-widgetify-id="${id}"]`).forEach((n) => n.remove());
    };
  }, [id]);

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
