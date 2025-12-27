import React from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Gift, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PersonalizedCTA = () => {
  const { segment, content, session, intent, trackClick } = usePersonalization();

  const handleCTAClick = () => {
    trackClick('personalized-cta-bottom');
  };

  // Different CTA configurations based on segment
  const getCTAConfig = () => {
    switch (segment) {
      case 'power_user':
        return {
          icon: Star,
          badge: 'Pro Tip',
          title: 'Unlock Advanced Features',
          description: 'Take your widgets to the next level with A/B testing, analytics, and custom CSS.',
          buttonText: 'Explore Pro Features',
          buttonLink: '/ab-testing',
          gradient: 'from-primary/20 to-accent/20',
        };
      case 'hot_prospect':
        return {
          icon: Zap,
          badge: 'Limited Offer',
          title: 'Start Converting Today',
          description: 'Join 10,000+ businesses already boosting their conversions with Widgetify.',
          buttonText: 'Get Started Free',
          buttonLink: '#widget-generator',
          gradient: 'from-primary/30 to-accent/30',
        };
      case 'warm_lead':
        return {
          icon: Gift,
          badge: 'Free Templates',
          title: 'Find Your Perfect Template',
          description: 'Browse our library of 16+ professionally designed widget templates.',
          buttonText: 'View All Templates',
          buttonLink: '/custom-builder',
          gradient: 'from-secondary/30 to-muted/30',
        };
      default:
        return {
          icon: ArrowRight,
          badge: 'Get Started',
          title: 'Create Your First Widget',
          description: 'No signup required. Start building beautiful widgets in under 2 minutes.',
          buttonText: 'Try It Now',
          buttonLink: '#widget-generator',
          gradient: 'from-primary/10 to-accent/10',
        };
    }
  };

  const config = getCTAConfig();
  const Icon = config.icon;

  return (
    <section className="section-spacing container-padding">
      <Card className={`overflow-hidden bg-gradient-to-br ${config.gradient} border-border/50`}>
        <CardContent className="p-5 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              <Icon className="w-3 h-3 mr-1" />
              {config.badge}
            </Badge>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-2">
              {config.title}
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              {config.description}
            </p>

            {content.showUrgency && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-primary">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Offer expires soon</span>
              </div>
            )}

            <div className="pt-2 sm:pt-4">
              {config.buttonLink.startsWith('#') ? (
                <Button
                  size="lg"
                  onClick={() => {
                    handleCTAClick();
                    const element = document.getElementById(config.buttonLink.slice(1));
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shadow-elegant min-h-[48px] w-full sm:w-auto text-sm sm:text-base"
                >
                  {config.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  asChild
                  onClick={handleCTAClick}
                  className="shadow-elegant min-h-[48px] w-full sm:w-auto text-sm sm:text-base"
                >
                  <Link to={config.buttonLink}>
                    {config.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Additional context for returning users */}
            {session.isReturningUser && intent.type !== 'new_visitor' && (
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
                Based on your previous visits, we think you'll love this.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
