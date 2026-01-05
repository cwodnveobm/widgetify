import React, { useState, useEffect } from 'react';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingNudgeProps {
  variant?: 'banner' | 'card' | 'inline';
}

export const PricingNudge: React.FC<PricingNudgeProps> = ({
  variant = 'card',
}) => {
  const { getPricingNudge, trackClick, uiPersonalization } = useHyperPersonalization();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const nudge = getPricingNudge();

  useEffect(() => {
    if (!nudge || dismissed) {
      setIsVisible(false);
      return;
    }

    if (nudge.timing === 'immediate') {
      setIsVisible(true);
    } else if (nudge.timing === 'delayed') {
      const timer = setTimeout(() => setIsVisible(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [nudge, dismissed]);

  if (!isVisible || !nudge) {
    return null;
  }

  const handleDismiss = () => {
    trackClick('pricing-nudge-dismiss');
    setDismissed(true);
    setIsVisible(false);
  };

  const handleCTA = () => {
    trackClick(`pricing-nudge-cta-${nudge.feature}`);
  };

  const getIcon = () => {
    switch (nudge.type) {
      case 'value_demo': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'feature_highlight': return <Sparkles className="w-5 h-5 text-primary" />;
      case 'soft': return <Zap className="w-5 h-5 text-amber-500" />;
    }
  };

  const getFeatureLink = () => {
    switch (nudge.feature) {
      case 'analytics': return '/ab-testing';
      case 'ab_testing': return '/ab-testing';
      case 'custom_code': return '/custom-builder';
      default: return null;
    }
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {getIcon()}
            <span className="text-sm font-medium">{nudge.title}</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">{nudge.message}</span>
          </div>
          <div className="flex items-center gap-2">
            {getFeatureLink() ? (
              <Button size="sm" variant="outline" asChild onClick={handleCTA}>
                <Link to={getFeatureLink()!}>
                  {nudge.cta}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={handleCTA}>
                {nudge.cta}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        {getIcon()}
        <div className="flex-1">
          <span className="text-sm font-medium">{nudge.title}</span>
          <span className="text-sm text-muted-foreground ml-2">{nudge.message}</span>
        </div>
        {getFeatureLink() ? (
          <Button size="sm" variant="ghost" asChild onClick={handleCTA}>
            <Link to={getFeatureLink()!}>
              {nudge.cta}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={handleCTA}>
            {nudge.cta}
          </Button>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 shrink-0">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{nudge.title}</h4>
                {nudge.type === 'value_demo' && (
                  <Badge variant="secondary" className="text-xs">Based on your usage</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{nudge.message}</p>
              
              <div className="mt-3">
                {getFeatureLink() ? (
                  <Button size="sm" asChild onClick={handleCTA}>
                    <Link to={getFeatureLink()!}>
                      {nudge.cta}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleCTA}>
                    {nudge.cta}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 shrink-0"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
