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
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const SubscriptionModal = ({ open, onClose, user }: SubscriptionModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      setLoading(true);
      
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: { amount: 29900 } // ₹299 in paise
        }
      );

      if (orderError) throw orderError;

      // Initialize Razorpay checkout
      const options = {
        key: 'rzp_live_RGiH0mj7MRwJsu',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Widgetify',
        description: 'Premium Subscription',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              }
            );

            if (verifyError) throw verifyError;

            toast.success("Subscription activated successfully!");
            onClose();
            window.location.reload(); // Refresh to update subscription status
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#e79ca9'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed. Please try again.");
      });

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to initiate payment. Please try again.");
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
