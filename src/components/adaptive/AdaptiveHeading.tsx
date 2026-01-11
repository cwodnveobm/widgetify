import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AdaptiveHeadingProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  className?: string;
  gradient?: boolean;
  animate?: boolean;
  emoji?: string;
}

export const AdaptiveHeading: React.FC<AdaptiveHeadingProps> = ({
  children,
  as = 'h2',
  className,
  gradient = false,
  animate = true,
  emoji,
}) => {
  const { config, classes, shouldShowElement } = useAdaptiveUI();

  const Tag = as;

  // Heading size based on adaptive config and element level
  const levelSizeMap: Record<HeadingLevel, string> = {
    h1: config.typography.headingSize === 'xl' 
      ? 'text-4xl sm:text-5xl md:text-6xl font-bold' 
      : 'text-3xl sm:text-4xl md:text-5xl font-bold',
    h2: classes.heading,
    h3: 'text-xl sm:text-2xl font-semibold',
    h4: 'text-lg sm:text-xl font-semibold',
    h5: 'text-base sm:text-lg font-medium',
    h6: 'text-sm sm:text-base font-medium',
  };

  const headingClasses = cn(
    levelSizeMap[as],
    gradient && 'brand-gradient-text',
    className
  );

  const showEmoji = shouldShowElement('emoji') && emoji;
  const content = showEmoji ? `${emoji} ${children}` : children;

  const shouldAnimate = animate && config.content.animationLevel !== 'none';

  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: config.content.animationLevel === 'subtle' ? 0.2 : 0.4,
          ease: 'easeOut'
        }}
      >
        <Tag className={headingClasses}>{content}</Tag>
      </motion.div>
    );
  }

  return <Tag className={headingClasses}>{content}</Tag>;
};

// Subheading component
interface AdaptiveSubheadingProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const AdaptiveSubheading: React.FC<AdaptiveSubheadingProps> = ({
  children,
  className,
  animate = true,
}) => {
  const { config, classes } = useAdaptiveUI();

  const shouldAnimate = animate && config.content.animationLevel !== 'none';

  const subheadingClasses = cn(
    classes.subheading,
    'max-w-2xl',
    className
  );

  if (shouldAnimate) {
    return (
      <motion.p
        className={subheadingClasses}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: config.content.animationLevel === 'subtle' ? 0.2 : 0.4,
          delay: 0.1,
          ease: 'easeOut'
        }}
      >
        {children}
      </motion.p>
    );
  }

  return <p className={subheadingClasses}>{children}</p>;
};
