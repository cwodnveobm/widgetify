import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink, Sparkles, Link2, Instagram, Twitter, Youtube,
  Github, Linkedin, Music, ShoppingBag, Mail, Phone, Globe2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';

const THEMES = [
  { id: 'glass', bg: 'from-slate-900 to-slate-800', accent: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.18)' },
  { id: 'neon', bg: 'from-black to-gray-950', accent: 'rgba(0,255,128,0.12)', border: '#00ff80' },
  { id: 'aurora', bg: 'from-purple-950 via-indigo-950 to-blue-950', accent: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.45)' },
  { id: 'minimal', bg: 'from-white to-gray-50', accent: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.10)' },
];

const SHAPES: Record<string, string> = {
  rounded: '16px',
  pill: '999px',
  sharp: '4px',
};

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  link: Link2,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  music: Music,
  shop: ShoppingBag,
  mail: Mail,
  phone: Phone,
  website: Globe2,
};

interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

interface LastSetProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
  shape: string;
  links: LinkItem[];
  is_public: boolean;
  view_count: number;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function recordClick(profileId: string, index: number, label: string, url: string) {
  // Fire-and-forget — never block the navigation
  supabase
    .from('lastset_link_clicks' as any)
    .insert({
      profile_id: profileId,
      link_index: index,
      link_label: label,
      link_url: url,
    })
    .then(() => {});
}

export default function LastSetPublic() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<LastSetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    supabase
      .from('lastset_profiles')
      .select('*')
      .eq('username', username)
      .eq('is_public', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!data || error) {
          setNotFound(true);
        } else {
          setProfile(data as any);
          // Increment view count (fire-and-forget, non-blocking)
          supabase
            .from('lastset_profiles')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id)
            .eq('is_public', true)
            .then(() => {});
        }
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <p className="text-white/50 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 gap-6">
        <SEOHead title="Profile Not Found | Widgetify" description="" />
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold text-white">@{username} not found</h1>
        <p className="text-white/50 text-sm">This profile doesn't exist or is private.</p>
        <Link to="/lastset" className="mt-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors">
          Create your own ✦
        </Link>
      </div>
    );
  }

  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const borderRadius = SHAPES[profile.shape] || '16px';
  const isDark = profile.theme !== 'minimal';
  const textColor = isDark ? '#ffffff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.55)' : '#6b7280';
  const glowColor = profile.theme === 'neon' ? '0 0 24px rgba(0,255,128,0.2)' : 'none';

  const links = (profile.links as LinkItem[]).filter(l => l.label && l.url);

  return (
    <>
      <SEOHead
        title={`${profile.display_name} (@${profile.username}) | Widgetify LastSet`}
        description={profile.bio || `Check out ${profile.display_name}'s links on Widgetify LastSet.`}
        image={profile.avatar_url || undefined}
      />

      <div
        className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {/* Ambient blobs */}
        {profile.theme === 'aurora' && (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}
        {profile.theme === 'neon' && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        )}

        <div className="relative z-10 min-h-screen flex flex-col items-center py-16 px-4">
          <div className="w-full max-w-sm">
            {/* Avatar + Identity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="flex flex-col items-center mb-10 gap-3"
            >
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ border: `2.5px solid ${theme.border}`, boxShadow: glowColor }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      background: theme.accent,
                      border: `2.5px solid ${theme.border}`,
                      color: textColor,
                      boxShadow: glowColor,
                    }}
                  >
                    {profile.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary))' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold" style={{ color: textColor }}>{profile.display_name}</h1>
                <p className="text-sm mt-0.5" style={{ color: subColor }}>@{profile.username}</p>
                {profile.bio && (
                  <p className="text-sm mt-2 max-w-xs text-center leading-relaxed" style={{ color: subColor }}>
                    {profile.bio}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              className="flex flex-col gap-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {links.map((link, i) => {
                const IconComp = ICON_MAP[link.icon || 'link'] || Link2;
                const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                return (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={item}
                    whileHover={{ scale: 1.035, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => recordClick(profile.id, i, link.label, href)}
                    className="flex items-center gap-4 px-5 py-4 group cursor-pointer"
                    style={{
                      background: theme.accent,
                      border: `1.5px solid ${theme.border}`,
                      borderRadius,
                      backdropFilter: profile.theme === 'glass' ? 'blur(16px)' : undefined,
                      boxShadow: profile.theme === 'neon'
                        ? '0 0 12px rgba(0,255,128,0.08)'
                        : '0 2px 12px rgba(0,0,0,0.12)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: subColor }}>
                      <IconComp className="w-5 h-5" />
                    </span>
                    <span
                      className="flex-1 font-semibold text-sm"
                      style={{ color: textColor }}
                    >
                      {link.label}
                    </span>
                    <ExternalLink
                      className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity"
                      style={{ color: textColor }}
                    />
                  </motion.a>
                );
              })}

              {links.length === 0 && (
                <p className="text-center py-10 text-sm" style={{ color: subColor }}>
                  No links added yet.
                </p>
              )}
            </motion.div>

            {/* Watermark */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <a
                href="https://widgetify.lovable.app/lastset"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-opacity hover:opacity-100"
                style={{ color: subColor }}
              >
                ✦ Build yours on <strong>Widgetify</strong>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
