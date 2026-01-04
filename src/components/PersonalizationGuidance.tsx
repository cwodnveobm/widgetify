import React, { useState, useEffect } from 'react';
import { useWidgetPersonalization } from '@/hooks/useWidgetPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, AlertCircle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PersonalizationGuidanceProps {
  onSelectWidget?: (widgetType: string) => void;
}

export const PersonalizationGuidance: React.FC<PersonalizationGuidanceProps> = ({
  onSelectWidget,
}) => {
  const { getGuidance, getTopOptimization, userProfile } = useWidgetPersonalization();
  const { trackClick } = usePersonalization();
  const [dismissed, setDismissed] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);
  
  const guidance = getGuidance();
  const topOptimization = getTopOptimization();
  
  // Show optimization tip after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOptimization(true);
    }, 10000); // Show after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAction = () => {
    if (guidance?.action) {
      trackClick(`guidance-action-${guidance.action}`);
      if (guidance.action.startsWith('/')) {
        // It's a route, let Link handle it
        return;
      }
      if (onSelectWidget) {
        onSelectWidget(guidance.action);
      }
    }
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    trackClick('guidance-dismissed');
  };
  
  if (dismissed || !guidance) {
    // Show top optimization if available and enough time has passed
    if (showOptimization && topOptimization && !dismissed) {
      return (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Highest-Impact Widget for You
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {topOptimization.reason}: <span className="text-green-600 font-medium">{topOptimization.impact}</span>
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowOptimization(false)}
                className="shrink-0 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }
  
  const getIcon = () => {
    switch (guidance.type) {
      case 'tip': return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'opportunity': return <Sparkles className="w-4 h-4 text-primary" />;
      case 'upsell': return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
  };
  
  const getBadge = () => {
    switch (guidance.type) {
      case 'tip': return <Badge variant="outline" className="text-amber-600 border-amber-200">Quick Tip</Badge>;
      case 'warning': return <Badge variant="destructive">Attention</Badge>;
      case 'opportunity': return <Badge className="bg-primary/10 text-primary border-primary/20">Opportunity</Badge>;
      case 'upsell': return <Badge variant="outline" className="text-green-600 border-green-200">Pro Feature</Badge>;
    }
  };
  
  const getCardStyle = () => {
    switch (guidance.type) {
      case 'tip': return 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20';
      case 'warning': return 'border-red-200 bg-red-50/50 dark:bg-red-950/20';
      case 'opportunity': return 'border-primary/30 bg-primary/5';
      case 'upsell': return 'border-green-200 bg-green-50/50 dark:bg-green-950/20';
    }
  };

  return (
    <Card className={`mb-4 ${getCardStyle()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-full bg-background/80 shrink-0">
              {getIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-foreground">{guidance.title}</span>
                {getBadge()}
              </div>
              <p className="text-sm text-muted-foreground">
                {guidance.message}
              </p>
              
              {guidance.action && guidance.actionLabel && (
                <div className="mt-3">
                  {guidance.action.startsWith('/') ? (
                    <Button 
                      size="sm" 
                      variant={guidance.type === 'opportunity' ? 'default' : 'outline'}
                      asChild
                      onClick={() => trackClick(`guidance-action-${guidance.action}`)}
                    >
                      <Link to={guidance.action}>
                        {guidance.actionLabel}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant={guidance.type === 'opportunity' ? 'default' : 'outline'}
                      onClick={handleAction}
                    >
                      {guidance.actionLabel}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="shrink-0 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Experience level context */}
        {userProfile.experienceLevel === 'beginner' && guidance.type === 'tip' && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              We're showing simpler widgets first. As you gain experience, we'll suggest more advanced options.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
