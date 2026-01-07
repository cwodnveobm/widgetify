import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface UserBehavior {
  pageViews: number;
  widgetsGenerated: number;
  templatesViewed: number;
  timeOnSite: number; // in seconds
  scrollDepth: number; // 0-100
  clickedElements: string[];
  lastActiveTime: number;
  // New enhanced tracking
  microConversions: MicroConversion[];
  engagementDecay: number; // 0-1, decreases with inactivity
  widgetAffinities: Record<string, number>; // widget type -> affinity score
  sessionHeatmap: SessionHeatmapData;
  interactionVelocity: number; // interactions per minute
}

// New: Micro-conversion tracking for funnel analysis
interface MicroConversion {
  type: 'scroll_50' | 'scroll_100' | 'time_30s' | 'time_60s' | 'first_click' | 'widget_view' | 'widget_hover' | 'copy_code' | 'download';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// New: Session heatmap data
interface SessionHeatmapData {
  clickZones: { x: number; y: number; element: string }[];
  hoverDurations: Record<string, number>;
  focusAreas: string[];
}

interface SessionContext {
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  landingPage: string;
  pagesVisited: string[];
  sessionStart: number;
  isReturningUser: boolean;
  visitCount: number;
  // New enhanced session data
  daysSinceLastVisit: number;
  totalTimeAllSessions: number;
  averageSessionDuration: number;
  bounceRisk: number; // 0-1
  referralPath: ReferralPath;
}

// New: Detailed referral path analysis
type ReferralPath = 
  | 'direct' 
  | 'organic_google' 
  | 'organic_bing' 
  | 'organic_other'
  | 'paid_google' 
  | 'paid_facebook' 
  | 'paid_other'
  | 'social_twitter' 
  | 'social_linkedin' 
  | 'social_facebook' 
  | 'social_instagram'
  | 'social_producthunt'
  | 'social_reddit'
  | 'email_campaign'
  | 'affiliate'
  | 'referral_blog'
  | 'referral_other';

// New: Time-based context
interface TimeContext {
  hour: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isBusinessHours: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  localTime: string;
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
  connectionType: 'slow' | 'fast' | 'unknown';
  touchCapable: boolean;
}

interface UserIntent {
  type: 'exploring' | 'comparing' | 'ready_to_convert' | 'returning_power_user' | 'new_visitor';
  confidence: number; // 0-1
  interests: string[];
  predictedNextAction: string | null;
  churnRisk: number; // 0-1
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
  // New enhanced content
  urgencyMessage: string | null;
  socialProofMessage: string | null;
  personalizedBadge: { text: string; variant: 'default' | 'success' | 'warning' } | null;
}

interface PersonalizationState {
  behavior: UserBehavior;
  session: SessionContext;
  location: LocationData;
  device: DeviceInfo;
  intent: UserIntent;
  content: PersonalizedContent;
  segment: 'cold_visitor' | 'warm_lead' | 'hot_prospect' | 'power_user';
  // New enhanced state
  timeContext: TimeContext;
  engagementScore: number; // 0-100
  conversionProbability: number; // 0-1
}

interface PersonalizationContextType extends PersonalizationState {
  trackEvent: (eventName: string, data?: Record<string, unknown>) => void;
  trackClick: (elementId: string, metadata?: Record<string, unknown>) => void;
  trackPageView: (pagePath: string) => void;
  trackWidgetGeneration: (widgetType?: string) => void;
  trackMicroConversion: (type: MicroConversion['type'], metadata?: Record<string, unknown>) => void;
  trackWidgetInteraction: (widgetType: string, interactionType: 'view' | 'hover' | 'click' | 'configure' | 'download') => void;
  getPersonalizedCTA: () => string;
  getPersonalizedHeadline: () => string;
  getTimeBasedGreeting: () => string;
  getReferralSpecificContent: () => { headline: string; subheadline: string; badge?: string };
  calculateEngagementScore: () => number;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    utmContent: params.get('utm_content'),
    utmTerm: params.get('utm_term'),
  };
};

// New: Calculate time context
const getTimeContext = (): TimeContext => {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isBusinessHours = hour >= 9 && hour < 18 && !isWeekend;
  
  let timeOfDay: TimeContext['timeOfDay'] = 'night';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  
  return {
    hour,
    dayOfWeek,
    isWeekend,
    isBusinessHours,
    timeOfDay,
    localTime: now.toLocaleTimeString(),
  };
};

// New: Determine referral path from UTM and referrer
const determineReferralPath = (utmSource: string | null, utmMedium: string | null, referrer: string): ReferralPath => {
  const src = (utmSource || '').toLowerCase();
  const med = (utmMedium || '').toLowerCase();
  const ref = referrer.toLowerCase();
  
  // Check for paid traffic first
  if (med === 'cpc' || med === 'ppc' || med === 'paid') {
    if (src.includes('google')) return 'paid_google';
    if (src.includes('facebook') || src.includes('fb')) return 'paid_facebook';
    return 'paid_other';
  }
  
  // Check for email
  if (med === 'email' || src.includes('email') || src.includes('newsletter')) {
    return 'email_campaign';
  }
  
  // Check for social
  if (src.includes('twitter') || src.includes('x.com') || ref.includes('twitter') || ref.includes('x.com')) return 'social_twitter';
  if (src.includes('linkedin') || ref.includes('linkedin')) return 'social_linkedin';
  if (src.includes('facebook') || src.includes('fb') || ref.includes('facebook')) return 'social_facebook';
  if (src.includes('instagram') || ref.includes('instagram')) return 'social_instagram';
  if (src.includes('producthunt') || ref.includes('producthunt')) return 'social_producthunt';
  if (src.includes('reddit') || ref.includes('reddit')) return 'social_reddit';
  
  // Check for organic search
  if (ref.includes('google')) return 'organic_google';
  if (ref.includes('bing')) return 'organic_bing';
  if (ref.includes('search') || ref.includes('duckduckgo') || ref.includes('yahoo')) return 'organic_other';
  
  // Check for affiliate
  if (med === 'affiliate' || src.includes('affiliate')) return 'affiliate';
  
  // Check for blog/referral
  if (ref && !ref.includes(window.location.hostname)) {
    if (ref.includes('blog') || ref.includes('medium') || ref.includes('dev.to')) return 'referral_blog';
    return 'referral_other';
  }
  
  return 'direct';
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
  
  // Detect connection speed
  let connectionType: DeviceInfo['connectionType'] = 'unknown';
  const connection = (navigator as any).connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === '4g' || effectiveType === '5g') connectionType = 'fast';
    else if (effectiveType === '2g' || effectiveType === 'slow-2g') connectionType = 'slow';
  }
  
  // Detect touch capability
  const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return { isMobile, isTablet, browser, os, screenWidth: window.innerWidth, connectionType, touchCapable };
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

// New: Calculate engagement score based on multiple factors
const calculateRawEngagementScore = (behavior: UserBehavior, session: SessionContext): number => {
  let score = 0;
  
  // Time on site (max 25 points)
  score += Math.min(25, behavior.timeOnSite / 12);
  
  // Scroll depth (max 15 points)
  score += behavior.scrollDepth * 0.15;
  
  // Interactions (max 20 points)
  score += Math.min(20, behavior.clickedElements.length * 2);
  
  // Widgets generated (max 20 points)
  score += Math.min(20, behavior.widgetsGenerated * 5);
  
  // Return visitor bonus (max 10 points)
  if (session.isReturningUser) {
    score += Math.min(10, session.visitCount * 2);
  }
  
  // Interaction velocity bonus (max 10 points)
  score += Math.min(10, behavior.interactionVelocity * 2);
  
  // Apply engagement decay
  score *= behavior.engagementDecay;
  
  return Math.min(100, Math.round(score));
};

// New: Calculate conversion probability
const calculateConversionProbability = (behavior: UserBehavior, intent: UserIntent, session: SessionContext): number => {
  let probability = 0.05; // Base probability
  
  // Intent-based adjustments
  switch (intent.type) {
    case 'ready_to_convert': probability += 0.4; break;
    case 'returning_power_user': probability += 0.3; break;
    case 'comparing': probability += 0.2; break;
    case 'exploring': probability += 0.1; break;
  }
  
  // Behavior adjustments
  if (behavior.widgetsGenerated > 0) probability += 0.15;
  if (behavior.widgetsGenerated > 2) probability += 0.1;
  if (behavior.scrollDepth > 75) probability += 0.05;
  if (behavior.timeOnSite > 120) probability += 0.05;
  
  // Micro-conversion adjustments
  const copyCodeConversions = behavior.microConversions.filter(mc => mc.type === 'copy_code').length;
  probability += Math.min(0.2, copyCodeConversions * 0.05);
  
  // Returning user bonus
  if (session.isReturningUser && session.visitCount > 2) probability += 0.1;
  
  return Math.min(0.95, probability);
};

const determineIntent = (behavior: UserBehavior, session: SessionContext): UserIntent => {
  const interests: string[] = [];
  
  // Analyze clicked elements for interests
  if (behavior.clickedElements.some(el => el.includes('template'))) interests.push('templates');
  if (behavior.clickedElements.some(el => el.includes('quiz'))) interests.push('lead-generation');
  if (behavior.clickedElements.some(el => el.includes('pricing'))) interests.push('pricing');
  if (behavior.clickedElements.some(el => el.includes('custom'))) interests.push('customization');
  if (behavior.clickedElements.some(el => el.includes('whatsapp'))) interests.push('communication');
  if (behavior.clickedElements.some(el => el.includes('analytics') || el.includes('ab-test'))) interests.push('optimization');
  
  // Analyze widget affinities for interests
  const topAffinities = Object.entries(behavior.widgetAffinities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([widget]) => widget);
  interests.push(...topAffinities);
  
  // Determine intent type
  let type: UserIntent['type'] = 'new_visitor';
  let confidence = 0.5;
  
  if (session.visitCount > 3 && behavior.widgetsGenerated > 2) {
    type = 'returning_power_user';
    confidence = 0.9;
  } else if (behavior.clickedElements.some(el => el.includes('pricing')) && behavior.timeOnSite > 120) {
    type = 'ready_to_convert';
    confidence = 0.8;
  } else if (behavior.microConversions.some(mc => mc.type === 'copy_code' || mc.type === 'download')) {
    type = 'ready_to_convert';
    confidence = 0.85;
  } else if (behavior.pageViews > 3 || behavior.templatesViewed > 2) {
    type = 'comparing';
    confidence = 0.7;
  } else if (behavior.timeOnSite > 60 || behavior.scrollDepth > 50) {
    type = 'exploring';
    confidence = 0.6;
  }
  
  // Predict next action
  let predictedNextAction: string | null = null;
  if (behavior.widgetsGenerated === 0 && behavior.timeOnSite > 30) {
    predictedNextAction = 'create_first_widget';
  } else if (behavior.widgetsGenerated > 0 && !behavior.microConversions.some(mc => mc.type === 'copy_code')) {
    predictedNextAction = 'copy_widget_code';
  } else if (behavior.widgetsGenerated > 2) {
    predictedNextAction = 'explore_ab_testing';
  }
  
  // Calculate churn risk
  let churnRisk = 0.5;
  if (behavior.engagementDecay < 0.5) churnRisk = 0.8;
  else if (behavior.timeOnSite > 300 && behavior.widgetsGenerated === 0) churnRisk = 0.7;
  else if (behavior.widgetsGenerated > 0) churnRisk = 0.2;
  
  return { type, confidence, interests: [...new Set(interests)], predictedNextAction, churnRisk };
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
  device: DeviceInfo,
  timeContext: TimeContext
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
    urgencyMessage: null,
    socialProofMessage: null,
    personalizedBadge: null,
  };
  
  // Time-based personalization
  if (timeContext.timeOfDay === 'morning') {
    baseContent.heroHeadline = 'Good Morning! Start Your Day with Smart Widgets ☀️';
  } else if (timeContext.timeOfDay === 'evening') {
    baseContent.heroHeadline = 'Wind Down with Some Widget Building 🌙';
  }
  
  // Weekend vs weekday personalization
  if (timeContext.isWeekend) {
    baseContent.heroSubheadline = 'Perfect time to work on your side project. Create widgets in minutes!';
  }
  
  // Referral path-based personalization
  switch (session.referralPath) {
    case 'social_producthunt':
      baseContent.heroHeadline = 'Welcome, Product Hunters! 🎉';
      baseContent.heroSubheadline = 'Join thousands of makers using Widgetify to boost conversions.';
      baseContent.ctaText = 'Try It Free';
      baseContent.personalizedBadge = { text: '🦄 Product Hunt Special', variant: 'success' };
      baseContent.showSocialProof = true;
      break;
      
    case 'social_twitter':
      baseContent.heroHeadline = 'Build Widgets That Go Viral 🐦';
      baseContent.heroSubheadline = 'Create shareable widgets in minutes, not hours.';
      baseContent.personalizedBadge = { text: 'Seen on X', variant: 'default' };
      break;
      
    case 'social_linkedin':
      baseContent.heroHeadline = 'Professional Widgets for Professional Sites';
      baseContent.heroSubheadline = 'Trusted by businesses worldwide to increase conversions.';
      baseContent.personalizedBadge = { text: 'B2B Favorite', variant: 'default' };
      break;
      
    case 'social_reddit':
      baseContent.heroHeadline = 'The Widget Builder Reddit Loves';
      baseContent.heroSubheadline = 'No BS, no paywalls. Just great widgets.';
      baseContent.personalizedBadge = { text: 'Community Pick', variant: 'default' };
      break;
      
    case 'organic_google':
    case 'organic_bing':
      baseContent.heroHeadline = 'Found What You\'re Looking For!';
      baseContent.heroSubheadline = 'The #1 free widget builder for modern websites.';
      baseContent.socialProofMessage = 'Trusted by 10,000+ website owners';
      break;
      
    case 'paid_google':
    case 'paid_facebook':
      baseContent.showUrgency = true;
      baseContent.urgencyMessage = 'Special offer for new users today!';
      break;
      
    case 'email_campaign':
      baseContent.heroHeadline = 'Welcome Back! We\'ve Missed You';
      baseContent.heroSubheadline = 'Pick up where you left off or try something new.';
      baseContent.ctaText = 'Continue Building';
      break;
      
    case 'referral_blog':
      baseContent.heroHeadline = 'Thanks for Reading About Us!';
      baseContent.heroSubheadline = 'Now experience the widget builder everyone\'s talking about.';
      break;
  }
  
  // Retargeting override
  if (session.utmCampaign?.includes('retarget')) {
    baseContent.heroHeadline = 'Welcome Back! Pick Up Where You Left Off';
    baseContent.heroSubheadline = 'Your widget is waiting for you.';
    baseContent.ctaText = 'Continue Building';
    baseContent.showUrgency = true;
  }
  
  // Intent-based personalization (override referral if stronger signal)
  switch (intent.type) {
    case 'returning_power_user':
      baseContent.heroHeadline = 'Welcome Back, Pro! 👋';
      baseContent.heroSubheadline = `You've created ${behavior.widgetsGenerated} widgets. Ready for more?`;
      baseContent.ctaText = 'Create New Widget';
      baseContent.ctaSecondary = 'View Your Widgets';
      baseContent.recommendedTemplates = ['quiz', 'feedback', 'advanced-cta'];
      baseContent.personalizedBadge = { text: '⭐ Power User', variant: 'success' };
      break;
      
    case 'ready_to_convert':
      baseContent.heroHeadline = 'Ready to Boost Your Conversions?';
      baseContent.heroSubheadline = 'Join 10,000+ businesses already using Widgetify.';
      baseContent.ctaText = 'Get Started Now';
      baseContent.showUrgency = true;
      baseContent.pricingEmphasis = 'value';
      baseContent.socialProofMessage = '2,500+ widgets created this week';
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
  
  // Interest-based recommendations
  if (intent.interests.includes('lead-generation')) {
    baseContent.recommendedTemplates = ['quiz', 'newsletter', 'lead-magnet'];
  } else if (intent.interests.includes('communication')) {
    baseContent.recommendedTemplates = ['whatsapp', 'live-chat', 'call-now'];
  } else if (intent.interests.includes('optimization')) {
    baseContent.recommendedTemplates = ['exit-intent-popup', 'countdown-timer', 'ab-testing'];
  } else if (intent.interests.includes('pricing')) {
    baseContent.pricingEmphasis = 'savings';
    baseContent.showUrgency = true;
  }
  
  // Device-specific adjustments
  if (device.isMobile) {
    baseContent.ctaText = baseContent.ctaText.length > 15 ? 'Get Started' : baseContent.ctaText;
    // Prioritize mobile-friendly widgets
    baseContent.recommendedTemplates = ['whatsapp', 'call-now', 'sticky-banner'];
  }
  
  // Slow connection adjustments
  if (device.connectionType === 'slow') {
    baseContent.heroSubheadline = 'Lightweight widgets that load fast on any connection.';
  }
  
  // Days since last visit personalization for returning users
  if (session.isReturningUser && session.daysSinceLastVisit > 7) {
    baseContent.heroHeadline = 'Great to See You Again! 🎉';
    baseContent.heroSubheadline = 'We\'ve added new features since your last visit.';
    baseContent.personalizedBadge = { text: 'New Features!', variant: 'warning' };
  }
  
  return baseContent;
};

export const PersonalizationProvider = ({ children }: { children: ReactNode }) => {
  const [timeContext] = useState<TimeContext>(getTimeContext);
  
  const [behavior, setBehavior] = useState<UserBehavior>(() => ({
    pageViews: getStoredData('pageViews', 0) as number,
    widgetsGenerated: getStoredData('widgetsGenerated', 0) as number,
    templatesViewed: getStoredData('templatesViewed', 0) as number,
    timeOnSite: 0,
    scrollDepth: 0,
    clickedElements: [],
    lastActiveTime: Date.now(),
    // New enhanced tracking
    microConversions: [],
    engagementDecay: 1.0,
    widgetAffinities: getStoredData('widgetAffinities', {}) as Record<string, number>,
    sessionHeatmap: {
      clickZones: [],
      hoverDurations: {},
      focusAreas: [],
    },
    interactionVelocity: 0,
  }));
  
  const [session] = useState<SessionContext>(() => {
    const utmParams = getUTMParams();
    const visitCount = (getStoredData('visitCount', 0) as number) + 1;
    const lastVisitTimestamp = getStoredData('lastVisitTimestamp', 0) as number;
    const totalTimeAllSessions = getStoredData('totalTimeAllSessions', 0) as number;
    const daysSinceLastVisit = lastVisitTimestamp 
      ? Math.floor((Date.now() - lastVisitTimestamp) / (1000 * 60 * 60 * 24))
      : 0;
    
    storeData('visitCount', visitCount);
    storeData('lastVisitTimestamp', Date.now());
    
    const referralPath = determineReferralPath(utmParams.utmSource, utmParams.utmMedium, document.referrer);
    
    return {
      referrer: document.referrer,
      ...utmParams,
      landingPage: window.location.pathname,
      pagesVisited: [window.location.pathname],
      sessionStart: Date.now(),
      isReturningUser: visitCount > 1,
      visitCount,
      daysSinceLastVisit,
      totalTimeAllSessions,
      averageSessionDuration: visitCount > 1 ? totalTimeAllSessions / (visitCount - 1) : 0,
      bounceRisk: 0.5, // Will be updated dynamically
      referralPath,
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
  const content = generatePersonalizedContent(intent, session, behavior, device, timeContext);
  const engagementScore = calculateRawEngagementScore(behavior, session);
  const conversionProbability = calculateConversionProbability(behavior, intent, session);
  
  // Track time on site and engagement decay
  useEffect(() => {
    const interval = setInterval(() => {
      setBehavior(prev => {
        const timeSinceLastActive = (Date.now() - prev.lastActiveTime) / 1000;
        // Decay engagement by 2% per 10 seconds of inactivity
        const decayRate = timeSinceLastActive > 10 ? 0.98 : 1.0;
        const newEngagementDecay = Math.max(0.3, prev.engagementDecay * decayRate);
        
        // Calculate interaction velocity (interactions per minute)
        const sessionMinutes = (prev.timeOnSite + 1) / 60;
        const totalInteractions = prev.clickedElements.length + prev.microConversions.length;
        const interactionVelocity = sessionMinutes > 0 ? totalInteractions / sessionMinutes : 0;
        
        return { 
          ...prev, 
          timeOnSite: prev.timeOnSite + 1,
          engagementDecay: newEngagementDecay,
          interactionVelocity,
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track scroll depth with micro-conversions
  useEffect(() => {
    let hasTriggered50 = false;
    let hasTriggered100 = false;
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.min(100, Math.round((scrolled / docHeight) * 100));
      
      setBehavior(prev => {
        const updates: Partial<UserBehavior> = {
          scrollDepth: Math.max(prev.scrollDepth, depth),
          lastActiveTime: Date.now(),
          engagementDecay: Math.min(1.0, prev.engagementDecay + 0.05), // Boost engagement on scroll
        };
        
        // Track scroll micro-conversions
        const newConversions = [...prev.microConversions];
        if (!hasTriggered50 && depth >= 50) {
          hasTriggered50 = true;
          newConversions.push({ type: 'scroll_50', timestamp: Date.now() });
        }
        if (!hasTriggered100 && depth >= 95) {
          hasTriggered100 = true;
          newConversions.push({ type: 'scroll_100', timestamp: Date.now() });
        }
        updates.microConversions = newConversions;
        
        return { ...prev, ...updates };
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track time-based micro-conversions
  useEffect(() => {
    const timer30s = setTimeout(() => {
      setBehavior(prev => ({
        ...prev,
        microConversions: [...prev.microConversions, { type: 'time_30s', timestamp: Date.now() }],
      }));
    }, 30000);
    
    const timer60s = setTimeout(() => {
      setBehavior(prev => ({
        ...prev,
        microConversions: [...prev.microConversions, { type: 'time_60s', timestamp: Date.now() }],
      }));
    }, 60000);
    
    return () => {
      clearTimeout(timer30s);
      clearTimeout(timer60s);
    };
  }, []);
  
  // Persist behavior data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      storeData('pageViews', behavior.pageViews);
      storeData('widgetsGenerated', behavior.widgetsGenerated);
      storeData('templatesViewed', behavior.templatesViewed);
      storeData('widgetAffinities', behavior.widgetAffinities);
      storeData('totalTimeAllSessions', session.totalTimeAllSessions + behavior.timeOnSite);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [behavior, session.totalTimeAllSessions]);
  
  const trackEvent = useCallback((eventName: string, data?: Record<string, unknown>) => {
    console.log('[Personalization] Event:', eventName, data);
  }, []);
  
  const trackClick = useCallback((elementId: string, metadata?: Record<string, unknown>) => {
    setBehavior(prev => {
      const isFirstClick = prev.clickedElements.length === 0;
      const newConversions = isFirstClick 
        ? [...prev.microConversions, { type: 'first_click' as const, timestamp: Date.now() }]
        : prev.microConversions;
      
      return {
        ...prev,
        clickedElements: [...new Set([...prev.clickedElements, elementId])],
        lastActiveTime: Date.now(),
        engagementDecay: Math.min(1.0, prev.engagementDecay + 0.1),
        microConversions: newConversions,
      };
    });
    trackEvent('click', { elementId, ...metadata });
  }, [trackEvent]);
  
  const trackPageView = useCallback((pagePath: string) => {
    setBehavior(prev => {
      const newPageViews = prev.pageViews + 1;
      storeData('pageViews', newPageViews);
      return {
        ...prev,
        pageViews: newPageViews,
      };
    });
    trackEvent('page_view', { path: pagePath });
  }, [trackEvent]);
  
  const trackWidgetGeneration = useCallback((widgetType?: string) => {
    setBehavior(prev => {
      const newCount = prev.widgetsGenerated + 1;
      storeData('widgetsGenerated', newCount);
      
      // Update widget affinities
      const newAffinities = { ...prev.widgetAffinities };
      if (widgetType) {
        newAffinities[widgetType] = (newAffinities[widgetType] || 0) + 10;
      }
      
      return {
        ...prev,
        widgetsGenerated: newCount,
        widgetAffinities: newAffinities,
      };
    });
    trackEvent('widget_generated', { widgetType });
  }, [trackEvent]);
  
  const trackMicroConversion = useCallback((type: MicroConversion['type'], metadata?: Record<string, unknown>) => {
    setBehavior(prev => ({
      ...prev,
      microConversions: [...prev.microConversions, { type, timestamp: Date.now(), metadata }],
      lastActiveTime: Date.now(),
      engagementDecay: Math.min(1.0, prev.engagementDecay + 0.15),
    }));
    trackEvent('micro_conversion', { type, ...metadata });
  }, [trackEvent]);
  
  const trackWidgetInteraction = useCallback((widgetType: string, interactionType: 'view' | 'hover' | 'click' | 'configure' | 'download') => {
    setBehavior(prev => {
      const affinityBoost: Record<string, number> = {
        view: 1,
        hover: 2,
        click: 5,
        configure: 8,
        download: 15,
      };
      
      const newAffinities = { ...prev.widgetAffinities };
      newAffinities[widgetType] = (newAffinities[widgetType] || 0) + affinityBoost[interactionType];
      
      // Track as micro-conversion for important interactions
      let newConversions = prev.microConversions;
      if (interactionType === 'view') {
        newConversions = [...newConversions, { type: 'widget_view' as const, timestamp: Date.now(), metadata: { widgetType } }];
      } else if (interactionType === 'hover') {
        newConversions = [...newConversions, { type: 'widget_hover' as const, timestamp: Date.now(), metadata: { widgetType } }];
      } else if (interactionType === 'download') {
        newConversions = [...newConversions, { type: 'download' as const, timestamp: Date.now(), metadata: { widgetType } }];
      }
      
      return {
        ...prev,
        widgetAffinities: newAffinities,
        microConversions: newConversions,
        lastActiveTime: Date.now(),
      };
    });
    trackEvent('widget_interaction', { widgetType, interactionType });
  }, [trackEvent]);
  
  const getPersonalizedCTA = useCallback(() => {
    return content.ctaText;
  }, [content.ctaText]);
  
  const getPersonalizedHeadline = useCallback(() => {
    return content.heroHeadline;
  }, [content.heroHeadline]);
  
  const getTimeBasedGreeting = useCallback(() => {
    const greetings = {
      morning: 'Good morning! ☀️',
      afternoon: 'Good afternoon! 👋',
      evening: 'Good evening! 🌆',
      night: 'Working late? 🌙',
    };
    return greetings[timeContext.timeOfDay];
  }, [timeContext.timeOfDay]);
  
  const getReferralSpecificContent = useCallback(() => {
    const referralContent: Record<ReferralPath, { headline: string; subheadline: string; badge?: string }> = {
      direct: { headline: 'Welcome to Widgetify!', subheadline: 'Create beautiful widgets in seconds.' },
      organic_google: { headline: 'Found Us on Google?', subheadline: 'You\'re in the right place for widget magic.', badge: '🔍 Top Search Result' },
      organic_bing: { headline: 'Welcome from Bing!', subheadline: 'Discover why developers love our widgets.' },
      organic_other: { headline: 'Great to Have You!', subheadline: 'The widget builder you\'ve been searching for.' },
      paid_google: { headline: 'Special Welcome!', subheadline: 'Exclusive offer just for you.', badge: '⭐ Special Offer' },
      paid_facebook: { headline: 'Welcome from Facebook!', subheadline: 'Join our growing community of builders.', badge: '🎁 Exclusive Access' },
      paid_other: { headline: 'You Found Us!', subheadline: 'Start building amazing widgets today.' },
      social_twitter: { headline: 'Hey, X Friend! 🐦', subheadline: 'Build widgets that make waves.' },
      social_linkedin: { headline: 'Welcome, Professional!', subheadline: 'Enterprise-grade widgets made simple.', badge: '💼 B2B Ready' },
      social_facebook: { headline: 'Welcome from Facebook!', subheadline: 'Join thousands creating amazing widgets.' },
      social_instagram: { headline: 'Visual Creator? 📸', subheadline: 'Build widgets as beautiful as your feed.' },
      social_producthunt: { headline: 'Welcome, Hunter! 🦄', subheadline: 'You\'ve discovered something special.', badge: '🏆 Featured on PH' },
      social_reddit: { headline: 'Welcome, Redditor!', subheadline: 'The widget builder the community recommends.', badge: '📣 Community Pick' },
      email_campaign: { headline: 'Welcome Back!', subheadline: 'Thanks for clicking through. Let\'s build!' },
      affiliate: { headline: 'Special Welcome!', subheadline: 'Your referral gets you exclusive benefits.', badge: '🎁 Referral Bonus' },
      referral_blog: { headline: 'Thanks for Reading!', subheadline: 'Now try the tool everyone\'s writing about.' },
      referral_other: { headline: 'Welcome, Friend!', subheadline: 'Glad someone told you about us.' },
    };
    return referralContent[session.referralPath] || referralContent.direct;
  }, [session.referralPath]);
  
  const calculateEngagementScore = useCallback(() => {
    return engagementScore;
  }, [engagementScore]);
  
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
        timeContext,
        engagementScore,
        conversionProbability,
        trackEvent,
        trackClick,
        trackPageView,
        trackWidgetGeneration,
        trackMicroConversion,
        trackWidgetInteraction,
        getPersonalizedCTA,
        getPersonalizedHeadline,
        getTimeBasedGreeting,
        getReferralSpecificContent,
        calculateEngagementScore,
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
