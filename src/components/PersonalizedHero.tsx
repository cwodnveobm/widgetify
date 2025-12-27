import React from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Zap, Clock } from 'lucide-react';

interface PersonalizedHeroProps {
  onScrollToGenerator: () => void;
}

export const PersonalizedHero = ({ onScrollToGenerator }: PersonalizedHeroProps) => {
  const { content, segment, session, trackClick, intent } = usePersonalization();

  const handlePrimaryCTA = () => {
    trackClick('hero-primary-cta');
    onScrollToGenerator();
  };

  const handleSecondaryCTA = () => {
    trackClick('hero-secondary-cta');
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic social proof based on segment
  const getSocialProof = () => {
    switch (segment) {
      case 'power_user':
        return { count: '50,000+', text: 'widgets created this month' };
      case 'hot_prospect':
        return { count: '10,000+', text: 'businesses trust us' };
      case 'warm_lead':
        return { count: '4.9/5', text: 'average rating from users' };
      default:
        return { count: '100,000+', text: 'widgets generated' };
    }
  };

  const socialProof = getSocialProof();

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden section-spacing">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-padding relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Personalized badge */}
          {session.isReturningUser && (
            <Badge variant="secondary" className="animate-fade-in text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              {segment === 'power_user' ? 'Welcome back, Pro!' : 'Welcome back!'}
            </Badge>
          )}

          {/* Urgency indicator for hot prospects */}
          {content.showUrgency && (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-primary animate-pulse px-4">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Limited time: Get 20% off your first month</span>
            </div>
          )}

          {/* Personalized headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-2">
            <span className="gradient-text">{content.heroHeadline}</span>
          </h1>

          {/* Personalized subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {content.heroSubheadline}
          </p>

          {/* Social proof */}
          {content.showSocialProof && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-4 px-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base">{socialProof.count}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">{socialProof.text}</span>
              </div>
              {segment !== 'cold_visitor' && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm">Free to start</span>
                </div>
              )}
            </div>
          )}

          {/* Personalized CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Button
              size="lg"
              onClick={handlePrimaryCTA}
              className="w-full sm:w-auto sm:min-w-[200px] text-base sm:text-lg shadow-elegant hover:shadow-lg transition-all duration-300 min-h-[48px]"
            >
              {content.ctaText}
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
          </div>

          {/* Trust indicators based on intent */}
          {intent.type === 'comparing' && (
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto text-center px-4">
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="text-xl sm:text-2xl font-bold text-primary">100%</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Free Tier</div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="text-xl sm:text-2xl font-bold text-primary">0</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Code Required</div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="text-xl sm:text-2xl font-bold text-primary">5min</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Setup Time</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
