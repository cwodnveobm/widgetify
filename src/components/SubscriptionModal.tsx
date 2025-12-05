import { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Check, Sparkles, Lock, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const ACCESS_OTP_CODE = "999";

export const SubscriptionModal = ({ open, onClose, user }: SubscriptionModalProps) => {
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleVerifyOtp = () => {
    if (otpCode === ACCESS_OTP_CODE) {
      setOtpVerified(true);
      setOtpError(false);
      toast.success("Access code verified!");
    } else {
      setOtpError(true);
      toast.error("Invalid access code. Please try again.");
    }
  };

  const handleActivatePremium = async () => {
    if (!user) {
      toast.error("Please sign in to activate premium");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify the access code first");
      return;
    }

    setActivating(true);

    try {
      // Create a premium subscription directly
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          plan_type: 'premium',
          amount: 19900,
          currency: 'INR',
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        });

      if (error) throw error;

      toast.success("Premium activated successfully! 🎉");
      
      // Reload to refresh subscription status
      window.location.reload();
    } catch (error: any) {
      console.error('Error activating premium:', error);
      toast.error(error.message || "Failed to activate premium. Please try again.");
    } finally {
      setActivating(false);
    }
  };

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify the access code first");
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
    
    // Reset state
    setOtpCode("");
    setOtpVerified(false);
  };

  const handleClose = () => {
    setOtpCode("");
    setOtpVerified(false);
    setOtpError(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              <span>Remove Widgetify branding</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>Download widget code</span>
            </div>
          </div>

          {/* OTP Verification Section */}
          <div className="space-y-3 pt-2 border-t">
            <Label htmlFor="otpCode" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4" />
              Access OTP Code
            </Label>
            <div className="flex gap-2">
              <Input
                id="otpCode"
                type="text"
                placeholder="Enter access code"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError(false);
                }}
                className={otpError ? "border-red-500" : otpVerified ? "border-green-500" : ""}
                disabled={otpVerified}
              />
              <Button 
                onClick={handleVerifyOtp}
                variant={otpVerified ? "secondary" : "outline"}
                disabled={otpVerified || !otpCode}
              >
                {otpVerified ? "Verified ✓" : "Verify"}
              </Button>
            </div>
            {otpError && (
              <p className="text-xs text-red-500">Invalid access code. Please try again.</p>
            )}
            {otpVerified && (
              <p className="text-xs text-green-600">Access code verified. You can now proceed.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleActivatePremium}
              className="w-full"
              size="lg"
              disabled={!otpVerified || activating}
            >
              <Zap className="w-4 h-4 mr-2" />
              {activating ? "Activating..." : "Activate Premium Now"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or pay via</span>
              </div>
            </div>

            <Button 
              onClick={handleSubscribe}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={!otpVerified}
            >
              Pay with Razorpay
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
