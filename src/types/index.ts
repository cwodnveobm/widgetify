
export type WidgetType = 
  'whatsapp' | 
  'facebook' | 
  'instagram' | 
  'twitter' | 
  'telegram' | 
  'linkedin' | 
  'social-share' | 
  'google-translate' | 
  'youtube' | 
  'github' | 
  'twitch' | 
  'slack' | 
  'discord' | 
  'call-now' | 
  'review-now' | 
  'follow-us' | 
  'dodo-payment' |
  'payment' |
  'contact-form' |
  'whatsapp-form' |
  'lead-capture-popup' |
  'email-contact' |
  'live-chat' |
  'booking-calendar' |
  'newsletter-signup' |
  'feedback-form' |
  'download-app' |
  'countdown-timer' |
  'back-to-top' |
  'scroll-progress' |
  'print-page' |
  'qr-generator' |
  'weather-widget' |
  'calculator' |
  'crypto-prices' |
  'stock-ticker' |
  'rss-feed' |
  'cookie-consent' |
  'age-verification' |
  'popup-announcement' |
  'floating-video' |
  'music-player' |
  'image-gallery' |
  'pdf-viewer' |
  'click-to-copy' |
  'share-page' |
  'dark-mode-toggle' |
  'spotify-embed' |
  'ai-seo-listing' |
  'exit-intent-popup' |
  'sticky-banner' |
  'ai-chatbot' |
  'trust-badge' |
  'email-signature-generator' |
  'holiday-countdown' |
  'flash-sale-banner' |
  'seasonal-greeting' |
  'black-friday-timer' |
  'multi-step-survey' |
  'loyalty-points' |
  'live-visitor-counter' |
  'smart-faq-chatbot' |
  'price-drop-alert' |
  'product-tour' |
  'referral-tracking' |
  'lead-magnet' |
  'smart-query' |
  'service-estimator' |
  'google-maps' |
  'google-reviews' |
  // New high-conversion chatbot widgets
  'job-application-chatbot' |
  'subscriber-capture-chatbot' |
  'lead-generation-chatbot' |
  'webinar-registration-chatbot' |
  'ecommerce-assistant-chatbot' |
  'whatsapp-interactive-form' |
  // New widgets for enhanced functionality
  'visitor-counter' |
  'bug-report' |
  'product-cards' |
  'zoom-meeting' |
  // Additional categories
  'testimonial-slider' |
  'social-proof-popup' |
  'cart-abandonment' |
  'product-comparison' |
  'wishlist' |
  'size-guide' |
  'stock-alert' |
  'quick-view' |
  'announcement-bar' |
  'team-member' |
  'faq-accordion' |
  'video-testimonial';

export type WidgetSize = 'small' | 'medium' | 'large';

// Marketplace template types
export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  widgetType: WidgetType;
  previewImage?: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  isPremium: boolean;
  config: Record<string, unknown>;
  conversionRate?: string;
  useCases: string[];
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}
