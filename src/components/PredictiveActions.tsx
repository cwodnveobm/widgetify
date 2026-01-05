import React, { useState } from 'react';
import { useHyperPersonalization, type PredictedAction } from '@/hooks/useHyperPersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  X,
  Zap,
  TrendingUp,
  Crown,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PredictiveActionsProps {
  onSelectWidget?: (widgetType: string) => void;
  variant?: 'card' | 'inline' | 'floating';
  maxActions?: number;
}

export const PredictiveActions: React.FC<PredictiveActionsProps> = ({
  onSelectWidget,
  variant = 'card',
  maxActions = 3,
}) => {
  const { getPredictedActions, extendedProfile, uiPersonalization, trackClick } = useHyperPersonalization();
  const [dismissed, setDismissed] = useState(false);
  
  const actions = getPredictedActions().slice(0, maxActions);
  
  // Don't show if user has disabled recommendations or is power user who doesn't need guidance
  if (dismissed || !uiPersonalization.showRecommendations || actions.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: PredictedAction['category']) => {
    switch (category) {
      case 'widget': return <Zap className="w-4 h-4" />;
      case 'feature': return <Sparkles className="w-4 h-4" />;
      case 'upgrade': return <Crown className="w-4 h-4" />;
      case 'optimization': return <Wrench className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: PredictedAction['priority']) => {
    switch (priority) {
      case 'high': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleAction = (action: PredictedAction) => {
    trackClick(`predicted-action-${action.action}`);
    
    if (action.action.startsWith('create-')) {
      const widgetType = action.action.replace('create-', '');
      onSelectWidget?.(widgetType);
    }
    // Routes are handled by Link components
  };

  const getActionLink = (action: PredictedAction): string | null => {
    if (action.action === 'open-ab-testing') return '/ab-testing';
    if (action.action === 'open-custom-builder') return '/custom-builder';
    if (action.action === 'view-documentation') return '/faq';
    return null;
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => {
          const link = getActionLink(action);
          const button = (
            <Button
              key={action.action}
              size="sm"
              variant={index === 0 ? 'default' : 'outline'}
              onClick={() => handleAction(action)}
              className="gap-2"
            >
              {getCategoryIcon(action.category)}
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </Button>
          );
          
          return link ? (
            <Link key={action.action} to={link}>
              {button}
            </Link>
          ) : button;
        })}
      </div>
    );
  }

  if (variant === 'floating') {
    const topAction = actions[0];
    if (!topAction) return null;
    
    const link = getActionLink(topAction);
    
    return (
      <div className="fixed bottom-20 right-4 z-40 animate-in slide-in-from-bottom-5">
        <Card className="shadow-lg border-primary/20 max-w-xs">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  {getCategoryIcon(topAction.category)}
                </div>
                <Badge className={getPriorityColor(topAction.priority)}>
                  {topAction.priority === 'high' ? 'Recommended' : 'Suggested'}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setDismissed(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm font-medium mb-1">{topAction.label}</p>
            <p className="text-xs text-muted-foreground mb-3">{topAction.description}</p>
            {link ? (
              <Button size="sm" className="w-full" asChild>
                <Link to={link}>
                  Get Started
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="w-full" onClick={() => handleAction(topAction)}>
                Get Started
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Next Best Actions</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {actions.map((action, index) => {
            const link = getActionLink(action);
            const isTopAction = index === 0;
            
            const content = (
              <div
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                  isTopAction ? 'bg-gradient-to-r from-primary/5 to-transparent border-primary/30' : 'border-border'
                }`}
                onClick={() => !link && handleAction(action)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isTopAction ? 'bg-primary/10' : 'bg-muted'}`}>
                    {getCategoryIcon(action.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{action.label}</p>
                      {isTopAction && (
                        <Badge className="text-xs py-0 px-1.5 bg-primary/10 text-primary">
                          Top Pick
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            );
            
            return link ? (
              <Link key={action.action} to={link}>
                {content}
              </Link>
            ) : (
              <div key={action.action}>{content}</div>
            );
          })}
        </div>
        
        {/* Confidence indicator for power users */}
        {extendedProfile.skillLevel === 'advanced' || extendedProfile.skillLevel === 'expert' ? (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Based on your {extendedProfile.industry.replace('_', ' ')} profile · {Math.round(actions[0]?.confidence * 100)}% match
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};
