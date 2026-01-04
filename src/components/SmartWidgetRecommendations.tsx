import React, { useMemo } from 'react';
import { useWidgetPersonalization, type WidgetRecommendation } from '@/hooks/useWidgetPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Target,
  Lightbulb,
  Crown
} from 'lucide-react';

interface SmartWidgetRecommendationsProps {
  onSelectWidget: (widgetType: string) => void;
  currentWidget?: string;
}

export const SmartWidgetRecommendations: React.FC<SmartWidgetRecommendationsProps> = ({
  onSelectWidget,
  currentWidget,
}) => {
  const { getRecommendations, userProfile, industryBenchmarks } = useWidgetPersonalization();
  const { behavior, segment } = usePersonalization();
  
  const recommendations = useMemo(() => getRecommendations(3), [getRecommendations]);
  
  // Don't show if user just arrived or has already generated many widgets
  const shouldShow = behavior.timeOnSite > 10 || behavior.widgetsGenerated > 0;
  
  if (!shouldShow) return null;
  
  const getPriorityIcon = (priority: WidgetRecommendation['priority']) => {
    switch (priority) {
      case 'high': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-primary" />;
      default: return <Lightbulb className="w-4 h-4 text-muted-foreground" />;
    }
  };
  
  const getPriorityBadge = (priority: WidgetRecommendation['priority']) => {
    switch (priority) {
      case 'high': 
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Top Pick</Badge>;
      case 'medium': 
        return <Badge variant="secondary">Recommended</Badge>;
      default: 
        return null;
    }
  };

  const getPersonalizedTitle = () => {
    if (segment === 'power_user') {
      return 'Optimizations for Your Stack';
    }
    if (userProfile.industry !== 'unknown') {
      return `Best for ${userProfile.industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    if (behavior.widgetsGenerated > 0) {
      return 'Based on Your Activity';
    }
    return 'Smart Recommendations';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{getPersonalizedTitle()}</h3>
        </div>
        {industryBenchmarks && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Target className="w-3 h-3" />
            {industryBenchmarks.avgConversion} avg conversion
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.type}
            className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
              currentWidget === rec.type ? 'border-primary ring-2 ring-primary/20' : ''
            } ${index === 0 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : ''}`}
            onClick={() => onSelectWidget(rec.type)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityIcon(rec.priority)}
                    <span className="font-medium text-foreground truncate">{rec.name}</span>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {rec.reason}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {rec.expectedImpact}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {rec.setupTime}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant={index === 0 ? 'default' : 'outline'}
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWidget(rec.type);
                  }}
                >
                  {index === 0 ? 'Create' : 'Select'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Experience level indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <Crown className="w-3 h-3" />
        <span>
          Showing {userProfile.experienceLevel === 'beginner' ? 'simple' : 
                   userProfile.experienceLevel === 'intermediate' ? 'balanced' : 'advanced'} widgets for your level
        </span>
      </div>
    </div>
  );
};
