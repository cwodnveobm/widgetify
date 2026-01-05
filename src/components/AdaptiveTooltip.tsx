import React from 'react';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface AdaptiveTooltipProps {
  tooltipId: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  fallbackTitle?: string;
  fallbackContent?: string;
}

export const AdaptiveTooltip: React.FC<AdaptiveTooltipProps> = ({
  tooltipId,
  children,
  side = 'top',
  showIcon = false,
  fallbackTitle,
  fallbackContent,
}) => {
  const { getTooltipContent, uiPersonalization } = useHyperPersonalization();
  
  const content = getTooltipContent(tooltipId);
  
  // Use fallback if no personalized content and fallbacks provided
  const title = content?.title || fallbackTitle;
  const description = content?.content || fallbackContent;
  
  // Don't show tooltip if no content and tooltips are disabled
  if (!title && !description) {
    return <>{children}</>;
  }
  
  // For advanced users, use minimal tooltips unless explicitly requested
  if (!uiPersonalization.showTooltips && !showIcon) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {children}
          {showIcon && (
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {title && <p className="font-medium text-sm mb-1">{title}</p>}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </TooltipContent>
    </Tooltip>
  );
};

// Simple wrapper for labels that need tooltips
interface AdaptiveLabelProps {
  htmlFor?: string;
  tooltipId: string;
  children: React.ReactNode;
  className?: string;
}

export const AdaptiveLabel: React.FC<AdaptiveLabelProps> = ({
  htmlFor,
  tooltipId,
  children,
  className = '',
}) => {
  const { getTooltipContent, uiPersonalization } = useHyperPersonalization();
  const content = getTooltipContent(tooltipId);
  
  if (!content || !uiPersonalization.showTooltips) {
    return (
      <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
        {children}
      </label>
    );
  }

  return (
    <AdaptiveTooltip tooltipId={tooltipId} showIcon>
      <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
        {children}
      </label>
    </AdaptiveTooltip>
  );
};
