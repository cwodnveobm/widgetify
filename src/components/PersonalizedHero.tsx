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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden section-spacing">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Personalized badge */}
          {session.isReturningUser && (
            <Badge variant="secondary" className="animate-fade-in">
              <Sparkles className="w-3 h-3 mr-1" />
              {segment === 'power_user' ? 'Welcome back, Pro!' : 'Welcome back!'}
            </Badge>
          )}

          {/* Urgency indicator for hot prospects */}
          {content.showUrgency && (
            <div className="flex items-center justify-center gap-2 text-sm text-primary animate-pulse">
              <Clock className="w-4 h-4" />
              <span>Limited time: Get 20% off your first month</span>
            </div>
          )}

          {/* Personalized headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="gradient-text">{content.heroHeadline}</span>
          </h1>

          {/* Personalized subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.heroSubheadline}
          </p>

          {/* Social proof */}
          {content.showSocialProof && (
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{socialProof.count}</span>
                <span className="text-muted-foreground text-sm">{socialProof.text}</span>
              </div>
              {segment !== 'cold_visitor' && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground text-sm">Free to start</span>
                </div>
              )}
            </div>
          )}

          {/* Personalized CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handlePrimaryCTA}
              className="min-w-[200px] text-lg shadow-elegant hover:shadow-lg transition-all duration-300"
            >
              {content.ctaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryCTA}
              className="min-w-[200px] text-lg"
            >
              {content.ctaSecondary}
            </Button>
          </div>

          {/* Trust indicators based on intent */}
          {intent.type === 'comparing' && (
            <div className="pt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">Free Tier</div>
              </div>
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Code Required</div>
              </div>
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl font-bold text-primary">5min</div>
                <div className="text-xs text-muted-foreground">Setup Time</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
