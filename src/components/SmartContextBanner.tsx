import React from 'react';
import { useWidgetPersonalization } from '@/hooks/useWidgetPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Briefcase, 
  ShoppingCart, 
  Globe, 
  Target,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';

interface SmartContextBannerProps {
  compact?: boolean;
}

export const SmartContextBanner: React.FC<SmartContextBannerProps> = ({ compact = false }) => {
  const { userProfile, industryBenchmarks } = useWidgetPersonalization();
  const { behavior, segment } = usePersonalization();
  
  // Don't show for brand new visitors
  if (behavior.timeOnSite < 15 && behavior.widgetsGenerated === 0) {
    return null;
  }
  
  const getIndustryIcon = () => {
    switch (userProfile.industry) {
      case 'ecommerce': return <ShoppingCart className="w-3 h-3" />;
      case 'saas': return <Globe className="w-3 h-3" />;
      case 'local_business': return <Building2 className="w-3 h-3" />;
      case 'content': return <Briefcase className="w-3 h-3" />;
      case 'professional_services': return <Target className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };
  
  const getDeviceIcon = () => {
    return userProfile.devicePriority === 'mobile_first' 
      ? <Smartphone className="w-3 h-3" /> 
      : <Monitor className="w-3 h-3" />;
  };
  
  const formatIndustry = (industry: string) => {
    return industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const formatGoal = (goal: string) => {
    return goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {userProfile.industry !== 'unknown' && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5">
            {getIndustryIcon()}
            {formatIndustry(userProfile.industry)}
          </Badge>
        )}
        {userProfile.primaryGoal !== 'unknown' && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs py-0.5">
            <Target className="w-3 h-3" />
            {formatGoal(userProfile.primaryGoal)}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
      <span className="text-xs text-muted-foreground mr-1">Optimizing for:</span>
      
      {userProfile.industry !== 'unknown' && (
        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          {getIndustryIcon()}
          {formatIndustry(userProfile.industry)}
        </Badge>
      )}
      
      {userProfile.primaryGoal !== 'unknown' && (
        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          <Target className="w-3 h-3" />
          {formatGoal(userProfile.primaryGoal)}
        </Badge>
      )}
      
      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
        {getDeviceIcon()}
        {userProfile.devicePriority === 'mobile_first' ? 'Mobile' : 'Desktop'}
      </Badge>
      
      {segment === 'power_user' && (
        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
          <Sparkles className="w-3 h-3 mr-1" />
          Power User
        </Badge>
      )}
      
      {industryBenchmarks && (
        <span className="text-xs text-muted-foreground ml-auto">
          {industryBenchmarks.avgConversion} avg conversion
        </span>
      )}
    </div>
  );
};
