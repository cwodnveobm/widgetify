import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { usePersonalization } from '@/hooks/usePersonalization';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Sparkles, Gift, TrendingUp, Zap, CheckCircle, X } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" }).max(255);
const nameSchema = z.string().trim().max(100).optional();

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ open, onClose }) => {
  const { segment, behavior, session, intent, trackClick } = usePersonalization();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get personalized content based on user behavior
  const getPersonalizedContent = () => {
    const widgetCount = behavior.widgetsGenerated;
    const pageViews = behavior.pageViews;
    const timeOnSite = behavior.timeOnSite;

    // High engagement user
    if (widgetCount > 3 || timeOnSite > 300) {
      return {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        badge: 'Power User',
        badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        headline: "You're on fire! 🔥",
        subheadline: `You've created ${widgetCount} widgets! Get exclusive pro tips and advanced templates delivered to your inbox.`,
        benefits: [
          'Advanced widget customization guides',
          'Early access to new features',
          'Priority support queue'
        ],
        cta: 'Unlock Pro Tips'
      };
    }

    // Widget creator
    if (widgetCount > 0) {
      return {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        badge: 'Widget Creator',
        badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        headline: 'Love your widgets? 💜',
        subheadline: `You've already created ${widgetCount} widget${widgetCount > 1 ? 's' : ''}! Stay updated with new templates and optimization tips.`,
        benefits: [
          'New widget templates weekly',
          'Conversion optimization tips',
          'Integration guides'
        ],
        cta: 'Get Widget Updates'
      };
    }

    // Explorer based on page views
    if (pageViews > 5) {
      return {
        icon: <Gift className="h-8 w-8 text-primary" />,
        badge: 'Explorer',
        badgeColor: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
        headline: 'Still exploring? Let us help! 🎯',
        subheadline: "You've been checking out our features. Get personalized recommendations based on your interests.",
        benefits: [
          'Curated widget recommendations',
          'Use case inspiration',
          'Best practices guide'
        ],
        cta: 'Get Recommendations'
      };
    }

    // Returning visitor
    if (session.isReturningUser) {
      return {
        icon: <Zap className="h-8 w-8 text-primary" />,
        badge: 'Welcome Back',
        badgeColor: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        headline: `Good to see you again! 👋`,
        subheadline: "You've visited us before. Join our community for updates on new features and exclusive content.",
        benefits: [
          'Exclusive returning user perks',
          'Feature announcements first',
          'Community access'
        ],
        cta: 'Join the Community'
      };
    }

    // Default content
    return {
      icon: <Mail className="h-8 w-8 text-primary" />,
      badge: 'Special Offer',
      badgeColor: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground',
      headline: 'Get 20% off Pro Features! 🎉',
      subheadline: 'Subscribe to our newsletter and receive an exclusive discount plus weekly tips.',
      benefits: [
        'Weekly widget tips & tricks',
        'Exclusive discounts',
        'Early feature access'
      ],
      cta: 'Claim Your Discount'
    };
  };

  const content = getPersonalizedContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast({
        title: "Invalid email",
        description: emailValidation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    // Validate name if provided
    if (name) {
      const nameValidation = nameSchema.safeParse(name);
      if (!nameValidation.success) {
        toast({
          title: "Invalid name",
          description: "Name must be less than 100 characters",
          variant: "destructive"
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('email_captures').insert({
        email: emailValidation.data,
        name: name || null,
        source: 'returning_user_modal',
        user_segment: segment,
        widget_preferences: {
          widgetsGenerated: behavior.widgetsGenerated,
          intentType: intent.type
        },
        browsing_data: {
          pageViews: behavior.pageViews,
          timeOnSite: behavior.timeOnSite,
          scrollDepth: behavior.scrollDepth,
          visitCount: session.visitCount,
          referrer: session.referrer
        }
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "You're already on our list! We'll keep you updated.",
          });
          setIsSubmitted(true);
        } else {
          throw error;
        }
      } else {
        trackClick('email_capture_submit');
        setIsSubmitted(true);
        toast({
          title: "Welcome aboard! 🎉",
          description: "You'll receive personalized updates soon.",
        });

        // Store in localStorage to not show again
        localStorage.setItem('widgetify_email_captured', 'true');
      }
    } catch (error) {
      console.error('Email capture error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">You're all set! 🎉</DialogTitle>
            <DialogDescription className="text-muted-foreground mb-6">
              Check your inbox for a welcome email with your personalized recommendations.
            </DialogDescription>
            <Button onClick={onClose} className="w-full">
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center pb-4">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              {content.icon}
            </div>
            <Badge className={`${content.badgeColor} border-0`}>
              {content.badge}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">
            {content.headline}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {content.subheadline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : content.cta}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
