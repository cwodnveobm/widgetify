import React from 'react';
import { motion } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { cn } from '@/lib/utils';

interface AdaptiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  stagger?: boolean;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  className,
  columns = 'auto',
  gap = 'md',
  animate = true,
  stagger = true,
}) => {
  const { config, classes, getSpacingClass } = useAdaptiveUI();

  // Determine columns based on config or prop
  const effectiveCols = columns === 'auto' ? config.layout.gridColumns : columns;
  
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  const gridClasses = cn(
    'grid',
    colClasses[effectiveCols as keyof typeof colClasses] || classes.grid,
    gapClasses[gap],
    className
  );

  const shouldAnimate = animate && config.content.animationLevel !== 'none';

  if (shouldAnimate && stagger) {
    return (
      <motion.div
        className={gridClasses}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: config.content.animationLevel === 'subtle' ? 0.05 : 0.1,
            },
          },
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: config.content.animationLevel === 'subtle' ? 0.2 : 0.4,
                  ease: 'easeOut'
                }
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return <div className={gridClasses}>{children}</div>;
};
