import React from 'react';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

interface AdaptiveEmptyStateProps {
  type: 'widgets' | 'analytics' | 'ab_tests' | 'custom_widgets';
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export const AdaptiveEmptyState: React.FC<AdaptiveEmptyStateProps> = ({
  type,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const { 
    extendedProfile, 
    uiPersonalization, 
    getPersonalizedCopy,
    getPrioritizedWidgets,
  } = useHyperPersonalization();
  
  const copy = getPersonalizedCopy();
  const prioritizedWidgets = getPrioritizedWidgets();
  const showEmojis = uiPersonalization.showEmojis;

  const getContent = () => {
    switch (type) {
      case 'widgets':
        return {
          icon: Sparkles,
          title: copy.emptyStateTitle,
          message: copy.emptyStateMessage,
          primaryCTA: copy.emptyStateCTA,
          secondaryCTA: 'See Templates',
          showRecommendations: true,
        };
      
      case 'analytics':
        if (extendedProfile.skillLevel === 'beginner') {
          return {
            icon: TrendingUp,
            title: `${showEmojis ? '📊 ' : ''}Analytics Await Your First Widget`,
            message: 'Create a widget and we\'ll track how well it performs for your visitors.',
            primaryCTA: 'Create Your First Widget',
            secondaryCTA: 'Learn About Analytics',
            showRecommendations: false,
          };
        }
        return {
          icon: TrendingUp,
          title: 'No Analytics Data Yet',
          message: 'Deploy widgets to start collecting performance metrics.',
          primaryCTA: 'Create Widget',
          secondaryCTA: 'View Documentation',
          showRecommendations: false,
        };
      
      case 'ab_tests':
        if (extendedProfile.skillLevel === 'beginner') {
          return {
            icon: Target,
            title: `${showEmojis ? '🧪 ' : ''}A/B Testing Made Simple`,
            message: 'Test different versions of your widgets to see which works best. Start with a widget first!',
            primaryCTA: 'Create Widget First',
            secondaryCTA: 'What is A/B Testing?',
            showRecommendations: false,
          };
        }
        return {
          icon: Target,
          title: 'No Active Tests',
          message: 'Create an A/B test to optimize your widget performance.',
          primaryCTA: 'Create Test',
          secondaryCTA: 'View Guide',
          showRecommendations: false,
        };
      
      case 'custom_widgets':
        return {
          icon: Zap,
          title: extendedProfile.skillLevel === 'beginner' 
            ? `${showEmojis ? '🎨 ' : ''}Build Something Unique`
            : 'Custom Widgets',
          message: extendedProfile.skillLevel === 'beginner'
            ? 'Start from scratch and create exactly what you need.'
            : 'Create custom widgets with full control over design and behavior.',
          primaryCTA: 'Start Building',
          secondaryCTA: 'Use Template',
          showRecommendations: false,
        };
      
      default:
        return {
          icon: Sparkles,
          title: 'Nothing Here Yet',
          message: 'Get started by creating something new.',
          primaryCTA: 'Create',
          secondaryCTA: 'Browse',
          showRecommendations: false,
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{content.message}</p>
        
        {/* Skill-level adapted recommendations */}
        {content.showRecommendations && prioritizedWidgets.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {prioritizedWidgets.slice(0, 4).map((widget, index) => (
              <Badge 
                key={widget} 
                variant={index === 0 ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => onPrimaryAction?.()}
              >
                {widget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                {index === 0 && <Zap className="w-3 h-3 ml-1" />}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onPrimaryAction}>
            {content.primaryCTA}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {content.secondaryCTA}
            </Button>
          )}
        </div>
        
        {/* Encouragement for beginners */}
        {extendedProfile.skillLevel === 'beginner' && copy.encouragementMessage && (
          <p className="text-sm text-muted-foreground mt-6 max-w-sm">
            {copy.encouragementMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
