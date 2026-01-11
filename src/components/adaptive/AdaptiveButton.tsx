import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdaptiveButtonProps extends Omit<ButtonProps, 'variant'> {
  adaptiveVariant?: 'primary' | 'secondary' | 'cta' | 'subtle';
  showGlow?: boolean;
  children: React.ReactNode;
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  adaptiveVariant = 'primary',
  showGlow,
  className,
  children,
  ...props
}) => {
  const { config, classes, isVibrantMode, getButtonVariant } = useAdaptiveUI();

  const shouldGlow = showGlow ?? (getButtonVariant() === 'glow' && adaptiveVariant === 'cta');
  
  // Size mapping based on adaptive config
  const sizeMap = {
    sm: 'sm' as const,
    default: 'default' as const,
    lg: 'lg' as const,
  };
  const adaptiveSize = sizeMap[config.components.buttonSize];

  // Generate variant-specific classes
  const variantClasses = {
    primary: classes.buttonPrimary,
    secondary: classes.buttonSecondary,
    cta: cn(
      classes.buttonPrimary,
      shouldGlow && 'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40',
      isVibrantMode && 'animate-pulse-subtle'
    ),
    subtle: 'bg-transparent hover:bg-muted text-foreground',
  };

  // Animation based on config
  const shouldAnimate = config.content.animationLevel !== 'none';
  
  const buttonContent = (
    <Button
      size={adaptiveSize}
      className={cn(
        variantClasses[adaptiveVariant],
        config.content.animationLevel !== 'none' && 'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );

  if (shouldAnimate && config.interactions.microAnimations) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
};
