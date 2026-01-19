import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Psychological profile types
export type PersonalityType = 'confident' | 'hesitant' | 'analytical' | 'impulsive' | 'skeptical' | 'explorer';
export type EmotionalState = 'excited' | 'curious' | 'frustrated' | 'neutral' | 'overwhelmed' | 'decisive';
export type IntentIntensity = 'browsing' | 'evaluating' | 'comparing' | 'ready' | 'urgent';

// Real-time behavior signals
interface BehaviorSignal {
  type: 'click' | 'scroll' | 'hover' | 'idle' | 'rage_click' | 'hesitation' | 'rapid_action' | 'backtrack' | 'focus_loss';
  timestamp: number;
  element?: string;
  data?: Record<string, unknown>;
}

// Hesitation pattern detection
interface HesitationPattern {
  location: string;
  duration: number;
  mouseMovements: number;
  scrollOscillations: number;
  detected: boolean;
  intensity: 'mild' | 'moderate' | 'severe';
}

// Psychological profile
export interface PsychologicalProfile {
  // Core personality
  personalityType: PersonalityType;
  personalityConfidence: number;
  
  // Emotional state (real-time)
  currentEmotion: EmotionalState;
  emotionHistory: { state: EmotionalState; timestamp: number }[];
  
  // Decision-making style
  decisionSpeed: 'fast' | 'moderate' | 'slow';
  informationNeeds: 'minimal' | 'moderate' | 'extensive';
  riskTolerance: 'high' | 'medium' | 'low';
  
  // Trust indicators
  trustLevel: number; // 0-100
  skepticismScore: number; // 0-100
  
  // Engagement patterns
  attentionSpan: 'short' | 'medium' | 'long';
  interactionStyle: 'passive' | 'active' | 'power_user';
  
  // Intent signals
  intentIntensity: IntentIntensity;
  purchaseReadiness: number; // 0-100
  
  // Frustration indicators
  frustrationLevel: number; // 0-100
  confusionPoints: string[];
}

// Adaptive content recommendations
export interface ContentAdaptation {
  // Tone adjustments
  toneStyle: 'confident' | 'reassuring' | 'technical' | 'friendly' | 'urgent' | 'exclusive';
  showTrustSignals: boolean;
  showSocialProof: boolean;
  showUrgency: boolean;
  showExclusivity: boolean;
  
  // CTA optimization
  ctaStyle: 'soft' | 'moderate' | 'aggressive';
  ctaText: string;
  ctaEmphasis: 'primary' | 'secondary' | 'subtle';
  
  // Content density
  verbosity: 'minimal' | 'balanced' | 'detailed';
  showBenefits: boolean;
  showFeatures: boolean;
  showTestimonials: boolean;
  
  // Visual emphasis
  highlightElements: string[];
  dimElements: string[];
  
  // Timing
  nudgeDelay: number;
  showNudge: boolean;
  nudgeMessage: string;
}

// Intelligent nudge system
export interface SmartNudge {
  id: string;
  type: 'tooltip' | 'banner' | 'modal' | 'highlight' | 'message';
  trigger: 'hesitation' | 'scroll' | 'time' | 'idle' | 'exit_intent' | 'milestone';
  message: string;
  cta?: string;
  priority: number;
  cooldown: number;
  shown: boolean;
  dismissed: boolean;
}

// Storage keys
const STORAGE_PREFIX = 'widgetify_rtb_';

const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const storeValue = (key: string, value: unknown) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {}
};

export const useRealTimeBehavior = () => {
  // Behavior tracking state
  const [signals, setSignals] = useState<BehaviorSignal[]>([]);
  const [hesitationPatterns, setHesitationPatterns] = useState<HesitationPattern[]>([]);
  const [activeNudges, setActiveNudges] = useState<SmartNudge[]>([]);
  
  // Mouse/scroll tracking refs
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseMovements = useRef(0);
  const scrollPositions = useRef<number[]>([]);
  const lastScrollTime = useRef(Date.now());
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const currentHoverElement = useRef<string | null>(null);
  const clickTimes = useRef<number[]>([]);
  const pageLoadTime = useRef(Date.now());
  
  // Session data
  const [sessionData, setSessionData] = useState(() => ({
    startTime: Date.now(),
    totalClicks: getStoredValue('totalClicks', 0),
    totalScrollDistance: 0,
    maxScrollDepth: 0,
    pagesInSession: 1,
    widgetsViewed: getStoredValue('widgetsViewed', [] as string[]),
    actionsPerMinute: 0,
    lastActionTime: Date.now(),
    returnCount: getStoredValue('returnCount', 0),
    totalSessions: getStoredValue('totalSessions', 0),
    lifetimeValue: getStoredValue('lifetimeValue', 0),
  }));

  // Psychological profile (computed from signals)
  const psychologicalProfile = useMemo((): PsychologicalProfile => {
    const now = Date.now();
    const sessionDuration = (now - sessionData.startTime) / 1000;
    const recentSignals = signals.filter(s => now - s.timestamp < 60000);
    
    // Analyze click patterns for personality
    const rageClicks = recentSignals.filter(s => s.type === 'rage_click').length;
    const hesitations = recentSignals.filter(s => s.type === 'hesitation').length;
    const rapidActions = recentSignals.filter(s => s.type === 'rapid_action').length;
    const backtracks = recentSignals.filter(s => s.type === 'backtrack').length;
    const idles = recentSignals.filter(s => s.type === 'idle').length;
    
    // Determine personality type
    let personalityType: PersonalityType = 'explorer';
    let personalityConfidence = 0.5;
    
    if (rapidActions > 5 && hesitations < 2) {
      personalityType = 'impulsive';
      personalityConfidence = 0.8;
    } else if (hesitations > 3 || backtracks > 2) {
      personalityType = 'hesitant';
      personalityConfidence = 0.75;
    } else if (sessionDuration > 180 && sessionData.maxScrollDepth > 80) {
      personalityType = 'analytical';
      personalityConfidence = 0.7;
    } else if (rageClicks > 0 || backtracks > 3) {
      personalityType = 'skeptical';
      personalityConfidence = 0.65;
    } else if (sessionData.actionsPerMinute > 10 && sessionData.totalClicks > 15) {
      personalityType = 'confident';
      personalityConfidence = 0.7;
    }
    
    // Determine emotional state
    let currentEmotion: EmotionalState = 'neutral';
    if (rageClicks > 0) currentEmotion = 'frustrated';
    else if (rapidActions > 3) currentEmotion = 'excited';
    else if (idles > 2) currentEmotion = 'overwhelmed';
    else if (sessionData.actionsPerMinute > 8) currentEmotion = 'curious';
    else if (hesitations < 1 && sessionData.totalClicks > 5) currentEmotion = 'decisive';
    
    // Decision speed
    const avgTimeBetweenActions = sessionData.totalClicks > 1 
      ? sessionDuration / sessionData.totalClicks 
      : sessionDuration;
    let decisionSpeed: PsychologicalProfile['decisionSpeed'] = 'moderate';
    if (avgTimeBetweenActions < 3) decisionSpeed = 'fast';
    else if (avgTimeBetweenActions > 10) decisionSpeed = 'slow';
    
    // Information needs
    let informationNeeds: PsychologicalProfile['informationNeeds'] = 'moderate';
    if (sessionData.maxScrollDepth > 80 && sessionDuration > 120) informationNeeds = 'extensive';
    else if (sessionData.maxScrollDepth < 30 && rapidActions > 3) informationNeeds = 'minimal';
    
    // Risk tolerance
    let riskTolerance: PsychologicalProfile['riskTolerance'] = 'medium';
    if (personalityType === 'impulsive' || personalityType === 'confident') riskTolerance = 'high';
    else if (personalityType === 'hesitant' || personalityType === 'analytical') riskTolerance = 'low';
    
    // Trust level (builds over time)
    const baselineTrust = Math.min(50, sessionData.returnCount * 15 + sessionData.totalSessions * 5);
    const sessionTrust = Math.min(30, sessionDuration / 10);
    const interactionTrust = Math.min(20, sessionData.totalClicks * 2);
    const trustLevel = Math.min(100, baselineTrust + sessionTrust + interactionTrust);
    
    // Skepticism (inverse of trust in some ways)
    const skepticismScore = Math.max(0, 100 - trustLevel - (sessionData.widgetsViewed.length * 5));
    
    // Attention span
    let attentionSpan: PsychologicalProfile['attentionSpan'] = 'medium';
    if (idles > 3 || sessionDuration < 30) attentionSpan = 'short';
    else if (sessionDuration > 300 && sessionData.maxScrollDepth > 70) attentionSpan = 'long';
    
    // Interaction style
    let interactionStyle: PsychologicalProfile['interactionStyle'] = 'active';
    if (sessionData.actionsPerMinute < 2) interactionStyle = 'passive';
    else if (sessionData.actionsPerMinute > 10 && sessionData.totalClicks > 20) interactionStyle = 'power_user';
    
    // Intent intensity
    let intentIntensity: IntentIntensity = 'browsing';
    const widgetViewCount = sessionData.widgetsViewed.length;
    if (widgetViewCount > 5 && sessionDuration > 120) intentIntensity = 'ready';
    else if (widgetViewCount > 3) intentIntensity = 'comparing';
    else if (widgetViewCount > 1) intentIntensity = 'evaluating';
    
    // Purchase readiness
    const purchaseReadiness = Math.min(100, 
      (widgetViewCount * 10) + 
      (sessionData.returnCount * 15) + 
      (sessionDuration > 120 ? 20 : 0) +
      (trustLevel * 0.3)
    );
    
    // Frustration level
    const frustrationLevel = Math.min(100, 
      (rageClicks * 30) + 
      (hesitations * 10) + 
      (backtracks * 15) +
      (idles > 3 ? 20 : 0)
    );
    
    // Confusion points
    const confusionPoints = hesitationPatterns
      .filter(h => h.detected && h.intensity !== 'mild')
      .map(h => h.location);
    
    return {
      personalityType,
      personalityConfidence,
      currentEmotion,
      emotionHistory: [],
      decisionSpeed,
      informationNeeds,
      riskTolerance,
      trustLevel,
      skepticismScore,
      attentionSpan,
      interactionStyle,
      intentIntensity,
      purchaseReadiness,
      frustrationLevel,
      confusionPoints,
    };
  }, [signals, sessionData, hesitationPatterns]);

  // Content adaptation based on psychological profile
  const contentAdaptation = useMemo((): ContentAdaptation => {
    const { personalityType, currentEmotion, trustLevel, intentIntensity, frustrationLevel, purchaseReadiness } = psychologicalProfile;
    
    // Determine tone based on personality
    let toneStyle: ContentAdaptation['toneStyle'] = 'friendly';
    switch (personalityType) {
      case 'confident': toneStyle = 'confident'; break;
      case 'hesitant': toneStyle = 'reassuring'; break;
      case 'analytical': toneStyle = 'technical'; break;
      case 'impulsive': toneStyle = 'urgent'; break;
      case 'skeptical': toneStyle = 'reassuring'; break;
      case 'explorer': toneStyle = 'friendly'; break;
    }
    
    // Trust signals needed for skeptical/hesitant users
    const showTrustSignals = trustLevel < 60 || personalityType === 'skeptical' || personalityType === 'hesitant';
    
    // Social proof for various personalities
    const showSocialProof = personalityType !== 'confident' && intentIntensity !== 'browsing';
    
    // Urgency for impulsive users or high intent
    const showUrgency = personalityType === 'impulsive' || intentIntensity === 'ready' || purchaseReadiness > 70;
    
    // Exclusivity for returning/power users
    const showExclusivity = sessionData.returnCount > 0 || psychologicalProfile.interactionStyle === 'power_user';
    
    // CTA optimization
    let ctaStyle: ContentAdaptation['ctaStyle'] = 'moderate';
    let ctaText = 'Get Started';
    
    if (personalityType === 'impulsive' || intentIntensity === 'ready') {
      ctaStyle = 'aggressive';
      ctaText = 'Create Now →';
    } else if (personalityType === 'hesitant' || trustLevel < 40) {
      ctaStyle = 'soft';
      ctaText = 'Try It Free';
    }
    
    // Adjust for emotional state
    if (currentEmotion === 'frustrated') {
      ctaText = 'Need Help?';
      ctaStyle = 'soft';
    } else if (currentEmotion === 'decisive') {
      ctaText = 'Create Your Widget';
      ctaStyle = 'aggressive';
    }
    
    // Verbosity based on information needs
    const verbosity = psychologicalProfile.informationNeeds === 'extensive' ? 'detailed' : 
                      psychologicalProfile.informationNeeds === 'minimal' ? 'minimal' : 'balanced';
    
    // Nudge configuration
    let nudgeMessage = '';
    let showNudge = false;
    let nudgeDelay = 5000;
    
    if (frustrationLevel > 50) {
      nudgeMessage = "Need assistance? We're here to help!";
      showNudge = true;
      nudgeDelay = 2000;
    } else if (intentIntensity === 'comparing' && sessionData.widgetsViewed.length > 2) {
      nudgeMessage = "Can't decide? Try our recommendation engine!";
      showNudge = true;
    } else if (personalityType === 'hesitant' && psychologicalProfile.purchaseReadiness > 40) {
      nudgeMessage = "Join 50,000+ businesses who trust Widgetify";
      showNudge = true;
      nudgeDelay = 8000;
    }
    
    return {
      toneStyle,
      showTrustSignals,
      showSocialProof,
      showUrgency,
      showExclusivity,
      ctaStyle,
      ctaText,
      ctaEmphasis: ctaStyle === 'aggressive' ? 'primary' : ctaStyle === 'soft' ? 'subtle' : 'secondary',
      verbosity,
      showBenefits: psychologicalProfile.riskTolerance !== 'high',
      showFeatures: personalityType === 'analytical' || psychologicalProfile.informationNeeds === 'extensive',
      showTestimonials: showSocialProof && trustLevel < 70,
      highlightElements: [],
      dimElements: [],
      nudgeDelay,
      showNudge,
      nudgeMessage,
    };
  }, [psychologicalProfile, sessionData]);

  // Track a behavior signal
  const trackSignal = useCallback((signal: Omit<BehaviorSignal, 'timestamp'>) => {
    const newSignal = { ...signal, timestamp: Date.now() };
    setSignals(prev => [...prev.slice(-100), newSignal]);
  }, []);

  // Track click with rage click detection
  const trackClick = useCallback((element: string) => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current.filter(t => now - t < 2000), now];
    
    // Rage click detection (4+ clicks in 2 seconds)
    if (clickTimes.current.length >= 4) {
      trackSignal({ type: 'rage_click', element });
    } else {
      trackSignal({ type: 'click', element });
    }
    
    setSessionData(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      lastActionTime: now,
      actionsPerMinute: (prev.totalClicks + 1) / ((now - prev.startTime) / 60000),
    }));
    
    storeValue('totalClicks', sessionData.totalClicks + 1);
  }, [trackSignal, sessionData.totalClicks]);

  // Track widget interaction
  const trackWidgetView = useCallback((widgetType: string) => {
    setSessionData(prev => {
      const newViewed = prev.widgetsViewed.includes(widgetType) 
        ? prev.widgetsViewed 
        : [...prev.widgetsViewed, widgetType];
      storeValue('widgetsViewed', newViewed);
      return { ...prev, widgetsViewed: newViewed };
    });
  }, []);

  // Detect hesitation pattern
  const detectHesitation = useCallback((location: string) => {
    const pattern: HesitationPattern = {
      location,
      duration: 0,
      mouseMovements: mouseMovements.current,
      scrollOscillations: 0,
      detected: false,
      intensity: 'mild',
    };
    
    // Check for scroll oscillation (user scrolling up and down)
    if (scrollPositions.current.length > 4) {
      let oscillations = 0;
      for (let i = 2; i < scrollPositions.current.length; i++) {
        const prev = scrollPositions.current[i - 2];
        const curr = scrollPositions.current[i];
        const mid = scrollPositions.current[i - 1];
        if ((mid > prev && mid > curr) || (mid < prev && mid < curr)) {
          oscillations++;
        }
      }
      pattern.scrollOscillations = oscillations;
    }
    
    // Determine if hesitation is significant
    if (mouseMovements.current > 50 || pattern.scrollOscillations > 2) {
      pattern.detected = true;
      pattern.intensity = mouseMovements.current > 100 || pattern.scrollOscillations > 4 ? 'severe' : 
                         mouseMovements.current > 75 ? 'moderate' : 'mild';
      
      setHesitationPatterns(prev => [...prev.slice(-10), pattern]);
      trackSignal({ type: 'hesitation', element: location, data: { ...pattern } as Record<string, unknown> });
    }
    
    mouseMovements.current = 0;
  }, [trackSignal]);

  // Get personalized message based on profile
  const getPersonalizedMessage = useCallback((context: 'welcome' | 'nudge' | 'cta' | 'success' | 'error'): string => {
    const { personalityType, currentEmotion, intentIntensity } = psychologicalProfile;
    
    const messages: Record<string, Record<string, string[]>> = {
      welcome: {
        confident: ['Let\'s build something great', 'Ready to create?', 'Your widgets await'],
        hesitant: ['Take your time exploring', 'We\'re here to help', 'Start with our popular templates'],
        analytical: ['Explore our full feature set', 'See detailed documentation', 'Compare all options'],
        impulsive: ['Create your first widget in 30 seconds!', 'Jump right in!', 'Instant results await'],
        skeptical: ['See why 50,000+ trust us', 'Try it free, no strings attached', 'Read our reviews'],
        explorer: ['Discover what\'s possible', 'Browse our collection', 'Find your perfect widget'],
      },
      nudge: {
        confident: ['You\'re on a roll!', 'Keep going!', 'Almost there!'],
        hesitant: ['Need a hand?', 'Our support team is here', 'Try our guided tour'],
        analytical: ['View detailed specs', 'Compare features', 'See analytics'],
        impulsive: ['Limited time offer!', 'Act now!', 'Don\'t miss out!'],
        skeptical: ['Read testimonials', 'See case studies', 'Money-back guarantee'],
        explorer: ['Discover more widgets', 'Try something new', 'Explore advanced features'],
      },
      cta: {
        confident: ['Create Now', 'Build It', 'Let\'s Go'],
        hesitant: ['Try It Free', 'Learn More', 'See How It Works'],
        analytical: ['View Details', 'Compare Options', 'See Features'],
        impulsive: ['Get It Now!', 'Start Instantly', 'Create →'],
        skeptical: ['See Reviews', 'Try Risk-Free', 'No Credit Card'],
        explorer: ['Explore', 'Discover', 'Browse All'],
      },
      success: {
        confident: ['Excellent work!', 'Nailed it!', 'You\'re crushing it!'],
        hesitant: ['Great job!', 'That was easy, right?', 'You did it!'],
        analytical: ['Widget created successfully', 'All parameters set correctly', 'Ready for deployment'],
        impulsive: ['Done! 🎉', 'Boom! Created!', 'Lightning fast!'],
        skeptical: ['Widget ready for testing', 'Preview before publishing', 'Review your creation'],
        explorer: ['Nice! What\'s next?', 'Widget ready! Explore more?', 'One down, many to discover!'],
      },
      error: {
        confident: ['Quick fix needed', 'Easy to resolve', 'Try again'],
        hesitant: ['No worries, let\'s fix this together', 'This happens sometimes', 'We\'ll help you through'],
        analytical: ['Error details available', 'See troubleshooting guide', 'Check configuration'],
        impulsive: ['Retry now', 'Quick fix', 'Try again →'],
        skeptical: ['Common issue with easy fix', 'Our support can help', 'See FAQs'],
        explorer: ['Let\'s try a different approach', 'Alternative options available', 'Explore other widgets'],
      },
    };
    
    const contextMessages = messages[context]?.[personalityType] || messages[context]?.explorer || [''];
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }, [psychologicalProfile]);

  // Should show specific content type
  const shouldShow = useCallback((contentType: 'urgency' | 'social_proof' | 'trust_badges' | 'detailed_info' | 'quick_actions'): boolean => {
    const { personalityType, trustLevel, intentIntensity, frustrationLevel } = psychologicalProfile;
    
    switch (contentType) {
      case 'urgency':
        return personalityType === 'impulsive' || intentIntensity === 'ready';
      case 'social_proof':
        return trustLevel < 70 || personalityType === 'skeptical' || personalityType === 'hesitant';
      case 'trust_badges':
        return trustLevel < 50 || personalityType === 'skeptical';
      case 'detailed_info':
        return personalityType === 'analytical' || psychologicalProfile.informationNeeds === 'extensive';
      case 'quick_actions':
        return personalityType === 'impulsive' || personalityType === 'confident' || frustrationLevel > 30;
      default:
        return true;
    }
  }, [psychologicalProfile]);

  // Initialize tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastMousePos.current.x);
      const dy = Math.abs(e.clientY - lastMousePos.current.y);
      if (dx > 5 || dy > 5) {
        mouseMovements.current++;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
      
      // Reset idle timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        trackSignal({ type: 'idle' });
        detectHesitation(window.location.pathname);
      }, 10000);
    };
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      
      scrollPositions.current = [...scrollPositions.current.slice(-10), scrollY];
      
      setSessionData(prev => ({
        ...prev,
        maxScrollDepth: Math.max(prev.maxScrollDepth, depth),
        totalScrollDistance: prev.totalScrollDistance + Math.abs(scrollY - (scrollPositions.current[scrollPositions.current.length - 2] || 0)),
      }));
      
      const now = Date.now();
      if (now - lastScrollTime.current > 100) {
        trackSignal({ type: 'scroll', data: { depth, y: scrollY } });
        lastScrollTime.current = now;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackSignal({ type: 'focus_loss' });
      }
    };
    
    // Increment session count on mount
    const newSessionCount = sessionData.totalSessions + 1;
    storeValue('totalSessions', newSessionCount);
    if (sessionData.totalSessions > 0) {
      storeValue('returnCount', sessionData.returnCount + 1);
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [trackSignal, detectHesitation, sessionData.totalSessions, sessionData.returnCount]);

  return {
    // Psychological profile
    psychologicalProfile,
    
    // Content adaptation
    contentAdaptation,
    
    // Behavior tracking
    trackClick,
    trackWidgetView,
    trackSignal,
    detectHesitation,
    
    // Smart helpers
    getPersonalizedMessage,
    shouldShow,
    
    // Session data
    sessionData,
    
    // Hesitation patterns
    hesitationPatterns,
    
    // Active nudges
    activeNudges,
    setActiveNudges,
  };
};
