import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Star, Flame, Shield } from 'lucide-react';

interface PersonalizedHeroSectionProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export const PersonalizedHeroSection: React.FC<PersonalizedHeroSectionProps> = ({
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const { 
    extendedProfile, 
    uiPersonalization,
    industryBenchmarks 
  } = useHyperPersonalization();
  const { session, behavior, conversionProbability } = usePersonalization();
  const { 
    getConversionContent, 
    conversionSignals, 
    getDynamicCTA,
    isHighIntent 
  } = useConversionOptimization();
  
  const content = getConversionContent('hero');
  const showEmojis = uiPersonalization.showEmojis;

  // Show returning user banner
  const isReturningUser = session.isReturningUser && behavior.widgetsGenerated > 0;
  
  // Social proof based on segment and conversion optimization
  const getSocialProof = () => {
    if (conversionSignals.showSocialProof && content.socialProof) {
      return { icon: Users, text: content.socialProof };
    }
    if (extendedProfile.role === 'marketer') {
      return { icon: TrendingUp, text: 'Used by 10,000+ marketers worldwide' };
    }
    if (extendedProfile.role === 'agency_owner') {
      return { icon: Users, text: 'Trusted by 500+ agencies' };
    }
    if (extendedProfile.role === 'developer') {
      return { icon: Zap, text: 'Zero dependencies • 3KB gzipped' };
    }
    return { icon: Sparkles, text: 'Join 50,000+ businesses using Widgetify' };
  };

  const socialProof = getSocialProof();
  const SocialIcon = socialProof.icon;

  // Dynamic CTA based on conversion optimization
  const primaryCTA = getDynamicCTA(content.cta);

  return (
    <div className="text-center space-y-6">
      {/* Returning user badge */}
      <AnimatePresence>
        {isReturningUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Badge variant="secondary" className="animate-in fade-in-0 slide-in-from-top-2">
              {showEmojis ? '👋 ' : ''}Welcome back! You've created {behavior.widgetsGenerated} widget{behavior.widgetsGenerated !== 1 ? 's' : ''}
              {conversionProbability > 0.5 && <span className="ml-1 text-primary">• Keep building!</span>}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* UTM-based welcome */}
      {session.utmSource?.includes('producthunt') && (
        <Badge className="bg-[#ff6154] text-white">
          {showEmojis ? '🎉 ' : ''}Welcome from Product Hunt!
        </Badge>
      )}

      {/* Urgency indicator */}
      <AnimatePresence>
        {conversionSignals.isUrgent && content.urgencyMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-primary"
          >
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="font-medium">{content.urgencyMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main headline - conversion optimized */}
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.headline}
      </motion.h1>
      
      {/* Subtitle - conversion optimized */}
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {content.subheadline}
      </motion.p>

      {/* Value proposition */}
      {conversionSignals.showBenefits && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-sm text-primary"
        >
          <Zap className="w-4 h-4" />
          <span className="font-medium">{content.valueProposition}</span>
        </motion.div>
      )}
      
      {/* Industry benchmark for marketers/founders */}
      {(extendedProfile.role === 'marketer' || extendedProfile.role === 'founder') && industryBenchmarks && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>
            {extendedProfile.industry.replace('_', ' ')} average: {industryBenchmarks.avgConversion} conversion rate
          </span>
        </div>
      )}
      
      {/* CTAs - conversion optimized */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          size="lg" 
          onClick={onPrimaryAction}
          className={`text-lg px-8 shadow-elegant ${isHighIntent ? 'animate-pulse-subtle' : ''}`}
        >
          {primaryCTA}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={onSecondaryAction}
          className="text-lg px-8"
        >
          {content.cta === primaryCTA ? 'View Templates' : content.cta}
        </Button>
      </motion.div>
      
      {/* Social proof */}
      <motion.div 
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <SocialIcon className="w-4 h-4" />
        <span>{socialProof.text}</span>
        {conversionSignals.showSocialProof && (
          <>
            <span className="mx-2">•</span>
            <Shield className="w-4 h-4 text-green-500" />
            <span>Free forever</span>
          </>
        )}
      </motion.div>
      
      {/* Quick stats for power users */}
      {(extendedProfile.skillLevel === 'advanced' || extendedProfile.skillLevel === 'expert') && (
        <motion.div 
          className="flex items-center justify-center gap-6 text-sm pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            ~3KB gzipped
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            No dependencies
          </span>
          <span>MIT License</span>
        </motion.div>
      )}

      {/* High-intent benefit highlight */}
      {isHighIntent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-medium text-primary"
        >
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-4 h-4" />
            {content.benefit}
          </span>
        </motion.div>
      )}
    </div>
  );
};
