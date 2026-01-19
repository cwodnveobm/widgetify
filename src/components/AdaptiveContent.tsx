import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealTimeBehavior } from '@/hooks/useRealTimeBehavior';
import { cn } from '@/lib/utils';

// Trust signals that adapt to user's skepticism level
export const AdaptiveTrustSignals = () => {
  const { psychologicalProfile, shouldShow } = useRealTimeBehavior();
  
  if (!shouldShow('trust_badges')) return null;
  
  const { trustLevel, personalityType } = psychologicalProfile;
  
  // More trust signals for lower trust levels
  const signalCount = trustLevel < 30 ? 4 : trustLevel < 60 ? 3 : 2;
  
  const signals = [
    { icon: Shield, text: 'SSL Secured', priority: 1 },
    { icon: Users, text: '50,000+ Users', priority: 2 },
    { icon: Star, text: '4.9/5 Rating', priority: 3 },
    { icon: CheckCircle, text: 'No Credit Card', priority: personalityType === 'skeptical' ? 0 : 4 },
    { icon: Clock, text: 'Instant Setup', priority: personalityType === 'impulsive' ? 0 : 5 },
  ]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, signalCount);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      {signals.map((signal, i) => (
        <motion.div
          key={signal.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <signal.icon className="w-4 h-4 text-primary" />
          <span>{signal.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Social proof that adapts to personality
export const AdaptiveSocialProof = () => {
  const { psychologicalProfile, shouldShow, sessionData } = useRealTimeBehavior();
  
  if (!shouldShow('social_proof')) return null;
  
  const { personalityType, intentIntensity } = psychologicalProfile;
  
  // Different messages based on personality
  const message = useMemo(() => {
    if (sessionData.returnCount > 0) {
      return "Welcome back! You're one of our power users";
    }
    
    switch (personalityType) {
      case 'hesitant':
        return "Join 50,000+ businesses who made the same decision";
      case 'skeptical':
        return "Rated 4.9/5 by verified users on Trustpilot";
      case 'analytical':
        return "Average 35% increase in conversions reported";
      case 'impulsive':
        return "🔥 247 widgets created in the last hour";
      case 'confident':
        return "Used by leading companies worldwide";
      default:
        return "Trusted by thousands of businesses";
    }
  }, [personalityType, sessionData.returnCount]);
  
  // Show activity-based proof for high intent
  const showActivity = intentIntensity === 'ready' || intentIntensity === 'comparing';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{message}</span>
      </div>
      
      {showActivity && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>12 people creating widgets right now</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Adaptive CTA that changes based on user state
interface AdaptiveCTAProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const AdaptiveCTA: React.FC<AdaptiveCTAProps> = ({ 
  children, 
  className, 
  onClick,
  variant = 'primary'
}) => {
  const { contentAdaptation, getPersonalizedMessage } = useRealTimeBehavior();
  
  const ctaText = children || contentAdaptation.ctaText || getPersonalizedMessage('cta');
  
  const styles = useMemo(() => {
    switch (contentAdaptation.ctaStyle) {
      case 'aggressive':
        return {
          button: 'bg-gradient-to-r from-primary via-primary to-purple-600 hover:scale-105 shadow-lg shadow-primary/25',
          text: 'font-bold text-lg',
          animation: true,
        };
      case 'soft':
        return {
          button: 'bg-secondary hover:bg-secondary/80',
          text: 'font-medium',
          animation: false,
        };
      default:
        return {
          button: 'bg-primary hover:bg-primary/90',
          text: 'font-semibold',
          animation: false,
        };
    }
  }, [contentAdaptation.ctaStyle]);
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={styles.animation ? { scale: 1.05 } : undefined}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-6 py-3 rounded-xl text-primary-foreground transition-all duration-300",
        styles.button,
        styles.text,
        className
      )}
    >
      {styles.animation && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-white/20"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {ctaText}
        {contentAdaptation.showUrgency && (
          <Zap className="w-4 h-4 animate-pulse" />
        )}
      </span>
    </motion.button>
  );
};

// Urgency indicator that appears for high-intent users
export const AdaptiveUrgency = () => {
  const { contentAdaptation, psychologicalProfile } = useRealTimeBehavior();
  
  if (!contentAdaptation.showUrgency) return null;
  
  const messages = [
    { text: "Limited time offer", icon: Clock },
    { text: "Trending now", icon: TrendingUp },
    { text: "Premium features unlocked", icon: Star },
  ];
  
  // Pick message based on intent
  const messageIndex = psychologicalProfile.intentIntensity === 'ready' ? 2 : 
                       psychologicalProfile.personalityType === 'impulsive' ? 0 : 1;
  const { text, icon: Icon } = messages[messageIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex"
    >
      <Badge 
        variant="secondary" 
        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
      >
        <Icon className="w-3 h-3 mr-1" />
        {text}
      </Badge>
    </motion.div>
  );
};

// Personalized badge based on user segment
export const AdaptiveUserBadge = () => {
  const { psychologicalProfile, sessionData } = useRealTimeBehavior();
  
  const badge = useMemo(() => {
    if (sessionData.returnCount > 2) {
      return { text: 'VIP Member', variant: 'premium' as const };
    }
    if (sessionData.returnCount > 0) {
      return { text: 'Welcome Back', variant: 'success' as const };
    }
    if (psychologicalProfile.purchaseReadiness > 70) {
      return { text: 'Ready to Create', variant: 'default' as const };
    }
    return null;
  }, [sessionData.returnCount, psychologicalProfile.purchaseReadiness]);
  
  if (!badge) return null;
  
  const variantStyles = {
    premium: 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-primary/30',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    default: 'bg-primary/10 text-primary border-primary/30',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Badge className={cn("border", variantStyles[badge.variant])}>
        ✨ {badge.text}
      </Badge>
    </motion.div>
  );
};

export default {
  AdaptiveTrustSignals,
  AdaptiveSocialProof,
  AdaptiveCTA,
  AdaptiveUrgency,
  AdaptiveUserBadge,
};
