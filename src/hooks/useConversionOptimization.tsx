import { useMemo, useCallback } from 'react';
import { usePersonalization } from './usePersonalization';
import { useHyperPersonalization } from './useHyperPersonalization';
import type { WidgetType } from '@/types';

// Conversion-optimized content variants
export interface ConversionContent {
  headline: string;
  subheadline: string;
  cta: string;
  urgencyMessage?: string;
  socialProof?: string;
  benefit: string;
  valueProposition: string;
}

// Widget-specific conversion optimization
export interface WidgetConversionData {
  optimizedTitle: string;
  optimizedDescription: string;
  optimizedCTA: string;
  urgencyEnabled: boolean;
  socialProofType: 'count' | 'testimonial' | 'rating' | 'activity' | 'none';
  conversionBooster: string;
}

// Conversion signals for real-time optimization
export interface ConversionSignals {
  isHighIntent: boolean;
  isUrgent: boolean;
  showSocialProof: boolean;
  showScarcity: boolean;
  showBenefits: boolean;
  optimizationLevel: 'minimal' | 'moderate' | 'aggressive';
}

// Segment-specific conversion strategies
const SEGMENT_STRATEGIES = {
  cold_visitor: {
    focus: 'awareness',
    urgencyLevel: 0.2,
    socialProofWeight: 0.8,
    ctaStyle: 'soft',
    benefitEmphasis: 'ease_of_use',
  },
  warm_lead: {
    focus: 'consideration',
    urgencyLevel: 0.5,
    socialProofWeight: 0.9,
    ctaStyle: 'moderate',
    benefitEmphasis: 'features',
  },
  hot_prospect: {
    focus: 'conversion',
    urgencyLevel: 0.8,
    socialProofWeight: 1.0,
    ctaStyle: 'strong',
    benefitEmphasis: 'results',
  },
  power_user: {
    focus: 'retention',
    urgencyLevel: 0.3,
    socialProofWeight: 0.6,
    ctaStyle: 'direct',
    benefitEmphasis: 'advanced_features',
  },
};

// Time-based urgency messages
const URGENCY_MESSAGES = {
  morning: ['Start your day with a conversion boost', 'Early bird gets the conversions!'],
  afternoon: ['Perfect time to optimize your widgets', 'Boost your afternoon traffic'],
  evening: ['Set up widgets for tomorrow\'s visitors', 'Prepare for peak hours'],
  night: ['Late night optimization session?', 'Build while you think'],
};

// Social proof variants by segment
const SOCIAL_PROOF_VARIANTS = {
  cold_visitor: [
    'Join 50,000+ businesses already using Widgetify',
    'Trusted by startups and enterprises alike',
    '4.9/5 rating from verified users',
  ],
  warm_lead: [
    '10,000+ widgets created this week',
    'Used by top companies in your industry',
    'Average 35% increase in engagement',
  ],
  hot_prospect: [
    'Limited spots for premium features',
    'Join other businesses seeing 40%+ conversion lifts',
    'Most popular choice for professionals',
  ],
  power_user: [
    'You\'re in the top 10% of creators',
    'Power users see 2x better results',
    'Unlock advanced analytics next',
  ],
};

// Widget-specific conversion copy
const WIDGET_CONVERSION_COPY: Record<string, { title: string; description: string; cta: string; benefit: string }> = {
  'whatsapp': {
    title: 'Instant WhatsApp Chat',
    description: 'Convert visitors to conversations in one click',
    cta: 'Start Chatting Now',
    benefit: '3x more customer inquiries',
  },
  'lead-capture-popup': {
    title: 'Smart Lead Capture',
    description: 'Turn browsers into qualified leads automatically',
    cta: 'Capture More Leads',
    benefit: '45% more email signups',
  },
  'exit-intent-popup': {
    title: 'Exit Intent Recovery',
    description: 'Save abandoning visitors with targeted offers',
    cta: 'Stop Losing Visitors',
    benefit: 'Recover 15% of lost traffic',
  },
  'newsletter-signup': {
    title: 'Newsletter Signup',
    description: 'Build your subscriber list effortlessly',
    cta: 'Grow Your List',
    benefit: '2x subscriber growth',
  },
  'countdown-timer': {
    title: 'Urgency Timer',
    description: 'Create FOMO with dynamic countdowns',
    cta: 'Add Urgency Now',
    benefit: '25% faster conversions',
  },
  'ai-chatbot': {
    title: 'AI-Powered Support',
    description: '24/7 intelligent customer assistance',
    cta: 'Enable AI Chat',
    benefit: '60% fewer support tickets',
  },
  'booking-calendar': {
    title: 'Booking Widget',
    description: 'Let customers book directly from your site',
    cta: 'Enable Bookings',
    benefit: '40% more appointments',
  },
  'social-share': {
    title: 'Social Sharing',
    description: 'Amplify your reach with one-click sharing',
    cta: 'Add Share Buttons',
    benefit: '3x social traffic',
  },
  'trust-badge': {
    title: 'Trust Badges',
    description: 'Build instant credibility with security badges',
    cta: 'Add Trust Signals',
    benefit: '32% higher trust scores',
  },
  'call-now': {
    title: 'Click-to-Call',
    description: 'Connect with customers instantly',
    cta: 'Enable Calling',
    benefit: '2x more phone inquiries',
  },
};

export const useConversionOptimization = () => {
  const { behavior, session, segment, intent, timeContext, conversionProbability } = usePersonalization();
  const { extendedProfile, uiPersonalization, getPersonalizedCopy } = useHyperPersonalization();

  // Calculate conversion signals based on user state
  const conversionSignals = useMemo((): ConversionSignals => {
    const strategy = SEGMENT_STRATEGIES[segment] || SEGMENT_STRATEGIES.cold_visitor;
    
    const isHighIntent = conversionProbability > 0.4 || intent.type === 'ready_to_convert';
    const isUrgent = strategy.urgencyLevel > 0.6 || 
      (behavior.timeOnSite > 180 && behavior.widgetsGenerated === 0);
    
    let optimizationLevel: ConversionSignals['optimizationLevel'] = 'minimal';
    if (conversionProbability > 0.6) optimizationLevel = 'aggressive';
    else if (conversionProbability > 0.3) optimizationLevel = 'moderate';

    return {
      isHighIntent,
      isUrgent,
      showSocialProof: strategy.socialProofWeight > 0.7,
      showScarcity: isHighIntent && segment !== 'cold_visitor',
      showBenefits: segment !== 'power_user',
      optimizationLevel,
    };
  }, [segment, conversionProbability, intent, behavior]);

  // Get conversion-optimized content for any context
  const getConversionContent = useCallback((context: 'hero' | 'widget' | 'cta' | 'popup'): ConversionContent => {
    const strategy = SEGMENT_STRATEGIES[segment] || SEGMENT_STRATEGIES.cold_visitor;
    const baseCopy = getPersonalizedCopy();
    const showEmoji = uiPersonalization.showEmojis;
    
    // Urgency message based on time and segment
    const timeKey = timeContext?.timeOfDay || 'afternoon';
    const urgencyMessages = URGENCY_MESSAGES[timeKey] || URGENCY_MESSAGES.afternoon;
    const urgencyMessage = conversionSignals.isUrgent 
      ? urgencyMessages[Math.floor(Math.random() * urgencyMessages.length)]
      : undefined;

    // Social proof based on segment
    const socialProofOptions = SOCIAL_PROOF_VARIANTS[segment] || SOCIAL_PROOF_VARIANTS.cold_visitor;
    const socialProof = socialProofOptions[Math.floor(Math.random() * socialProofOptions.length)];

    // Context-specific headlines
    const headlines: Record<string, Record<string, string>> = {
      hero: {
        cold_visitor: `${showEmoji ? '✨ ' : ''}Create Beautiful Widgets in Seconds`,
        warm_lead: `${showEmoji ? '🚀 ' : ''}Your Perfect Widget Awaits`,
        hot_prospect: `${showEmoji ? '⚡ ' : ''}Ready to Transform Your Site?`,
        power_user: 'Welcome Back, Creator',
      },
      widget: {
        cold_visitor: 'Start with our most popular widget',
        warm_lead: 'Based on your interests',
        hot_prospect: 'Your recommended next step',
        power_user: 'Quick create',
      },
      cta: {
        cold_visitor: 'Get Started Free',
        warm_lead: 'Try It Now',
        hot_prospect: 'Create Instantly',
        power_user: 'Build',
      },
      popup: {
        cold_visitor: `${showEmoji ? '👋 ' : ''}Want to boost your conversions?`,
        warm_lead: `${showEmoji ? '💡 ' : ''}Here\'s a widget perfect for you`,
        hot_prospect: `${showEmoji ? '🎯 ' : ''}You\'re almost there!`,
        power_user: 'New feature unlocked',
      },
    };

    // Subheadlines with benefit focus
    const subheadlines: Record<string, Record<string, string>> = {
      hero: {
        cold_visitor: 'No coding required. Beautiful, high-converting widgets for any website.',
        warm_lead: 'See how easy it is to increase engagement with the right widget.',
        hot_prospect: 'Join thousands who boosted their conversions by 35%+ today.',
        power_user: `You've created ${behavior.widgetsGenerated} widgets. What's next?`,
      },
      widget: {
        cold_visitor: 'Perfect for beginners, loved by professionals',
        warm_lead: 'This widget type matches your goals',
        hot_prospect: 'Most effective for your use case',
        power_user: 'Advanced options available',
      },
      cta: {
        cold_visitor: 'Free forever. No credit card required.',
        warm_lead: 'Takes less than 30 seconds to set up.',
        hot_prospect: 'Create, copy, and paste. That simple.',
        power_user: 'Your widgets are ready.',
      },
      popup: {
        cold_visitor: 'Our widgets increase engagement by an average of 35%',
        warm_lead: 'This is the most popular widget in your category',
        hot_prospect: 'Limited time: Premium features unlocked for you',
        power_user: 'Check out what\'s new',
      },
    };

    // Value propositions
    const valueProps: Record<string, string> = {
      cold_visitor: 'Free, fast, and no coding needed',
      warm_lead: 'Proven to increase conversions',
      hot_prospect: 'Get results in minutes',
      power_user: 'Advanced features for power users',
    };

    // Benefit statements
    const benefits: Record<string, string> = {
      cold_visitor: 'Beautiful widgets that work on any website',
      warm_lead: 'Join 50,000+ businesses seeing real results',
      hot_prospect: 'Average 35% increase in conversions',
      power_user: 'Analytics and A/B testing included',
    };

    return {
      headline: headlines[context]?.[segment] || baseCopy.heroTitle,
      subheadline: subheadlines[context]?.[segment] || baseCopy.heroSubtitle,
      cta: headlines.cta[segment] || baseCopy.primaryCTA,
      urgencyMessage: conversionSignals.isUrgent ? urgencyMessage : undefined,
      socialProof: conversionSignals.showSocialProof ? socialProof : undefined,
      benefit: benefits[segment] || benefits.cold_visitor,
      valueProposition: valueProps[segment] || valueProps.cold_visitor,
    };
  }, [segment, behavior, timeContext, conversionSignals, uiPersonalization, getPersonalizedCopy]);

  // Get widget-specific conversion optimization
  const getWidgetConversion = useCallback((widgetType: WidgetType): WidgetConversionData => {
    const widgetCopy = WIDGET_CONVERSION_COPY[widgetType] || {
      title: widgetType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: 'Enhance your website with this widget',
      cta: 'Add to Site',
      benefit: 'Improved user engagement',
    };

    const strategy = SEGMENT_STRATEGIES[segment] || SEGMENT_STRATEGIES.cold_visitor;
    
    // Determine social proof type based on segment and widget
    let socialProofType: WidgetConversionData['socialProofType'] = 'none';
    if (strategy.socialProofWeight > 0.8) {
      if (segment === 'hot_prospect') socialProofType = 'activity';
      else if (segment === 'warm_lead') socialProofType = 'count';
      else socialProofType = 'rating';
    }

    // Create conversion booster message
    const boosters: Record<string, string> = {
      cold_visitor: `✨ ${widgetCopy.benefit}`,
      warm_lead: `🔥 Most popular for your industry`,
      hot_prospect: `⚡ Limited time: Premium styling included`,
      power_user: `🎯 Pair with ${suggestComplementaryWidget(widgetType)} for best results`,
    };

    return {
      optimizedTitle: widgetCopy.title,
      optimizedDescription: widgetCopy.description,
      optimizedCTA: conversionSignals.optimizationLevel === 'aggressive' 
        ? widgetCopy.cta 
        : `Add ${widgetCopy.title}`,
      urgencyEnabled: conversionSignals.isUrgent,
      socialProofType,
      conversionBooster: boosters[segment] || boosters.cold_visitor,
    };
  }, [segment, conversionSignals]);

  // Get dynamic CTA based on user state
  const getDynamicCTA = useCallback((defaultCta: string): string => {
    if (conversionSignals.optimizationLevel === 'minimal') return defaultCta;
    
    const ctaVariants: Record<string, string[]> = {
      cold_visitor: ['Get Started Free', 'Try It Now', 'Explore Widgets'],
      warm_lead: ['Create Your Widget', 'Build Now', 'Start Creating'],
      hot_prospect: ['Create Instantly', 'Get Started Now', 'Build Your Widget'],
      power_user: ['Quick Create', 'Build', 'Create New'],
    };

    const variants = ctaVariants[segment] || ctaVariants.cold_visitor;
    
    // Return variation based on time to add variety
    const index = Math.floor(Date.now() / 60000) % variants.length;
    return variants[index];
  }, [segment, conversionSignals]);

  // Get optimized section content for platform-wide consistency
  const getOptimizedSectionContent = useCallback((section: 'features' | 'pricing' | 'testimonials' | 'faq'): {
    title: string;
    subtitle: string;
    cta: string;
  } => {
    const sectionContent: Record<string, Record<string, { title: string; subtitle: string; cta: string }>> = {
      features: {
        cold_visitor: {
          title: 'Everything You Need',
          subtitle: 'Powerful features to create high-converting widgets',
          cta: 'Explore Features',
        },
        warm_lead: {
          title: 'Features That Drive Results',
          subtitle: 'See why businesses choose Widgetify',
          cta: 'See All Features',
        },
        hot_prospect: {
          title: 'Pro Features Included',
          subtitle: 'Premium tools at your fingertips',
          cta: 'Start Using Now',
        },
        power_user: {
          title: 'Advanced Capabilities',
          subtitle: 'Take your widgets to the next level',
          cta: 'Explore Advanced',
        },
      },
      pricing: {
        cold_visitor: {
          title: 'Simple, Transparent Pricing',
          subtitle: 'Start free, upgrade when ready',
          cta: 'View Plans',
        },
        warm_lead: {
          title: 'Plans for Every Need',
          subtitle: 'Choose the right plan for your business',
          cta: 'Compare Plans',
        },
        hot_prospect: {
          title: 'Unlock Full Potential',
          subtitle: 'Special offer available now',
          cta: 'Get Started',
        },
        power_user: {
          title: 'Your Current Plan',
          subtitle: 'Review your usage and benefits',
          cta: 'Manage Plan',
        },
      },
      testimonials: {
        cold_visitor: {
          title: 'Loved by Businesses',
          subtitle: 'See what our users say',
          cta: 'Read Stories',
        },
        warm_lead: {
          title: 'Success Stories',
          subtitle: 'Real results from real businesses',
          cta: 'Get Inspired',
        },
        hot_prospect: {
          title: 'Join Successful Businesses',
          subtitle: 'You could be our next success story',
          cta: 'Start Your Story',
        },
        power_user: {
          title: 'Community',
          subtitle: 'Connect with other creators',
          cta: 'Join Community',
        },
      },
      faq: {
        cold_visitor: {
          title: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know',
          cta: 'Browse FAQs',
        },
        warm_lead: {
          title: 'Common Questions',
          subtitle: 'Quick answers to help you decide',
          cta: 'Get Answers',
        },
        hot_prospect: {
          title: 'Quick Help',
          subtitle: 'Last questions before you start',
          cta: 'Contact Support',
        },
        power_user: {
          title: 'Help Center',
          subtitle: 'Documentation and guides',
          cta: 'View Docs',
        },
      },
    };

    return sectionContent[section]?.[segment] || sectionContent[section]?.cold_visitor || {
      title: section.charAt(0).toUpperCase() + section.slice(1),
      subtitle: '',
      cta: 'Learn More',
    };
  }, [segment]);

  return {
    // Signals
    conversionSignals,
    conversionProbability,
    
    // Content generators
    getConversionContent,
    getWidgetConversion,
    getDynamicCTA,
    getOptimizedSectionContent,
    
    // Quick access
    segment,
    isHighIntent: conversionSignals.isHighIntent,
    optimizationLevel: conversionSignals.optimizationLevel,
  };
};

// Helper: Suggest complementary widget
function suggestComplementaryWidget(widgetType: WidgetType): string {
  const complements: Record<string, string> = {
    'whatsapp': 'Call Now',
    'lead-capture-popup': 'Exit Intent',
    'exit-intent-popup': 'Newsletter Signup',
    'newsletter-signup': 'Social Share',
    'countdown-timer': 'Flash Sale Banner',
    'ai-chatbot': 'FAQ Widget',
    'booking-calendar': 'WhatsApp',
    'social-share': 'Follow Us',
    'trust-badge': 'Reviews Widget',
    'call-now': 'WhatsApp',
  };
  return complements[widgetType] || 'Social Share';
}
