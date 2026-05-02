import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

type WidgetLite = { id: string; name: string; widget_type: string };

interface Interaction {
  widget_id: string;
  event_type: string;
  created_at: string;
}

const EVENT_COLORS: Record<string, string> = {
  view: "hsl(var(--primary))",
  click: "hsl(var(--accent-foreground))",
  submit: "hsl(142 71% 45%)",
  open: "hsl(217 91% 60%)",
  close: "hsl(0 72% 51%)",
  trigger_fired: "hsl(38 92% 50%)",
  chat_message: "hsl(280 65% 60%)",
};

const ALL_EVENTS = ["view", "click", "submit", "open", "close", "trigger_fired", "chat_message"];

export function InteractionDashboard({ widgets }: { widgets: WidgetLite[] }) {
  const [days, setDays] = useState<number>(7);
  const [widgetFilter, setWidgetFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [rows, setRows] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (widgets.length === 0) return;
    setLoading(true);
    const since = startOfDay(subDays(new Date(), days - 1)).toISOString();
    const ids = widgets.map((w) => w.id);
    supabase
      .from("widget_interactions")
      .select("widget_id,event_type,created_at")
      .in("widget_id", ids)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(5000)
      .then(({ data }) => {
        setRows((data ?? []) as Interaction[]);
        setLoading(false);
      });
  }, [widgets, days]);

  const widgetMap = useMemo(() => {
    const m: Record<string, WidgetLite> = {};
    widgets.forEach((w) => (m[w.id] = w));
    return m;
  }, [widgets]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (widgetFilter !== "all" && r.widget_id !== widgetFilter) return false;
      if (typeFilter !== "all" && widgetMap[r.widget_id]?.widget_type !== typeFilter) return false;
      if (eventFilter !== "all" && r.event_type !== eventFilter) return false;
      return true;
    });
  }, [rows, widgetFilter, typeFilter, eventFilter, widgetMap]);

  // Build per-day series, one column per event type present
  const dailySeries = useMemo(() => {
    const buckets: Record<string, Record<string, number>> = {};
    for (let i = days - 1; i >= 0; i--) {
      const key = format(subDays(new Date(), i), "MMM d");
      buckets[key] = {};
    }
    filtered.forEach((r) => {
      const key = format(new Date(r.created_at), "MMM d");
      if (!buckets[key]) buckets[key] = {};
      buckets[key][r.event_type] = (buckets[key][r.event_type] ?? 0) + 1;
    });
    return Object.entries(buckets).map(([day, counts]) => ({ day, ...counts }));
  }, [filtered, days]);

  const eventBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((r) => (counts[r.event_type] = (counts[r.event_type] ?? 0) + 1));
    return ALL_EVENTS
      .filter((e) => counts[e])
      .map((e) => ({ event: e, count: counts[e] }));
  }, [filtered]);

  const widgetTypeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((r) => {
      const t = widgetMap[r.widget_id]?.widget_type ?? "unknown";
      counts[t] = (counts[t] ?? 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [filtered, widgetMap]);

  const presentEvents = useMemo(
    () => ALL_EVENTS.filter((e) => dailySeries.some((d) => (d as Record<string, unknown>)[e])),
    [dailySeries]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span>Interaction analytics</span>
          <Badge variant="outline">{filtered.length} events</Badge>
        </CardTitle>
        <CardDescription>Filter by date range, widget, type and event.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs">Range</Label>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Widget</Label>
            <Select value={widgetFilter} onValueChange={setWidgetFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All widgets</SelectItem>
                {widgets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Widget type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="popup">Popup</SelectItem>
                <SelectItem value="lead-form">Lead form</SelectItem>
                <SelectItem value="ai-chat">AI chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Event</Label>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {ALL_EVENTS.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading analytics…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center border rounded-lg">
            No interactions in this range yet. Embed a widget on a site to start collecting events.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold mb-2">Events per day</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {presentEvents.map((e) => (
                      <Line
                        key={e}
                        type="monotone"
                        dataKey={e}
                        stroke={EVENT_COLORS[e] ?? "hsl(var(--primary))"}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">By event type</h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="event" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">By widget type</h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={widgetTypeBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
