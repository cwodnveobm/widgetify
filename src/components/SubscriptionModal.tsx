import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const SubscriptionModal = ({ open, onClose, user }: SubscriptionModalProps) => {

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    // Open Razorpay payment link
    window.open('https://rzp.io/rzp/rYB4zouV', '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Get unlimited access to all features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">₹299</span>
            <span className="text-muted-foreground">/month</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>All widget features included</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>20,000 monthly views</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>Access to premium templates</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>Remove branding option</span>
            </div>
          </div>

          <Button 
            onClick={handleSubscribe}
            className="w-full"
            size="lg"
          >
            Subscribe Now
          </Button>

          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Razorpay
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Please note that this payment link isn't specifically created for this idea, but you can still use it to make a payment for your overall requirements.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
