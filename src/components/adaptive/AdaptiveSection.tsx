import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { cn } from '@/lib/utils';

interface AdaptiveSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'highlighted' | 'gradient' | 'muted';
  spacing?: 'compact' | 'default' | 'spacious';
  animate?: boolean;
}

export const AdaptiveSection: React.FC<AdaptiveSectionProps> = ({
  children,
  className,
  id,
  variant = 'default',
  spacing,
  animate = true,
}) => {
  const { config, classes, getSpacingClass } = useAdaptiveUI();

  // Determine spacing based on config or prop override
  const effectiveSpacing = spacing || config.layout.density;
  const spacingClasses = {
    compact: 'py-8 sm:py-12',
    comfortable: 'py-12 sm:py-16 md:py-20',
    spacious: 'py-16 sm:py-24 md:py-32',
    default: 'py-12 sm:py-16 md:py-20',
  };

  const variantClasses = {
    default: '',
    highlighted: 'bg-primary/5',
    gradient: 'bg-gradient-to-br from-background via-background to-primary/5',
    muted: 'bg-muted/30',
  };

  const shouldAnimate = animate && config.content.animationLevel !== 'none';

  const sectionClasses = cn(
    spacingClasses[effectiveSpacing],
    variantClasses[variant],
    classes.container,
    className
  );

  if (shouldAnimate) {
    return (
      <motion.section
        id={id}
        className={sectionClasses}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ 
          duration: config.content.animationLevel === 'subtle' ? 0.3 : 0.5,
          ease: 'easeOut'
        }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <section id={id} className={sectionClasses}>
      {children}
    </section>
  );
};
