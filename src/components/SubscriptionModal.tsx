import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Sparkles, Lock } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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

const OTP_CODE = '999';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onOpenChange,
  onAuthRequired,
}) => {
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleOtpVerify = () => {
    if (otpValue === OTP_CODE) {
      setOtpVerified(true);
      toast.success('Access code verified!');
    } else {
      toast.error('Invalid access code. Please try again.');
    }
  };

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
      onSuccess: () => {
        setProcessing(false);
        onOpenChange(false);
        setOtpValue('');
        setOtpVerified(false);
      },
      onFailure: () => {
        setProcessing(false);
      },
    });
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setOtpValue('');
      setOtpVerified(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <DialogTitle className="text-xl">Go Premium</DialogTitle>
          </div>
          <DialogDescription>
            Unlock all features for just ₹199/month
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Price card */}
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Cancel anytime
            </Badge>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* OTP Gate */}
          {!otpVerified ? (
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Enter access code to proceed
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleOtpVerify()}
                  maxLength={6}
                />
                <Button onClick={handleOtpVerify} variant="secondary">
                  Verify
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                Access verified — ready to subscribe
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSubscribe}
                disabled={processing}
              >
                <Sparkles className="w-4 h-4" />
                {processing ? 'Processing...' : 'Subscribe — ₹199/month'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
