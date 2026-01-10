import React from 'react';
import { motion } from 'framer-motion';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, TrendingUp, Zap, Clock, Star, Flame } from 'lucide-react';
import type { WidgetType } from '@/types';

interface ConversionWidgetCardProps {
  widgetType: WidgetType;
  icon?: React.ReactNode;
  onSelect: (type: WidgetType) => void;
  isSelected?: boolean;
  className?: string;
}

export const ConversionWidgetCard: React.FC<ConversionWidgetCardProps> = ({
  widgetType,
  icon,
  onSelect,
  isSelected = false,
  className = '',
}) => {
  const { getWidgetConversion, conversionSignals, segment } = useConversionOptimization();
  const conversion = getWidgetConversion(widgetType);

  const getSocialProofIcon = () => {
    switch (conversion.socialProofType) {
      case 'activity': return <Flame className="w-3 h-3" />;
      case 'count': return <Users className="w-3 h-3" />;
      case 'rating': return <Star className="w-3 h-3" />;
      default: return <TrendingUp className="w-3 h-3" />;
    }
  };

  const getSocialProofText = () => {
    switch (conversion.socialProofType) {
      case 'activity': return 'Trending now';
      case 'count': return '10k+ created';
      case 'rating': return '4.9★ rated';
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300
          hover:shadow-elegant hover:border-primary/50
          ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border/50'}
          ${className}
        `}
        onClick={() => onSelect(widgetType)}
      >
        {/* Urgency indicator */}
        {conversion.urgencyEnabled && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        )}

        {/* Social proof badge */}
        {conversion.socialProofType !== 'none' && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 text-xs flex items-center gap-1"
          >
            {getSocialProofIcon()}
            {getSocialProofText()}
          </Badge>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{conversion.optimizedTitle}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {conversion.optimizedDescription}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Conversion booster */}
          <div className="flex items-center gap-1.5 text-xs text-primary mb-3">
            <Zap className="w-3 h-3" />
            <span className="truncate">{conversion.conversionBooster}</span>
          </div>

          {/* CTA */}
          <Button 
            size="sm" 
            variant={isSelected ? 'default' : 'outline'}
            className="w-full group"
          >
            {conversion.optimizedCTA}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConversionWidgetCard;
