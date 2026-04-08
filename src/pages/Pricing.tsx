import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = 'rzp_live_SZIYgnAQN4Bg5n';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    amount: 9900,
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    popular: false,
    features: [
      '5 Widget Types',
      '50,000 Monthly Views',
      'Basic Customization',
      'Standard Support',
      'Widgetify Branding',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    amount: 29900,
    icon: Crown,
    color: 'from-primary to-primary/70',
    popular: true,
    features: [
      'All 20+ Widget Types',
      'Unlimited Views',
      'Full Customization',
      'Priority Support',
      'Remove Branding',
      'Custom CSS Injection',
      'A/B Testing',
      'Analytics Dashboard',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 999,
    amount: 99900,
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    popular: false,
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'Custom Builder Access',
      'API Access (MCP)',
      'White-Label Widgets',
      'Dedicated Support',
      'Creator Verification',
      'Priority Feature Requests',
    ],
  },
];

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    setLoadingPlan(plan.id);

    try {
      // Create order via edge function
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ plan_type: plan.id, amount: plan.amount }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const order = await res.json();

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Widgetify',
        description: `${plan.name} Plan - Monthly`,
        order_id: order.order_id,
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#7c3aed',
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-razorpay-payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan_type: plan.id,
                  amount: plan.amount,
                }),
              }
            );

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed');
            }

            toast.success(`${plan.name} plan activated! 🎉`);
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoadingPlan(null);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthModalOpen={openAuthModal} />

      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free and upgrade when you need more. All plans include core widget generation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.popular
                      ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan)}
                      disabled={loadingPlan === plan.id}
                    >
                      {loadingPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Secured by Razorpay. Cancel anytime. All amounts in INR.
        </motion.p>
      </div>

      <Footer />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
};

export default Pricing;
