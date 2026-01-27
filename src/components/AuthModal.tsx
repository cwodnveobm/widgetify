import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { getStoredReferralCode, clearStoredReferralCode } from "@/hooks/useReferralTracking";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "signin" | "signup";
}

export const AuthModal = ({ open, onClose, mode = "signin" }: AuthModalProps) => {
  const [isSignIn, setIsSignIn] = useState(mode === "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email
      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (isSignIn) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Signed in successfully!");
        onClose();
      } else {
        if (!fullName.trim()) {
          toast.error("Please enter your full name");
          setLoading(false);
          return;
        }

        const redirectUrl = `${window.location.origin}/`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              email: email,
              full_name: fullName,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          // Handle referral tracking
          const referralCode = getStoredReferralCode();
          if (referralCode) {
            try {
              // Find the referral and update it
              const { data: referralData, error: findError } = await supabase
                .from('referrals')
                .select('id, referrer_id, status')
                .eq('referral_code', referralCode)
                .eq('status', 'pending')
                .limit(1)
                .maybeSingle();

              if (referralData && !findError) {
                // Update referral status to signed_up
                await supabase
                  .from('referrals')
                  .update({
                    status: 'signed_up',
                    referred_user_id: data.user.id,
                    converted_at: new Date().toISOString(),
                  })
                  .eq('id', referralData.id);

                // Credit the referrer
                const { data: creditsData } = await supabase
                  .from('user_credits')
                  .select('*')
                  .eq('user_id', referralData.referrer_id)
                  .maybeSingle();

                if (creditsData) {
                  // Get current tier for credit calculation
                  const { data: tierData } = await supabase
                    .from('referral_tiers')
                    .select('credits_per_referral')
                    .lte('min_referrals', creditsData.total_referrals)
                    .order('min_referrals', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                  const creditsPerReferral = tierData?.credits_per_referral || 0.005;

                  // Update referrer's credits
                  await supabase
                    .from('user_credits')
                    .update({
                      total_credits: Number(creditsData.total_credits) + creditsPerReferral,
                      total_referrals: creditsData.total_referrals + 1,
                    })
                    .eq('user_id', referralData.referrer_id);

                  // Update referral to credited
                  await supabase
                    .from('referrals')
                    .update({
                      status: 'credited',
                      credited_at: new Date().toISOString(),
                    })
                    .eq('id', referralData.id);

                  // Create transaction record
                  await supabase
                    .from('credit_transactions')
                    .insert({
                      user_id: referralData.referrer_id,
                      amount: creditsPerReferral,
                      transaction_type: 'earned',
                      description: `Referral signup: ${email}`,
                      referral_id: referralData.id,
                    });
                }
              }

              clearStoredReferralCode();
            } catch (refError) {
              console.error('Referral tracking error:', refError);
            }
          }
        }

        toast.success("Account created! You can now sign in.");
        onClose();
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl">{isSignIn ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {isSignIn
              ? "Sign in to access your premium features"
              : "Create an account to get started"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                className="min-h-[48px] text-base"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="min-h-[48px] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="min-h-[48px] text-base"
            />
          </div>

          <Button type="submit" className="w-full min-h-[48px] text-base font-medium" disabled={loading}>
            {loading ? "Loading..." : isSignIn ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-sm text-primary hover:underline min-h-[44px] px-4"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
