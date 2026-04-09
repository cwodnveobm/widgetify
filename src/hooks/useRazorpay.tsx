import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  amount: number;
  currency?: string;
  purpose: 'donation' | 'subscription';
  metadata?: Record<string, any>;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void;
}

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

export const useRazorpay = () => {
  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      options.onFailure?.('Script load failed');
      return;
    }

    try {
      // Create order via edge function
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            amount: options.amount,
            currency: options.currency || 'INR',
            purpose: options.purpose,
            notes: options.metadata,
          }),
        }
      );

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'Widgetify',
        description:
          options.purpose === 'subscription'
            ? 'Premium Subscription'
            : 'Donation to Widgetify',
        prefill: options.prefill || {},
        theme: { color: '#9b87f5' },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyRes = await fetch(
              `https://${projectId}.supabase.co/functions/v1/verify-razorpay-payment`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  purpose: options.purpose,
                  metadata: {
                    amount: options.amount,
                    ...options.metadata,
                  },
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            toast.success(
              options.purpose === 'subscription'
                ? 'Premium subscription activated! 🎉'
                : 'Thank you for your donation! ❤️'
            );
            options.onSuccess?.(response.razorpay_payment_id);
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
            options.onFailure?.(err.message);
          }
        },
        modal: {
          ondismiss: () => {
            options.onFailure?.('Payment cancelled');
          },
        },
      });

      rzp.on('payment.failed', (response: any) => {
        toast.error(response.error?.description || 'Payment failed');
        options.onFailure?.(response.error?.description || 'Payment failed');
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate payment');
      options.onFailure?.(err.message);
    }
  }, []);

  return { initiatePayment };
};
