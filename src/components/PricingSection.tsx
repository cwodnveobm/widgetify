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
    <section id="pricing" className="section-spacing container-padding bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 rounded-full mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Premium Plan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
            Unlock Premium Features
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Elevate your widget experience with unlimited possibilities and professional customization
          </p>
        </div>

        <div className="max-w-lg mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-primary/5 rounded-tr-full" />
            
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Premium</h3>
            <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">₹199</span>
              <span className="text-sm sm:text-base text-muted-foreground">/month</span>
            </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Everything you need to create stunning, professional widgets
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">All Features Included</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Access every widget type and customization option</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">20,000 Monthly Views</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Generous view limit for growing businesses</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Premium Templates</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Exclusive professionally-designed templates</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Remove Branding</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">White-label solution for your brand</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubscribe}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Subscribe Now
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-3 sm:mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center px-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
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
