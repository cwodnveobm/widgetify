import { useMemo, useCallback } from 'react';
import { usePersonalization } from './usePersonalization';
import type { WidgetType, WidgetSize } from '@/types';

// User profile for widget recommendations
export interface UserProfile {
  role: 'marketer' | 'developer' | 'business_owner' | 'designer' | 'agency' | 'unknown';
  industry: 'ecommerce' | 'saas' | 'local_business' | 'content' | 'professional_services' | 'unknown';
  websiteType: 'landing_page' | 'blog' | 'store' | 'portfolio' | 'corporate' | 'unknown';
  primaryGoal: 'lead_generation' | 'sales' | 'engagement' | 'support' | 'awareness' | 'unknown';
  devicePriority: 'mobile_first' | 'desktop_first' | 'balanced';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  planTier: 'free' | 'premium';
}

// Smart widget recommendation with CRO data
export interface WidgetRecommendation {
  type: WidgetType;
  name: string;
  reason: string;
  expectedImpact: string;
  conversionRate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  setupTime: string;
}

// Smart configuration defaults
export interface SmartDefaults {
  title: string;
  welcomeMessage: string;
  ctaText: string;
  primaryColor: string;
  position: 'left' | 'right';
  size: WidgetSize;
  triggerDelay?: number;
}

// Guidance message for friction detection
export interface GuidanceMessage {
  type: 'tip' | 'warning' | 'opportunity' | 'upsell';
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
}

// Industry benchmarks for CRO
const INDUSTRY_BENCHMARKS = {
  ecommerce: {
    topWidgets: ['exit-intent-popup', 'flash-sale-banner', 'live-visitor-counter', 'whatsapp'] as WidgetType[],
    avgConversion: '3.2%',
    ctaColors: ['#ef4444', '#f59e0b', '#22c55e'],
    urgencyWords: ['Limited', 'Flash', 'Exclusive', 'Today Only'],
  },
  saas: {
    topWidgets: ['lead-capture-popup', 'ai-chatbot', 'booking-calendar', 'newsletter-signup'] as WidgetType[],
    avgConversion: '5.1%',
    ctaColors: ['#3b82f6', '#6366f1', '#8b5cf6'],
    urgencyWords: ['Free Trial', 'Get Started', 'Demo', 'Learn More'],
  },
  local_business: {
    topWidgets: ['call-now', 'whatsapp', 'google-maps', 'google-reviews'] as WidgetType[],
    avgConversion: '4.7%',
    ctaColors: ['#22c55e', '#14b8a6', '#0891b2'],
    urgencyWords: ['Call Now', 'Visit Today', 'Book Now', 'Get Quote'],
  },
  content: {
    topWidgets: ['newsletter-signup', 'social-share', 'follow-us', 'feedback-form'] as WidgetType[],
    avgConversion: '2.8%',
    ctaColors: ['#ec4899', '#f43f5e', '#8b5cf6'],
    urgencyWords: ['Subscribe', 'Join', 'Follow', 'Share'],
  },
  professional_services: {
    topWidgets: ['booking-calendar', 'lead-capture-popup', 'whatsapp-form', 'live-chat'] as WidgetType[],
    avgConversion: '6.3%',
    ctaColors: ['#1e40af', '#0f172a', '#059669'],
    urgencyWords: ['Schedule', 'Consult', 'Get Quote', 'Learn More'],
  },
  unknown: {
    topWidgets: ['whatsapp', 'lead-capture-popup', 'social-share', 'newsletter-signup'] as WidgetType[],
    avgConversion: '3.5%',
    ctaColors: ['#9b87f5', '#7c3aed', '#6366f1'],
    urgencyWords: ['Get Started', 'Learn More', 'Contact Us', 'Try Free'],
  },
};

// Goal-based widget mapping
const GOAL_WIDGET_MAP: Record<string, WidgetType[]> = {
  lead_generation: ['lead-capture-popup', 'whatsapp-form', 'newsletter-signup', 'booking-calendar', 'exit-intent-popup'],
  sales: ['flash-sale-banner', 'exit-intent-popup', 'countdown-timer', 'live-visitor-counter', 'payment'],
  engagement: ['ai-chatbot', 'social-share', 'follow-us', 'feedback-form', 'multi-step-survey'],
  support: ['whatsapp', 'ai-chatbot', 'live-chat', 'call-now', 'smart-faq-chatbot'],
  awareness: ['social-share', 'follow-us', 'newsletter-signup', 'sticky-banner', 'spotify-embed'],
};

// Widget metadata for recommendations
const WIDGET_METADATA: Record<WidgetType, { name: string; category: string; complexity: number; conversionImpact: number; setupTime: string }> = {
  'whatsapp': { name: 'WhatsApp Chat', category: 'Communication', complexity: 1, conversionImpact: 85, setupTime: '30 sec' },
  'lead-capture-popup': { name: 'Lead Capture Popup', category: 'Lead Generation', complexity: 2, conversionImpact: 92, setupTime: '1 min' },
  'exit-intent-popup': { name: 'Exit Intent Popup', category: 'Conversion', complexity: 2, conversionImpact: 88, setupTime: '1 min' },
  'flash-sale-banner': { name: 'Flash Sale Banner', category: 'Sales', complexity: 1, conversionImpact: 78, setupTime: '45 sec' },
  'ai-chatbot': { name: 'AI Chatbot', category: 'Support', complexity: 3, conversionImpact: 75, setupTime: '2 min' },
  'newsletter-signup': { name: 'Newsletter Signup', category: 'Lead Generation', complexity: 1, conversionImpact: 70, setupTime: '30 sec' },
  'call-now': { name: 'Call Now Button', category: 'Communication', complexity: 1, conversionImpact: 82, setupTime: '20 sec' },
  'booking-calendar': { name: 'Booking Calendar', category: 'Conversion', complexity: 2, conversionImpact: 90, setupTime: '1.5 min' },
  'social-share': { name: 'Social Share', category: 'Engagement', complexity: 1, conversionImpact: 45, setupTime: '30 sec' },
  'follow-us': { name: 'Follow Us', category: 'Engagement', complexity: 1, conversionImpact: 40, setupTime: '30 sec' },
  'live-visitor-counter': { name: 'Live Visitor Counter', category: 'Social Proof', complexity: 2, conversionImpact: 65, setupTime: '45 sec' },
  'countdown-timer': { name: 'Countdown Timer', category: 'Urgency', complexity: 1, conversionImpact: 72, setupTime: '45 sec' },
  'sticky-banner': { name: 'Sticky Banner', category: 'Announcement', complexity: 1, conversionImpact: 55, setupTime: '30 sec' },
  'whatsapp-form': { name: 'WhatsApp Form', category: 'Lead Generation', complexity: 2, conversionImpact: 88, setupTime: '1 min' },
  'google-reviews': { name: 'Google Reviews', category: 'Social Proof', complexity: 1, conversionImpact: 68, setupTime: '45 sec' },
  'google-maps': { name: 'Google Maps', category: 'Location', complexity: 2, conversionImpact: 50, setupTime: '1 min' },
  'feedback-form': { name: 'Feedback Form', category: 'Engagement', complexity: 2, conversionImpact: 35, setupTime: '1 min' },
  'live-chat': { name: 'Live Chat', category: 'Support', complexity: 2, conversionImpact: 78, setupTime: '1 min' },
  'payment': { name: 'Payment Gateway', category: 'Sales', complexity: 2, conversionImpact: 95, setupTime: '1.5 min' },
  'dodo-payment': { name: 'Dodo Payment', category: 'Sales', complexity: 2, conversionImpact: 90, setupTime: '1 min' },
  'review-now': { name: 'Review Request', category: 'Social Proof', complexity: 1, conversionImpact: 60, setupTime: '30 sec' },
  'email-contact': { name: 'Email Contact', category: 'Communication', complexity: 1, conversionImpact: 55, setupTime: '30 sec' },
  'download-app': { name: 'Download App', category: 'Conversion', complexity: 1, conversionImpact: 70, setupTime: '45 sec' },
  'spotify-embed': { name: 'Spotify Player', category: 'Engagement', complexity: 1, conversionImpact: 25, setupTime: '30 sec' },
  'multi-step-survey': { name: 'Multi-Step Survey', category: 'Lead Generation', complexity: 3, conversionImpact: 85, setupTime: '3 min' },
  'smart-faq-chatbot': { name: 'Smart FAQ Bot', category: 'Support', complexity: 3, conversionImpact: 72, setupTime: '2 min' },
  // Default metadata for remaining widgets
  'facebook': { name: 'Facebook', category: 'Social', complexity: 1, conversionImpact: 40, setupTime: '30 sec' },
  'instagram': { name: 'Instagram', category: 'Social', complexity: 1, conversionImpact: 45, setupTime: '30 sec' },
  'twitter': { name: 'Twitter', category: 'Social', complexity: 1, conversionImpact: 38, setupTime: '30 sec' },
  'telegram': { name: 'Telegram', category: 'Communication', complexity: 1, conversionImpact: 75, setupTime: '30 sec' },
  'linkedin': { name: 'LinkedIn', category: 'Social', complexity: 1, conversionImpact: 50, setupTime: '30 sec' },
  'google-translate': { name: 'Google Translate', category: 'Utility', complexity: 1, conversionImpact: 30, setupTime: '30 sec' },
  'youtube': { name: 'YouTube', category: 'Media', complexity: 1, conversionImpact: 35, setupTime: '30 sec' },
  'github': { name: 'GitHub', category: 'Developer', complexity: 1, conversionImpact: 25, setupTime: '30 sec' },
  'twitch': { name: 'Twitch', category: 'Media', complexity: 1, conversionImpact: 30, setupTime: '30 sec' },
  'slack': { name: 'Slack', category: 'Communication', complexity: 1, conversionImpact: 55, setupTime: '30 sec' },
  'discord': { name: 'Discord', category: 'Communication', complexity: 1, conversionImpact: 50, setupTime: '30 sec' },
  'contact-form': { name: 'Contact Form', category: 'Lead Generation', complexity: 2, conversionImpact: 75, setupTime: '1 min' },
  'back-to-top': { name: 'Back to Top', category: 'Utility', complexity: 1, conversionImpact: 10, setupTime: '20 sec' },
  'scroll-progress': { name: 'Scroll Progress', category: 'Utility', complexity: 1, conversionImpact: 15, setupTime: '20 sec' },
  'print-page': { name: 'Print Page', category: 'Utility', complexity: 1, conversionImpact: 10, setupTime: '20 sec' },
  'qr-generator': { name: 'QR Generator', category: 'Utility', complexity: 1, conversionImpact: 35, setupTime: '30 sec' },
  'weather-widget': { name: 'Weather Widget', category: 'Utility', complexity: 2, conversionImpact: 20, setupTime: '45 sec' },
  'calculator': { name: 'Calculator', category: 'Utility', complexity: 2, conversionImpact: 40, setupTime: '1 min' },
  'crypto-prices': { name: 'Crypto Prices', category: 'Finance', complexity: 2, conversionImpact: 30, setupTime: '45 sec' },
  'stock-ticker': { name: 'Stock Ticker', category: 'Finance', complexity: 2, conversionImpact: 30, setupTime: '45 sec' },
  'rss-feed': { name: 'RSS Feed', category: 'Content', complexity: 2, conversionImpact: 25, setupTime: '1 min' },
  'cookie-consent': { name: 'Cookie Consent', category: 'Compliance', complexity: 1, conversionImpact: 5, setupTime: '30 sec' },
  'age-verification': { name: 'Age Verification', category: 'Compliance', complexity: 1, conversionImpact: 5, setupTime: '30 sec' },
  'popup-announcement': { name: 'Popup Announcement', category: 'Announcement', complexity: 1, conversionImpact: 50, setupTime: '45 sec' },
  'floating-video': { name: 'Floating Video', category: 'Media', complexity: 2, conversionImpact: 45, setupTime: '1 min' },
  'music-player': { name: 'Music Player', category: 'Media', complexity: 2, conversionImpact: 25, setupTime: '45 sec' },
  'image-gallery': { name: 'Image Gallery', category: 'Media', complexity: 2, conversionImpact: 35, setupTime: '1 min' },
  'pdf-viewer': { name: 'PDF Viewer', category: 'Utility', complexity: 2, conversionImpact: 40, setupTime: '1 min' },
  'click-to-copy': { name: 'Click to Copy', category: 'Utility', complexity: 1, conversionImpact: 20, setupTime: '20 sec' },
  'share-page': { name: 'Share Page', category: 'Engagement', complexity: 1, conversionImpact: 35, setupTime: '30 sec' },
  'dark-mode-toggle': { name: 'Dark Mode Toggle', category: 'Utility', complexity: 1, conversionImpact: 15, setupTime: '20 sec' },
  'ai-seo-listing': { name: 'AI SEO Listing', category: 'SEO', complexity: 3, conversionImpact: 60, setupTime: '2 min' },
  'trust-badge': { name: 'Trust Badge', category: 'Social Proof', complexity: 1, conversionImpact: 55, setupTime: '30 sec' },
  'email-signature-generator': { name: 'Email Signature', category: 'Utility', complexity: 2, conversionImpact: 30, setupTime: '2 min' },
  'holiday-countdown': { name: 'Holiday Countdown', category: 'Urgency', complexity: 1, conversionImpact: 50, setupTime: '45 sec' },
  'seasonal-greeting': { name: 'Seasonal Greeting', category: 'Engagement', complexity: 1, conversionImpact: 25, setupTime: '30 sec' },
  'black-friday-timer': { name: 'Black Friday Timer', category: 'Sales', complexity: 1, conversionImpact: 75, setupTime: '45 sec' },
  'loyalty-points': { name: 'Loyalty Points', category: 'Engagement', complexity: 3, conversionImpact: 65, setupTime: '3 min' },
  'price-drop-alert': { name: 'Price Drop Alert', category: 'Sales', complexity: 2, conversionImpact: 70, setupTime: '1.5 min' },
  'product-tour': { name: 'Product Tour', category: 'Onboarding', complexity: 3, conversionImpact: 55, setupTime: '3 min' },
  'referral-tracking': { name: 'Referral Tracking', category: 'Growth', complexity: 3, conversionImpact: 80, setupTime: '2 min' },
  'lead-magnet': { name: 'Lead Magnet', category: 'Lead Generation', complexity: 2, conversionImpact: 85, setupTime: '1.5 min' },
  'smart-query': { name: 'Smart Query', category: 'Support', complexity: 3, conversionImpact: 65, setupTime: '2 min' },
  'service-estimator': { name: 'Service Estimator', category: 'Conversion', complexity: 3, conversionImpact: 88, setupTime: '3 min' },
  // New high-conversion chatbot widgets
  'job-application-chatbot': { name: 'Job Application Chatbot', category: 'Lead Generation', complexity: 2, conversionImpact: 85, setupTime: '2 min' },
  'subscriber-capture-chatbot': { name: 'Subscriber Capture Chatbot', category: 'Lead Generation', complexity: 2, conversionImpact: 78, setupTime: '1.5 min' },
  'lead-generation-chatbot': { name: 'Lead Generation Chatbot', category: 'Lead Generation', complexity: 2, conversionImpact: 90, setupTime: '2 min' },
  'webinar-registration-chatbot': { name: 'Webinar Registration Chatbot', category: 'Events', complexity: 2, conversionImpact: 82, setupTime: '1.5 min' },
  'ecommerce-assistant-chatbot': { name: 'E-commerce Assistant', category: 'Sales', complexity: 3, conversionImpact: 88, setupTime: '3 min' },
  'whatsapp-interactive-form': { name: 'WhatsApp Interactive Form', category: 'Lead Generation', complexity: 1, conversionImpact: 85, setupTime: '1 min' },
  // New enhanced functionality widgets
  'visitor-counter': { name: 'Visitor Counter', category: 'Social Proof', complexity: 1, conversionImpact: 70, setupTime: '30 sec' },
  'bug-report': { name: 'Bug Report Template', category: 'Support', complexity: 2, conversionImpact: 45, setupTime: '1 min' },
  'product-cards': { name: 'Product Cards', category: 'eCommerce', complexity: 2, conversionImpact: 85, setupTime: '2 min' },
  'zoom-meeting': { name: 'Zoom Meeting', category: 'Communication', complexity: 1, conversionImpact: 80, setupTime: '45 sec' },
  // Additional widget categories
  'testimonial-slider': { name: 'Testimonial Slider', category: 'Social Proof', complexity: 2, conversionImpact: 75, setupTime: '2 min' },
  'social-proof-popup': { name: 'Social Proof Popup', category: 'Social Proof', complexity: 1, conversionImpact: 72, setupTime: '1 min' },
  'cart-abandonment': { name: 'Cart Abandonment', category: 'eCommerce', complexity: 2, conversionImpact: 88, setupTime: '1.5 min' },
  'product-comparison': { name: 'Product Comparison', category: 'eCommerce', complexity: 3, conversionImpact: 70, setupTime: '3 min' },
  'wishlist': { name: 'Wishlist', category: 'eCommerce', complexity: 2, conversionImpact: 65, setupTime: '1.5 min' },
  'size-guide': { name: 'Size Guide', category: 'eCommerce', complexity: 1, conversionImpact: 55, setupTime: '1 min' },
  'stock-alert': { name: 'Stock Alert', category: 'eCommerce', complexity: 2, conversionImpact: 78, setupTime: '1 min' },
  'quick-view': { name: 'Quick View', category: 'eCommerce', complexity: 2, conversionImpact: 60, setupTime: '1.5 min' },
  'announcement-bar': { name: 'Announcement Bar', category: 'Announcement', complexity: 1, conversionImpact: 50, setupTime: '30 sec' },
  'team-member': { name: 'Team Member', category: 'Content', complexity: 1, conversionImpact: 35, setupTime: '1 min' },
  'faq-accordion': { name: 'FAQ Accordion', category: 'Support', complexity: 1, conversionImpact: 55, setupTime: '2 min' },
  'video-testimonial': { name: 'Video Testimonial', category: 'Social Proof', complexity: 2, conversionImpact: 82, setupTime: '1.5 min' },
  'lastset': { name: 'LastSet — Link-in-Bio', category: 'Personal Branding', complexity: 2, conversionImpact: 90, setupTime: '2 min' },
};

export const useWidgetPersonalization = () => {
  const { behavior, session, device, intent, segment } = usePersonalization();

  // Infer user profile from behavior and session data
  const userProfile = useMemo((): UserProfile => {
    const clickedElements = behavior.clickedElements || [];
    const utmCampaign = session.utmCampaign || '';
    
    // Infer role from behavior patterns
    let role: UserProfile['role'] = 'unknown';
    if (clickedElements.some(el => el.includes('developer') || el.includes('code') || el.includes('api'))) {
      role = 'developer';
    } else if (clickedElements.some(el => el.includes('marketing') || el.includes('conversion') || el.includes('analytics'))) {
      role = 'marketer';
    } else if (clickedElements.some(el => el.includes('agency') || el.includes('client'))) {
      role = 'agency';
    } else if (clickedElements.some(el => el.includes('design') || el.includes('portfolio'))) {
      role = 'designer';
    } else if (session.visitCount > 3 && behavior.widgetsGenerated > 2) {
      role = 'business_owner';
    }

    // Infer industry from UTM or behavior
    let industry: UserProfile['industry'] = 'unknown';
    if (utmCampaign.includes('ecommerce') || utmCampaign.includes('shop') || clickedElements.some(el => el.includes('payment') || el.includes('sale'))) {
      industry = 'ecommerce';
    } else if (utmCampaign.includes('saas') || clickedElements.some(el => el.includes('demo') || el.includes('trial'))) {
      industry = 'saas';
    } else if (clickedElements.some(el => el.includes('call') || el.includes('maps') || el.includes('local'))) {
      industry = 'local_business';
    } else if (clickedElements.some(el => el.includes('blog') || el.includes('newsletter') || el.includes('content'))) {
      industry = 'content';
    }

    // Infer website type
    let websiteType: UserProfile['websiteType'] = 'unknown';
    if (clickedElements.some(el => el.includes('landing'))) websiteType = 'landing_page';
    else if (clickedElements.some(el => el.includes('blog'))) websiteType = 'blog';
    else if (industry === 'ecommerce') websiteType = 'store';
    else if (role === 'agency' || role === 'designer') websiteType = 'portfolio';

    // Infer primary goal from intent
    let primaryGoal: UserProfile['primaryGoal'] = 'unknown';
    if (intent.interests.includes('lead-generation') || clickedElements.some(el => el.includes('lead'))) {
      primaryGoal = 'lead_generation';
    } else if (clickedElements.some(el => el.includes('sale') || el.includes('payment'))) {
      primaryGoal = 'sales';
    } else if (clickedElements.some(el => el.includes('chat') || el.includes('support'))) {
      primaryGoal = 'support';
    } else if (clickedElements.some(el => el.includes('share') || el.includes('follow'))) {
      primaryGoal = 'engagement';
    }

    // Device priority
    const devicePriority: UserProfile['devicePriority'] = device.isMobile ? 'mobile_first' : 'balanced';

    // Experience level based on behavior
    let experienceLevel: UserProfile['experienceLevel'] = 'beginner';
    if (behavior.widgetsGenerated > 5 || session.visitCount > 5) {
      experienceLevel = 'advanced';
    } else if (behavior.widgetsGenerated > 2 || session.visitCount > 2) {
      experienceLevel = 'intermediate';
    }

    return {
      role,
      industry,
      websiteType,
      primaryGoal,
      devicePriority,
      experienceLevel,
      planTier: 'premium', // Always premium now
    };
  }, [behavior, session, device, intent]);

  // Generate smart widget recommendations with affinity integration
  const getRecommendations = useCallback((limit: number = 3): WidgetRecommendation[] => {
    const benchmarks = INDUSTRY_BENCHMARKS[userProfile.industry];
    const goalWidgets = GOAL_WIDGET_MAP[userProfile.primaryGoal] || [];
    const affinities = behavior.widgetAffinities || {};
    
    // Score widgets based on multiple factors including affinities
    const scoredWidgets = Object.entries(WIDGET_METADATA)
      .map(([type, meta]) => {
        let score = meta.conversionImpact;
        const affinityScore = affinities[type] || 0;
        
        // MAJOR: Boost based on user's widget affinity (behavior-driven)
        if (affinityScore > 0) {
          score += Math.min(40, affinityScore * 2); // Up to 40 point boost
        }
        
        // Boost industry-relevant widgets
        if (benchmarks.topWidgets.includes(type as WidgetType)) {
          score += 20;
        }
        
        // Boost goal-aligned widgets
        if (goalWidgets.includes(type as WidgetType)) {
          score += 25;
        }
        
        // Adjust for experience level
        if (userProfile.experienceLevel === 'beginner' && meta.complexity > 2) {
          score -= 15;
        } else if (userProfile.experienceLevel === 'advanced' && meta.complexity === 1) {
          score -= 5;
        }
        
        // Mobile optimization
        if (userProfile.devicePriority === 'mobile_first') {
          if (['whatsapp', 'call-now', 'sticky-banner'].includes(type)) {
            score += 15;
          }
        }
        
        // Boost widgets user has interacted with but not downloaded
        const hasViewed = behavior.clickedElements.includes(`widget-type-select-${type}`);
        const hasDownloaded = behavior.clickedElements.includes(`widget-download-${type}`);
        
        if (hasViewed && !hasDownloaded) {
          score += 15; // They showed interest but didn't complete
        }
        
        // Don't recommend already-generated widgets heavily
        if (hasDownloaded) {
          score -= 30;
        }
        
        return { type: type as WidgetType, meta, score, affinityScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredWidgets.map(({ type, meta, score, affinityScore }) => {
      const isTopPick = score > 100;
      const isGoodMatch = score > 80;
      const isAffinityDriven = affinityScore > 15;
      
      let reason = '';
      let expectedImpact = '';
      
      // Prioritize affinity-based reasons
      if (isAffinityDriven) {
        reason = `Based on your ${affinityScore > 30 ? 'strong' : 'growing'} interest`;
        expectedImpact = `+${Math.round(meta.conversionImpact * 0.8)}% conversion potential`;
      } else if (userProfile.industry !== 'unknown' && benchmarks.topWidgets.includes(type)) {
        reason = `Top performer for ${userProfile.industry.replace('_', ' ')} websites`;
        expectedImpact = `+${Math.round(meta.conversionImpact * 0.7)}% conversion lift expected`;
      } else if (goalWidgets.includes(type)) {
        reason = `Optimized for ${userProfile.primaryGoal.replace('_', ' ')} goal`;
        expectedImpact = `+${Math.round(meta.conversionImpact * 0.6)}% in target metrics`;
      } else {
        reason = `High-performing ${meta.category.toLowerCase()} widget`;
        expectedImpact = `+${Math.round(meta.conversionImpact * 0.5)}% engagement boost`;
      }

      return {
        type,
        name: meta.name,
        reason,
        expectedImpact,
        conversionRate: `${benchmarks.avgConversion} industry avg`,
        priority: isTopPick ? 'high' : isGoodMatch ? 'medium' : 'low',
        category: meta.category,
        setupTime: meta.setupTime,
      };
    });
  }, [userProfile, behavior.clickedElements, behavior.widgetAffinities]);

  // Generate smart defaults for a widget type
  const getSmartDefaults = useCallback((widgetType: WidgetType): SmartDefaults => {
    const benchmarks = INDUSTRY_BENCHMARKS[userProfile.industry];
    const primaryColor = benchmarks.ctaColors[0] || '#9b87f5';
    const urgencyWord = benchmarks.urgencyWords[Math.floor(Math.random() * benchmarks.urgencyWords.length)];
    
    // Mobile-first defaults
    const position: 'left' | 'right' = device.isMobile ? 'right' : 'right';
    const size: WidgetSize = device.isMobile ? 'medium' : 'medium';
    
    // Industry-specific copy
    const industryDefaults: Record<string, Partial<SmartDefaults>> = {
      ecommerce: {
        title: '🛒 Complete Your Purchase',
        welcomeMessage: 'Need help finding the perfect product? Our team is here!',
        ctaText: 'Shop Now',
      },
      saas: {
        title: '🚀 Start Your Free Trial',
        welcomeMessage: 'Have questions about our platform? Let\'s chat!',
        ctaText: 'Get Started Free',
      },
      local_business: {
        title: '📍 Visit Us Today',
        welcomeMessage: 'Hello! How can we help you today?',
        ctaText: 'Call Now',
      },
      content: {
        title: '📧 Stay Updated',
        welcomeMessage: 'Join our community for exclusive content!',
        ctaText: 'Subscribe',
      },
      professional_services: {
        title: '📅 Book a Consultation',
        welcomeMessage: 'Ready to discuss your project? Schedule a call!',
        ctaText: 'Book Now',
      },
    };
    
    const defaults = industryDefaults[userProfile.industry] || {
      title: `${urgencyWord}!`,
      welcomeMessage: 'Hello! How can we assist you today?',
      ctaText: urgencyWord,
    };

    // Widget-specific overrides
    const widgetOverrides: Partial<Record<WidgetType, Partial<SmartDefaults>>> = {
      'exit-intent-popup': {
        title: 'Wait! Before You Go...',
        welcomeMessage: 'Get 15% off your first order with code SAVE15',
        ctaText: 'Claim Discount',
        triggerDelay: 0,
      },
      'lead-capture-popup': {
        title: 'Get Your Free Quote',
        welcomeMessage: 'Leave your details and we\'ll get back to you within 24 hours',
        ctaText: 'Get Quote',
        triggerDelay: 5,
      },
      'newsletter-signup': {
        title: 'Join 10,000+ Subscribers',
        welcomeMessage: 'Get weekly insights delivered to your inbox',
        ctaText: 'Subscribe Free',
      },
      'ai-chatbot': {
        title: 'AI Assistant',
        welcomeMessage: 'Hi! I\'m your AI assistant. Ask me anything!',
        ctaText: 'Start Chat',
      },
      'whatsapp': {
        title: 'Chat with Us',
        welcomeMessage: 'Hey there! 👋 How can we help you today?',
        ctaText: 'Open WhatsApp',
      },
    };

    return {
      title: widgetOverrides[widgetType]?.title || defaults.title || 'Welcome',
      welcomeMessage: widgetOverrides[widgetType]?.welcomeMessage || defaults.welcomeMessage || '',
      ctaText: widgetOverrides[widgetType]?.ctaText || defaults.ctaText || 'Get Started',
      primaryColor,
      position,
      size,
      triggerDelay: widgetOverrides[widgetType]?.triggerDelay,
    };
  }, [userProfile, device]);

  // Detect friction and provide guidance
  const getGuidance = useCallback((): GuidanceMessage | null => {
    const timeOnPage = behavior.timeOnSite;
    const scrollDepth = behavior.scrollDepth;
    const widgetsGenerated = behavior.widgetsGenerated;
    
    // Friction detection: User spent time but hasn't generated widget
    if (timeOnPage > 120 && widgetsGenerated === 0 && scrollDepth > 50) {
      const recommendation = getRecommendations(1)[0];
      return {
        type: 'opportunity',
        title: 'Need Help Getting Started?',
        message: `Based on your browsing, we recommend starting with a ${recommendation.name}. It's the top converter for your needs.`,
        action: recommendation.type,
        actionLabel: `Create ${recommendation.name}`,
      };
    }
    
    // Beginner tip
    if (userProfile.experienceLevel === 'beginner' && widgetsGenerated === 0 && timeOnPage > 30) {
      return {
        type: 'tip',
        title: 'Quick Tip',
        message: 'Start with WhatsApp Chat - it takes 30 seconds and boosts conversions by 85% on average.',
        action: 'whatsapp',
        actionLabel: 'Create WhatsApp Widget',
      };
    }
    
    // Power user upsell (soft)
    if (userProfile.experienceLevel === 'advanced' && widgetsGenerated > 3 && segment === 'power_user') {
      return {
        type: 'upsell',
        title: 'Pro Feature Unlocked',
        message: 'You\'re getting great results! A/B Testing can help you optimize further.',
        action: '/ab-testing',
        actionLabel: 'Try A/B Testing',
      };
    }
    
    // Missed opportunity detection
    if (userProfile.industry === 'ecommerce' && !behavior.clickedElements.some(el => el.includes('exit-intent'))) {
      if (widgetsGenerated > 0 && timeOnPage > 60) {
        return {
          type: 'opportunity',
          title: 'Boost Sales by 12%',
          message: 'E-commerce sites see 12% more conversions with Exit Intent Popups. You haven\'t tried one yet!',
          action: 'exit-intent-popup',
          actionLabel: 'Create Exit Intent',
        };
      }
    }
    
    return null;
  }, [behavior, userProfile, segment, getRecommendations]);

  // Get highest-leverage optimization
  const getTopOptimization = useCallback((): { widget: WidgetType; impact: string; reason: string } | null => {
    const recommendations = getRecommendations(1);
    if (recommendations.length === 0) return null;
    
    const top = recommendations[0];
    return {
      widget: top.type,
      impact: top.expectedImpact,
      reason: top.reason,
    };
  }, [getRecommendations]);

  return {
    userProfile,
    getRecommendations,
    getSmartDefaults,
    getGuidance,
    getTopOptimization,
    industryBenchmarks: INDUSTRY_BENCHMARKS[userProfile.industry],
  };
};
