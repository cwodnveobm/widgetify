import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { MousePointerClick, Eye, Mail, CreditCard, TrendingUp, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Props { profileId: string; viewCount: number }

interface Submission { id: string; widget_type: string; data: any; created_at: string }
interface Click { link_index: number; link_label: string; clicked_at: string }
interface Payment { amount: number; currency: string; status: string; created_at: string }

export function LastSetAnalytics({ profileId, viewCount }: Props) {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, s, p] = await Promise.all([
        supabase.from('lastset_link_clicks' as any).select('link_index, link_label, clicked_at').eq('profile_id', profileId).order('clicked_at', { ascending: false }).limit(1000),
        supabase.from('lastset_submissions' as any).select('id, widget_type, data, created_at').eq('profile_id', profileId).order('created_at', { ascending: false }).limit(500),
        supabase.from('lastset_payments' as any).select('amount, currency, status, created_at').eq('profile_id', profileId).order('created_at', { ascending: false }).limit(500),
      ]);
      setClicks((c.data as any) || []);
      setSubs((s.data as any) || []);
      setPayments((p.data as any) || []);
      setLoading(false);
    })();
  }, [profileId]);

  const totalClicks = clicks.length;
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount / 100, 0);
  const conversionRate = viewCount > 0 ? ((totalClicks / viewCount) * 100).toFixed(1) : '0';

  // Last 14 days
  const days: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days[d.toISOString().slice(0, 10)] = 0;
  }
  clicks.forEach(c => {
    const k = c.clicked_at.slice(0, 10);
    if (k in days) days[k]++;
  });
  const chartData = Object.entries(days).map(([date, count]) => ({
    date: date.slice(5),
    clicks: count,
  }));

  // Top links
  const linkCounts: Record<string, number> = {};
  clicks.forEach(c => { linkCounts[c.link_label] = (linkCounts[c.link_label] || 0) + 1; });
  const topLinks = Object.entries(linkCounts).map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  const exportCsv = () => {
    if (subs.length === 0) { toast.info('No leads to export yet'); return; }
    const rows = [['type', 'data', 'created_at'], ...subs.map(s => [s.widget_type, JSON.stringify(s.data).replace(/"/g, '""'), s.created_at])];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `lastset-leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-sm text-muted-foreground py-4">Loading analytics…</div>;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" /> Analytics
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<Eye className="w-3.5 h-3.5" />} label="Views" value={viewCount.toLocaleString()} />
        <StatCard icon={<MousePointerClick className="w-3.5 h-3.5" />} label="Clicks" value={totalClicks.toLocaleString()} />
        <StatCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="CTR" value={`${conversionRate}%`} />
        <StatCard icon={<Mail className="w-3.5 h-3.5" />} label="Leads" value={subs.length.toLocaleString()} />
      </div>

      {totalRevenue > 0 && (
        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">₹{totalRevenue.toFixed(0)} earned</span>
          <span className="text-xs text-muted-foreground ml-auto">{payments.filter(p => p.status === 'paid').length} payments</span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-xs">Clicks · last 14 days</CardTitle></CardHeader>
        <CardContent className="px-2 pb-2">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {topLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs">Top performing links</CardTitle></CardHeader>
          <CardContent className="px-2 pb-2">
            <ResponsiveContainer width="100%" height={Math.max(80, topLinks.length * 28)}>
              <BarChart layout="vertical" data={topLinks}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={90} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {subs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Recent leads ({subs.length})</span>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={exportCsv}>
              <Download className="w-3 h-3" /> Export CSV
            </Button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {subs.slice(0, 10).map(s => (
              <div key={s.id} className="p-2 rounded-lg border border-border bg-card text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-primary">{s.widget_type}</span>
                  <span className="text-muted-foreground text-[10px]">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-0.5 text-foreground truncate">
                  {s.data.email || s.data.name || JSON.stringify(s.data).slice(0, 60)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">{icon} {label}</div>
      <div className="text-lg font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
