// Modular widget system for LastSet bio pages.
// Each widget is JSON-serializable and rendered by the public page + builder.

export type WidgetKind =
  | 'link'
  | 'social-row'
  | 'email-capture'
  | 'whatsapp'
  | 'youtube'
  | 'contact-form'
  | 'booking'
  | 'payment'
  | 'header'
  | 'divider';

export type CtaStyle = 'button' | 'card' | 'banner';

export interface BaseWidget {
  id: string;
  kind: WidgetKind;
  title?: string;
}

export interface LinkWidget extends BaseWidget {
  kind: 'link';
  label: string;
  url: string;
  icon?: string;
  style?: CtaStyle;
  highlight?: boolean;
}

export interface SocialRowWidget extends BaseWidget {
  kind: 'social-row';
  items: { platform: string; url: string }[];
}

export interface EmailCaptureWidget extends BaseWidget {
  kind: 'email-capture';
  heading: string;
  buttonText: string;
  successText?: string;
}

export interface WhatsAppWidget extends BaseWidget {
  kind: 'whatsapp';
  phone: string;
  message?: string;
  label?: string;
}

export interface YouTubeWidget extends BaseWidget {
  kind: 'youtube';
  url: string;
}

export interface ContactFormWidget extends BaseWidget {
  kind: 'contact-form';
  heading: string;
  fields: ('name' | 'email' | 'phone' | 'message')[];
  buttonText: string;
}

export interface BookingWidget extends BaseWidget {
  kind: 'booking';
  label: string;
  url: string; // Calendly / Cal.com / etc.
}

export interface PaymentWidget extends BaseWidget {
  kind: 'payment';
  label: string;
  description?: string;
  amount: number; // INR
  currency?: 'INR' | 'USD';
}

export interface HeaderWidget extends BaseWidget {
  kind: 'header';
  text: string;
}

export interface DividerWidget extends BaseWidget {
  kind: 'divider';
}

export type Widget =
  | LinkWidget
  | SocialRowWidget
  | EmailCaptureWidget
  | WhatsAppWidget
  | YouTubeWidget
  | ContactFormWidget
  | BookingWidget
  | PaymentWidget
  | HeaderWidget
  | DividerWidget;

export const WIDGET_LIBRARY: { kind: WidgetKind; label: string; description: string }[] = [
  { kind: 'link', label: 'Link Button', description: 'A clickable link with icon' },
  { kind: 'social-row', label: 'Social Icons', description: 'Inline row of socials' },
  { kind: 'email-capture', label: 'Email Capture', description: 'Collect newsletter signups' },
  { kind: 'whatsapp', label: 'WhatsApp CTA', description: 'Open WhatsApp chat' },
  { kind: 'youtube', label: 'YouTube Embed', description: 'Embed a YouTube video' },
  { kind: 'contact-form', label: 'Contact Form', description: 'Multi-field lead form' },
  { kind: 'booking', label: 'Booking Link', description: 'Calendly / Cal.com' },
  { kind: 'payment', label: 'Accept Payment', description: 'Razorpay one-time payment' },
  { kind: 'header', label: 'Header', description: 'Section title' },
  { kind: 'divider', label: 'Divider', description: 'Visual separator' },
];

let counter = 0;
export const newId = () =>
  `w_${Date.now().toString(36)}_${(++counter).toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export function defaultWidget(kind: WidgetKind): Widget {
  const id = newId();
  switch (kind) {
    case 'link':
      return { id, kind, label: 'My Website', url: 'https://', icon: 'website', style: 'button' };
    case 'social-row':
      return {
        id, kind,
        items: [
          { platform: 'instagram', url: 'https://instagram.com/' },
          { platform: 'twitter', url: 'https://twitter.com/' },
        ],
      };
    case 'email-capture':
      return { id, kind, heading: 'Join my newsletter', buttonText: 'Subscribe', successText: 'Thanks for subscribing! 🎉' };
    case 'whatsapp':
      return { id, kind, phone: '+910000000000', message: 'Hi! I came from your bio.', label: 'Chat on WhatsApp' };
    case 'youtube':
      return { id, kind, url: 'https://youtu.be/dQw4w9WgXcQ' };
    case 'contact-form':
      return { id, kind, heading: 'Get in touch', fields: ['name', 'email', 'message'], buttonText: 'Send' };
    case 'booking':
      return { id, kind, label: 'Book a call', url: 'https://cal.com/' };
    case 'payment':
      return { id, kind, label: 'Support my work', description: 'One-time payment', amount: 9900, currency: 'INR' };
    case 'header':
      return { id, kind, text: 'Featured' };
    case 'divider':
      return { id, kind };
  }
}

export function ytEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {}
  return null;
}

export const FONT_OPTIONS = [
  { id: 'Inter', label: 'Inter (Modern)' },
  { id: 'Space Grotesk', label: 'Space Grotesk (Tech)' },
  { id: 'Playfair Display', label: 'Playfair (Editorial)' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono (Dev)' },
  { id: 'Poppins', label: 'Poppins (Friendly)' },
];

export const SPACING_OPTIONS = [
  { id: 'compact', label: 'Compact', gap: '0.5rem', pad: '0.75rem 1rem' },
  { id: 'comfortable', label: 'Comfortable', gap: '0.75rem', pad: '1rem 1.25rem' },
  { id: 'spacious', label: 'Spacious', gap: '1.25rem', pad: '1.5rem 1.5rem' },
];
