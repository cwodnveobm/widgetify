import { useMemo, useCallback } from 'react';
import { usePersonalization } from './usePersonalization';
import { useWidgetPersonalization } from './useWidgetPersonalization';
import type { WidgetType } from '@/types';

// Extended user profile with more granular data
export interface ExtendedUserProfile {
  // Core role detection
  role: 'founder' | 'marketer' | 'developer' | 'agency_owner' | 'designer' | 'beginner' | 'unknown';
  roleConfidence: number;
  
  // Business context
  industry: 'ecommerce' | 'saas' | 'local_business' | 'content' | 'professional_services' | 'agency' | 'unknown';
  websiteType: 'landing_page' | 'blog' | 'store' | 'portfolio' | 'corporate' | 'marketplace' | 'unknown';
  businessSize: 'solo' | 'small' | 'medium' | 'enterprise' | 'unknown';
  
  // Goals & intent
  primaryGoal: 'lead_generation' | 'sales' | 'engagement' | 'support' | 'awareness' | 'retention' | 'unknown';
  urgency: 'exploring' | 'planning' | 'ready_to_implement' | 'urgent';
  
  // Technical profile
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prefersTechnical: boolean;
  
  // Engagement metrics
  engagementScore: number; // 0-100
  widgetCreationVelocity: 'slow' | 'medium' | 'fast';
  embedStatus: 'never' | 'attempted' | 'successful';
  
  // Device & traffic
  trafficSource: 'organic' | 'paid' | 'social' | 'referral' | 'direct';
  devicePriority: 'mobile_first' | 'desktop_first' | 'balanced';
}

// Personalized UI configuration
export interface UIPersonalization {
  // Language & tone
  languageTone: 'simple' | 'balanced' | 'technical';
  showEmojis: boolean;
  verbosityLevel: 'minimal' | 'normal' | 'detailed';
  
  // Feature visibility
  showAdvancedSettings: boolean;
  showDeveloperOptions: boolean;
  showAnalytics: boolean;
  showABTesting: boolean;
  showCustomCSS: boolean;
  showAPIIntegration: boolean;
  
  // Layout preferences
  dashboardLayout: 'simple' | 'standard' | 'power';
  widgetGridColumns: number;
  showRecommendations: boolean;
  showBenchmarks: boolean;
  
  // Onboarding state
  onboardingStep: 'welcome' | 'role_selection' | 'goal_setting' | 'first_widget' | 'completed';
  showOnboarding: boolean;
  showTooltips: boolean;
  showGuidedTour: boolean;
}

// Personalized copy/messaging
export interface PersonalizedCopy {
  // Headlines
  heroTitle: string;
  heroSubtitle: string;
  
  // CTAs
  primaryCTA: string;
  secondaryCTA: string;
  widgetCTA: string;
  
  // Empty states
  emptyStateTitle: string;
  emptyStateMessage: string;
  emptyStateCTA: string;
  
  // Tooltips
  tooltipStyle: 'brief' | 'detailed' | 'technical';
  
  // Notifications
  successMessage: string;
  encouragementMessage: string;
}

// Predictive actions
export interface PredictedAction {
  action: string;
  label: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  category: 'widget' | 'feature' | 'upgrade' | 'optimization';
}

// Pricing nudge
export interface PricingNudge {
  show: boolean;
  type: 'soft' | 'value_demo' | 'feature_highlight';
  title: string;
  message: string;
  feature?: string;
  cta: string;
  timing: 'immediate' | 'delayed' | 'on_success';
}

// Role-based configurations
const ROLE_CONFIGS = {
  founder: {
    interests: ['lead_generation', 'sales', 'analytics'],
    preferredWidgets: ['lead-capture-popup', 'booking-calendar', 'whatsapp', 'payment'] as WidgetType[],
    copyStyle: 'results-focused',
    showAnalytics: true,
  },
  marketer: {
    interests: ['conversion', 'ab_testing', 'analytics'],
    preferredWidgets: ['exit-intent-popup', 'newsletter-signup', 'lead-capture-popup', 'countdown-timer'] as WidgetType[],
    copyStyle: 'data-driven',
    showAnalytics: true,
  },
  developer: {
    interests: ['customization', 'api', 'integration'],
    preferredWidgets: ['ai-chatbot', 'contact-form', 'smart-faq-chatbot', 'calculator'] as WidgetType[],
    copyStyle: 'technical',
    showAnalytics: true,
  },
  agency_owner: {
    interests: ['white_label', 'bulk', 'clients'],
    preferredWidgets: ['lead-capture-popup', 'booking-calendar', 'whatsapp-form', 'trust-badge'] as WidgetType[],
    copyStyle: 'professional',
    showAnalytics: true,
  },
  designer: {
    interests: ['customization', 'branding', 'aesthetics'],
    preferredWidgets: ['social-share', 'follow-us', 'image-gallery', 'floating-video'] as WidgetType[],
    copyStyle: 'creative',
    showAnalytics: false,
  },
  beginner: {
    interests: ['simplicity', 'templates', 'guidance'],
    preferredWidgets: ['whatsapp', 'call-now', 'social-share', 'newsletter-signup'] as WidgetType[],
    copyStyle: 'friendly',
    showAnalytics: false,
  },
  unknown: {
    interests: ['general'],
    preferredWidgets: ['whatsapp', 'lead-capture-popup', 'social-share'] as WidgetType[],
    copyStyle: 'balanced',
    showAnalytics: false,
  },
};

// Industry-specific widget priorities
const INDUSTRY_WIDGET_PRIORITIES: Record<string, WidgetType[]> = {
  ecommerce: ['exit-intent-popup', 'flash-sale-banner', 'live-visitor-counter', 'payment', 'price-drop-alert', 'trust-badge'],
  saas: ['lead-capture-popup', 'ai-chatbot', 'booking-calendar', 'product-tour', 'smart-faq-chatbot'],
  local_business: ['call-now', 'whatsapp', 'google-maps', 'google-reviews', 'booking-calendar'],
  content: ['newsletter-signup', 'social-share', 'follow-us', 'spotify-embed', 'rss-feed'],
  professional_services: ['booking-calendar', 'lead-capture-popup', 'whatsapp-form', 'service-estimator', 'trust-badge'],
  agency: ['lead-capture-popup', 'booking-calendar', 'contact-form', 'trust-badge', 'whatsapp-form'],
  unknown: ['whatsapp', 'lead-capture-popup', 'social-share', 'newsletter-signup'],
};

// Skill level visibility settings
const SKILL_VISIBILITY = {
  beginner: {
    showAdvancedSettings: false,
    showDeveloperOptions: false,
    showCustomCSS: false,
    showAPIIntegration: false,
    showABTesting: false,
    showAnalytics: false,
    tooltipStyle: 'detailed' as const,
  },
  intermediate: {
    showAdvancedSettings: true,
    showDeveloperOptions: false,
    showCustomCSS: false,
    showAPIIntegration: false,
    showABTesting: true,
    showAnalytics: true,
    tooltipStyle: 'brief' as const,
  },
  advanced: {
    showAdvancedSettings: true,
    showDeveloperOptions: true,
    showCustomCSS: true,
    showAPIIntegration: true,
    showABTesting: true,
    showAnalytics: true,
    tooltipStyle: 'brief' as const,
  },
  expert: {
    showAdvancedSettings: true,
    showDeveloperOptions: true,
    showCustomCSS: true,
    showAPIIntegration: true,
    showABTesting: true,
    showAnalytics: true,
    tooltipStyle: 'technical' as const,
  },
};

export const useHyperPersonalization = () => {
  const { behavior, session, device, intent, segment, trackClick } = usePersonalization();
  const { userProfile: baseProfile, getRecommendations, industryBenchmarks } = useWidgetPersonalization();

  // Build extended user profile with enhanced detection
  const extendedProfile = useMemo((): ExtendedUserProfile => {
    const clickedElements = behavior.clickedElements || [];
    const utmSource = session.utmSource || '';
    const utmCampaign = session.utmCampaign || '';
    
    // Enhanced role detection with confidence scoring
    let role: ExtendedUserProfile['role'] = 'unknown';
    let roleConfidence = 0.3;
    
    // Check for explicit role signals
    if (clickedElements.some(el => el.includes('developer') || el.includes('api') || el.includes('code'))) {
      role = 'developer';
      roleConfidence = 0.85;
    } else if (clickedElements.some(el => el.includes('agency') || el.includes('client') || el.includes('white-label'))) {
      role = 'agency_owner';
      roleConfidence = 0.8;
    } else if (clickedElements.some(el => el.includes('marketing') || el.includes('conversion') || el.includes('ab-test'))) {
      role = 'marketer';
      roleConfidence = 0.8;
    } else if (clickedElements.some(el => el.includes('design') || el.includes('portfolio') || el.includes('creative'))) {
      role = 'designer';
      roleConfidence = 0.75;
    } else if (session.visitCount > 3 && behavior.widgetsGenerated > 2) {
      role = 'founder';
      roleConfidence = 0.6;
    } else if (behavior.widgetsGenerated === 0 && behavior.timeOnSite < 120) {
      role = 'beginner';
      roleConfidence = 0.7;
    }
    
    // Traffic source detection
    let trafficSource: ExtendedUserProfile['trafficSource'] = 'direct';
    if (utmSource.includes('google') || utmSource.includes('bing')) {
      trafficSource = session.utmMedium === 'cpc' ? 'paid' : 'organic';
    } else if (utmSource.includes('facebook') || utmSource.includes('twitter') || utmSource.includes('linkedin')) {
      trafficSource = 'social';
    } else if (session.referrer && !session.referrer.includes(window.location.hostname)) {
      trafficSource = 'referral';
    }
    
    // Urgency detection
    let urgency: ExtendedUserProfile['urgency'] = 'exploring';
    if (behavior.widgetsGenerated > 0 && behavior.timeOnSite < 300) {
      urgency = 'ready_to_implement';
    } else if (clickedElements.some(el => el.includes('pricing') || el.includes('download'))) {
      urgency = 'planning';
    } else if (utmCampaign.includes('urgent') || utmCampaign.includes('now')) {
      urgency = 'urgent';
    }
    
    // Skill level with more granularity
    let skillLevel: ExtendedUserProfile['skillLevel'] = 'beginner';
    const advancedActions = clickedElements.filter(el => 
      el.includes('custom') || el.includes('api') || el.includes('code') || el.includes('advanced')
    ).length;
    
    if (advancedActions > 5 || behavior.widgetsGenerated > 10) {
      skillLevel = 'expert';
    } else if (advancedActions > 2 || behavior.widgetsGenerated > 5) {
      skillLevel = 'advanced';
    } else if (behavior.widgetsGenerated > 2 || session.visitCount > 3) {
      skillLevel = 'intermediate';
    }
    
    // Engagement score calculation
    const engagementScore = Math.min(100, 
      (behavior.timeOnSite / 10) + 
      (behavior.widgetsGenerated * 15) + 
      (behavior.scrollDepth * 0.3) + 
      (session.visitCount * 5) +
      (clickedElements.length * 2)
    );
    
    // Widget creation velocity
    const avgTimePerWidget = behavior.widgetsGenerated > 0 
      ? behavior.timeOnSite / behavior.widgetsGenerated 
      : Infinity;
    let widgetCreationVelocity: ExtendedUserProfile['widgetCreationVelocity'] = 'slow';
    if (avgTimePerWidget < 60) widgetCreationVelocity = 'fast';
    else if (avgTimePerWidget < 180) widgetCreationVelocity = 'medium';
    
    // Embed status detection
    let embedStatus: ExtendedUserProfile['embedStatus'] = 'never';
    if (clickedElements.some(el => el.includes('embed-success'))) {
      embedStatus = 'successful';
    } else if (clickedElements.some(el => el.includes('download') || el.includes('copy-code'))) {
      embedStatus = 'attempted';
    }
    
    // Business size inference
    let businessSize: ExtendedUserProfile['businessSize'] = 'unknown';
    if (role === 'agency_owner') {
      businessSize = 'small';
    } else if (clickedElements.some(el => el.includes('enterprise'))) {
      businessSize = 'enterprise';
    } else if (behavior.widgetsGenerated > 5) {
      businessSize = 'small';
    } else {
      businessSize = 'solo';
    }

    return {
      role,
      roleConfidence,
      industry: baseProfile.industry as ExtendedUserProfile['industry'],
      websiteType: baseProfile.websiteType as ExtendedUserProfile['websiteType'],
      businessSize,
      primaryGoal: baseProfile.primaryGoal as ExtendedUserProfile['primaryGoal'],
      urgency,
      skillLevel,
      prefersTechnical: role === 'developer' || skillLevel === 'expert',
      engagementScore,
      widgetCreationVelocity,
      embedStatus,
      trafficSource,
      devicePriority: baseProfile.devicePriority,
    };
  }, [behavior, session, baseProfile]);

  // Generate UI personalization settings
  const uiPersonalization = useMemo((): UIPersonalization => {
    const skillSettings = SKILL_VISIBILITY[extendedProfile.skillLevel];
    const roleConfig = ROLE_CONFIGS[extendedProfile.role] || ROLE_CONFIGS.unknown;
    
    // Determine onboarding state
    let onboardingStep: UIPersonalization['onboardingStep'] = 'completed';
    let showOnboarding = false;
    
    if (behavior.widgetsGenerated === 0) {
      if (behavior.timeOnSite < 30) {
        onboardingStep = 'welcome';
        showOnboarding = true;
      } else if (extendedProfile.role === 'unknown') {
        onboardingStep = 'role_selection';
        showOnboarding = true;
      } else if (extendedProfile.primaryGoal === 'unknown') {
        onboardingStep = 'goal_setting';
        showOnboarding = true;
      } else {
        onboardingStep = 'first_widget';
        showOnboarding = true;
      }
    }
    
    return {
      // Language & tone
      languageTone: extendedProfile.prefersTechnical ? 'technical' : 
                    extendedProfile.skillLevel === 'beginner' ? 'simple' : 'balanced',
      showEmojis: extendedProfile.skillLevel !== 'expert' && extendedProfile.role !== 'developer',
      verbosityLevel: extendedProfile.skillLevel === 'beginner' ? 'detailed' : 
                      extendedProfile.skillLevel === 'expert' ? 'minimal' : 'normal',
      
      // Feature visibility from skill level
      ...skillSettings,
      showAnalytics: skillSettings.showAnalytics || roleConfig.showAnalytics,
      
      // Layout preferences
      dashboardLayout: extendedProfile.skillLevel === 'beginner' ? 'simple' : 
                       extendedProfile.skillLevel === 'expert' ? 'power' : 'standard',
      widgetGridColumns: device.isMobile ? 1 : extendedProfile.skillLevel === 'beginner' ? 2 : 3,
      showRecommendations: extendedProfile.engagementScore < 70,
      showBenchmarks: extendedProfile.role === 'marketer' || extendedProfile.role === 'founder',
      
      // Onboarding
      onboardingStep,
      showOnboarding,
      showTooltips: extendedProfile.skillLevel === 'beginner',
      showGuidedTour: behavior.widgetsGenerated === 0 && session.visitCount === 1,
    };
  }, [extendedProfile, behavior, session, device]);

  // Generate personalized copy based on profile
  const getPersonalizedCopy = useCallback((): PersonalizedCopy => {
    const roleConfig = ROLE_CONFIGS[extendedProfile.role] || ROLE_CONFIGS.unknown;
    const emoji = uiPersonalization.showEmojis;
    
    // Role-specific headlines
    const headlines: Record<string, { title: string; subtitle: string }> = {
      founder: {
        title: `${emoji ? '🚀 ' : ''}Grow Your Business with Smart Widgets`,
        subtitle: 'Convert more visitors into customers with data-driven widgets',
      },
      marketer: {
        title: `${emoji ? '📈 ' : ''}Boost Conversions by 35%+`,
        subtitle: 'A/B tested widgets that actually drive results',
      },
      developer: {
        title: 'Lightweight, Customizable Widget Library',
        subtitle: 'Copy-paste code, full API access, zero dependencies',
      },
      agency_owner: {
        title: `${emoji ? '🏢 ' : ''}White-Label Widgets for Your Clients`,
        subtitle: 'Create professional widgets at scale without the overhead',
      },
      designer: {
        title: `${emoji ? '🎨 ' : ''}Beautiful Widgets, Zero Hassle`,
        subtitle: 'Stunning designs that match any brand aesthetic',
      },
      beginner: {
        title: `${emoji ? '✨ ' : ''}Create Your First Widget in 30 Seconds`,
        subtitle: 'No coding needed. Just pick, customize, and launch!',
      },
      unknown: {
        title: `${emoji ? '⚡ ' : ''}Create High-Converting Widgets`,
        subtitle: 'Beautiful, lightweight widgets for any website',
      },
    };
    
    const headline = headlines[extendedProfile.role] || headlines.unknown;
    
    // CTA personalization based on urgency and role
    const ctas: Record<string, { primary: string; secondary: string; widget: string }> = {
      exploring: { primary: 'Explore Widgets', secondary: 'See Examples', widget: 'Try This Widget' },
      planning: { primary: 'Start Building', secondary: 'View Plans', widget: 'Customize This' },
      ready_to_implement: { primary: 'Create Now', secondary: 'Quick Start', widget: 'Create & Download' },
      urgent: { primary: 'Get Started Instantly', secondary: 'Talk to Us', widget: 'Generate Now' },
    };
    
    const ctaSet = ctas[extendedProfile.urgency] || ctas.exploring;
    
    // Empty state personalization
    const emptyStates: Record<string, { title: string; message: string; cta: string }> = {
      beginner: {
        title: `${emoji ? '👋 ' : ''}Ready to Create Your First Widget?`,
        message: 'Pick from our most popular templates and launch in seconds',
        cta: 'Start with WhatsApp Widget',
      },
      intermediate: {
        title: 'No Widgets Yet',
        message: 'Browse our collection or try our smart recommendations',
        cta: 'See Recommendations',
      },
      advanced: {
        title: 'Create a New Widget',
        message: 'Use templates or build from scratch with full customization',
        cta: 'Open Builder',
      },
      expert: {
        title: 'New Widget',
        message: 'Templates • Custom Builder • API',
        cta: 'Create',
      },
    };
    
    const emptyState = emptyStates[extendedProfile.skillLevel] || emptyStates.beginner;
    
    // Success/encouragement messages
    const successMessages: Record<string, string> = {
      beginner: `${emoji ? '🎉 ' : ''}Amazing! Your widget is ready to go!`,
      intermediate: 'Widget created successfully!',
      advanced: 'Widget generated. Ready to embed.',
      expert: 'Done.',
    };
    
    const encouragementMessages: Record<string, string> = {
      beginner: `${emoji ? '💪 ' : ''}You're doing great! Your first widget is just a click away.`,
      intermediate: 'Keep building! Each widget increases your site engagement.',
      advanced: `${behavior.widgetsGenerated} widgets created. Average conversion +${Math.round(extendedProfile.engagementScore * 0.4)}%`,
      expert: '',
    };

    const tooltipStyleMap: Record<string, 'brief' | 'detailed' | 'technical'> = {
      beginner: 'detailed',
      intermediate: 'brief',
      advanced: 'brief',
      expert: 'technical',
    };

    return {
      heroTitle: headline.title,
      heroSubtitle: headline.subtitle,
      primaryCTA: ctaSet.primary,
      secondaryCTA: ctaSet.secondary,
      widgetCTA: ctaSet.widget,
      emptyStateTitle: emptyState.title,
      emptyStateMessage: emptyState.message,
      emptyStateCTA: emptyState.cta,
      tooltipStyle: tooltipStyleMap[extendedProfile.skillLevel] || 'brief',
      successMessage: successMessages[extendedProfile.skillLevel] || successMessages.beginner,
      encouragementMessage: encouragementMessages[extendedProfile.skillLevel] || '',
    };
  }, [extendedProfile, uiPersonalization, behavior]);

  // Predict next best actions
  const getPredictedActions = useCallback((): PredictedAction[] => {
    const actions: PredictedAction[] = [];
    const industryWidgets = INDUSTRY_WIDGET_PRIORITIES[extendedProfile.industry] || INDUSTRY_WIDGET_PRIORITIES.unknown;
    
    // Widget recommendations based on profile
    if (behavior.widgetsGenerated === 0) {
      const topWidget = industryWidgets[0];
      actions.push({
        action: `create-${topWidget}`,
        label: `Create ${topWidget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
        description: `Most effective widget for ${extendedProfile.industry.replace('_', ' ')} websites`,
        confidence: 0.9,
        priority: 'high',
        category: 'widget',
      });
    }
    
    // Suggest complementary widgets
    if (behavior.widgetsGenerated > 0 && behavior.widgetsGenerated < 3) {
      const suggestions = industryWidgets.slice(1, 3);
      suggestions.forEach(widget => {
        if (!behavior.clickedElements.some(el => el.includes(widget))) {
          actions.push({
            action: `create-${widget}`,
            label: `Add ${widget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
            description: 'Boost conversions with a complementary widget',
            confidence: 0.75,
            priority: 'medium',
            category: 'widget',
          });
        }
      });
    }
    
    // A/B testing suggestion for power users
    if (extendedProfile.skillLevel !== 'beginner' && behavior.widgetsGenerated > 2) {
      actions.push({
        action: 'open-ab-testing',
        label: 'Try A/B Testing',
        description: 'Optimize your widgets with data-driven experiments',
        confidence: 0.7,
        priority: 'medium',
        category: 'feature',
      });
    }
    
    // Custom builder for advanced users
    if (extendedProfile.skillLevel === 'advanced' || extendedProfile.skillLevel === 'expert') {
      actions.push({
        action: 'open-custom-builder',
        label: 'Custom Widget Builder',
        description: 'Full control over every aspect of your widget',
        confidence: 0.65,
        priority: 'low',
        category: 'feature',
      });
    }
    
    // Optimization suggestions
    if (extendedProfile.embedStatus === 'attempted' && behavior.widgetsGenerated > 1) {
      actions.push({
        action: 'view-documentation',
        label: 'View Integration Guide',
        description: 'Get help embedding your widgets correctly',
        confidence: 0.8,
        priority: 'high',
        category: 'optimization',
      });
    }

    return actions.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  }, [extendedProfile, behavior]);

  // Generate pricing nudges at high-intent moments
  const getPricingNudge = useCallback((): PricingNudge | null => {
    // No nudge for new visitors
    if (behavior.timeOnSite < 60 || behavior.widgetsGenerated === 0) {
      return null;
    }
    
    // High engagement - soft nudge
    if (extendedProfile.engagementScore > 70 && behavior.widgetsGenerated >= 3) {
      return {
        show: true,
        type: 'value_demo',
        title: 'You\'re Getting Results!',
        message: `${behavior.widgetsGenerated} widgets created. Unlock advanced analytics to measure their impact.`,
        feature: 'analytics',
        cta: 'See Analytics Demo',
        timing: 'delayed',
      };
    }
    
    // A/B testing interest
    if (behavior.clickedElements.some(el => el.includes('ab-test'))) {
      return {
        show: true,
        type: 'feature_highlight',
        title: 'Ready for A/B Testing?',
        message: 'Test different widget variations to find what converts best for your audience.',
        feature: 'ab_testing',
        cta: 'Start Testing',
        timing: 'immediate',
      };
    }
    
    // Advanced customization interest
    if (extendedProfile.skillLevel === 'advanced' && 
        behavior.clickedElements.some(el => el.includes('custom'))) {
      return {
        show: true,
        type: 'soft',
        title: 'Need More Control?',
        message: 'Custom CSS and JavaScript for unlimited styling options.',
        feature: 'custom_code',
        cta: 'Learn More',
        timing: 'delayed',
      };
    }
    
    return null;
  }, [extendedProfile, behavior]);

  // Get prioritized widget types for this user
  const getPrioritizedWidgets = useCallback((): WidgetType[] => {
    const roleConfig = ROLE_CONFIGS[extendedProfile.role] || ROLE_CONFIGS.unknown;
    const industryWidgets = INDUSTRY_WIDGET_PRIORITIES[extendedProfile.industry] || INDUSTRY_WIDGET_PRIORITIES.unknown;
    
    // Combine role and industry preferences, removing duplicates
    const combined = [...new Set([...roleConfig.preferredWidgets, ...industryWidgets])];
    
    // Filter by skill level for beginners
    if (extendedProfile.skillLevel === 'beginner') {
      const simpleWidgets = ['whatsapp', 'call-now', 'social-share', 'follow-us', 'newsletter-signup', 'sticky-banner'];
      return combined.filter(w => simpleWidgets.includes(w)) as WidgetType[];
    }
    
    return combined.slice(0, 12);
  }, [extendedProfile]);

  // Get contextual tooltip content
  const getTooltipContent = useCallback((tooltipId: string): { title: string; content: string } | null => {
    if (!uiPersonalization.showTooltips) return null;
    
    const tooltips: Record<string, Record<string, { title: string; content: string }>> = {
      simple: {
        'widget-position': {
          title: 'Widget Position',
          content: 'Choose where your widget appears. Right side is most common.',
        },
        'primary-color': {
          title: 'Button Color',
          content: 'Pick a color that matches your brand or stands out.',
        },
        'trigger-delay': {
          title: 'When It Appears',
          content: 'How many seconds to wait before showing the popup.',
        },
      },
      technical: {
        'widget-position': {
          title: 'Position',
          content: 'CSS fixed positioning. left/right affects transform-origin for animations.',
        },
        'primary-color': {
          title: 'Primary Color',
          content: 'Applied to CTA buttons and accent elements. Supports hex, rgb, hsl.',
        },
        'trigger-delay': {
          title: 'Trigger Delay (ms)',
          content: 'setTimeout delay before widget injection. 0 for immediate.',
        },
      },
    };
    
    const styleKey = uiPersonalization.languageTone === 'technical' ? 'technical' : 'simple';
    return tooltips[styleKey]?.[tooltipId] || null;
  }, [uiPersonalization]);

  // Format message based on language tone
  const formatMessage = useCallback((message: string, options?: { emoji?: boolean }): string => {
    let formatted = message;
    
    // Remove emojis if not preferred
    if (!uiPersonalization.showEmojis && !options?.emoji) {
      formatted = formatted.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    }
    
    // Simplify for beginners
    if (uiPersonalization.languageTone === 'simple') {
      formatted = formatted
        .replace(/conversion/gi, 'sign-ups')
        .replace(/CTA/gi, 'button')
        .replace(/integration/gi, 'connection')
        .replace(/configuration/gi, 'settings');
    }
    
    return formatted;
  }, [uiPersonalization]);

  return {
    // Profiles
    extendedProfile,
    uiPersonalization,
    
    // Content
    getPersonalizedCopy,
    formatMessage,
    getTooltipContent,
    
    // Actions & predictions
    getPredictedActions,
    getPricingNudge,
    getPrioritizedWidgets,
    
    // From base hooks
    getRecommendations,
    industryBenchmarks,
    trackClick,
    
    // Helpers
    isBeginnerMode: extendedProfile.skillLevel === 'beginner',
    isPowerUser: segment === 'power_user',
    shouldShowOnboarding: uiPersonalization.showOnboarding,
  };
};
