import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { WidgetRenderer } from '@/components/lastset/WidgetRenderer';
import type { Widget } from '@/lib/lastsetWidgets';
import { SPACING_OPTIONS } from '@/lib/lastsetWidgets';

const THEMES = [
  { id: 'glass',   bg: 'from-slate-900 to-slate-800', accent: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.18)' },
  { id: 'neon',    bg: 'from-black to-gray-950',      accent: 'rgba(0,255,128,0.12)',   border: '#00ff80' },
  { id: 'aurora',  bg: 'from-purple-950 via-indigo-950 to-blue-950', accent: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.45)' },
  { id: 'minimal', bg: 'from-white to-gray-50',       accent: 'rgba(0,0,0,0.04)',       border: 'rgba(0,0,0,0.10)' },
];

const SHAPES: Record<string, string> = { rounded: '16px', pill: '999px', sharp: '4px' };

interface LegacyLink { label: string; url: string; icon?: string }
interface LastSetProfile {
  id: string; username: string; display_name: string; bio: string;
  avatar_url: string; theme: string; shape: string;
  links: LegacyLink[]; widgets: Widget[];
  is_public: boolean; view_count: number;
  font_family?: string; accent_color?: string; spacing?: string;
}

export default function LastSetPublic() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const isEmbed = searchParams.get('embed') === '1' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/embed/lastset/'));
  const [profile, setProfile] = useState<LastSetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPrivateAccess, setIsPrivateAccess] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('lastset_profiles').select('*')
        .eq('username', username).eq('is_public', true).maybeSingle();
      if (cancelled) return;
      if (data) {
        setProfile(data as any);
        supabase.from('lastset_profiles')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id).eq('is_public', true).then(() => {});
        setLoading(false); return;
      }
      if (token && /^[a-f0-9]{16,128}$/i.test(token)) {
        const { data: rows } = await supabase.rpc('get_lastset_profile_by_token' as any, { _username: username, _token: token });
        const priv = Array.isArray(rows) ? rows[0] : rows;
        if (priv) {
          setProfile(priv as any); setIsPrivateAccess(true);
          setLoading(false); return;
        }
      }
      setNotFound(true); setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [username, token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    </div>
  );

  if (notFound || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 gap-6">
      <SEOHead title="Profile Not Found | Widgetify" description="" noindex />
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold text-white">@{username} not found</h1>
      <Link to="/lastset" className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20">Create your own ✦</Link>
    </div>
  );

  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const borderRadius = SHAPES[profile.shape] || '16px';
  const isDark = profile.theme !== 'minimal';
  const textColor = isDark ? '#ffffff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const accentColor = profile.accent_color || '#9b87f5';
  const fontFamily = `${profile.font_family || 'Inter'}, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  const spacing = SPACING_OPTIONS.find(s => s.id === profile.spacing) || SPACING_OPTIONS[1];

  // Backwards-compat: build widgets list from `widgets` if present, else from `links`
  const widgetList: Widget[] = (profile.widgets && profile.widgets.length)
    ? profile.widgets
    : (profile.links || []).map((l, i) => ({
        id: `legacy_${i}`, kind: 'link' as const,
        label: l.label, url: l.url, icon: l.icon, style: 'button' as const,
      }));

  return (
    <>
      <SEOHead
        title={`${profile.display_name} (@${profile.username}) | Widgetify LastSet`}
        description={profile.bio || `Check out ${profile.display_name}'s links on Widgetify LastSet.`}
        image={profile.avatar_url || undefined}
        type="profile"
        noindex={isPrivateAccess || !profile.is_public || isEmbed}
      />
      {profile.is_public && !isPrivateAccess && !isEmbed && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person', name: profile.display_name,
              alternateName: `@${profile.username}`, description: profile.bio || undefined,
              image: profile.avatar_url || undefined,
              url: `https://widgetify.vercel.app/l/${profile.username}`,
              sameAs: widgetList.filter(w => w.kind === 'link').map((w: any) => w.url),
            },
          }) }} />
      )}
      <h1 className="sr-only">{profile.display_name} (@{profile.username}) — Links</h1>

      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`} style={{ fontFamily }}>
        {profile.theme === 'aurora' && (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        <div className={`relative z-10 min-h-screen flex flex-col items-center px-4 ${isEmbed ? 'py-6' : 'py-16'}`}>
          <div className="w-full max-w-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="flex flex-col items-center mb-8 gap-3"
            >
              {isPrivateAccess && (
                <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: theme.accent, border: `1px solid ${theme.border}`, color: subColor }}>
                  Private preview
                </div>
              )}
              <div className="relative">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name}
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ border: `2.5px solid ${theme.border}` }} />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{ background: theme.accent, border: `2.5px solid ${theme.border}`, color: textColor }}>
                    {profile.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: accentColor }}>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold" style={{ color: textColor }}>{profile.display_name}</h1>
                <p className="text-sm mt-0.5" style={{ color: subColor }}>@{profile.username}</p>
                {profile.bio && <p className="text-sm mt-2 max-w-xs leading-relaxed" style={{ color: subColor }}>{profile.bio}</p>}
              </div>
            </motion.div>

            <motion.div className="flex flex-col" style={{ gap: spacing.gap }}
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
              {widgetList.map((w, i) => (
                <motion.div key={w.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <WidgetRenderer
                    widget={w} profileId={profile.id} theme={theme} index={i}
                    borderRadius={borderRadius} textColor={textColor} subColor={subColor}
                    accentColor={accentColor} pad={spacing.pad} isEmbed={isEmbed}
                  />
                </motion.div>
              ))}
              {widgetList.length === 0 && (
                <p className="text-center py-10 text-sm" style={{ color: subColor }}>No content yet.</p>
              )}
            </motion.div>

            {!isEmbed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-12 text-center">
                <a href="https://widgetify.vercel.app/lastset" target="_blank" rel="noopener noreferrer"
                  className="text-xs hover:opacity-100" style={{ color: subColor }}>
                  ✦ Build yours on <strong>Widgetify</strong>
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
