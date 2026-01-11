import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdaptiveBadgeProps extends BadgeProps {
  show?: boolean;
  icon?: React.ReactNode;
  pulse?: boolean;
  children: React.ReactNode;
}

export const AdaptiveBadge: React.FC<AdaptiveBadgeProps> = ({
  show,
  icon,
  pulse = false,
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const { config, shouldShowElement } = useAdaptiveUI();

  // Check if badges should be shown based on adaptive config
  const shouldShow = show ?? shouldShowElement('badge');
  
  if (!shouldShow) return null;

  const shouldAnimate = config.content.animationLevel !== 'none';
  const shouldPulse = pulse && config.colorScheme.intensity === 'vibrant';

  const badgeContent = (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1',
        shouldPulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Badge>
  );

  if (shouldAnimate) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {badgeContent}
      </motion.span>
    );
  }

  return badgeContent;
};

// Urgency badge variant
interface UrgencyBadgeProps {
  message: string;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ message, className }) => {
  const { shouldShowElement, config } = useAdaptiveUI();

  if (!shouldShowElement('urgency')) return null;

  return (
    <AdaptiveBadge
      variant="destructive"
      pulse={config.colorScheme.intensity === 'vibrant'}
      className={cn('bg-destructive/10 text-destructive border-destructive/20', className)}
    >
      {message}
    </AdaptiveBadge>
  );
};

// Social proof badge variant
interface SocialProofBadgeProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export const SocialProofBadge: React.FC<SocialProofBadgeProps> = ({ message, icon, className }) => {
  const { shouldShowElement } = useAdaptiveUI();

  if (!shouldShowElement('socialProof')) return null;

  return (
    <AdaptiveBadge
      variant="secondary"
      icon={icon}
      className={cn('bg-primary/10 text-primary border-primary/20', className)}
    >
      {message}
    </AdaptiveBadge>
  );
};
