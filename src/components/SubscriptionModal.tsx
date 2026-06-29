import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthRequired?: () => void;
}

const PREMIUM_FEATURES = [
  'Remove Widgetify branding',
  'Unlimited widget views',
  'Premium widget types (Maps, Reviews, etc.)',
  'A/B testing & analytics',
  'Priority support',
  'Custom CSS injection',
  'Code download access',
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open, onOpenChange, onAuthRequired,
}) => {
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = () => {
    if (!user) {
      onOpenChange(false);
      onAuthRequired?.();
      return;
    }
    setProcessing(true);
    initiatePayment({
      amount: 199,
      currency: 'INR',
      purpose: 'subscription',
      prefill: { email: user.email },
      onSuccess: () => { setProcessing(false); onOpenChange(false); },
      onFailure: () => setProcessing(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <DialogTitle className="text-xl">Go Premium</DialogTitle>
          </div>
          <DialogDescription>Unlock everything for ₹199/month</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              <Zap className="w-3 h-3 mr-1" /> Cancel anytime
            </Badge>
          </div>

          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 shrink-0" />{f}
              </li>
            ))}
          </ul>

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleSubscribe}
            disabled={processing}
          >
            <Sparkles className="w-4 h-4" />
            {processing ? 'Opening checkout…' : 'Subscribe — ₹199/month'}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure payment by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
