import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface UserBehavior {
  pageViews: number;
  widgetsGenerated: number;
  templatesViewed: number;
  timeOnSite: number; // in seconds
  scrollDepth: number; // 0-100
  clickedElements: string[];
  lastActiveTime: number;
}

interface SessionContext {
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  landingPage: string;
  pagesVisited: string[];
  sessionStart: number;
  isReturningUser: boolean;
  visitCount: number;
}

interface LocationData {
  country: string | null;
  city: string | null;
  timezone: string;
  language: string;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  browser: string;
  os: string;
  screenWidth: number;
}

interface UserIntent {
  type: 'exploring' | 'comparing' | 'ready_to_convert' | 'returning_power_user' | 'new_visitor';
  confidence: number; // 0-1
  interests: string[];
}

interface PersonalizedContent {
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  ctaSecondary: string;
  recommendedTemplates: string[];
  showSocialProof: boolean;
  showUrgency: boolean;
  pricingEmphasis: 'value' | 'features' | 'savings';
}

interface PersonalizationState {
  behavior: UserBehavior;
  session: SessionContext;
  location: LocationData;
  device: DeviceInfo;
  intent: UserIntent;
  content: PersonalizedContent;
  segment: 'cold_visitor' | 'warm_lead' | 'hot_prospect' | 'power_user';
}

interface PersonalizationContextType extends PersonalizationState {
  trackEvent: (eventName: string, data?: Record<string, unknown>) => void;
  trackClick: (elementId: string) => void;
  trackPageView: (pagePath: string) => void;
  trackWidgetGeneration: () => void;
  getPersonalizedCTA: () => string;
  getPersonalizedHeadline: () => string;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
  };
};

const detectDevice = (): DeviceInfo => {
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua) && window.innerWidth < 768;
  const isTablet = /iPad|Android/i.test(ua) && window.innerWidth >= 768 && window.innerWidth < 1024;
  
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'Mac';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return { isMobile, isTablet, browser, os, screenWidth: window.innerWidth };
};

const getStoredData = (key: string, defaultValue: unknown) => {
  try {
    const stored = localStorage.getItem(`widgetify_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const storeData = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`widgetify_${key}`, JSON.stringify(value));
  } catch {
    // Silent fail for storage issues
  }
};

const determineIntent = (behavior: UserBehavior, session: SessionContext): UserIntent => {
  const interests: string[] = [];
  
  // Analyze clicked elements for interests
  if (behavior.clickedElements.some(el => el.includes('template'))) interests.push('templates');
  if (behavior.clickedElements.some(el => el.includes('quiz'))) interests.push('lead-generation');
  if (behavior.clickedElements.some(el => el.includes('pricing'))) interests.push('pricing');
  if (behavior.clickedElements.some(el => el.includes('custom'))) interests.push('customization');
  
  // Determine intent type
  let type: UserIntent['type'] = 'new_visitor';
  let confidence = 0.5;
  
  if (session.visitCount > 3 && behavior.widgetsGenerated > 2) {
    type = 'returning_power_user';
    confidence = 0.9;
  } else if (behavior.clickedElements.some(el => el.includes('pricing')) && behavior.timeOnSite > 120) {
    type = 'ready_to_convert';
    confidence = 0.8;
  } else if (behavior.pageViews > 3 || behavior.templatesViewed > 2) {
    type = 'comparing';
    confidence = 0.7;
  } else if (behavior.timeOnSite > 60 || behavior.scrollDepth > 50) {
    type = 'exploring';
    confidence = 0.6;
  }
  
  return { type, confidence, interests };
};

const getSegment = (intent: UserIntent, behavior: UserBehavior): PersonalizationState['segment'] => {
  if (intent.type === 'returning_power_user') return 'power_user';
  if (intent.type === 'ready_to_convert') return 'hot_prospect';
  if (intent.type === 'comparing' || intent.type === 'exploring') return 'warm_lead';
  return 'cold_visitor';
};

const generatePersonalizedContent = (
  intent: UserIntent,
  session: SessionContext,
  behavior: UserBehavior,
  device: DeviceInfo
): PersonalizedContent => {
  const baseContent: PersonalizedContent = {
    heroHeadline: 'Create Stunning Widgets in Seconds',
    heroSubheadline: 'No coding required. Generate beautiful, responsive widgets that convert visitors into customers.',
    ctaText: 'Start Creating Free',
    ctaSecondary: 'View Templates',
    recommendedTemplates: ['newsletter', 'cta', 'social'],
    showSocialProof: true,
    showUrgency: false,
    pricingEmphasis: 'features',
  };
  
  // Personalize based on referral source
  if (session.utmSource?.includes('producthunt')) {
    baseContent.heroHeadline = 'Welcome, Product Hunters! 🎉';
    baseContent.heroSubheadline = 'Join thousands of makers using Widgetify to boost conversions.';
    baseContent.ctaText = 'Try It Free';
    baseContent.showSocialProof = true;
  } else if (session.utmSource?.includes('twitter') || session.utmSource?.includes('x')) {
    baseContent.heroHeadline = 'Build Widgets That Go Viral';
    baseContent.heroSubheadline = 'Create shareable widgets in minutes, not hours.';
  } else if (session.utmCampaign?.includes('retarget')) {
    baseContent.heroHeadline = 'Welcome Back! Pick Up Where You Left Off';
    baseContent.heroSubheadline = 'Your widget is waiting for you.';
    baseContent.ctaText = 'Continue Building';
    baseContent.showUrgency = true;
  }
  
  // Personalize based on intent
  switch (intent.type) {
    case 'returning_power_user':
      baseContent.heroHeadline = 'Welcome Back, Pro! 👋';
      baseContent.heroSubheadline = 'Ready to create your next high-converting widget?';
      baseContent.ctaText = 'Create New Widget';
      baseContent.ctaSecondary = 'View Your Widgets';
      baseContent.recommendedTemplates = ['quiz', 'feedback', 'advanced-cta'];
      break;
      
    case 'ready_to_convert':
      baseContent.heroHeadline = 'Ready to Boost Your Conversions?';
      baseContent.heroSubheadline = 'Join 10,000+ businesses already using Widgetify.';
      baseContent.ctaText = 'Get Started Now';
      baseContent.showUrgency = true;
      baseContent.pricingEmphasis = 'value';
      break;
      
    case 'comparing':
      baseContent.heroHeadline = 'The Easiest Widget Builder on the Market';
      baseContent.heroSubheadline = 'Compare our features and see why developers love us.';
      baseContent.ctaText = 'See All Features';
      baseContent.pricingEmphasis = 'features';
      break;
      
    case 'exploring':
      baseContent.heroHeadline = 'Discover the Power of Smart Widgets';
      baseContent.heroSubheadline = 'From lead capture to social proof, we have got you covered.';
      baseContent.ctaText = 'Explore Templates';
      break;
  }
  
  // Personalize based on interests
  if (intent.interests.includes('lead-generation')) {
    baseContent.recommendedTemplates = ['quiz', 'newsletter', 'lead-magnet'];
  } else if (intent.interests.includes('pricing')) {
    baseContent.pricingEmphasis = 'savings';
    baseContent.showUrgency = true;
  }
  
  // Device-specific adjustments
  if (device.isMobile) {
    baseContent.ctaText = baseContent.ctaText.length > 15 ? 'Get Started' : baseContent.ctaText;
  }
  
  return baseContent;
};

export const PersonalizationProvider = ({ children }: { children: ReactNode }) => {
  const [behavior, setBehavior] = useState<UserBehavior>(() => ({
    pageViews: getStoredData('pageViews', 0) as number,
    widgetsGenerated: getStoredData('widgetsGenerated', 0) as number,
    templatesViewed: getStoredData('templatesViewed', 0) as number,
    timeOnSite: 0,
    scrollDepth: 0,
    clickedElements: [],
    lastActiveTime: Date.now(),
  }));
  
  const [session] = useState<SessionContext>(() => {
    const utmParams = getUTMParams();
    const visitCount = (getStoredData('visitCount', 0) as number) + 1;
    storeData('visitCount', visitCount);
    
    return {
      referrer: document.referrer,
      ...utmParams,
      landingPage: window.location.pathname,
      pagesVisited: [window.location.pathname],
      sessionStart: Date.now(),
      isReturningUser: visitCount > 1,
      visitCount,
    };
  });
  
  const [location] = useState<LocationData>(() => ({
    country: null,
    city: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  }));
  
  const [device] = useState<DeviceInfo>(detectDevice);
  
  const intent = determineIntent(behavior, session);
  const segment = getSegment(intent, behavior);
  const content = generatePersonalizedContent(intent, session, behavior, device);
  
  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setBehavior(prev => ({ ...prev, timeOnSite: prev.timeOnSite + 1 }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.min(100, Math.round((scrolled / docHeight) * 100));
      
      setBehavior(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, depth),
      }));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Persist behavior data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      storeData('pageViews', behavior.pageViews);
      storeData('widgetsGenerated', behavior.widgetsGenerated);
      storeData('templatesViewed', behavior.templatesViewed);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [behavior]);
  
  const trackEvent = useCallback((eventName: string, data?: Record<string, unknown>) => {
    console.log('[Personalization] Event:', eventName, data);
    // Could send to analytics here
  }, []);
  
  const trackClick = useCallback((elementId: string) => {
    setBehavior(prev => ({
      ...prev,
      clickedElements: [...new Set([...prev.clickedElements, elementId])],
      lastActiveTime: Date.now(),
    }));
    trackEvent('click', { elementId });
  }, [trackEvent]);
  
  const trackPageView = useCallback((pagePath: string) => {
    setBehavior(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
    }));
    storeData('pageViews', behavior.pageViews + 1);
    trackEvent('page_view', { path: pagePath });
  }, [behavior.pageViews, trackEvent]);
  
  const trackWidgetGeneration = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      widgetsGenerated: prev.widgetsGenerated + 1,
    }));
    storeData('widgetsGenerated', behavior.widgetsGenerated + 1);
    trackEvent('widget_generated');
  }, [behavior.widgetsGenerated, trackEvent]);
  
  const getPersonalizedCTA = useCallback(() => {
    return content.ctaText;
  }, [content.ctaText]);
  
  const getPersonalizedHeadline = useCallback(() => {
    return content.heroHeadline;
  }, [content.heroHeadline]);
  
  return (
    <PersonalizationContext.Provider
      value={{
        behavior,
        session,
        location,
        device,
        intent,
        content,
        segment,
        trackEvent,
        trackClick,
        trackPageView,
        trackWidgetGeneration,
        getPersonalizedCTA,
        getPersonalizedHeadline,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};
