import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AdaptiveProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'gradient' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const AdaptiveProgress: React.FC<AdaptiveProgressProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  label,
  variant = 'default',
  size = 'md',
  animate = true,
}) => {
  const { config, shouldShowElement } = useAdaptiveUI();

  // Check if progress should be shown based on adaptive config
  if (!shouldShowElement('progress')) return null;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const shouldAnimate = animate && config.content.animationLevel !== 'none';

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: '',
    gradient: '[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent',
    success: '[&>div]:bg-green-500',
    warning: '[&>div]:bg-amber-500',
  };

  const progressBar = (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label || 'Progress'}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <Progress
        value={shouldAnimate ? 0 : percentage}
        className={cn(sizeClasses[size], variantClasses[variant])}
      />
    </div>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn('space-y-1', className)}>
          {showLabel && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{label || 'Progress'}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.round(percentage)}%
              </motion.span>
            </div>
          )}
          <div className={cn('relative w-full overflow-hidden rounded-full bg-secondary', sizeClasses[size])}>
            <motion.div
              className={cn(
                'h-full rounded-full bg-primary',
                variant === 'gradient' && 'bg-gradient-to-r from-primary to-accent',
                variant === 'success' && 'bg-green-500',
                variant === 'warning' && 'bg-amber-500'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ 
                duration: config.content.animationLevel === 'subtle' ? 0.5 : 1,
                ease: 'easeOut',
                delay: 0.2
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return progressBar;
};

// Conversion probability indicator
interface ConversionIndicatorProps {
  probability: number;
  className?: string;
}

export const ConversionIndicator: React.FC<ConversionIndicatorProps> = ({
  probability,
  className,
}) => {
  const { shouldShowElement, config } = useAdaptiveUI();

  if (!shouldShowElement('progress') || config.layout.density === 'compact') return null;

  const getVariant = () => {
    if (probability >= 0.6) return 'success';
    if (probability >= 0.3) return 'gradient';
    return 'default';
  };

  const getLabel = () => {
    if (probability >= 0.6) return 'High conversion potential';
    if (probability >= 0.3) return 'Good engagement';
    return 'Building interest';
  };

  return (
    <AdaptiveProgress
      value={probability * 100}
      label={getLabel()}
      showLabel
      variant={getVariant()}
      size="sm"
      className={className}
    />
  );
};
