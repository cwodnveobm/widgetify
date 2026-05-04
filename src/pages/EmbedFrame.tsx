import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

/**
 * iFrame-friendly embed host: /embed/:id?token=…
 * Renders only the widget, no app chrome — perfect for <iframe src="…/embed/ID"/>.
 */
export default function EmbedFrame() {
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
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
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
    <div style={{ minHeight: "100vh", background: "transparent" }}>
      {error && (
        <div style={{ padding: 16, fontFamily: "system-ui", color: "#b91c1c", textAlign: "center" }}>
          {error}
        </div>
      )}
    </div>
  );
}
