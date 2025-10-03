import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const SubscriptionModal = ({ open, onClose, user }: SubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setLoading(true);

    try {
      // Call edge function to create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: 29900 } // ₹299 in paise
      });

      if (error) throw error;

      const options = {
        key: 'rzp_live_RGiH0mj7MRwJsu',
        amount: data.amount,
        currency: data.currency,
        name: 'Widgetify Premium',
        description: 'Premium Subscription - Monthly',
        order_id: data.id,
        handler: async function (response: any) {
          // Verify payment
          const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          });

          if (verifyError) {
            toast.error("Payment verification failed");
            return;
          }

          toast.success("Subscription activated successfully!");
          onClose();
          window.location.reload();
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#6366f1'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
