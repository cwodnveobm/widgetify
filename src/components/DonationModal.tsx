import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, Star, Trophy, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DonationTrigger {
  type: 'achievement' | 'milestone' | 'appreciation' | 'expert' | 'supporter' | 'influencer';
  title: string;
  message: string;
  emoji: string;
  ctaText: string;
  priority: number;
}

interface DonationModalProps {
  isOpen: boolean;
  trigger: DonationTrigger | null;
  appreciationMessage: string;
  onDonate: () => void;
  onDismiss: () => void;
  onMaybeLater: () => void;
}

const ICON_MAP = {
  achievement: Trophy,
  milestone: Zap,
  appreciation: Heart,
  expert: Sparkles,
  supporter: Star,
  influencer: Gift,
};

const GRADIENT_MAP = {
  achievement: 'from-amber-500 via-yellow-400 to-orange-500',
  milestone: 'from-purple-500 via-pink-500 to-rose-500',
  appreciation: 'from-rose-500 via-pink-500 to-red-500',
  expert: 'from-blue-500 via-cyan-400 to-teal-500',
  supporter: 'from-emerald-500 via-green-400 to-lime-500',
  influencer: 'from-indigo-500 via-purple-500 to-pink-500',
};

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  trigger,
  appreciationMessage,
  onDonate,
  onDismiss,
  onMaybeLater,
}) => {
  if (!trigger) return null;

  const IconComponent = ICON_MAP[trigger.type] || Heart;
  const gradient = GRADIENT_MAP[trigger.type] || GRADIENT_MAP.appreciation;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onMaybeLater}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md">
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-3xl blur-2xl opacity-30 bg-gradient-to-r",
                gradient
              )} />

              {/* Modal content */}
              <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={onDismiss}
                  className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Header with gradient */}
                <div className={cn(
                  "relative pt-8 pb-6 px-6 bg-gradient-to-r text-white",
                  gradient
                )}>
                  {/* Animated particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full"
                        initial={{ 
                          x: Math.random() * 100 + '%', 
                          y: '100%',
                          opacity: 0 
                        }}
                        animate={{ 
                          y: '-100%',
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                          ease: 'linear'
                        }}
                      />
                    ))}
                  </div>

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-center"
                  >
                    {trigger.title}
                  </motion.h2>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Appreciation message */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-primary font-medium italic"
                  >
                    "{appreciationMessage}"
                  </motion.p>

                  {/* Main message */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-muted-foreground leading-relaxed"
                  >
                    {trigger.message}
                  </motion.p>

                  {/* Stats badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
                      <Heart className="w-4 h-4 text-destructive" fill="currentColor" />
                      <span className="text-muted-foreground">Supported by 2,000+ creators</span>
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={onDonate}
                      className={cn(
                        "w-full h-12 text-base font-semibold bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
                        gradient
                      )}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      {trigger.ctaText}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={onMaybeLater}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      Maybe Later
                    </Button>
                  </motion.div>

                  {/* Trust indicator */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-xs text-muted-foreground"
                  >
                    🔒 Secure payment via Razorpay • Any amount helps!
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;
