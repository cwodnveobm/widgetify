import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Plus, Copy, Check, Eye, EyeOff, Sparkles, User, Palette, Globe, Lock, ArrowLeft,
  Camera, X, MousePointerClick, Share2, ExternalLink, Type, Layers, Layout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import { cn } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';
import { LastSetShareTokens } from '@/components/LastSetShareTokens';
import { LastSetQRCode } from '@/components/LastSetQRCode';
import { WidgetEditor, WidgetAddMenu } from '@/components/lastset/WidgetEditor';
import { WidgetRenderer } from '@/components/lastset/WidgetRenderer';
import { LastSetAnalytics } from '@/components/lastset/LastSetAnalytics';
import { LastSetEmbedSnippet } from '@/components/lastset/LastSetEmbedSnippet';
import {
  Widget, WidgetKind, defaultWidget, FONT_OPTIONS, SPACING_OPTIONS,
} from '@/lib/lastsetWidgets';

const THEMES = [
  { id: 'glass',   label: 'Glass',   bg: 'from-slate-900 to-slate-800', accent: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.2)' },
  { id: 'neon',    label: 'Neon',    bg: 'from-black to-gray-950',      accent: 'rgba(0,255,128,0.15)',   border: '#00ff80' },
  { id: 'aurora',  label: 'Aurora',  bg: 'from-purple-950 via-indigo-950 to-blue-950', accent: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.5)' },
  { id: 'minimal', label: 'Minimal', bg: 'from-white to-gray-50',       accent: 'rgba(0,0,0,0.04)',       border: 'rgba(0,0,0,0.1)' },
];
const SHAPES = [
  { id: 'rounded', label: 'Rounded' }, { id: 'pill', label: 'Pill' }, { id: 'sharp', label: 'Sharp' },
];
const SHAPE_RADIUS: Record<string, string> = { rounded: '16px', pill: '999px', sharp: '4px' };

interface LastSetProfile {
  id?: string;
  username: string; display_name: string; bio: string; avatar_url: string;
  theme: string; shape: string;
  widgets: Widget[];
  is_public: boolean;
  view_count?: number;
  font_family: string;
  accent_color: string;
  spacing: string;
}

const DEFAULT_PROFILE: LastSetProfile = {
  username: '', display_name: '', bio: '', avatar_url: '',
  theme: 'aurora', shape: 'rounded',
  widgets: [
    defaultWidget('link'),
    defaultWidget('social-row'),
    defaultWidget('email-capture'),
  ],
  is_public: true,
  font_family: 'Inter',
  accent_color: '#9b87f5',
  spacing: 'comfortable',
};

export default function LastSetBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LastSetProfile>(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Load existing profile
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase.from('lastset_profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          const widgets: Widget[] = (data as any).widgets?.length
            ? (data as any).widgets
            : ((data.links as unknown) as { label: string; url: string; icon?: string }[] || [])
                .map((l, i) => ({ id: `legacy_${i}_${Date.now()}`, kind: 'link' as const, label: l.label, url: l.url, icon: l.icon, style: 'button' as const }));
          setProfile({
            id: data.id, username: data.username, display_name: data.display_name,
            bio: data.bio || '', avatar_url: data.avatar_url || '',
            theme: data.theme, shape: data.shape, widgets,
            is_public: data.is_public, view_count: data.view_count ?? 0,
            font_family: (data as any).font_family || 'Inter',
            accent_color: (data as any).accent_color || '#9b87f5',
            spacing: (data as any).spacing || 'comfortable',
          });
          setUsernameAvailable(true);
        }
        setLoading(false);
      });
  }, [user]);

  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) { setUsernameAvailable(null); return; }
    setCheckingUsername(true);
    const { data } = await supabase.from('lastset_profiles').select('id, user_id').eq('username', value).maybeSingle();
    setCheckingUsername(false);
    setUsernameAvailable(!data || data.user_id === user?.id);
  };
  const handleUsernameChange = (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    setProfile(p => ({ ...p, username: clean }));
    setUsernameAvailable(null);
    if (usernameTimeout.current) clearTimeout(usernameTimeout.current);
    usernameTimeout.current = setTimeout(() => checkUsername(clean), 600);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) { setAuthMode('signin'); setAuthModalOpen(true); return; }
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;
      const { error: e1 } = await supabase.storage.from('lastset-avatars').upload(path, file, { upsert: true, contentType: file.type });
      if (e1) throw e1;
      const { data: { publicUrl } } = supabase.storage.from('lastset-avatars').getPublicUrl(path);
      setProfile(p => ({ ...p, avatar_url: `${publicUrl}?t=${Date.now()}` }));
      toast.success('Avatar uploaded');
    } catch (err: any) { toast.error(err.message || 'Upload failed'); }
    finally { setUploadingAvatar(false); }
  };

  const updateWidget = (id: string, patch: Widget) =>
    setProfile(p => ({ ...p, widgets: p.widgets.map(w => w.id === id ? patch : w) }));
  const removeWidget = (id: string) =>
    setProfile(p => ({ ...p, widgets: p.widgets.filter(w => w.id !== id) }));
  const addWidget = (kind: WidgetKind) => {
    if (profile.widgets.length >= 30) { toast.warning('Max 30 widgets'); return; }
    setProfile(p => ({ ...p, widgets: [...p.widgets, defaultWidget(kind)] }));
    setShowAddMenu(false);
  };
  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    setProfile(p => {
      const arr = [...p.widgets];
      const [moved] = arr.splice(r.source.index, 1);
      arr.splice(r.destination!.index, 0, moved);
      return { ...p, widgets: arr };
    });
  };

  const handleSave = async () => {
    if (!user) { setAuthMode('signin'); setAuthModalOpen(true); return; }
    if (!profile.username || profile.username.length < 3) { toast.error('Username must be 3+ characters'); return; }
    if (usernameAvailable === false) { toast.error('Username taken'); return; }
    if (!profile.display_name) { toast.error('Display name required'); return; }
    setSaving(true);
    const payload = {
      user_id: user.id, username: profile.username, display_name: profile.display_name,
      bio: profile.bio, avatar_url: profile.avatar_url, theme: profile.theme, shape: profile.shape,
      links: profile.widgets.filter(w => w.kind === 'link').map((w: any) => ({ label: w.label, url: w.url, icon: w.icon })) as any,
      widgets: profile.widgets as any,
      is_public: profile.is_public,
      font_family: profile.font_family, accent_color: profile.accent_color, spacing: profile.spacing,
    };
    let error;
    if (profile.id) {
      ({ error } = await supabase.from('lastset_profiles').update(payload as any).eq('id', profile.id));
    } else {
      const { data, error: e } = await supabase.from('lastset_profiles').insert(payload as any).select().single();
      error = e; if (data) setProfile(p => ({ ...p, id: data.id }));
    }
    setSaving(false);
    if (error) toast.error(error.message); else toast.success('Saved 🎉');
  };

  const CANONICAL_BASE = 'https://widgetify.vercel.app';
  const shareUrl = `${CANONICAL_BASE}/l/${profile.username}`;

  const copySafe = async (text: string) => {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch {}
    try {
      const ta = document.createElement('textarea'); ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
    } catch { return false; }
  };
  const handleCopyLink = async () => {
    if (!profile.username) { toast.error('Set a username first'); return; }
    const ok = await copySafe(shareUrl);
    if (!ok) { toast.error('Could not copy'); return; }
    setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Link copied');
  };
  const handleShare = async () => {
    if (!profile.username) { toast.error('Set a username first'); return; }
    const data = { title: `${profile.display_name || profile.username} on Widgetify`, text: profile.bio || '', url: shareUrl };
    try { if (navigator.share && (!navigator.canShare || navigator.canShare(data))) { await navigator.share(data); return; } }
    catch (e: any) { if (e?.name === 'AbortError') return; }
    await handleCopyLink();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  // Live preview style derivations
  const themeMeta = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const radius = SHAPE_RADIUS[profile.shape] || '16px';
  const isDark = profile.theme !== 'minimal';
  const textColor = isDark ? '#fff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const spacing = SPACING_OPTIONS.find(s => s.id === profile.spacing) || SPACING_OPTIONS[1];

  return (
    <>
      <SEOHead
        title="LastSet — Build Your Link-in-Bio | Widgetify"
        description="Build a high-performance link-in-bio with widgets, lead capture, payments, analytics and embeds."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation onAuthModalOpen={(mode) => { setAuthMode(mode); setAuthModalOpen(true); }} />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor */}
          <div className="w-full lg:w-[480px] flex-shrink-0 lg:border-r border-border overflow-y-auto">
            <div className="p-5 space-y-7">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted">
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> LastSet
                  </h1>
                  <p className="text-xs text-muted-foreground">Widget-driven link-in-bio</p>
                </div>
              </div>

              {/* Share + view stats */}
              {profile.id && profile.username && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm font-mono truncate">{shareUrl}</span>
                    <button onClick={handleCopyLink} aria-label="Copy" className="p-1.5 rounded-lg hover:bg-primary/10 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button onClick={handleShare} aria-label="Share" className="p-1.5 rounded-lg hover:bg-primary/10 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <a href={`/l/${profile.username}`} target="_blank" rel="noopener noreferrer" aria-label="Open" className="p-1.5 rounded-lg hover:bg-primary/10 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              )}

              {/* Profile */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Profile</h2>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Username *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input value={profile.username} onChange={e => handleUsernameChange(e.target.value)} placeholder="yourname" className="pl-7 font-mono text-sm" />
                    {checkingUsername && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">checking…</span>}
                    {!checkingUsername && usernameAvailable === true && profile.username && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500">✓</span>}
                    {!checkingUsername && usernameAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive">✗</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">widgetify.vercel.app/l/{profile.username || 'yourname'}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Display Name *</Label>
                  <Input value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  <Textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Creator • Designer • Builder ✨" className="resize-none" rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Avatar</Label>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = ''; }} />
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center"><User className="w-6 h-6 text-muted-foreground" /></div>
                      )}
                      {profile.avatar_url && (
                        <button onClick={() => setProfile(p => ({ ...p, avatar_url: '' }))} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                      )}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="flex-1 gap-2" disabled={uploadingAvatar}
                      onClick={() => { if (!user) { setAuthMode('signin'); setAuthModalOpen(true); return; } avatarInputRef.current?.click(); }}>
                      <Camera className="w-3.5 h-3.5" />
                      {uploadingAvatar ? 'Uploading…' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>
              </section>

              {/* Theme & customization */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Style</h2>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => setProfile(p => ({ ...p, theme: t.id }))}
                      className={cn('p-3 rounded-xl border-2 text-left transition-all',
                        profile.theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                      <div className={`h-8 rounded-lg bg-gradient-to-br ${t.bg} mb-2`} />
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {SHAPES.map(s => (
                    <button key={s.id} onClick={() => setProfile(p => ({ ...p, shape: s.id }))}
                      className={cn('flex-1 py-2 text-xs font-medium border-2 transition-all',
                        s.id === 'pill' ? 'rounded-full' : s.id === 'sharp' ? 'rounded-sm' : 'rounded-lg',
                        profile.shape === s.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40')}>{s.label}</button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Type className="w-3 h-3" /> Font</Label>
                    <Select value={profile.font_family} onValueChange={v => setProfile(p => ({ ...p, font_family: v }))}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{FONT_OPTIONS.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Layout className="w-3 h-3" /> Spacing</Label>
                    <Select value={profile.spacing} onValueChange={v => setProfile(p => ({ ...p, spacing: v }))}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{SPACING_OPTIONS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Brand color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={profile.accent_color} onChange={e => setProfile(p => ({ ...p, accent_color: e.target.value }))}
                      className="w-10 h-9 rounded border border-border cursor-pointer bg-transparent" />
                    <Input value={profile.accent_color} onChange={e => setProfile(p => ({ ...p, accent_color: e.target.value }))} className="h-9 text-xs font-mono" />
                  </div>
                </div>
              </section>

              {/* Widgets — drag and drop */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Widgets</h2>
                  <span className="text-xs text-muted-foreground">{profile.widgets.length}/30</span>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="widgets">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                        {profile.widgets.map((w, i) => (
                          <Draggable key={w.id} draggableId={w.id} index={i}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps}>
                                <WidgetEditor widget={w}
                                  dragHandleProps={p.dragHandleProps}
                                  onChange={(nw) => updateWidget(w.id, nw)}
                                  onRemove={() => removeWidget(w.id)} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {showAddMenu ? (
                  <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Choose a widget</span>
                      <button onClick={() => setShowAddMenu(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                    <WidgetAddMenu onAdd={addWidget} />
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowAddMenu(true)}>
                    <Plus className="w-4 h-4" /> Add widget
                  </Button>
                )}
              </section>

              {/* Analytics */}
              {profile.id && (
                <section><LastSetAnalytics profileId={profile.id} viewCount={profile.view_count ?? 0} /></section>
              )}

              {/* QR + share tokens */}
              {profile.id && profile.username && (
                <section className="space-y-3">
                  <LastSetQRCode url={shareUrl} filename={`lastset-${profile.username}.png`} />
                  <LastSetShareTokens profileId={profile.id} username={profile.username} />
                </section>
              )}

              {/* Embed snippet */}
              {profile.id && profile.username && profile.is_public && (
                <section><LastSetEmbedSnippet username={profile.username} /></section>
              )}

              {/* Visibility */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2">
                  {profile.is_public ? <Globe className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{profile.is_public ? 'Public' : 'Private'}</p>
                    <p className="text-xs text-muted-foreground">{profile.is_public ? 'Anyone with the link can view' : 'Only you can see it'}</p>
                  </div>
                </div>
                <button onClick={() => setProfile(p => ({ ...p, is_public: !p.is_public }))}
                  className={cn('relative w-10 h-6 rounded-full', profile.is_public ? 'bg-green-500' : 'bg-muted')}>
                  <span className={cn('absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform', profile.is_public && 'translate-x-4')} />
                </button>
              </div>

              <div className="flex gap-2 pb-6">
                <Button variant="outline" className="flex-1 gap-2 lg:hidden" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide' : 'Preview'}
                </Button>
                <Button className="flex-1 gap-2" onClick={handleSave} disabled={saving}>
                  {saving ? '…' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* Live preview pane */}
          <AnimatePresence>
            {showPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 hidden lg:flex items-start justify-center bg-muted/20 overflow-y-auto">
                <div className={`w-full min-h-full bg-gradient-to-br ${themeMeta.bg} flex items-start justify-center py-10 px-4`}
                  style={{ fontFamily: `${profile.font_family}, sans-serif` }}>
                  <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center mb-8 gap-3">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover" style={{ border: `2px solid ${themeMeta.border}` }} />
                      ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                          style={{ background: themeMeta.accent, border: `2px solid ${themeMeta.border}`, color: textColor }}>
                          {profile.display_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="text-lg font-bold" style={{ color: textColor }}>{profile.display_name || 'Your Name'}</h3>
                        {profile.username && <p className="text-xs" style={{ color: subColor }}>@{profile.username}</p>}
                        {profile.bio && <p className="text-xs mt-1.5" style={{ color: subColor }}>{profile.bio}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ gap: spacing.gap }}>
                      {profile.widgets.map(w => (
                        <WidgetRenderer key={w.id} widget={w} profileId={profile.id || 'preview'}
                          theme={themeMeta} borderRadius={radius}
                          textColor={textColor} subColor={subColor}
                          accentColor={profile.accent_color} pad={spacing.pad} isEmbed />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </>
  );
}
