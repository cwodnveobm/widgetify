import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Zap, Clock, Star, TrendingUp, Shield, Flame } from 'lucide-react';

interface PersonalizedHeroProps {
  onScrollToGenerator: () => void;
}

export const PersonalizedHero = ({ onScrollToGenerator }: PersonalizedHeroProps) => {
  const { content, segment, session, trackClick, intent, conversionProbability } = usePersonalization();
  const { 
    getConversionContent, 
    conversionSignals, 
    getDynamicCTA,
    isHighIntent 
  } = useConversionOptimization();

  const conversionContent = getConversionContent('hero');

  const handlePrimaryCTA = () => {
    trackClick('hero-primary-cta');
    onScrollToGenerator();
  };

  const handleSecondaryCTA = () => {
    trackClick('hero-secondary-cta');
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic social proof based on segment and conversion signals
  const getSocialProof = () => {
    if (conversionSignals.showSocialProof && conversionContent.socialProof) {
      return { icon: Users, text: conversionContent.socialProof };
    }
    switch (segment) {
      case 'power_user':
        return { icon: Star, text: '50,000+ widgets created this month' };
      case 'hot_prospect':
        return { icon: Flame, text: '10,000+ businesses trust us' };
      case 'warm_lead':
        return { icon: TrendingUp, text: '4.9/5 average rating from users' };
      default:
        return { icon: Sparkles, text: '100,000+ widgets generated' };
    }
  };

  const socialProof = getSocialProof();
  const SocialProofIcon = socialProof.icon;

  // Get dynamic CTA text
  const primaryCtaText = getDynamicCTA(content.ctaText);

  return (
    <section 
      className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden section-spacing"
      role="banner"
      aria-label="Welcome to Widgetify"
    >
      {/* Animated background with conversion-optimized intensity - reduced motion support */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 overflow-hidden motion-reduce:hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl will-change-transform"
          animate={{ 
            scale: isHighIntent ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: isHighIntent ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl will-change-transform"
          animate={{ 
            scale: isHighIntent ? [1.2, 1, 1.2] : [1.1, 1, 1.1],
            opacity: isHighIntent ? [0.2, 0.1, 0.2] : [0.1, 0.05, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container-padding relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Personalized badge with conversion optimization */}
          <AnimatePresence mode="wait">
            {session.isReturningUser && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {segment === 'power_user' ? 'Welcome back, Pro!' : 'Welcome back!'}
                  {conversionProbability > 0.5 && (
                    <span className="ml-2 text-primary">• Ready to create</span>
                  )}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Urgency indicator for high-intent users */}
          <AnimatePresence>
            {conversionSignals.isUrgent && conversionContent.urgencyMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm text-primary px-4"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 animate-pulse" />
                <span className="font-medium">{conversionContent.urgencyMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversion-optimized headline */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">{conversionContent.headline}</span>
          </motion.h1>

          {/* Conversion-optimized subheadline */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {conversionContent.subheadline}
          </motion.p>

          {/* Value proposition badge */}
          {conversionSignals.showBenefits && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-sm text-primary"
            >
              <Zap className="w-4 h-4" />
              <span className="font-medium">{conversionContent.valueProposition}</span>
            </motion.div>
          )}

          {/* Social proof - always visible for conversion */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-4 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <SocialProofIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-muted-foreground text-xs sm:text-sm">{socialProof.text}</span>
            </div>
            {segment !== 'cold_visitor' && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">Free to start • No credit card</span>
              </div>
            )}
          </motion.div>

          {/* Conversion-optimized CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={handlePrimaryCTA}
              className={`w-full sm:w-auto sm:min-w-[200px] text-base sm:text-lg shadow-elegant hover:shadow-lg transition-all duration-300 min-h-[48px] ${
                isHighIntent ? 'animate-pulse-subtle' : ''
              }`}
            >
              {primaryCtaText}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryCTA}
              className="w-full sm:w-auto sm:min-w-[200px] text-base sm:text-lg min-h-[48px]"
            >
              {content.ctaSecondary}
            </Button>
          </motion.div>

          {/* Trust indicators based on intent - enhanced */}
          {(intent.type === 'comparing' || conversionSignals.showScarcity) && (
            <motion.div 
              className="pt-6 sm:pt-8 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="text-xl sm:text-2xl font-bold text-primary">100%</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Free Tier</div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="text-xl sm:text-2xl font-bold text-primary">0</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Code Required</div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="text-xl sm:text-2xl font-bold text-primary">30s</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Setup Time</div>
              </div>
            </motion.div>
          )}

          {/* Benefit highlight for high-intent users */}
          {isHighIntent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                {conversionContent.benefit}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
