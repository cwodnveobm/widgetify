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

    // Get widget name from user metadata or default
    const widgetName = "Premium Subscription";
    const email = user.email || "";
    const phoneNumber = user.user_metadata?.phone || "";
    
    // Format notes: Widget Name, Email, Phone Number
    const notes = `${widgetName}, ${email}, ${phoneNumber}`;
    
    // Encode notes for URL
    const encodedNotes = encodeURIComponent(notes);
    
    // Open Razorpay payment link with notes
    const paymentUrl = `https://razorpay.me/@adnan4402?amount=KxK8ikz%2BGFZ8lMDydVeeuA%3D%3D&notes=${encodedNotes}`;
    window.open(paymentUrl, '_blank');
    
    toast.info("Please complete the payment in the new window");
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
            <span className="text-4xl font-bold text-primary">₹199</span>
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

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
