import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { cn } from '@/lib/utils';

interface AdaptiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'highlighted';
  animate?: boolean;
  onClick?: () => void;
}

export const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  className,
  variant = 'default',
  animate = true,
  onClick,
}) => {
  const { config, classes, getAnimationClass } = useAdaptiveUI();

  const baseClasses = cn(
    'rounded-lg border',
    config.content.animationLevel !== 'none' && 'transition-all duration-200',
    onClick && 'cursor-pointer',
    className
  );

  const variantClasses = {
    default: classes.card,
    elevated: cn(classes.card, 'shadow-lg hover:shadow-xl'),
    interactive: cn(classes.card, 'hover:border-primary/50 hover:shadow-md active:scale-[0.99]'),
    highlighted: cn(classes.card, 'border-primary/30 bg-primary/5 hover:bg-primary/10'),
  };

  if (animate && config.content.animationLevel !== 'none') {
    return (
      <motion.div
        className={cn(baseClasses, variantClasses[variant])}
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: config.content.animationLevel === 'subtle' ? 0.2 : 0.3,
          ease: 'easeOut' as const
        }}
        whileHover={config.interactions.hoverEffects ? { scale: 1.01 } : undefined}
        whileTap={onClick ? { scale: 0.99 } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant])} onClick={onClick}>
      {children}
    </div>
  );
};
