import React, { useMemo, useEffect, useState } from 'react';
import { useWidgetPersonalization, type WidgetRecommendation } from '@/hooks/useWidgetPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Target,
  Lightbulb,
  Crown,
  Brain,
  Flame,
  BarChart3,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartWidgetRecommendationsProps {
  onSelectWidget: (widgetType: string) => void;
  currentWidget?: string;
}

export const SmartWidgetRecommendations: React.FC<SmartWidgetRecommendationsProps> = ({
  onSelectWidget,
  currentWidget,
}) => {
  const { getRecommendations, userProfile, industryBenchmarks, getTopOptimization } = useWidgetPersonalization();
  const { behavior, segment, intent, conversionProbability, trackWidgetInteraction } = usePersonalization();
  const { extendedProfile, uiPersonalization, getPersonalizedCopy } = useHyperPersonalization();
  
  const [showAffinityInsight, setShowAffinityInsight] = useState(false);
  
  // Get recommendations enhanced with affinity scores
  const recommendations = useMemo(() => {
    const baseRecs = getRecommendations(4);
    const affinities = behavior.widgetAffinities || {};
    
    // Enhance recommendations with affinity data
    return baseRecs.map(rec => {
      const affinity = affinities[rec.type] || 0;
      const isHighAffinity = affinity > 15;
      
      return {
        ...rec,
        affinity,
        isHighAffinity,
        boostedReason: isHighAffinity 
          ? `${rec.reason} • You've shown ${affinity > 30 ? 'strong' : 'consistent'} interest`
          : rec.reason,
      };
    });
  }, [getRecommendations, behavior.widgetAffinities]);

  // Top widget affinities for insight section
  const topAffinities = useMemo(() => {
    const affinities = behavior.widgetAffinities || {};
    return Object.entries(affinities)
      .filter(([, score]) => (score as number) > 5)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type, score]) => ({ type, score: score as number }));
  }, [behavior.widgetAffinities]);
  
  // Don't show if user just arrived or has already generated many widgets
  const shouldShow = behavior.timeOnSite > 8 || behavior.widgetsGenerated > 0;
  
  // Show affinity insight after some engagement
  useEffect(() => {
    if (topAffinities.length >= 2 && behavior.timeOnSite > 30) {
      setShowAffinityInsight(true);
    }
  }, [topAffinities, behavior.timeOnSite]);
  
  if (!shouldShow) return null;
  
  const getPriorityIcon = (priority: WidgetRecommendation['priority'], isHighAffinity?: boolean) => {
    if (isHighAffinity) return <Flame className="w-4 h-4 text-orange-500" />;
    switch (priority) {
      case 'high': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-primary" />;
      default: return <Lightbulb className="w-4 h-4 text-muted-foreground" />;
    }
  };
  
  const getPriorityBadge = (priority: WidgetRecommendation['priority'], affinity?: number) => {
    if (affinity && affinity > 20) {
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">Your Interest</Badge>;
    }
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
    const copy = getPersonalizedCopy();
    if (segment === 'power_user') {
      return 'Optimizations for Your Stack';
    }
    if (extendedProfile.role !== 'unknown') {
      return `Best for ${extendedProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}s`;
    }
    if (userProfile.industry !== 'unknown') {
      return `Best for ${userProfile.industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    if (behavior.widgetsGenerated > 0) {
      return 'Based on Your Activity';
    }
    return 'Smart Recommendations';
  };

  const handleWidgetSelect = (type: string) => {
    trackWidgetInteraction(type, 'click');
    onSelectWidget(type);
  };

  return (
    <div className="space-y-4">
      {/* Header with conversion potential */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{getPersonalizedTitle()}</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered based on your behavior
            </p>
          </div>
        </div>
        
        {/* Conversion potential indicator */}
        <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Potential</span>
          </div>
          <Progress value={conversionProbability * 100} className="w-16 h-1.5" />
          <span className="text-xs font-medium text-primary">
            {Math.round(conversionProbability * 100)}%
          </span>
        </div>
      </div>

      {/* Affinity Insight Banner */}
      {showAffinityInsight && topAffinities.length >= 2 && (
        <div className="p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Your Widget Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topAffinities.map(({ type, score }) => (
              <Badge 
                key={type}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleWidgetSelect(type)}
              >
                {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="ml-1 text-primary">{Math.round(score)}%</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Widget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.type}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
              currentWidget === rec.type && "border-primary ring-2 ring-primary/20",
              index === 0 && "sm:col-span-2 bg-gradient-to-r from-primary/5 to-accent/5",
              rec.isHighAffinity && "border-orange-200"
            )}
            onClick={() => handleWidgetSelect(rec.type)}
            onMouseEnter={() => trackWidgetInteraction(rec.type, 'hover')}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {getPriorityIcon(rec.priority, rec.isHighAffinity)}
                    <span className="font-medium text-foreground truncate">{rec.name}</span>
                    {getPriorityBadge(rec.priority, rec.affinity)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {rec.boostedReason}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs flex-wrap">
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {rec.expectedImpact}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {rec.setupTime}
                    </span>
                    {rec.affinity > 0 && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <Flame className="w-3 h-3" />
                        {Math.round(rec.affinity)}% interest
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant={index === 0 ? 'default' : 'outline'}
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWidgetSelect(rec.type);
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
      
      {/* Experience & Industry Context */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-2">
          <Crown className="w-3 h-3" />
          <span>
            Showing {userProfile.experienceLevel === 'beginner' ? 'simple' : 
                     userProfile.experienceLevel === 'intermediate' ? 'balanced' : 'advanced'} widgets
          </span>
        </div>
        {industryBenchmarks && (
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>Industry avg: {industryBenchmarks.avgConversion}</span>
          </div>
        )}
      </div>
    </div>
  );
};
