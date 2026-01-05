import React from 'react';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

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
    getPersonalizedCopy, 
    uiPersonalization,
    industryBenchmarks 
  } = useHyperPersonalization();
  const { session, behavior } = usePersonalization();
  
  const copy = getPersonalizedCopy();
  const showEmojis = uiPersonalization.showEmojis;

  // Show returning user banner
  const isReturningUser = session.isReturningUser && behavior.widgetsGenerated > 0;
  
  // Social proof based on segment
  const getSocialProof = () => {
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

  return (
    <div className="text-center space-y-6">
      {/* Returning user badge */}
      {isReturningUser && (
        <Badge variant="secondary" className="animate-in fade-in-0 slide-in-from-top-2">
          {showEmojis ? '👋 ' : ''}Welcome back! You've created {behavior.widgetsGenerated} widget{behavior.widgetsGenerated !== 1 ? 's' : ''}
        </Badge>
      )}
      
      {/* UTM-based welcome */}
      {session.utmSource?.includes('producthunt') && (
        <Badge className="bg-[#ff6154] text-white">
          {showEmojis ? '🎉 ' : ''}Welcome from Product Hunt!
        </Badge>
      )}

      {/* Main headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {copy.heroTitle}
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        {copy.heroSubtitle}
      </p>
      
      {/* Industry benchmark for marketers/founders */}
      {(extendedProfile.role === 'marketer' || extendedProfile.role === 'founder') && industryBenchmarks && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>
            {extendedProfile.industry.replace('_', ' ')} average: {industryBenchmarks.avgConversion} conversion rate
          </span>
        </div>
      )}
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button 
          size="lg" 
          onClick={onPrimaryAction}
          className="text-lg px-8"
        >
          {copy.primaryCTA}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={onSecondaryAction}
          className="text-lg px-8"
        >
          {copy.secondaryCTA}
        </Button>
      </div>
      
      {/* Social proof */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
        <SocialIcon className="w-4 h-4" />
        <span>{socialProof.text}</span>
      </div>
      
      {/* Quick stats for power users */}
      {extendedProfile.skillLevel === 'advanced' || extendedProfile.skillLevel === 'expert' ? (
        <div className="flex items-center justify-center gap-6 text-sm pt-2">
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            ~3KB gzipped
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            No dependencies
          </span>
          <span>MIT License</span>
        </div>
      ) : null}
    </div>
  );
};
