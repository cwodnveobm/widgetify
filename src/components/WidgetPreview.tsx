import React, { useState, useRef, useMemo } from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import {
  WhatsAppIcon,
  TelegramIcon,
  LinkedInIcon,
  ShareIcon,
  GoogleTranslateIcon,
  DiscordIcon,
  DollarIcon,
  SpotifyIcon,
  FlashSaleIcon,
  BlackFridayIcon,
  AiSeoIcon,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Twitch,
  Slack,
  Star,
  Phone,
  Mail,
  Calendar,
  FileText,
  Download,
  Users,
  ArrowUp,
  QrCode,
  Moon,
  Cloud,
  TrendingUp,
  Copy,
  Clock,
  Printer,
  Cookie,
  Shield,
  Video,
  Sparkles,
  MessageSquare,
  MessageCircle,
} from '@/components/icons/WidgetIcons';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size, networks } = config;
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeMap = useMemo(() => ({
    small: '50px',
    medium: '60px',
    large: '70px',
  }), []);

  const buttonStyle = useMemo(() => ({
    width: sizeMap[size || 'medium'],
    height: sizeMap[size || 'medium'],
    backgroundColor: primaryColor || '#25D366',
    position: 'absolute' as const,
    bottom: '20px',
    [position || 'right']: '20px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    zIndex: 50,
  } as React.CSSProperties), [size, primaryColor, position, sizeMap]);

  const popupStyle = useMemo(() => ({
    position: 'absolute' as const,
    bottom: '90px',
    [position || 'right']: '20px',
    width: '280px',
    height: '350px',
    backgroundColor: 'hsl(var(--background))',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid hsl(var(--border))',
    transition: 'all 0.3s ease',
    opacity: showPopup ? 1 : 0,
    transform: showPopup ? 'translateY(0)' : 'translateY(20px)',
    visibility: (showPopup ? 'visible' : 'hidden') as 'visible' | 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 40,
    overflow: 'hidden',
  }), [position, showPopup]);

  const socialButtonsContainerStyle = useMemo(() => ({
    position: 'absolute' as const,
    bottom: '90px',
    [position || 'right']: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    transition: 'all 0.3s ease',
    opacity: showPopup ? 1 : 0,
    transform: showPopup ? 'translateY(0)' : 'translateY(20px)',
    visibility: (showPopup ? 'visible' : 'hidden') as 'visible' | 'hidden',
  }), [position, showPopup]);

  const socialButtonStyle = (color: string) => ({
    width: parseInt(sizeMap[size || 'medium'], 10) * 0.8 + 'px',
    height: parseInt(sizeMap[size || 'medium'], 10) * 0.8 + 'px',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  });

  const tooltipStyle = useMemo(() => ({
    position: 'absolute' as const,
    bottom: parseInt(sizeMap[size || 'medium']) + 10 + 'px',
    [position || 'right']: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    opacity: showPopup ? 1 : 0,
    visibility: (showPopup ? 'visible' : 'hidden') as 'visible' | 'hidden',
    transition: 'all 0.3s ease',
    zIndex: 60,
  }), [size, position, showPopup, sizeMap]);

  // Memoized icon rendering
  const iconSize = useMemo(() => parseInt(sizeMap[size || 'medium'], 10) * 0.5, [size, sizeMap]);
  
  const getIcon = useMemo(() => {
    switch (type) {
      case 'whatsapp':
        return <WhatsAppIcon size={iconSize} />;
      case 'whatsapp-form':
        return (
          <div style={{ position: 'relative' }}>
            <WhatsAppIcon size={iconSize} />
            <svg width={iconSize * 0.6} height={iconSize * 0.6} viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <rect x="6" y="11" width="12" height="8" rx="1" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M9 14h6M9 16h4" stroke="white" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
        );
      case 'lead-capture-popup':
        return (
          <div style={{ position: 'relative' }}>
            <Users size={iconSize} color="white" />
            <svg width={iconSize * 0.7} height={iconSize * 0.7} viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: -2, right: -2 }}>
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
              <path d="M6 8h12M6 11h8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="18" cy="6" r="3" fill="#ff4444" stroke="white" strokeWidth="1"/>
            </svg>
          </div>
        );
      case 'facebook':
        return <Facebook size={iconSize} color="white" />;
      case 'instagram':
        return <Instagram size={iconSize} color="white" />;
      case 'twitter':
        return <Twitter size={iconSize} color="white" />;
      case 'telegram':
        return <TelegramIcon size={iconSize} />;
      case 'linkedin':
        return <LinkedInIcon size={iconSize} />;
      case 'social-share':
        return <ShareIcon size={iconSize} />;
      case 'google-translate':
        return <GoogleTranslateIcon size={iconSize} />;
      case 'youtube':
        return <Youtube size={iconSize} color="white" />;
      case 'github':
        return <Github size={iconSize} color="white" />;
      case 'twitch':
        return <Twitch size={iconSize} color="white" />;
      case 'slack':
        return <Slack size={iconSize} color="white" />;
      case 'discord':
        return <DiscordIcon size={iconSize} />;
      case 'call-now':
        return <Phone size={iconSize} color="white" />;
      case 'review-now':
        return <Star size={iconSize} color="white" />;
      case 'dodo-payment':
        return <DollarIcon size={iconSize} />;
      case 'email-contact':
        return <Mail size={iconSize} color="white" />;
      case 'live-chat':
        return <Users size={iconSize} color="white" />;
      case 'booking-calendar':
        return <Calendar size={iconSize} color="white" />;
      case 'newsletter-signup':
        return <Mail size={iconSize} color="white" />;
      case 'feedback-form':
        return <FileText size={iconSize} color="white" />;
      case 'download-app':
        return <Download size={iconSize} color="white" />;
      case 'follow-us':
        const platform = config.followPlatform || 'linkedin';
        if (platform === 'instagram') return <Instagram size={iconSize} color="white" />;
        if (platform === 'youtube') return <Youtube size={iconSize} color="white" />;
        return <Linkedin size={iconSize} color="white" />;
      case 'contact-form':
        return <Mail size={iconSize} color="white" />;
      case 'countdown-timer':
        return <span style={{ color: 'white', fontSize: `${iconSize * 0.6}px`, fontWeight: 'bold' }}>⏰</span>;
      case 'back-to-top':
        return <ArrowUp size={iconSize} color="white" />;
      case 'qr-generator':
        return <QrCode size={iconSize} color="white" />;
      case 'dark-mode-toggle':
        return <Moon size={iconSize} color="white" />;
      case 'weather-widget':
        return <Cloud size={iconSize} color="white" />;
      case 'crypto-prices':
        return <TrendingUp size={iconSize} color="white" />;
      case 'click-to-copy':
        return <Copy size={iconSize} color="white" />;
      case 'spotify-embed':
        return <SpotifyIcon size={iconSize} />;
      case 'print-page':
        return <Printer size={iconSize} color="white" />;
      case 'scroll-progress':
        return <Clock size={iconSize} color="white" />;
      case 'cookie-consent':
        return <Cookie size={iconSize} color="white" />;
      case 'age-verification':
        return <Shield size={iconSize} color="white" />;
      case 'pdf-viewer':
        return <FileText size={iconSize} color="white" />;
      case 'floating-video':
        return <Video size={iconSize} color="white" />;
      case 'ai-seo-listing':
        return <AiSeoIcon size={iconSize} />;
      case 'trust-badge':
        return <Shield size={iconSize} color="white" />;
      case 'email-signature-generator':
        return <Mail size={iconSize} color="white" />;
      case 'holiday-countdown':
        return <Star size={iconSize} color="white" />;
      case 'flash-sale-banner':
        return <FlashSaleIcon size={iconSize} />;
      case 'seasonal-greeting':
        return <Star size={iconSize} color="white" />;
      case 'black-friday-timer':
        return <BlackFridayIcon size={iconSize} />;
      case 'multi-step-survey':
        return <FileText size={iconSize} color="white" />;
      case 'loyalty-points':
        return <Star size={iconSize} color="white" />;
      case 'live-visitor-counter':
        return <Users size={iconSize} color="white" />;
      case 'smart-faq-chatbot':
        return <MessageSquare size={iconSize} color="white" />;
      case 'price-drop-alert':
        return <TrendingUp size={iconSize} color="white" />;
      case 'product-tour':
        return <Sparkles size={iconSize} color="white" />;
      case 'referral-tracking':
        return <Users size={iconSize} color="white" />;
      case 'lead-magnet':
        return <Download size={iconSize} color="white" />;
      case 'smart-query':
        return <MessageSquare size={iconSize} color="white" />;
      case 'service-estimator':
        return <TrendingUp size={iconSize} color="white" />;
      default:
        return <MessageCircle size={iconSize} color="white" />;
    }
  }, [type, iconSize, config.followPlatform]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSocialButtonClick = (network: string) => {
    const url = config.shareUrl || window.location.href;
    const text = encodeURIComponent(config.shareText || 'Check out this page!');
    
    switch (network) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const renderSocialButtons = () => {
    if (type !== 'social-share' || !networks) return null;
    
    return (
      <div style={socialButtonsContainerStyle} className="animate-fade-in">
        {networks.includes('facebook') && (
          <div 
            style={socialButtonStyle('#1877F2')}
            onClick={() => handleSocialButtonClick('facebook')}
            className="hover:scale-105 transition-transform"
          >
            <Facebook size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
        {networks.includes('twitter') && (
          <div 
            style={socialButtonStyle('#1DA1F2')}
            onClick={() => handleSocialButtonClick('twitter')}
            className="hover:scale-105 transition-transform"
          >
            <Twitter size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
        {networks.includes('linkedin') && (
          <div 
            style={socialButtonStyle('#0077B5')}
            onClick={() => handleSocialButtonClick('linkedin')}
            className="hover:scale-105 transition-transform"
          >
            <Linkedin size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
      </div>
    );
  };

  const getTooltipText = () => {
    switch (type) {
      case 'call-now':
        return 'Call Now';
      case 'review-now':
        return 'Leave a Review';
      case 'dodo-payment':
        return 'Make Payment';
      case 'follow-us':
        const platform = config.followPlatform || 'linkedin';
        return `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      case 'contact-form':
        return 'Contact Us';
      case 'countdown-timer':
        return config.title || 'Countdown Timer';
      case 'back-to-top':
        return 'Back to Top';
      case 'qr-generator':
        return 'Generate QR Code';
      case 'dark-mode-toggle':
        return 'Toggle Dark Mode';
      case 'weather-widget':
        return 'Weather Information';
      case 'crypto-prices':
        return 'Cryptocurrency Prices';
      case 'click-to-copy':
        return config.copyButtonText || 'Click to Copy';
      case 'print-page':
        return 'Print Page';
      case 'scroll-progress':
        return 'Scroll Progress';
      case 'cookie-consent':
        return 'Cookie Consent';
      case 'age-verification':
        return 'Age Verification';
      case 'pdf-viewer':
        return 'PDF Viewer';
      case 'floating-video':
        return 'Floating Video';
      case 'ai-seo-listing':
        return 'AI SEO Listing Generator';
      case 'trust-badge':
        return 'Trust & Security Badges';
      case 'email-signature-generator':
        return 'Generate Email Signature';
      case 'holiday-countdown':
        return `${config.holidayName || 'Holiday'} Countdown`;
      case 'flash-sale-banner':
        return 'Flash Sale Banner';
      case 'seasonal-greeting':
        return 'Seasonal Greeting';
      case 'black-friday-timer':
        return 'Black Friday Timer';
      default:
        return null;
    }
  };

  const getWidgetTitle = () => {
    switch (type) {
      case 'whatsapp': return 'WhatsApp Chat';
      case 'facebook': return 'Facebook Messenger';
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter';
      case 'telegram': return 'Telegram';
      case 'linkedin': return 'LinkedIn';
      case 'social-share': return 'Share';
      case 'google-translate': return 'Google Translate';
      case 'youtube': return 'YouTube';
      case 'github': return 'GitHub';
      case 'twitch': return 'Twitch';
      case 'slack': return 'Slack';
      case 'discord': return 'Discord';
      case 'call-now': return 'Call Now';
      case 'review-now': return 'Leave a Review';
      case 'follow-us': return 'Follow Us';
      case 'dodo-payment': return 'Dodo Payment';
      case 'email-contact': return 'Send Email';
      case 'live-chat': return 'Live Chat';
      case 'booking-calendar': return 'Book Appointment';
      case 'newsletter-signup': return 'Subscribe';
      case 'feedback-form': return 'Send Feedback';
      case 'download-app': return 'Download App';
      default: return 'Chat';
    }
  };

  // renderPaymentPopup, renderTranslatePopup, renderChatPopup functions
  const renderPaymentPopup = () => {
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
          <div className="font-medium">Dodo Payment</div>
          <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="flex-grow p-3 overflow-y-auto bg-white">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Amount (USD)</label>
            <div className="flex items-center border border-gray-300 rounded">
              <span className="px-3 py-2 bg-gray-100 border-r text-sm">$</span>
              <input
                type="number"
                defaultValue={config.amount || 10}
                min="1"
                className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Card Information</label>
            <input
              type="text"
              placeholder="1234 1234 1234 1234"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition-colors">
            Pay Now
          </button>
        </div>
        <div className="bg-gray-50 border-t p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-gray-700 transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderTranslatePopup = () => {
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
          <div className="font-medium">Google Translate</div>
          <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="flex-grow p-3 overflow-y-auto bg-white">
          <div className="bg-gray-50 p-3 rounded-lg mb-3">
            <p className="text-xs text-center text-gray-600 mb-2">Google Translate Widget</p>
            <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded">
              <div className="text-xs text-gray-500">
                &lt;div id="google_translate_element"&gt;&lt;/div&gt;
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            This widget integrates Google Translate for automatic page translation.
          </p>
        </div>
      </div>
    );
  };

  const renderContactFormPopup = () => {
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
          <div className="font-medium">Contact Form</div>
          <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="flex-grow p-3 overflow-y-auto bg-white">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input type="text" placeholder="Your name" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input type="email" placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Message</label>
              <textarea placeholder="Your message..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            </div>
            <button 
              className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition-colors text-xs"
              onClick={() => {
                const name = 'John Doe';
                const email = 'john@example.com';
                const message = 'Hello, I would like to get in touch!';
                const text = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
                const whatsappUrl = `https://wa.me/${config.whatsappNumber?.replace(/\D/g, '') || '1234567890'}?text=${text}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              Send via WhatsApp
            </button>
          </div>
        </div>
        <div className="bg-gray-50 border-t p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-gray-700 transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderCountdownPopup = () => {
    const targetDate = new Date(config.targetDate || '2024-12-31T23:59:59');
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
    
    const days = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((timeDiff % (1000 * 60)) / 1000));

    const style = config.countdownStyle || 'digital';
    
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">{config.title || 'Countdown Timer'}</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="flex-grow p-3 bg-background flex flex-col justify-center">
          {style === 'circular' && (
            <div className="flex justify-center gap-2">
              {[{ label: 'Days', value: days }, { label: 'Hours', value: hours }, { label: 'Minutes', value: minutes }, { label: 'Seconds', value: seconds }].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 border-4 border-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">{item.value}</span>
                  </div>
                  {config.showLabels && <div className="text-xs text-muted-foreground mt-1">{item.label}</div>}
                </div>
              ))}
            </div>
          )}
          {style === 'digital' && (
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-primary">
                {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              {config.showLabels && <div className="text-xs text-muted-foreground mt-2">Days : Hours : Minutes : Seconds</div>}
            </div>
          )}
          {style === 'minimal' && (
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-foreground">{days}d {hours}h {minutes}m {seconds}s</div>
              {config.showLabels && <div className="text-xs text-muted-foreground">Time remaining</div>}
            </div>
          )}
          {style === 'bold' && (
            <div className="text-center">
              <div className="grid grid-cols-4 gap-2">
                {[{ label: 'DAYS', value: days }, { label: 'HRS', value: hours }, { label: 'MIN', value: minutes }, { label: 'SEC', value: seconds }].map((item, index) => (
                  <div key={index} className="bg-primary text-primary-foreground p-2 rounded">
                    <div className="text-lg font-bold">{item.value}</div>
                    {config.showLabels && <div className="text-xs">{item.label}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-muted/50 border-t border-border p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderQRPopup = () => (
    <div style={popupStyle} className="animate-fade-in">
      <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
        <div className="font-medium text-foreground">QR Code</div>
        <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
      </div>
      <div className="flex-grow p-3 bg-background text-center">
        <div className="w-32 h-32 mx-auto bg-gray-200 mb-4 flex items-center justify-center">QR</div>
        <p className="text-xs">{config.qrText || window.location.href}</p>
      </div>
    </div>
  );

  const renderWeatherPopup = () => (
    <div style={popupStyle} className="animate-fade-in">
      <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
        <div className="font-medium text-foreground">Weather</div>
        <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
      </div>
      <div className="flex-grow p-3 bg-background text-center">
        <div className="text-2xl mb-2">☀️</div>
        <div className="text-lg font-bold">22°C</div>
        <div className="text-sm text-muted-foreground">{config.weatherCity || 'London'}</div>
      </div>
    </div>
  );

  const renderCryptoPopup = () => (
    <div style={popupStyle} className="animate-fade-in">
      <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
        <div className="font-medium text-foreground">Crypto Prices</div>
        <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
      </div>
      <div className="flex-grow p-3 bg-background">
        <div className="space-y-2">
          <div className="flex justify-between"><span>Bitcoin</span><span className="text-green-500">$45,000</span></div>
          <div className="flex justify-between"><span>Ethereum</span><span className="text-red-500">$3,200</span></div>
        </div>
      </div>
    </div>
  );

  const renderSpotifyPopup = () => {
    const url = config.spotifyUrl || '';
    const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    const embedUrl = match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : '';
    const height = config.height || (config.compact ? '152' : '352');

    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">Spotify Player</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
        </div>
        <div className="flex-grow bg-background p-0">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height={height}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: '0 0 10px 10px' }}
              title="Spotify Embed"
            />
          ) : (
            <div className="p-6 text-center bg-[#191414] text-white">
              <div className="w-14 h-14 bg-[#1db954] rounded-full mx-auto mb-4 flex items-center justify-center">
                {/* Spotify glyph */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.871 7.077-.496 9.713 1.115.293.18.386.563.206.857zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.518-.125-.413.106-.849.518-.973 3.632-1.102 8.147-.568 11.238 1.327.366.226.481.706.255 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.166-.62-.149-.493.129-1.016.621-1.166 3.532-1.073 9.404-.865 13.115 1.338.445.264.590.837.326 1.282-.264.444-.838.590-1.282.325z"/>
                </svg>
              </div>
              <h3 className="m-0 text-white">No music selected</h3>
              <p className="m-0 text-[#b3b3b3] text-sm">Add a Spotify URL to display music here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChatPopup = () => {
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">{getWidgetTitle()}</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg transition-colors">
            ×
          </button>
        </div>
        <div className="flex-grow p-3 overflow-y-auto bg-background">
          <div className="bg-muted/50 p-2 rounded-lg mb-2 max-w-[80%] border border-border/50">
            <p className="text-xs text-foreground">{config.welcomeMessage || 'How can I help you today?'}</p>
          </div>
        </div>
        <div className="p-3 border-t border-border bg-muted/50 rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow text-xs p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            <button className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="bg-muted/50 border-t border-border p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderLeadMagnetPopup = () => {
    return (
      <div style={popupStyle} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">{config.resourceTitle || 'Free Resource'}</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
        </div>
        <div className="flex-grow p-3 bg-background overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3">{config.resourceDescription || 'Enter your details to download this free resource.'}</p>
          <div className="space-y-2">
            <input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-input rounded text-xs bg-background" />
            <input type="email" placeholder="Your Email" className="w-full px-3 py-2 border border-input rounded text-xs bg-background" />
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="mt-1" />
              <span>I agree to receive emails and updates</span>
            </label>
            <button style={{ backgroundColor: config.primaryColor }} className="w-full text-white py-2 rounded font-medium hover:opacity-90 transition-opacity text-xs mt-3">
              Download Now
            </button>
          </div>
        </div>
        <div className="bg-muted/50 border-t border-border p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderSmartQueryPopup = () => {
    return (
      <div style={{ ...popupStyle, height: '450px' }} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">{config.queryTitle || 'Submit Your Query'}</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
        </div>
        <div className="flex-grow p-3 bg-background overflow-y-auto">
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium mb-1">Query Type</label>
              <select className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Sales Question</option>
                <option>Feature Request</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Priority</label>
              <select className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background">
                <option>Low - Can wait</option>
                <option>Medium - Normal</option>
                <option>High - Urgent</option>
              </select>
            </div>
            <input type="text" placeholder="Your Name" className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background" />
            <input type="email" placeholder="Your Email" className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background" />
            <input type="tel" placeholder="Phone (Optional)" className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background" />
            <textarea placeholder="Your message..." rows={3} className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-none"></textarea>
            <button style={{ backgroundColor: config.primaryColor }} className="w-full text-white py-2 rounded font-medium hover:opacity-90 transition-opacity text-xs mt-2">
              Submit Query
            </button>
          </div>
        </div>
        <div className="bg-muted/50 border-t border-border p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const renderServiceEstimatorPopup = () => {
    const services = config.services || [
      { name: 'Web Design', basePrice: 500, unit: 'page' },
      { name: 'SEO Optimization', basePrice: 300, unit: 'month' }
    ];

    return (
      <div style={{ ...popupStyle, height: '450px' }} className="animate-fade-in">
        <div className="bg-muted/80 p-3 flex justify-between items-center rounded-t-lg border-b border-border">
          <div className="font-medium text-foreground">{config.estimatorTitle || 'Service Cost Estimator'}</div>
          <button onClick={togglePopup} className="text-muted-foreground hover:text-foreground text-lg">×</button>
        </div>
        <div className="flex-grow p-3 bg-background overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3">Select services to get an estimate:</p>
          <div className="space-y-2">
            {services.slice(0, 2).map((service, idx) => (
              <div key={idx} className="border border-input rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="flex items-center gap-2 text-xs font-medium">
                    <input type="checkbox" />
                    {service.name}
                  </label>
                  <span className="text-xs text-muted-foreground">${service.basePrice}/{service.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Qty:</span>
                  <input type="number" min="1" defaultValue="1" className="w-16 px-2 py-1 border border-input rounded bg-background" />
                </div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: `${config.primaryColor}15` }} className="mt-3 p-3 rounded text-center">
            <div className="text-xs text-muted-foreground mb-1">Estimated Total</div>
            <div style={{ color: config.primaryColor }} className="text-2xl font-bold">$0</div>
          </div>
          <button style={{ backgroundColor: config.primaryColor }} className="w-full text-white py-2 rounded font-medium hover:opacity-90 transition-opacity text-xs mt-3">
            Request Detailed Quote
          </button>
        </div>
        <div className="bg-muted/50 border-t border-border p-2 text-center">
          <a href="https://widgetify-two.vercel.app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  const getWidgetContent = () => {
    if (type === 'social-share') {
      return renderSocialButtons();
    }
    
    if (type === 'dodo-payment') {
      return renderPaymentPopup();
    }
    
    if (type === 'google-translate') {
      return renderTranslatePopup();
    }
    
    if (type === 'contact-form') {
      return renderContactFormPopup();
    }
    
    if (type === 'countdown-timer') {
      return renderCountdownPopup();
    }
    
    if (type === 'qr-generator') {
      return renderQRPopup();
    }
    
    if (type === 'weather-widget') {
      return renderWeatherPopup();
    }
    
    if (type === 'crypto-prices') {
      return renderCryptoPopup();
    }
    
    if (type === 'spotify-embed') {
      return renderSpotifyPopup();
    }
    
    if (type === 'lead-magnet') {
      return renderLeadMagnetPopup();
    }
    
    if (type === 'smart-query') {
      return renderSmartQueryPopup();
    }
    
    if (type === 'service-estimator') {
      return renderServiceEstimatorPopup();
    }
    
    if (type === 'call-now' || type === 'review-now' || type === 'follow-us' || type === 'back-to-top' || type === 'dark-mode-toggle' || type === 'click-to-copy') {
      const tooltipText = getTooltipText();
      return tooltipText ? <div style={tooltipStyle}>{tooltipText}</div> : null;
    }
    
    return renderChatPopup();
  };

  const handleMainButtonClick = () => {
    switch (type) {
      case 'call-now':
        window.location.href = `tel:${config.phoneNumber || '+1234567890'}`;
        break;
      case 'review-now':
        window.open(config.reviewUrl || 'https://google.com/search?q=reviews', '_blank');
        break;
      case 'follow-us':
        const platform = config.followPlatform || 'linkedin';
        const handle = config.handle?.replace('@', '') || 'example';
        if (platform === 'instagram') {
          window.open(`https://instagram.com/${handle}`, '_blank');
        } else if (platform === 'youtube') {
          window.open(`https://www.youtube.com/${handle}`, '_blank');
        } else {
          window.open(`https://www.linkedin.com/in/${handle}`, '_blank');
        }
        break;
      case 'email-contact':
        window.location.href = `mailto:${config.emailAddress || 'contact@example.com'}`;
        break;
      case 'booking-calendar':
        window.open(config.bookingUrl || 'https://calendly.com/example', '_blank');
        break;
      case 'download-app':
        // Show popup for app download options
        togglePopup();
        break;
      case 'contact-form':
        togglePopup();
        break;
      case 'countdown-timer':
        togglePopup();
        break;
      case 'back-to-top':
        window.scrollTo({ top: 0, behavior: config.smoothScroll !== false ? 'smooth' : 'auto' });
        break;
      case 'qr-generator':
        togglePopup();
        break;
      case 'dark-mode-toggle':
        document.documentElement.classList.toggle('dark');
        if (config.savePreference !== false) {
          localStorage.setItem('darkMode', document.documentElement.classList.contains('dark') ? 'true' : 'false');
        }
        break;
      case 'weather-widget':
        togglePopup();
        break;
      case 'crypto-prices':
        togglePopup();
        break;
      case 'spotify-embed':
        togglePopup();
        break;
      case 'click-to-copy':
        navigator.clipboard.writeText(config.copyText || window.location.href);
        // Show temporary feedback
        const originalIcon = buttonRef.current?.querySelector('svg');
        if (originalIcon) {
          originalIcon.style.display = 'none';
          const checkIcon = document.createElement('div');
          checkIcon.innerHTML = '✓';
          checkIcon.style.color = 'green';
          checkIcon.style.fontSize = '20px';
          checkIcon.style.fontWeight = 'bold';
          originalIcon.parentNode?.appendChild(checkIcon);
          setTimeout(() => {
            originalIcon.style.display = 'block';
            checkIcon.remove();
          }, 1000);
        }
        break;
      case 'print-page':
        window.print();
        break;
      case 'ai-seo-listing':
        togglePopup();
        break;
      case 'lead-magnet':
      case 'smart-query':
      case 'service-estimator':
        togglePopup();
        break;
      default:
        togglePopup();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[130px] sm:min-h-[250px] max-w-[360px] mx-auto flex justify-center items-end
     overflow-visible xs:p-0 sm:p-1" style={{ touchAction: 'manipulation' }}>
      {showPopup && getWidgetContent()}
      {!showPopup && (type === 'call-now' || type === 'review-now' || type === 'follow-us') && getWidgetContent()}
      
      <button 
        ref={buttonRef}
        style={buttonStyle} 
        className="hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer border-none" 
        onClick={handleMainButtonClick}
      >
        {getIcon()}
      </button>
    </div>
  );
};

export default WidgetPreview;
