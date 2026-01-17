import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Coffee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DonationBannerProps {
  variant?: 'minimal' | 'card' | 'floating';
  className?: string;
}

const MESSAGES = [
  { text: "Love Widgetify? Buy us a coffee! ☕", icon: Coffee },
  { text: "Help keep Widgetify free for everyone 💖", icon: Heart },
  { text: "Support indie development ✨", icon: Sparkles },
];

export const DonationBanner: React.FC<DonationBannerProps> = ({
  variant = 'minimal',
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed banner recently
    const lastDismissed = localStorage.getItem('widgetify_banner_dismissed');
    if (lastDismissed) {
      const hoursSince = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        return;
      }
    }

    // Show banner after some time on site
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rotate messages
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % MESSAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    localStorage.setItem('widgetify_banner_dismissed', Date.now().toString());
  };

  const handleDonate = () => {
    localStorage.setItem('widgetify_last_donate_click', Date.now().toString());
    window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer');
  };

  const currentMessage = MESSAGES[messageIndex];
  const IconComponent = currentMessage.icon;

  if (dismissed || !isVisible) return null;

  if (variant === 'minimal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
            "border-b border-primary/20",
            "py-2 px-4",
            className
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{currentMessage.text}</span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDonate}
                className="text-primary hover:text-primary/80 h-8 px-3"
              >
                <Heart className="w-3.5 h-3.5 mr-1.5" />
                Donate
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'card') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "bg-card border border-border rounded-xl p-4 shadow-lg",
            className
          )}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground mb-1">Support Widgetify</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your contribution helps keep this tool free and accessible to everyone.
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleDonate} className="h-8">
                  <Heart className="w-3.5 h-3.5 mr-1.5" />
                  Donate Now
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-8">
                  Maybe Later
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Floating variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className={cn(
          "fixed bottom-24 right-4 z-40 max-w-xs",
          "bg-card border border-border rounded-2xl p-4 shadow-2xl",
          className
        )}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive to-destructive/60 flex items-center justify-center animate-pulse">
            <Heart className="w-5 h-5 text-destructive-foreground" fill="currentColor" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">Love Widgetify?</h4>
            <p className="text-xs text-muted-foreground">Support indie development</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Help us keep building free tools for creators worldwide.
        </p>
        
        <Button 
          size="sm" 
          onClick={handleDonate}
          className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
        >
          <Heart className="w-4 h-4 mr-2" />
          Buy us a Coffee
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonationBanner;
