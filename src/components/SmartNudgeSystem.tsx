import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, Zap, Shield, Users, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealTimeBehavior } from '@/hooks/useRealTimeBehavior';
import { cn } from '@/lib/utils';

interface Nudge {
  id: string;
  type: 'tooltip' | 'banner' | 'slide_in' | 'highlight';
  message: string;
  subMessage?: string;
  cta?: string;
  ctaAction?: () => void;
  icon?: 'sparkles' | 'message' | 'zap' | 'shield' | 'users' | 'heart';
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'success' | 'warning' | 'premium';
  dismissable?: boolean;
  autoHide?: number;
}

const iconMap = {
  sparkles: Sparkles,
  message: MessageCircle,
  zap: Zap,
  shield: Shield,
  users: Users,
  heart: Heart,
};

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-emerald-500/10 border-emerald-500/30',
  warning: 'bg-amber-500/10 border-amber-500/30',
  premium: 'bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30',
};

export const SmartNudgeSystem = () => {
  const { psychologicalProfile, contentAdaptation, sessionData, hesitationPatterns } = useRealTimeBehavior();
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [shownNudgeIds, setShownNudgeIds] = useState<Set<string>>(new Set());
  const [dismissedNudgeIds, setDismissedNudgeIds] = useState<Set<string>>(new Set());

  // Generate nudges based on behavior
  const generateNudges = useCallback(() => {
    const { personalityType, frustrationLevel, intentIntensity, trustLevel, purchaseReadiness } = psychologicalProfile;
    const newNudges: Nudge[] = [];
    
    // Frustration-based nudge
    if (frustrationLevel > 50 && !shownNudgeIds.has('frustration')) {
      newNudges.push({
        id: 'frustration',
        type: 'slide_in',
        message: personalityType === 'hesitant' 
          ? "We're here to help! 💜" 
          : "Need a hand? Our team is ready!",
        subMessage: "Get instant support or browse our FAQ",
        cta: "Get Help",
        icon: 'message',
        variant: 'default',
        dismissable: true,
      });
    }
    
    // Hesitation-based nudge
    if (hesitationPatterns.length > 0 && hesitationPatterns.some(h => h.intensity !== 'mild') && !shownNudgeIds.has('hesitation')) {
      const message = personalityType === 'analytical'
        ? "Compare all our widget features side-by-side"
        : personalityType === 'skeptical'
        ? "See what 50,000+ businesses say about us"
        : "Not sure where to start? We'll guide you!";
      
      newNudges.push({
        id: 'hesitation',
        type: 'slide_in',
        message,
        cta: personalityType === 'analytical' ? "View Comparison" : "Show Me",
        icon: personalityType === 'skeptical' ? 'users' : 'sparkles',
        variant: 'success',
        dismissable: true,
      });
    }
    
    // High intent nudge
    if (intentIntensity === 'ready' && purchaseReadiness > 60 && !shownNudgeIds.has('high_intent')) {
      newNudges.push({
        id: 'high_intent',
        type: 'banner',
        message: "You're ready! Create your first widget now",
        subMessage: "Join thousands who started their conversion journey today",
        cta: "Create Widget →",
        icon: 'zap',
        variant: 'premium',
        dismissable: true,
      });
    }
    
    // Trust building for skeptical users
    if (trustLevel < 40 && personalityType === 'skeptical' && !shownNudgeIds.has('trust')) {
      newNudges.push({
        id: 'trust',
        type: 'slide_in',
        message: "100% free. No credit card required.",
        subMessage: "Used by 50,000+ businesses • 4.9/5 rating",
        icon: 'shield',
        variant: 'success',
        dismissable: true,
        autoHide: 8000,
      });
    }
    
    // Returning user exclusive
    if (sessionData.returnCount > 0 && !shownNudgeIds.has('returning')) {
      newNudges.push({
        id: 'returning',
        type: 'banner',
        message: `Welcome back! You've earned exclusive access`,
        subMessage: "Premium templates unlocked for returning visitors",
        cta: "View Exclusives",
        icon: 'heart',
        variant: 'premium',
        dismissable: true,
      });
    }
    
    // Filter out dismissed nudges
    const filtered = newNudges.filter(n => !dismissedNudgeIds.has(n.id));
    
    // Only add new nudges (limit to 1 at a time for UX)
    if (filtered.length > 0 && nudges.length === 0) {
      const nudge = filtered[0];
      setNudges([nudge]);
      setShownNudgeIds(prev => new Set(prev).add(nudge.id));
    }
  }, [psychologicalProfile, hesitationPatterns, sessionData, nudges, shownNudgeIds, dismissedNudgeIds]);

  // Generate nudges based on behavior changes
  useEffect(() => {
    const timer = setTimeout(generateNudges, contentAdaptation.nudgeDelay);
    return () => clearTimeout(timer);
  }, [generateNudges, contentAdaptation.nudgeDelay]);

  const dismissNudge = useCallback((id: string) => {
    setNudges(prev => prev.filter(n => n.id !== id));
    setDismissedNudgeIds(prev => new Set(prev).add(id));
  }, []);

  // Auto-hide nudges
  useEffect(() => {
    nudges.forEach(nudge => {
      if (nudge.autoHide) {
        const timer = setTimeout(() => dismissNudge(nudge.id), nudge.autoHide);
        return () => clearTimeout(timer);
      }
    });
  }, [nudges, dismissNudge]);

  return (
    <AnimatePresence>
      {nudges.map(nudge => {
        const Icon = nudge.icon ? iconMap[nudge.icon] : Sparkles;
        
        if (nudge.type === 'banner') {
          return (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]",
                "rounded-xl border p-4 shadow-xl backdrop-blur-sm",
                variantStyles[nudge.variant || 'default']
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{nudge.message}</p>
                  {nudge.subMessage && (
                    <p className="text-sm text-muted-foreground mt-0.5">{nudge.subMessage}</p>
                  )}
                  {nudge.cta && (
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        nudge.ctaAction?.();
                        dismissNudge(nudge.id);
                      }}
                    >
                      {nudge.cta}
                    </Button>
                  )}
                </div>
                {nudge.dismissable && (
                  <button 
                    onClick={() => dismissNudge(nudge.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        }
        
        if (nudge.type === 'slide_in') {
          return (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                "fixed bottom-24 right-4 z-50 max-w-sm",
                "rounded-xl border p-4 shadow-xl backdrop-blur-sm",
                variantStyles[nudge.variant || 'default']
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{nudge.message}</p>
                  {nudge.subMessage && (
                    <p className="text-sm text-muted-foreground mt-0.5">{nudge.subMessage}</p>
                  )}
                  {nudge.cta && (
                    <button 
                      onClick={() => {
                        nudge.ctaAction?.();
                        dismissNudge(nudge.id);
                      }}
                      className="flex items-center gap-1 text-sm font-medium text-primary mt-2 hover:underline"
                    >
                      {nudge.cta} <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {nudge.dismissable && (
                  <button 
                    onClick={() => dismissNudge(nudge.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        }
        
        return null;
      })}
    </AnimatePresence>
  );
};

export default SmartNudgeSystem;
