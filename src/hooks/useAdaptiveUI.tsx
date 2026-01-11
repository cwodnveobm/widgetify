import { useMemo, useCallback, createContext, useContext, ReactNode } from 'react';
import { usePersonalization } from './usePersonalization';
import { useHyperPersonalization } from './useHyperPersonalization';
import { useConversionOptimization } from './useConversionOptimization';

// Adaptive UI configuration based on user profile
export interface AdaptiveUIConfig {
  // Layout adaptations
  layout: {
    density: 'compact' | 'comfortable' | 'spacious';
    gridColumns: number;
    cardSize: 'sm' | 'md' | 'lg';
    showSidebar: boolean;
    navigationStyle: 'minimal' | 'standard' | 'expanded';
  };
  
  // Color adaptations based on segment/intent
  colorScheme: {
    accent: 'primary' | 'accent' | 'success' | 'warning';
    intensity: 'subtle' | 'balanced' | 'vibrant';
    ctaVariant: 'default' | 'gradient' | 'glow';
    borderStyle: 'none' | 'subtle' | 'prominent';
  };
  
  // Content adaptations
  content: {
    verbosity: 'minimal' | 'standard' | 'detailed';
    showEmoji: boolean;
    showBadges: boolean;
    showProgress: boolean;
    showSocialProof: boolean;
    showUrgency: boolean;
    animationLevel: 'none' | 'subtle' | 'full';
  };
  
  // Interaction adaptations
  interactions: {
    hoverEffects: boolean;
    microAnimations: boolean;
    hapticFeedback: boolean;
    autoFocus: boolean;
    tooltipDelay: number;
    scrollBehavior: 'smooth' | 'instant';
  };
  
  // Typography adaptations
  typography: {
    headingSize: 'sm' | 'md' | 'lg' | 'xl';
    bodySize: 'sm' | 'md' | 'lg';
    fontWeight: 'normal' | 'medium' | 'bold';
    lineHeight: 'tight' | 'normal' | 'relaxed';
  };
  
  // Component-specific adaptations
  components: {
    buttonSize: 'sm' | 'default' | 'lg';
    buttonRounding: 'none' | 'sm' | 'md' | 'lg' | 'full';
    cardElevation: 'flat' | 'subtle' | 'elevated' | 'floating';
    inputStyle: 'minimal' | 'outlined' | 'filled';
  };
}

// Real-time adaptive CSS class generator
export interface AdaptiveClasses {
  container: string;
  card: string;
  button: string;
  buttonPrimary: string;
  buttonSecondary: string;
  heading: string;
  subheading: string;
  body: string;
  muted: string;
  badge: string;
  input: string;
  section: string;
  grid: string;
  animation: string;
}

interface AdaptiveUIContextType {
  config: AdaptiveUIConfig;
  classes: AdaptiveClasses;
  getAdaptiveClass: (base: string, variant?: string) => string;
  getAnimationClass: () => string;
  getSpacingClass: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => string;
  shouldShowElement: (element: 'emoji' | 'badge' | 'progress' | 'socialProof' | 'urgency' | 'tooltip') => boolean;
  getButtonVariant: () => 'default' | 'gradient' | 'glow' | 'outline';
  getCardStyle: () => string;
  getLayoutClass: () => string;
  isCompactMode: boolean;
  isVibrantMode: boolean;
  isPowerUser: boolean;
}

const AdaptiveUIContext = createContext<AdaptiveUIContextType | undefined>(undefined);

// Segment-based UI presets
const SEGMENT_UI_PRESETS: Record<string, Partial<AdaptiveUIConfig>> = {
  cold_visitor: {
    layout: { density: 'spacious', gridColumns: 2, cardSize: 'lg', showSidebar: false, navigationStyle: 'minimal' },
    colorScheme: { accent: 'primary', intensity: 'vibrant', ctaVariant: 'gradient', borderStyle: 'subtle' },
    content: { verbosity: 'standard', showEmoji: true, showBadges: true, showProgress: true, showSocialProof: true, showUrgency: false, animationLevel: 'full' },
    interactions: { hoverEffects: true, microAnimations: true, hapticFeedback: false, autoFocus: false, tooltipDelay: 200, scrollBehavior: 'smooth' },
    typography: { headingSize: 'xl', bodySize: 'md', fontWeight: 'medium', lineHeight: 'relaxed' },
    components: { buttonSize: 'lg', buttonRounding: 'lg', cardElevation: 'elevated', inputStyle: 'outlined' },
  },
  warm_lead: {
    layout: { density: 'comfortable', gridColumns: 3, cardSize: 'md', showSidebar: false, navigationStyle: 'standard' },
    colorScheme: { accent: 'primary', intensity: 'balanced', ctaVariant: 'gradient', borderStyle: 'subtle' },
    content: { verbosity: 'standard', showEmoji: true, showBadges: true, showProgress: true, showSocialProof: true, showUrgency: true, animationLevel: 'subtle' },
    interactions: { hoverEffects: true, microAnimations: true, hapticFeedback: false, autoFocus: true, tooltipDelay: 300, scrollBehavior: 'smooth' },
    typography: { headingSize: 'lg', bodySize: 'md', fontWeight: 'medium', lineHeight: 'normal' },
    components: { buttonSize: 'default', buttonRounding: 'md', cardElevation: 'subtle', inputStyle: 'outlined' },
  },
  hot_prospect: {
    layout: { density: 'comfortable', gridColumns: 3, cardSize: 'md', showSidebar: false, navigationStyle: 'standard' },
    colorScheme: { accent: 'success', intensity: 'vibrant', ctaVariant: 'glow', borderStyle: 'prominent' },
    content: { verbosity: 'minimal', showEmoji: true, showBadges: true, showProgress: false, showSocialProof: true, showUrgency: true, animationLevel: 'subtle' },
    interactions: { hoverEffects: true, microAnimations: true, hapticFeedback: true, autoFocus: true, tooltipDelay: 500, scrollBehavior: 'smooth' },
    typography: { headingSize: 'lg', bodySize: 'md', fontWeight: 'bold', lineHeight: 'tight' },
    components: { buttonSize: 'lg', buttonRounding: 'lg', cardElevation: 'elevated', inputStyle: 'filled' },
  },
  power_user: {
    layout: { density: 'compact', gridColumns: 4, cardSize: 'sm', showSidebar: true, navigationStyle: 'expanded' },
    colorScheme: { accent: 'primary', intensity: 'subtle', ctaVariant: 'default', borderStyle: 'subtle' },
    content: { verbosity: 'minimal', showEmoji: false, showBadges: false, showProgress: false, showSocialProof: false, showUrgency: false, animationLevel: 'none' },
    interactions: { hoverEffects: true, microAnimations: false, hapticFeedback: false, autoFocus: true, tooltipDelay: 800, scrollBehavior: 'instant' },
    typography: { headingSize: 'md', bodySize: 'sm', fontWeight: 'normal', lineHeight: 'tight' },
    components: { buttonSize: 'sm', buttonRounding: 'sm', cardElevation: 'flat', inputStyle: 'minimal' },
  },
};

// Skill level modifiers
const SKILL_MODIFIERS: Record<string, Partial<AdaptiveUIConfig['content']>> = {
  beginner: { verbosity: 'detailed', showProgress: true, showBadges: true, animationLevel: 'full' },
  intermediate: { verbosity: 'standard', showProgress: true, showBadges: true, animationLevel: 'subtle' },
  advanced: { verbosity: 'minimal', showProgress: false, showBadges: false, animationLevel: 'subtle' },
  expert: { verbosity: 'minimal', showProgress: false, showBadges: false, animationLevel: 'none' },
};

// Device-based modifiers
const DEVICE_MODIFIERS = {
  mobile: { density: 'comfortable' as const, gridColumns: 1, buttonSize: 'lg' as const, cardSize: 'md' as const },
  tablet: { density: 'comfortable' as const, gridColumns: 2, buttonSize: 'default' as const, cardSize: 'md' as const },
  desktop: { density: 'comfortable' as const, gridColumns: 3, buttonSize: 'default' as const, cardSize: 'md' as const },
};

export const AdaptiveUIProvider = ({ children }: { children: ReactNode }) => {
  const { segment, device, behavior, conversionProbability } = usePersonalization();
  const { extendedProfile, uiPersonalization } = useHyperPersonalization();
  const { conversionSignals, isHighIntent } = useConversionOptimization();

  // Build adaptive UI configuration from all personalization sources
  const config = useMemo((): AdaptiveUIConfig => {
    const segmentPreset = SEGMENT_UI_PRESETS[segment] || SEGMENT_UI_PRESETS.cold_visitor;
    const skillModifier = SKILL_MODIFIERS[extendedProfile.skillLevel] || SKILL_MODIFIERS.beginner;
    const deviceType = device.isMobile ? 'mobile' : device.isTablet ? 'tablet' : 'desktop';
    const deviceModifier = DEVICE_MODIFIERS[deviceType];

    // Merge configurations with priority: device > skill > segment > default
    const baseConfig: AdaptiveUIConfig = {
      layout: {
        density: deviceModifier.density,
        gridColumns: device.isMobile ? 1 : deviceModifier.gridColumns,
        cardSize: deviceModifier.cardSize,
        showSidebar: !device.isMobile && segmentPreset.layout?.showSidebar || false,
        navigationStyle: device.isMobile ? 'minimal' : segmentPreset.layout?.navigationStyle || 'standard',
      },
      colorScheme: {
        accent: isHighIntent ? 'success' : segmentPreset.colorScheme?.accent || 'primary',
        intensity: conversionSignals.optimizationLevel === 'aggressive' ? 'vibrant' : segmentPreset.colorScheme?.intensity || 'balanced',
        ctaVariant: conversionSignals.isHighIntent ? 'glow' : segmentPreset.colorScheme?.ctaVariant || 'default',
        borderStyle: segmentPreset.colorScheme?.borderStyle || 'subtle',
      },
      content: {
        verbosity: skillModifier.verbosity || segmentPreset.content?.verbosity || 'standard',
        showEmoji: uiPersonalization.showEmojis,
        showBadges: skillModifier.showBadges ?? segmentPreset.content?.showBadges ?? true,
        showProgress: skillModifier.showProgress ?? segmentPreset.content?.showProgress ?? true,
        showSocialProof: conversionSignals.showSocialProof,
        showUrgency: conversionSignals.isUrgent,
        animationLevel: device.connectionType === 'slow' ? 'none' : skillModifier.animationLevel || segmentPreset.content?.animationLevel || 'subtle',
      },
      interactions: {
        hoverEffects: !device.isMobile,
        microAnimations: device.connectionType !== 'slow' && segmentPreset.interactions?.microAnimations !== false,
        hapticFeedback: device.isMobile && segmentPreset.interactions?.hapticFeedback || false,
        autoFocus: !device.isMobile,
        tooltipDelay: uiPersonalization.showTooltips ? 200 : 800,
        scrollBehavior: 'smooth',
      },
      typography: {
        headingSize: device.isMobile ? 'lg' : segmentPreset.typography?.headingSize || 'lg',
        bodySize: device.isMobile ? 'md' : segmentPreset.typography?.bodySize || 'md',
        fontWeight: segmentPreset.typography?.fontWeight || 'medium',
        lineHeight: segmentPreset.typography?.lineHeight || 'normal',
      },
      components: {
        buttonSize: device.isMobile ? 'lg' : deviceModifier.buttonSize,
        buttonRounding: segmentPreset.components?.buttonRounding || 'md',
        cardElevation: segmentPreset.components?.cardElevation || 'subtle',
        inputStyle: segmentPreset.components?.inputStyle || 'outlined',
      },
    };

    return baseConfig;
  }, [segment, device, extendedProfile, uiPersonalization, conversionSignals, isHighIntent]);

  // Generate adaptive CSS classes
  const classes = useMemo((): AdaptiveClasses => {
    const { layout, colorScheme, content, typography, components } = config;

    // Density-based padding
    const densityPadding = {
      compact: 'p-2 sm:p-3',
      comfortable: 'p-3 sm:p-4 md:p-5',
      spacious: 'p-4 sm:p-6 md:p-8',
    };

    // Card elevation classes
    const cardElevationClasses = {
      flat: 'border border-border bg-card',
      subtle: 'border border-border bg-card shadow-sm',
      elevated: 'border border-border bg-card shadow-md hover:shadow-lg transition-shadow',
      floating: 'border border-border bg-card shadow-xl hover:shadow-2xl transition-shadow',
    };

    // Button size classes
    const buttonSizeClasses = {
      sm: 'h-8 px-3 text-sm',
      default: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    // Button rounding classes
    const buttonRoundingClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    // CTA variant classes
    const ctaVariantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      gradient: 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90',
      glow: 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 animate-pulse-subtle',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    };

    // Heading size classes
    const headingSizeClasses = {
      sm: 'text-lg sm:text-xl font-semibold',
      md: 'text-xl sm:text-2xl font-semibold',
      lg: 'text-2xl sm:text-3xl font-bold',
      xl: 'text-3xl sm:text-4xl md:text-5xl font-bold',
    };

    // Body size classes
    const bodySizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // Animation classes
    const animationClasses = {
      none: '',
      subtle: 'transition-all duration-200',
      full: 'transition-all duration-300 ease-out',
    };

    // Grid columns
    const gridColsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    return {
      container: `${densityPadding[layout.density]} mx-auto max-w-7xl`,
      card: `${cardElevationClasses[components.cardElevation]} rounded-lg ${animationClasses[content.animationLevel]}`,
      button: `${buttonSizeClasses[components.buttonSize]} ${buttonRoundingClasses[components.buttonRounding]} font-medium ${animationClasses[content.animationLevel]}`,
      buttonPrimary: `${buttonSizeClasses[components.buttonSize]} ${buttonRoundingClasses[components.buttonRounding]} ${ctaVariantClasses[colorScheme.ctaVariant]} font-medium`,
      buttonSecondary: `${buttonSizeClasses[components.buttonSize]} ${buttonRoundingClasses[components.buttonRounding]} bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium`,
      heading: `${headingSizeClasses[typography.headingSize]} text-foreground leading-tight`,
      subheading: `${bodySizeClasses[typography.bodySize]} text-muted-foreground`,
      body: `${bodySizeClasses[typography.bodySize]} text-foreground`,
      muted: `${bodySizeClasses[typography.bodySize]} text-muted-foreground`,
      badge: content.showBadges ? 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary' : 'hidden',
      input: components.inputStyle === 'minimal' 
        ? 'border-0 border-b border-input bg-transparent focus:border-primary' 
        : components.inputStyle === 'filled'
        ? 'border-0 bg-muted/50 focus:bg-muted'
        : 'border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary/20',
      section: `${densityPadding[layout.density]} ${animationClasses[content.animationLevel]}`,
      grid: `grid ${gridColsClasses[layout.gridColumns as keyof typeof gridColsClasses] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`,
      animation: animationClasses[content.animationLevel],
    };
  }, [config]);

  // Utility functions
  const getAdaptiveClass = useCallback((base: string, variant?: string): string => {
    const animClass = config.content.animationLevel !== 'none' ? 'transition-all duration-200' : '';
    return `${base} ${variant || ''} ${animClass}`.trim();
  }, [config.content.animationLevel]);

  const getAnimationClass = useCallback((): string => {
    if (config.content.animationLevel === 'none') return '';
    if (config.content.animationLevel === 'subtle') return 'transition-all duration-200';
    return 'transition-all duration-300 ease-out';
  }, [config.content.animationLevel]);

  const getSpacingClass = useCallback((size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): string => {
    const spacingMap = {
      compact: { xs: 'gap-1', sm: 'gap-2', md: 'gap-3', lg: 'gap-4', xl: 'gap-6' },
      comfortable: { xs: 'gap-2', sm: 'gap-3', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' },
      spacious: { xs: 'gap-3', sm: 'gap-4', md: 'gap-6', lg: 'gap-8', xl: 'gap-12' },
    };
    return spacingMap[config.layout.density][size];
  }, [config.layout.density]);

  const shouldShowElement = useCallback((element: 'emoji' | 'badge' | 'progress' | 'socialProof' | 'urgency' | 'tooltip'): boolean => {
    switch (element) {
      case 'emoji': return config.content.showEmoji;
      case 'badge': return config.content.showBadges;
      case 'progress': return config.content.showProgress;
      case 'socialProof': return config.content.showSocialProof;
      case 'urgency': return config.content.showUrgency;
      case 'tooltip': return uiPersonalization.showTooltips;
      default: return true;
    }
  }, [config.content, uiPersonalization.showTooltips]);

  const getButtonVariant = useCallback((): 'default' | 'gradient' | 'glow' | 'outline' => {
    return config.colorScheme.ctaVariant;
  }, [config.colorScheme.ctaVariant]);

  const getCardStyle = useCallback((): string => {
    return classes.card;
  }, [classes.card]);

  const getLayoutClass = useCallback((): string => {
    return classes.container;
  }, [classes.container]);

  const value: AdaptiveUIContextType = {
    config,
    classes,
    getAdaptiveClass,
    getAnimationClass,
    getSpacingClass,
    shouldShowElement,
    getButtonVariant,
    getCardStyle,
    getLayoutClass,
    isCompactMode: config.layout.density === 'compact',
    isVibrantMode: config.colorScheme.intensity === 'vibrant',
    isPowerUser: segment === 'power_user',
  };

  return (
    <AdaptiveUIContext.Provider value={value}>
      {children}
    </AdaptiveUIContext.Provider>
  );
};

export const useAdaptiveUI = (): AdaptiveUIContextType => {
  const context = useContext(AdaptiveUIContext);
  if (!context) {
    throw new Error('useAdaptiveUI must be used within an AdaptiveUIProvider');
  }
  return context;
};

// Hook for individual components to get their adaptive styles
export const useAdaptiveStyles = () => {
  const { config, classes, shouldShowElement, getAnimationClass } = useAdaptiveUI();
  
  return {
    // Quick access to common styles
    cardClass: classes.card,
    buttonClass: classes.button,
    primaryButtonClass: classes.buttonPrimary,
    headingClass: classes.heading,
    bodyClass: classes.body,
    gridClass: classes.grid,
    
    // Show/hide helpers
    showEmoji: shouldShowElement('emoji'),
    showBadge: shouldShowElement('badge'),
    showProgress: shouldShowElement('progress'),
    showSocialProof: shouldShowElement('socialProof'),
    showUrgency: shouldShowElement('urgency'),
    
    // Animation
    animationClass: getAnimationClass(),
    
    // Config access
    density: config.layout.density,
    intensity: config.colorScheme.intensity,
    verbosity: config.content.verbosity,
  };
};
