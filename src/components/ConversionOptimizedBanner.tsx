import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Clock, Star } from 'lucide-react';

interface ConversionOptimizedBannerProps {
  context: 'hero' | 'widget' | 'cta' | 'popup';
  onAction?: () => void;
  className?: string;
  showSocialProof?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export const ConversionOptimizedBanner: React.FC<ConversionOptimizedBannerProps> = ({
  context,
  onAction,
  className = '',
  showSocialProof = true,
  variant = 'default',
}) => {
  const { 
    getConversionContent, 
    conversionSignals, 
    segment,
    isHighIntent 
  } = useConversionOptimization();

  const content = getConversionContent(context);

  const getIcon = () => {
    if (isHighIntent) return <Zap className="w-4 h-4" />;
    if (segment === 'power_user') return <Star className="w-4 h-4" />;
    if (segment === 'warm_lead') return <TrendingUp className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 text-sm ${className}`}
      >
        {conversionSignals.showSocialProof && showSocialProof && content.socialProof && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{content.socialProof}</span>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 ${className}`}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{content.benefit}</span>
        </div>
        {onAction && (
          <Button size="sm" variant="ghost" onClick={onAction} className="text-primary">
            {content.cta}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-primary/20 p-6 ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-4">
        {/* Urgency badge */}
        <AnimatePresence>
          {conversionSignals.isUrgent && content.urgencyMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <Badge variant="destructive" className="animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                {content.urgencyMessage}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{content.headline}</h3>
          <p className="text-muted-foreground">{content.subheadline}</p>
        </div>

        {/* Value proposition */}
        {conversionSignals.showBenefits && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
              {getIcon()}
            </div>
            <span className="text-primary font-medium">{content.valueProposition}</span>
          </div>
        )}

        {/* Social proof */}
        {showSocialProof && content.socialProof && conversionSignals.showSocialProof && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{content.socialProof}</span>
          </div>
        )}

        {/* CTA */}
        {onAction && (
          <Button 
            onClick={onAction} 
            className="mt-2 shadow-elegant"
            size={isHighIntent ? 'lg' : 'default'}
          >
            {content.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ConversionOptimizedBanner;
