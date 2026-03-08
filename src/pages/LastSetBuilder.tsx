import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ExternalLink, Copy, Check, Save, Eye, EyeOff,
  Sparkles, Link2, User, Palette, Globe, Lock, Upload, ArrowLeft,
  GripVertical, Instagram, Twitter, Youtube, Github, Linkedin,
  Music, ShoppingBag, Mail, Phone, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import { cn } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';

const THEMES = [
  { id: 'glass', label: 'Glass', bg: 'from-slate-900 to-slate-800', accent: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.2)' },
  { id: 'neon', label: 'Neon', bg: 'from-black to-gray-950', accent: 'rgba(0,255,128,0.15)', border: '#00ff80' },
  { id: 'aurora', label: 'Aurora', bg: 'from-purple-950 via-indigo-950 to-blue-950', accent: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.5)' },
  { id: 'minimal', label: 'Minimal', bg: 'from-white to-gray-50', accent: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.1)' },
];

const SHAPES = [
  { id: 'rounded', label: 'Rounded', radius: '16px' },
  { id: 'pill', label: 'Pill', radius: '999px' },
  { id: 'sharp', label: 'Sharp', radius: '4px' },
];

const LINK_ICONS = [
  { id: 'link', label: 'Link', Icon: Link2 },
  { id: 'instagram', label: 'Instagram', Icon: Instagram },
  { id: 'twitter', label: 'Twitter/X', Icon: Twitter },
  { id: 'youtube', label: 'YouTube', Icon: Youtube },
  { id: 'github', label: 'GitHub', Icon: Github },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'music', label: 'Music', Icon: Music },
  { id: 'shop', label: 'Shop', Icon: ShoppingBag },
  { id: 'mail', label: 'Email', Icon: Mail },
  { id: 'phone', label: 'Phone', Icon: Phone },
  { id: 'website', label: 'Website', Icon: Globe2 },
];

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

interface LastSetProfile {
  id?: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
  shape: string;
  links: LinkItem[];
  is_public: boolean;
}

const DEFAULT_PROFILE: LastSetProfile = {
  username: '',
  display_name: '',
  bio: '',
  avatar_url: '',
  theme: 'glass',
  shape: 'rounded',
  links: [
    { label: 'My Website', url: 'https://', icon: 'website' },
    { label: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
  ],
  is_public: true,
};

// ─── Live Preview Component ──────────────────────────────────────────────────
function LivePreview({ profile }: { profile: LastSetProfile }) {
  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const shape = SHAPES.find(s => s.id === profile.shape) || SHAPES[0];

  const isDark = profile.theme !== 'minimal';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subColor = isDark ? 'text-white/60' : 'text-gray-500';

  const IconComp = ({ iconId }: { iconId?: string }) => {
    const found = LINK_ICONS.find(i => i.id === iconId);
    if (!found) return <Link2 className="w-4 h-4" />;
    const { Icon } = found;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className={`w-full min-h-screen bg-gradient-to-br ${theme.bg} flex items-start justify-center py-12 px-4`}>
      <div className="w-full max-w-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full object-cover ring-2"
                style={{ ringColor: theme.border }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ background: theme.accent, border: `2px solid ${theme.border}` }}
              >
                <span className={isDark ? 'text-white' : 'text-gray-700'}>
                  {profile.display_name ? profile.display_name[0]?.toUpperCase() : '?'}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </motion.div>
          <div className="text-center">
            <h1 className={`text-xl font-bold ${textColor}`}>{profile.display_name || 'Your Name'}</h1>
            {profile.username && (
              <p className={`text-sm ${subColor}`}>@{profile.username}</p>
            )}
            {profile.bio && (
              <p className={`text-sm mt-2 max-w-xs text-center ${subColor}`}>{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          {profile.links.filter(l => l.label && l.url).map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 180 }}
            >
              <div
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-all duration-200 group hover:scale-[1.03] hover:shadow-lg`}
                style={{
                  background: theme.accent,
                  border: `1px solid ${theme.border}`,
                  borderRadius: shape.radius,
                  backdropFilter: profile.theme === 'glass' ? 'blur(12px)' : undefined,
                }}
              >
                <span className={isDark ? 'text-white/70' : 'text-gray-500'}>
                  <IconComp iconId={link.icon} />
                </span>
                <span className={`flex-1 font-medium text-sm ${textColor}`}>{link.label}</span>
                <ExternalLink className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              </div>
            </motion.div>
          ))}
          {profile.links.filter(l => l.label && l.url).length === 0 && (
            <p className={`text-center text-sm py-6 ${subColor}`}>Add links to see them here…</p>
          )}
        </div>

        {/* Watermark */}
        <div className="mt-8 text-center">
          <a
            href="https://widgetify.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${subColor} hover:opacity-100 transition-opacity`}
          >
            ✦ Made with Widgetify
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Builder ────────────────────────────────────────────────────────────
export default function LastSetBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<LastSetProfile>(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Load existing profile
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('lastset_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            id: data.id,
            username: data.username,
            display_name: data.display_name,
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            theme: data.theme,
            shape: data.shape,
            links: (data.links as LinkItem[]) || [],
            is_public: data.is_public,
          });
          setUsernameAvailable(true);
        }
        setLoading(false);
      });
  }, [user]);

  // Check username availability
  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) { setUsernameAvailable(null); return; }
    setCheckingUsername(true);
    const { data } = await supabase
      .from('lastset_profiles')
      .select('id, user_id')
      .eq('username', value)
      .maybeSingle();
    setCheckingUsername(false);
    if (!data) {
      setUsernameAvailable(true);
    } else if (data.user_id === user?.id) {
      setUsernameAvailable(true); // their own username
    } else {
      setUsernameAvailable(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    setProfile(p => ({ ...p, username: clean }));
    setUsernameAvailable(null);
    if (usernameTimeout.current) clearTimeout(usernameTimeout.current);
    usernameTimeout.current = setTimeout(() => checkUsername(clean), 600);
  };

  const handleLinkChange = (i: number, field: keyof LinkItem, val: string) => {
    setProfile(p => ({
      ...p,
      links: p.links.map((l, idx) => idx === i ? { ...l, [field]: val } : l),
    }));
  };

  const addLink = () => {
    if (profile.links.length >= 12) { toast.warning('Maximum 12 links'); return; }
    setProfile(p => ({ ...p, links: [...p.links, { label: '', url: 'https://', icon: 'link' }] }));
  };

  const removeLink = (i: number) => {
    setProfile(p => ({ ...p, links: p.links.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    if (!user) { setAuthMode('signin'); setAuthModalOpen(true); return; }
    if (!profile.username || profile.username.length < 3) { toast.error('Username must be at least 3 characters'); return; }
    if (usernameAvailable === false) { toast.error('Username is already taken'); return; }
    if (!profile.display_name) { toast.error('Display name is required'); return; }

    setSaving(true);
    const payload = {
      user_id: user.id,
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      theme: profile.theme,
      shape: profile.shape,
      links: profile.links as any,
      is_public: profile.is_public,
    };

    let error;
    if (profile.id) {
      ({ error } = await supabase.from('lastset_profiles').update(payload).eq('id', profile.id));
    } else {
      const { data, error: insertError } = await supabase.from('lastset_profiles').insert(payload).select().single();
      error = insertError;
      if (data) setProfile(p => ({ ...p, id: data.id }));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile saved! 🎉');
    }
  };

  const shareUrl = `${window.location.origin}/l/${profile.username}`;

  const handleCopyLink = () => {
    if (!profile.username) { toast.error('Set a username first'); return; }
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="LastSet — Build Your Link-in-Bio | Widgetify"
        description="Create a stunning link-in-bio page with glassmorphism, neon, aurora, or minimal themes. Share everything with one beautiful URL."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation onAuthModalOpen={(mode) => { setAuthMode(mode); setAuthModalOpen(true); }} />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* ── Editor Panel ── */}
          <div className="w-full lg:w-[480px] flex-shrink-0 border-r border-border overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> LastSet
                  </h1>
                  <p className="text-xs text-muted-foreground">Your link-in-bio, reimagined for 2026</p>
                </div>
              </div>

              {/* Share URL */}
              {profile.id && profile.username && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="flex-1 text-sm text-foreground font-mono truncate">{shareUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <a href={`/l/${profile.username}`} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </motion.div>
              )}

              {/* Profile Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Profile
                </h2>

                {/* Username */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Username *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input
                      value={profile.username}
                      onChange={e => handleUsernameChange(e.target.value)}
                      placeholder="yourname"
                      className="pl-7 font-mono text-sm"
                    />
                    {checkingUsername && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">checking…</span>
                    )}
                    {!checkingUsername && usernameAvailable === true && profile.username && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500">✓ available</span>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive">✗ taken</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">widgetify.lovable.app/l/{profile.username || 'yourname'}</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Display Name *</Label>
                  <Input
                    value={profile.display_name}
                    onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Creator • Designer • Builder ✨"
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Avatar URL</Label>
                  <Input
                    value={profile.avatar_url}
                    onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Theme
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setProfile(p => ({ ...p, theme: theme.id }))}
                      className={cn(
                        'p-3 rounded-xl border-2 text-left transition-all',
                        profile.theme === theme.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <div className={`h-8 rounded-lg bg-gradient-to-br ${theme.bg} mb-2`} />
                      <span className="text-xs font-medium text-foreground">{theme.label}</span>
                    </button>
                  ))}
                </div>

                {/* Shape */}
                <div className="flex gap-2 mt-1">
                  {SHAPES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setProfile(p => ({ ...p, shape: s.id }))}
                      className={cn(
                        'flex-1 py-2 text-xs font-medium border-2 transition-all',
                        s.id === 'pill' ? 'rounded-full' : s.id === 'sharp' ? 'rounded-sm' : 'rounded-lg',
                        profile.shape === s.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" /> Links
                  <span className="ml-auto text-xs text-muted-foreground">{profile.links.length}/12</span>
                </h2>

                <div className="space-y-2">
                  <AnimatePresence>
                    {profile.links.map((link, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-xl border border-border bg-card space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                          <Input
                            value={link.label}
                            onChange={e => handleLinkChange(i, 'label', e.target.value)}
                            placeholder="Label (e.g. Instagram)"
                            className="flex-1 h-8 text-sm"
                          />
                          <button
                            onClick={() => removeLink(i)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Input
                          value={link.url}
                          onChange={e => handleLinkChange(i, 'url', e.target.value)}
                          placeholder="https://"
                          className="h-8 text-sm font-mono"
                        />
                        {/* Icon selector */}
                        <div className="flex gap-1 flex-wrap">
                          {LINK_ICONS.map(({ id, Icon }) => (
                            <button
                              key={id}
                              onClick={() => handleLinkChange(i, 'icon', id)}
                              title={id}
                              className={cn(
                                'p-1.5 rounded-md transition-colors',
                                link.icon === id
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-muted text-muted-foreground'
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2" onClick={addLink}>
                  <Plus className="w-4 h-4" /> Add Link
                </Button>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2">
                  {profile.is_public ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {profile.is_public ? 'Public' : 'Private'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.is_public ? 'Anyone with the link can view' : 'Only you can see this'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setProfile(p => ({ ...p, is_public: !p.is_public }))}
                  className={cn(
                    'relative w-10 h-6 rounded-full transition-colors',
                    profile.is_public ? 'bg-green-500' : 'bg-muted'
                  )}
                >
                  <span className={cn(
                    'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    profile.is_public && 'translate-x-4'
                  )} />
                </button>
              </div>

              {/* Save / Preview */}
              <div className="flex gap-2 pb-6">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {user ? (saving ? 'Saving…' : 'Save & Publish') : 'Sign in to Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Preview Panel (desktop always, mobile toggle) ── */}
          <div className={cn(
            'flex-1 overflow-auto',
            !showPreview && 'hidden lg:block'
          )}>
            <LivePreview profile={profile} />
          </div>
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}
