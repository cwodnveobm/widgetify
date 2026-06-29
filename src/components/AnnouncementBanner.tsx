import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, X } from "lucide-react";

interface Announcement { id: string; message: string; level: string }

export const AnnouncementBanner = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dismissed_announcements") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    supabase.from("system_announcements")
      .select("id, message, level")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem("dismissed_announcements", JSON.stringify(next));
  };

  const visible = items.filter((i) => !dismissed.includes(i.id));
  if (!visible.length) return null;

  return (
    <div className="w-full">
      {visible.map((a) => (
        <div key={a.id} className="bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 text-sm">
          <Megaphone className="w-4 h-4 shrink-0" />
          <span className="flex-1">{a.message}</span>
          <button onClick={() => dismiss(a.id)} aria-label="Dismiss" className="opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
