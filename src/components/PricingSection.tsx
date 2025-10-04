import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "./AuthModal";
import { SubscriptionModal } from "./SubscriptionModal";

export const PricingSection = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowSubscriptionModal(true);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Plan</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unlock Premium Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elevate your widget experience with unlimited possibilities and professional customization
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full" />
            
            <div className="relative p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-primary">₹199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">
                  Everything you need to create stunning, professional widgets
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">All Features Included</p>
                    <p className="text-sm text-muted-foreground">Access every widget type and customization option</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">20,000 Monthly Views</p>
                    <p className="text-sm text-muted-foreground">Generous view limit for growing businesses</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Premium Templates</p>
                    <p className="text-sm text-muted-foreground">Exclusive professionally-designed templates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Remove Branding</p>
                    <p className="text-sm text-muted-foreground">White-label solution for your brand</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubscribe}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Subscribe Now
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom plan? <a href="#support" className="text-primary hover:underline font-medium">Contact us</a>
          </p>
        </div>

        {/* Modals */}
        <AuthModal 
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="signup"
        />
        <SubscriptionModal
          open={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          user={user}
        />
      </div>
    </section>
  );
};
