import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useWidgetPersonalization } from '@/hooks/useWidgetPersonalization';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Zap,
  TrendingUp,
  Brain,
  Target,
  Flame,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WidgetType } from '@/types';

interface SmartAutoSuggestionsProps {
  onSelectWidget: (widgetType: WidgetType) => void;
  currentWidget?: string;
  className?: string;
}

interface AffinityWidget {
  type: WidgetType;
  name: string;
  affinity: number;
  trend: 'rising' | 'stable' | 'new';
  reason: string;
  conversionBoost: string;
}

const WIDGET_NAMES: Record<string, string> = {
  'whatsapp': 'WhatsApp Chat',
  'lead-capture-popup': 'Lead Capture',
  'exit-intent-popup': 'Exit Intent',
  'flash-sale-banner': 'Flash Sale',
  'ai-chatbot': 'AI Chatbot',
  'newsletter-signup': 'Newsletter',
  'call-now': 'Call Now',
  'booking-calendar': 'Booking',
  'social-share': 'Social Share',
  'countdown-timer': 'Countdown',
  'live-visitor-counter': 'Visitor Counter',
  'sticky-banner': 'Sticky Banner',
  'whatsapp-form': 'WhatsApp Form',
  'google-reviews': 'Reviews',
  'feedback-form': 'Feedback',
  'payment': 'Payment',
};

export const SmartAutoSuggestions: React.FC<SmartAutoSuggestionsProps> = ({
  onSelectWidget,
  currentWidget,
  className,
}) => {
  const { behavior, segment, intent, conversionProbability, trackWidgetInteraction } = usePersonalization();
  const { getRecommendations, userProfile, industryBenchmarks } = useWidgetPersonalization();
  const { extendedProfile, uiPersonalization, getPrioritizedWidgets } = useHyperPersonalization();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasSeenSuggestion, setHasSeenSuggestion] = useState(false);

  // Calculate affinity-based suggestions
  const affinityWidgets = useMemo((): AffinityWidget[] => {
    const affinities = behavior.widgetAffinities || {};
    const prioritizedWidgets = getPrioritizedWidgets();
    const recommendations = getRecommendations(5);
    
    // Combine affinity scores with recommendations
    const widgetScores: Record<string, { score: number; source: string }> = {};
    
    // Add affinity scores
    Object.entries(affinities).forEach(([widget, score]) => {
      widgetScores[widget] = { 
        score: score as number, 
        source: 'affinity' 
      };
    });
    
    // Boost with prioritized widgets
    prioritizedWidgets.forEach((widget, index) => {
      const boost = (prioritizedWidgets.length - index) * 5;
      if (widgetScores[widget]) {
        widgetScores[widget].score += boost;
      } else {
        widgetScores[widget] = { score: boost + 10, source: 'recommended' };
      }
    });
    
    // Add recommendations
    recommendations.forEach((rec, index) => {
      const boost = (5 - index) * 8;
      if (widgetScores[rec.type]) {
        widgetScores[rec.type].score += boost;
      } else {
        widgetScores[rec.type] = { score: boost + 15, source: 'ai' };
      }
    });
    
    // Sort and create affinity widgets
    return Object.entries(widgetScores)
      .filter(([type]) => type !== currentWidget)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 4)
      .map(([type, { score, source }]) => {
        const affinity = affinities[type] || 0;
        const trend: AffinityWidget['trend'] = 
          affinity > 10 ? 'rising' : 
          affinity > 0 ? 'stable' : 'new';
        
        let reason = '';
        if (source === 'affinity') {
          reason = `Based on your ${affinity > 20 ? 'strong' : ''} interest`;
        } else if (source === 'recommended') {
          reason = `Perfect for ${userProfile.industry !== 'unknown' ? userProfile.industry.replace('_', ' ') : 'your site'}`;
        } else {
          reason = `AI-recommended for ${extendedProfile.role}s`;
        }
        
        const conversionBoost = `+${Math.round(15 + score * 0.3)}%`;
        
        return {
          type: type as WidgetType,
          name: WIDGET_NAMES[type] || type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          affinity: Math.min(100, score),
          trend,
          reason,
          conversionBoost,
        };
      });
  }, [behavior.widgetAffinities, currentWidget, getRecommendations, getPrioritizedWidgets, userProfile, extendedProfile]);

  // Show suggestions based on behavior triggers
  const shouldShowSuggestions = useMemo(() => {
    if (isDismissed) return false;
    if (behavior.timeOnSite < 5) return false;
    
    // Show if user has been idle
    const idleTime = (Date.now() - behavior.lastActiveTime) / 1000;
    if (idleTime > 10 && !hasSeenSuggestion) return true;
    
    // Show for new visitors after exploring
    if (segment === 'cold_visitor' && behavior.scrollDepth > 30) return true;
    
    // Show for warm leads
    if (segment === 'warm_lead' && behavior.widgetsGenerated < 2) return true;
    
    // Always show for exploring intent
    if (intent.type === 'exploring') return true;
    
    return affinityWidgets.length > 0 && behavior.timeOnSite > 15;
  }, [isDismissed, behavior, segment, intent, hasSeenSuggestion, affinityWidgets]);

  useEffect(() => {
    if (shouldShowSuggestions && !hasSeenSuggestion) {
      setHasSeenSuggestion(true);
    }
  }, [shouldShowSuggestions, hasSeenSuggestion]);

  const handleSelectWidget = (widget: AffinityWidget) => {
    trackWidgetInteraction(widget.type, 'click');
    onSelectWidget(widget.type);
    setIsExpanded(false);
  };

  const getTrendIcon = (trend: AffinityWidget['trend']) => {
    switch (trend) {
      case 'rising': return <Flame className="w-3 h-3 text-orange-500" />;
      case 'stable': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'new': return <Sparkles className="w-3 h-3 text-primary" />;
    }
  };

  if (!shouldShowSuggestions || affinityWidgets.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          "fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6",
          className
        )}
      >
        <Card className={cn(
          "border-primary/20 shadow-xl bg-background/95 backdrop-blur-sm",
          "transition-all duration-300",
          isExpanded ? "w-80 md:w-96" : "w-auto"
        )}>
          <CardContent className="p-0">
            {/* Collapsed State */}
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
                onClick={() => setIsExpanded(true)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {affinityWidgets.length}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Smart Suggestions</p>
                  <p className="text-xs text-muted-foreground">Based on your activity</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto hidden md:block" />
              </motion.div>
            )}

            {/* Expanded State */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">For You</h4>
                      <p className="text-xs text-muted-foreground">AI-powered picks</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Conversion Probability Bar */}
                <div className="mb-4 p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Your conversion potential
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {Math.round(conversionProbability * 100)}%
                    </span>
                  </div>
                  <Progress value={conversionProbability * 100} className="h-1.5" />
                </div>

                {/* Widget Suggestions */}
                <div className="space-y-2">
                  {affinityWidgets.map((widget, index) => (
                    <motion.div
                      key={widget.type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        index === 0 && "bg-gradient-to-r from-primary/10 to-transparent border-primary/30"
                      )}
                      onClick={() => handleSelectWidget(widget)}
                      onMouseEnter={() => trackWidgetInteraction(widget.type, 'hover')}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getTrendIcon(widget.trend)}
                            <span className="text-sm font-medium text-foreground truncate">
                              {widget.name}
                            </span>
                            {index === 0 && (
                              <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {widget.reason}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge 
                            variant="outline" 
                            className="text-[10px] text-green-600 border-green-200 bg-green-50"
                          >
                            {widget.conversionBoost}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              {Math.round(widget.affinity)}% match
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Powered by your behavior
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsDismissed(true)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartAutoSuggestions;
