import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Shield, ShieldCheck, ShieldX, Users, Clock, CheckCircle, XCircle,
  Loader2, Megaphone, MessageSquare, CreditCard, BellRing, Send,
  Trash2, BarChart3, Coins, Crown, Bot,
} from 'lucide-react';
import { toast } from 'sonner';
import { AuthModal } from '@/components/AuthModal';
import { ReauthGate, requestReauth, clearReauth, getCachedReauthPassword } from '@/components/admin/ReauthGate';

/* ---------- Types ---------- */
interface CreatorVerification {
  id: string; user_id: string; instagram_handle: string;
  follower_count: number | null; status: string; badge_type: string;
  earning_multiplier: number; application_note: string | null;
  rejection_reason: string | null; created_at: string; updated_at: string;
}
interface Stats {
  users: number; activeSubs: number; widgets: number;
  lastsetProfiles: number; openSupport: number; activeAnnouncements: number;
}
interface AdminUser { user_id: string; email: string; full_name: string | null; created_at: string }
interface AdminSub { id: string; user_id: string; plan_type: string; amount: number; currency: string; status: string; start_date: string; end_date: string | null }
interface SupportMsg { id: string; name: string; email: string; subject: string; message: string; status: string; created_at: string }
interface Announcement { id: string; message: string; level: string; active: boolean; created_by: string | null; expires_at: string | null; created_at: string }

/* ---------- API helper ---------- */
const SENSITIVE_ACTIONS = new Set([
  'grant_premium', 'revoke_premium', 'add_credits',
  'delete_widget', 'delete_lastset', 'broadcast', 'clear_announcements',
]);

async function adminCall<T = any>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const body: Record<string, unknown> = { action, payload };
  if (SENSITIVE_ACTIONS.has(action)) {
    let pw = getCachedReauthPassword();
    if (!pw) {
      pw = await requestReauth();
      if (!pw) throw new Error('Re-authentication cancelled');
    }
    body.reauth_password = pw;
  }
  const { data, error } = await supabase.functions.invoke('admin-actions', { body });
  if (error) throw new Error(error.message);
  const err = (data as any)?.error;
  if (err) {
    if (err === 'reauth_required' || err === 'reauth_failed') {
      clearReauth();
      throw new Error((data as any).message || 'Password re-authentication required');
    }
    throw new Error(err);
  }
  return data as T;
}


/* ============================================================
   Stats overview
============================================================ */
const StatTile = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number | string; accent: string }) => (
  <div className={`border-2 border-foreground bg-card p-4 shadow-[4px_4px_0_0_hsl(var(--foreground))] ${accent}`}>
    <div className="flex items-center gap-3">
      <Icon className="w-7 h-7" />
      <div>
        <p className="text-2xl font-black leading-none">{value}</p>
        <p className="text-xs uppercase tracking-wider font-semibold mt-1">{label}</p>
      </div>
    </div>
  </div>
);

const OverviewTab = ({ stats, loading, reload }: { stats: Stats | null; loading: boolean; reload: () => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatTile icon={Users}      label="Users"           value={stats?.users ?? '—'}              accent="bg-primary/10" />
      <StatTile icon={Crown}      label="Active subs"     value={stats?.activeSubs ?? '—'}         accent="bg-accent/10" />
      <StatTile icon={BarChart3}  label="Widgets"         value={stats?.widgets ?? '—'}            accent="bg-secondary/10" />
      <StatTile icon={MessageSquare} label="LastSet"      value={stats?.lastsetProfiles ?? '—'}    accent="bg-primary/10" />
      <StatTile icon={BellRing}   label="Open support"    value={stats?.openSupport ?? '—'}        accent="bg-destructive/10" />
      <StatTile icon={Megaphone}  label="Live banners"    value={stats?.activeAnnouncements ?? '—'} accent="bg-accent/10" />
    </div>
    <Button onClick={reload} variant="outline" disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
      Refresh stats
    </Button>
  </div>
);

/* ============================================================
   Users tab
============================================================ */
const UsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  const [grantDays, setGrantDays] = useState<Record<string, number>>({});
  const [creditAmts, setCreditAmts] = useState<Record<string, number>>({});
  const [notifyMsgs, setNotifyMsgs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { users } = await adminCall<{ users: AdminUser[] }>('list_users', { limit: 50, search });
      setUsers(users || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const run = async (id: string, fn: () => Promise<void>) => {
    setPending(id);
    try { await fn(); } finally { setPending(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          className="border-2 border-foreground"
        />
        <Button onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {users.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground py-8 text-center">No users found.</p>
      )}

      {users.map((u) => {
        const id = u.user_id;
        return (
          <Card key={id} className="border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <CardContent className="pt-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{u.full_name || '—'}</p>
                  <p className="text-sm text-muted-foreground break-all">{u.email}</p>
                </div>
                <Badge variant="outline" className="border-2 border-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Grant premium */}
                <div className="border border-dashed border-foreground/40 p-3 space-y-2">
                  <Label className="text-xs uppercase font-bold flex items-center gap-1"><Crown className="w-3 h-3" /> Grant premium</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number" min={1} max={365}
                      value={grantDays[id] ?? 30}
                      onChange={(e) => setGrantDays((p) => ({ ...p, [id]: parseInt(e.target.value) || 30 }))}
                    />
                    <Button size="sm" disabled={pending === `g-${id}`}
                      onClick={() => run(`g-${id}`, async () => {
                        try {
                          const r = await adminCall<{ message: string }>('grant_premium', { email: u.email, days: grantDays[id] ?? 30 });
                          toast.success(r.message);
                        } catch (e: any) { toast.error(e.message); }
                      })}>
                      {pending === `g-${id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Grant'}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" disabled={pending === `r-${id}`}
                    onClick={() => run(`r-${id}`, async () => {
                      try {
                        const r = await adminCall<{ message: string }>('revoke_premium', { email: u.email });
                        toast.success(r.message);
                      } catch (e: any) { toast.error(e.message); }
                    })}>
                    <XCircle className="w-3 h-3 mr-1" /> Revoke
                  </Button>
                </div>

                {/* Credits */}
                <div className="border border-dashed border-foreground/40 p-3 space-y-2">
                  <Label className="text-xs uppercase font-bold flex items-center gap-1"><Coins className="w-3 h-3" /> Adjust credits</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={creditAmts[id] ?? 100}
                      onChange={(e) => setCreditAmts((p) => ({ ...p, [id]: parseInt(e.target.value) || 0 }))}
                    />
                    <Button size="sm" disabled={pending === `c-${id}`}
                      onClick={() => run(`c-${id}`, async () => {
                        try {
                          const r = await adminCall<{ message: string }>('add_credits', { email: u.email, amount: creditAmts[id] ?? 100 });
                          toast.success(r.message);
                        } catch (e: any) { toast.error(e.message); }
                      })}>
                      {pending === `c-${id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Use a negative number to deduct.</p>
                </div>

                {/* Notify */}
                <div className="border border-dashed border-foreground/40 p-3 space-y-2">
                  <Label className="text-xs uppercase font-bold flex items-center gap-1"><Send className="w-3 h-3" /> Send notification</Label>
                  <Textarea
                    rows={2}
                    placeholder="Message…"
                    value={notifyMsgs[id] ?? ''}
                    onChange={(e) => setNotifyMsgs((p) => ({ ...p, [id]: e.target.value }))}
                  />
                  <Button size="sm" className="w-full" disabled={pending === `n-${id}`}
                    onClick={() => run(`n-${id}`, async () => {
                      const msg = (notifyMsgs[id] ?? '').trim();
                      if (!msg) { toast.error('Message required'); return; }
                      try {
                        const r = await adminCall<{ message: string }>('notify_user', { email: u.email, message: msg });
                        toast.success(r.message);
                        setNotifyMsgs((p) => ({ ...p, [id]: '' }));
                      } catch (e: any) { toast.error(e.message); }
                    })}>
                    {pending === `n-${id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

/* ============================================================
   Subscriptions tab
============================================================ */
const SubsTab = () => {
  const [subs, setSubs] = useState<AdminSub[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { subscriptions } = await adminCall<{ subscriptions: AdminSub[] }>('list_subscriptions', { limit: 50 });
      setSubs(subscriptions || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button onClick={load} disabled={loading} variant="outline">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
        <Button onClick={async () => {
          try {
            const r = await adminCall<{ sent: number }>('send_expiry_reminders');
            toast.success(`Sent ${r.sent} reminder(s)`);
          } catch (e: any) { toast.error(e.message); }
        }}>
          <BellRing className="w-4 h-4 mr-2" />
          Send expiry reminders
        </Button>
      </div>
      <div className="grid gap-3">
        {subs.map((s) => (
          <Card key={s.id} className="border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold capitalize">{s.plan_type} — {s.currency} {s.amount}</p>
                <p className="text-xs text-muted-foreground">User {s.user_id.slice(0, 8)}…</p>
              </div>
              <div className="text-sm">
                Start: {s.start_date?.slice(0, 10)} · End: {s.end_date?.slice(0, 10) ?? '—'}
              </div>
              <Badge variant="outline" className="border-2 border-foreground capitalize">{s.status}</Badge>
            </CardContent>
          </Card>
        ))}
        {subs.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground py-8 text-center">No subscriptions yet.</p>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   Announcements tab
============================================================ */
const AnnouncementsTab = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('info');
  const [days, setDays] = useState(7);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { announcements } = await adminCall<{ announcements: Announcement[] }>('list_announcements');
      setItems(announcements || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const post = async () => {
    if (!message.trim()) { toast.error('Message required'); return; }
    setPosting(true);
    try {
      await adminCall('broadcast', { message: message.trim(), level, days });
      toast.success('Announcement live');
      setMessage('');
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setPosting(false); }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Megaphone className="w-5 h-5" /> New broadcast</CardTitle>
          <CardDescription>Shown as a banner to every signed-in user.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Heads up! We're shipping…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="grid grid-cols-2 gap-2">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" min={1} max={60} value={days} onChange={(e) => setDays(parseInt(e.target.value) || 7)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={post} disabled={posting} className="flex-1">
              {posting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Publish
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                const r = await adminCall<{ cleared: number }>('clear_announcements');
                toast.success(`Cleared ${r.cleared} banner(s)`);
                load();
              } catch (e: any) { toast.error(e.message); }
            }}>
              Clear all
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold uppercase tracking-wider text-sm">History</h3>
        {items.map((a) => (
          <Card key={a.id} className="border-2 border-foreground">
            <CardContent className="pt-5 flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                <p className="font-medium">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.level.toUpperCase()} · by {a.created_by ?? '—'} ·{' '}
                  {new Date(a.created_at).toLocaleString()}
                  {a.expires_at && ` · expires ${a.expires_at.slice(0, 10)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-2 border-foreground">
                  {a.active ? 'LIVE' : 'OFF'}
                </Badge>
                {a.active && (
                  <Button size="sm" variant="outline"
                    onClick={async () => {
                      try { await adminCall('deactivate_announcement', { id: a.id }); load(); }
                      catch (e: any) { toast.error(e.message); }
                    }}>
                    Disable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && !loading && <p className="text-sm text-muted-foreground">No announcements yet.</p>}
      </div>
    </div>
  );
};

/* ============================================================
   Support tab
============================================================ */
const SupportTab = () => {
  const [msgs, setMsgs] = useState<SupportMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { messages } = await adminCall<{ messages: SupportMsg[] }>('list_support', { limit: 50 });
      setMsgs(messages || []);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <Button onClick={load} variant="outline" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" />}
        Refresh
      </Button>
      {msgs.map((m) => (
        <Card key={m.id} className="border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
          <CardContent className="pt-5 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-bold">{m.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {m.name} &lt;{m.email}&gt; · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <Select value={m.status} onValueChange={async (s) => {
                try { await adminCall('update_support_status', { id: m.id, status: s }); load(); }
                catch (e: any) { toast.error(e.message); }
              }}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm whitespace-pre-wrap">{m.message}</p>
          </CardContent>
        </Card>
      ))}
      {msgs.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground py-8 text-center">Inbox zero. 🎉</p>
      )}
    </div>
  );
};

/* ============================================================
   Danger tab (delete by id/username)
============================================================ */
const DangerTab = () => {
  const [widgetId, setWidgetId] = useState('');
  const [lastsetUser, setLastsetUser] = useState('');

  const wipe = async (kind: 'widget' | 'lastset') => {
    const ok = window.confirm(`Permanently delete this ${kind}?`);
    if (!ok) return;
    try {
      if (kind === 'widget') {
        await adminCall('delete_widget', { id: widgetId.trim() });
        toast.success('Widget deleted'); setWidgetId('');
      } else {
        await adminCall('delete_lastset', { username: lastsetUser.trim() });
        toast.success('LastSet deleted'); setLastsetUser('');
      }
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="border-2 border-destructive shadow-[4px_4px_0_0_hsl(var(--destructive))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5" /> Delete embed widget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Widget UUID" value={widgetId} onChange={(e) => setWidgetId(e.target.value)} />
          <Button variant="destructive" disabled={!widgetId.trim()} onClick={() => wipe('widget')}>Delete</Button>
        </CardContent>
      </Card>
      <Card className="border-2 border-destructive shadow-[4px_4px_0_0_hsl(var(--destructive))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5" /> Delete LastSet profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="username" value={lastsetUser} onChange={(e) => setLastsetUser(e.target.value)} />
          <Button variant="destructive" disabled={!lastsetUser.trim()} onClick={() => wipe('lastset')}>Delete</Button>
        </CardContent>
      </Card>
    </div>
  );
};

/* ============================================================
   Creator verifications tab (existing functionality)
============================================================ */
const CreatorTab = () => {
  const [applications, setApplications] = useState<CreatorVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('creator_verifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) { toast.error('Failed to load applications'); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchApplications(); }, []);

  const handleApprove = async (a: CreatorVerification) => {
    setProcessingId(a.id);
    let badgeType = 'verified', multiplier = 1.5;
    if ((a.follower_count ?? 0) >= 50000) { badgeType = 'elite'; multiplier = 2.0; }
    else if ((a.follower_count ?? 0) >= 10000) { badgeType = 'premium'; multiplier = 1.75; }
    try {
      const { error } = await supabase.from('creator_verifications').update({
        status: 'approved', badge_type: badgeType, earning_multiplier: multiplier,
        verified_at: new Date().toISOString(), rejection_reason: null,
      }).eq('id', a.id);
      if (error) throw error;
      toast.success(`@${a.instagram_handle} approved`);
      fetchApplications();
    } catch (e: any) { toast.error(e.message); }
    finally { setProcessingId(null); }
  };

  const handleReject = async (a: CreatorVerification) => {
    const reason = rejectionReasons[a.id];
    if (!reason?.trim()) { toast.error('Provide a reason'); return; }
    setProcessingId(a.id);
    try {
      const { error } = await supabase.from('creator_verifications').update({
        status: 'rejected', rejection_reason: reason, badge_type: 'none', earning_multiplier: 1.0,
      }).eq('id', a.id);
      if (error) throw error;
      toast.success(`@${a.instagram_handle} rejected`);
      setRejectionReasons((p) => ({ ...p, [a.id]: '' }));
      fetchApplications();
    } catch (e: any) { toast.error(e.message); }
    finally { setProcessingId(null); }
  };

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin mx-auto" />;
  if (applications.length === 0) return <p className="text-sm text-muted-foreground py-8 text-center">No applications yet.</p>;

  return (
    <div className="space-y-3">
      {applications.map((a) => (
        <Card key={a.id} className="border-2 border-foreground">
          <CardContent className="pt-5 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold">@{a.instagram_handle}</span>
              <Badge variant="outline" className="capitalize">{a.status}</Badge>
              <span className="text-xs text-muted-foreground">
                {a.follower_count?.toLocaleString() ?? '—'} followers · {a.earning_multiplier}x
              </span>
            </div>
            {a.application_note && <p className="text-sm bg-muted/40 p-2">{a.application_note}</p>}
            {a.status === 'pending' && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Rejection reason"
                  value={rejectionReasons[a.id] || ''}
                  onChange={(e) => setRejectionReasons((p) => ({ ...p, [a.id]: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(a)} disabled={processingId === a.id}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(a)} disabled={processingId === a.id}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            )}
            {a.rejection_reason && <p className="text-sm text-destructive">Rejection: {a.rejection_reason}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/* ============================================================
   Page shell
============================================================ */
const AdminPanel: React.FC = () => {
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try { setStats(await adminCall<Stats>('stats')); }
    catch (e: any) { toast.error(e.message); }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { if (isAdmin) loadStats(); }, [isAdmin, loadStats]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto border-2 border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))]">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Admin access required</CardTitle>
              <CardDescription>Please sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setShowAuthModal(true)}>Sign in</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto border-2 border-destructive shadow-[6px_6px_0_0_hsl(var(--destructive))]">
            <CardHeader className="text-center">
              <ShieldX className="w-12 h-12 mx-auto text-destructive mb-4" />
              <CardTitle>Access denied</CardTitle>
              <CardDescription>You don't have permission to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="border-2 border-foreground bg-primary text-primary-foreground p-2 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Full control over users, subscriptions, broadcasts and support — mirrors the Telegram bot.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={async () => {
              const t = toast.loading('Pinging Telegram…');
              try {
                const { data, error } = await supabase.functions.invoke('notify-admin', {
                  body: { event: 'Admin dashboard ping', data: { by: user?.email } },
                });
                if (error) throw error;
                if ((data as any)?.error) throw new Error((data as any).error);
                toast.success('Telegram ping sent ✅', { id: t });
              } catch (e: any) { toast.error(e.message, { id: t }); }
            }}>
              <Bot className="w-4 h-4 mr-1" /> Ping Telegram
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 border-2 border-foreground bg-card p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subs">Subs</TabsTrigger>
            <TabsTrigger value="announce">Broadcast</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab stats={stats} loading={statsLoading} reload={loadStats} /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="subs"><SubsTab /></TabsContent>
          <TabsContent value="announce"><AnnouncementsTab /></TabsContent>
          <TabsContent value="support"><SupportTab /></TabsContent>
          <TabsContent value="more">
            <Tabs defaultValue="creators" className="w-full">
              <TabsList className="border-2 border-foreground bg-card mb-4">
                <TabsTrigger value="creators">Creators</TabsTrigger>
                <TabsTrigger value="danger">Danger zone</TabsTrigger>
              </TabsList>
              <TabsContent value="creators"><CreatorTab /></TabsContent>
              <TabsContent value="danger"><DangerTab /></TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
