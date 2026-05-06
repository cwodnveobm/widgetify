import { motion } from 'framer-motion';
import {
  ExternalLink, Mail, MessageCircle, Calendar, CreditCard, Link2,
  Instagram, Twitter, Youtube, Github, Linkedin, Music, ShoppingBag,
  Phone, Globe2,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from 'sonner';
import type { Widget } from '@/lib/lastsetWidgets';
import { ytEmbedUrl } from '@/lib/lastsetWidgets';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  link: Link2, instagram: Instagram, twitter: Twitter, youtube: Youtube,
  github: Github, linkedin: Linkedin, music: Music, shop: ShoppingBag,
  mail: Mail, phone: Phone, website: Globe2,
};

interface RenderProps {
  widget: Widget;
  profileId: string;
  theme: { accent: string; border: string };
  borderRadius: string;
  textColor: string;
  subColor: string;
  accentColor: string;
  pad: string;
  isEmbed?: boolean; // suppress payment etc. when embedded
}

export function WidgetRenderer({
  widget, profileId, theme, borderRadius, textColor, subColor, accentColor, pad, isEmbed,
}: RenderProps) {
  const baseStyle: React.CSSProperties = {
    background: theme.accent,
    border: `1.5px solid ${theme.border}`,
    borderRadius,
    padding: pad,
    color: textColor,
    textDecoration: 'none',
    display: 'block',
  };

  switch (widget.kind) {
    case 'link': {
      const Icon = ICON_MAP[widget.icon || 'link'] || Link2;
      const href = widget.url.startsWith('http') ? widget.url : `https://${widget.url}`;
      const variant = widget.style || 'button';
      const trackClick = () => {
        supabase.from('lastset_link_clicks' as any).insert({
          profile_id: profileId, link_index: 0,
          link_label: widget.label, link_url: href,
        }).then(() => {});
      };
      if (variant === 'banner') {
        return (
          <motion.a href={href} target="_blank" rel="noopener noreferrer" onClick={trackClick}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ ...baseStyle, background: accentColor, color: '#fff', textAlign: 'center', fontWeight: 700 }}>
            {widget.label}
          </motion.a>
        );
      }
      if (variant === 'card') {
        return (
          <motion.a href={href} target="_blank" rel="noopener noreferrer" onClick={trackClick}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            style={{ ...baseStyle, padding: '1.25rem' }}>
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: textColor }}>{widget.label}</div>
                <div className="text-xs truncate" style={{ color: subColor }}>{href.replace(/^https?:\/\//, '')}</div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </div>
          </motion.a>
        );
      }
      // button
      return (
        <motion.a href={href} target="_blank" rel="noopener noreferrer" onClick={trackClick}
          whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 group" style={baseStyle}>
          <Icon className="w-5 h-5" style={{ color: subColor }} />
          <span className="flex-1 font-semibold text-sm" style={{ color: textColor }}>{widget.label}</span>
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition" style={{ color: textColor }} />
        </motion.a>
      );
    }

    case 'social-row':
      return (
        <div className="flex justify-center gap-3 py-2" style={{ color: textColor }}>
          {widget.items.filter(i => i.url).map((s, i) => {
            const Icon = ICON_MAP[s.platform] || Link2;
            const href = s.url.startsWith('http') ? s.url : `https://${s.url}`;
            return (
              <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: theme.accent, border: `1.5px solid ${theme.border}` }}
                aria-label={s.platform}>
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </div>
      );

    case 'whatsapp': {
      const cleanPhone = widget.phone.replace(/\D/g, '');
      const href = `https://wa.me/${cleanPhone}${widget.message ? `?text=${encodeURIComponent(widget.message)}` : ''}`;
      return (
        <motion.a href={href} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ ...baseStyle, background: '#25D366', color: '#fff' }}
          className="flex items-center justify-center gap-2 font-semibold">
          <MessageCircle className="w-5 h-5" />
          {widget.label || 'Chat on WhatsApp'}
        </motion.a>
      );
    }

    case 'youtube': {
      const src = ytEmbedUrl(widget.url);
      if (!src) return <div style={{ ...baseStyle, color: subColor, textAlign: 'center' }}>Invalid YouTube URL</div>;
      return (
        <div style={{ borderRadius, overflow: 'hidden', border: `1.5px solid ${theme.border}` }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe src={src} title={widget.title || 'YouTube'} loading="lazy" allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          </div>
        </div>
      );
    }

    case 'booking':
      return (
        <motion.a href={widget.url} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ ...baseStyle, background: accentColor, color: '#fff' }}
          className="flex items-center justify-center gap-2 font-semibold">
          <Calendar className="w-5 h-5" />
          {widget.label}
        </motion.a>
      );

    case 'email-capture':
      return <EmailCaptureBlock widget={widget} profileId={profileId} baseStyle={baseStyle}
        accentColor={accentColor} subColor={subColor} textColor={textColor} />;

    case 'contact-form':
      return <ContactFormBlock widget={widget} profileId={profileId} baseStyle={baseStyle}
        accentColor={accentColor} subColor={subColor} textColor={textColor} theme={theme} />;

    case 'payment':
      return <PaymentBlock widget={widget} profileId={profileId} baseStyle={baseStyle}
        accentColor={accentColor} textColor={textColor} subColor={subColor} disabled={isEmbed} />;

    case 'header':
      return <h2 className="text-xs font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: subColor }}>{widget.text}</h2>;

    case 'divider':
      return <div style={{ height: 1, background: theme.border, margin: '0.25rem 0' }} />;
  }
}

// ─── Sub-blocks ──────────────────────────────────────────────────────────────

function EmailCaptureBlock({ widget, profileId, baseStyle, accentColor, subColor, textColor }: any) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Enter a valid email'); return; }
    setBusy(true);
    const { error } = await supabase.from('lastset_submissions' as any).insert({
      profile_id: profileId, widget_id: widget.id, widget_type: 'email-capture',
      data: { email },
    });
    setBusy(false);
    if (error) { toast.error('Failed to subscribe'); return; }
    setDone(true);
  };

  return (
    <div style={{ ...baseStyle, padding: '1.25rem' }}>
      <div className="font-semibold text-sm mb-3" style={{ color: textColor }}>{widget.heading}</div>
      {done ? (
        <p className="text-sm" style={{ color: subColor }}>{widget.successText || 'Thanks!'}</p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input type="email" required placeholder="you@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${baseStyle.border?.toString().split('solid ')[1] ?? 'rgba(255,255,255,0.2)'}`, color: textColor }} />
          <button type="submit" disabled={busy}
            className="px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
            style={{ background: accentColor, color: '#fff' }}>
            {busy ? '…' : widget.buttonText}
          </button>
        </form>
      )}
    </div>
  );
}

function ContactFormBlock({ widget, profileId, baseStyle, accentColor, subColor, textColor, theme }: any) {
  const [data, setData] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from('lastset_submissions' as any).insert({
      profile_id: profileId, widget_id: widget.id, widget_type: 'contact-form', data,
    });
    setBusy(false);
    if (error) { toast.error('Failed to send'); return; }
    setDone(true); setData({});
  };

  if (done) return <div style={{ ...baseStyle, padding: '1.25rem', textAlign: 'center' }}>
    <p style={{ color: textColor }} className="font-semibold">Thanks! We'll be in touch.</p>
  </div>;

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${theme.border}`,
    color: textColor,
  };

  return (
    <form onSubmit={submit} style={{ ...baseStyle, padding: '1.25rem' }} className="space-y-2">
      <div className="font-semibold text-sm mb-1" style={{ color: textColor }}>{widget.heading}</div>
      {widget.fields.includes('name') && (
        <input required placeholder="Name" value={data.name || ''} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 rounded-md text-sm outline-none" style={inputStyle} />
      )}
      {widget.fields.includes('email') && (
        <input required type="email" placeholder="Email" value={data.email || ''} onChange={e => setData({ ...data, email: e.target.value })}
          className="w-full px-3 py-2 rounded-md text-sm outline-none" style={inputStyle} />
      )}
      {widget.fields.includes('phone') && (
        <input type="tel" placeholder="Phone" value={data.phone || ''} onChange={e => setData({ ...data, phone: e.target.value })}
          className="w-full px-3 py-2 rounded-md text-sm outline-none" style={inputStyle} />
      )}
      {widget.fields.includes('message') && (
        <textarea required placeholder="Message" rows={3} value={data.message || ''} onChange={e => setData({ ...data, message: e.target.value })}
          className="w-full px-3 py-2 rounded-md text-sm outline-none resize-none" style={inputStyle} />
      )}
      <button type="submit" disabled={busy} className="w-full px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
        style={{ background: accentColor, color: '#fff' }}>
        {busy ? 'Sending…' : widget.buttonText}
      </button>
    </form>
  );
}

function PaymentBlock({ widget, profileId, baseStyle, accentColor, textColor, subColor, disabled }: any) {
  const { initiatePayment } = useRazorpay();
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    if (disabled) { toast.info('Open the full bio page to pay'); return; }
    setBusy(true);
    initiatePayment({
      amount: widget.amount / 100,
      currency: widget.currency || 'INR',
      purpose: 'donation',
      metadata: { profile_id: profileId, widget_id: widget.id, label: widget.label },
      onSuccess: async (paymentId) => {
        await supabase.from('lastset_payments' as any).insert({
          profile_id: profileId, widget_id: widget.id,
          amount: widget.amount, currency: widget.currency || 'INR',
          status: 'paid', razorpay_payment_id: paymentId,
        });
        setBusy(false);
      },
      onFailure: () => setBusy(false),
    });
  };

  return (
    <div style={{ ...baseStyle, padding: '1.25rem' }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="font-semibold text-sm" style={{ color: textColor }}>{widget.label}</div>
          {widget.description && <div className="text-xs mt-0.5" style={{ color: subColor }}>{widget.description}</div>}
        </div>
        <div className="text-lg font-bold" style={{ color: accentColor }}>
          {widget.currency === 'USD' ? '$' : '₹'}{(widget.amount / 100).toFixed(0)}
        </div>
      </div>
      <button onClick={pay} disabled={busy}
        className="w-full px-4 py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: accentColor, color: '#fff' }}>
        <CreditCard className="w-4 h-4" />
        {busy ? 'Processing…' : 'Pay Now'}
      </button>
    </div>
  );
}
