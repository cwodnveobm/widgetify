import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useReferrals } from '@/hooks/useReferrals';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { AuthModal } from '@/components/AuthModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Crown, User, CreditCard, Users, History,
  Copy, LogOut, Shield, Sparkles, ArrowRight,
  TrendingUp, Gift, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription();
  const {
    credits, referralLink, referrals, currentTier,
    nextTier, progressToNextTier, copyReferralLink, creditsToRupees,
  } = useReferrals();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, email')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data || { full_name: null, email: user.email || '' });
      });
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    navigate('/');
  };

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const availableCredits = (credits?.total_credits ?? 0) - (credits?.redeemed_credits ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthModalOpen={(mode) => { setAuthMode(mode); setAuthModalOpen(true); }} />

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome back, {profile?.full_name || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/payment-history">
                <History className="w-4 h-4 mr-1.5" />
                Payment History
              </Link>
            </Button>
            {!isPremium && (
              <Button size="sm" onClick={() => setSubscriptionOpen(true)} className="gap-1.5">
                <Crown className="w-4 h-4" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subscription */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isPremium ? 'bg-amber-500/10' : 'bg-muted'}`}>
                  <Crown className={`w-5 h-5 ${isPremium ? 'text-amber-500' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-semibold">{isPremium ? 'Premium' : 'Free'}</p>
                </div>
              </div>
              {isPremium && (
                <Badge className="mt-3 bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits</p>
                  <p className="font-semibold">{availableCredits.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ≈ ₹{creditsToRupees(availableCredits).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Referrals */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                  <p className="font-semibold">{credits?.total_referrals ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/10">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tier</p>
                  <p className="font-semibold">{currentTier?.tier_name || 'Starter'}</p>
                </div>
              </div>
              {nextTier && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{nextTier.tier_name}</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Your Referral Link
            </CardTitle>
            <CardDescription>Share this link to earn credits for every signup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <code className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm truncate">
                {referralLink}
              </code>
              <Button variant="secondary" size="sm" onClick={copyReferralLink} className="shrink-0 gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
            </div>
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/referrals">
                  View Referral Dashboard
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Referrals */}
        {referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referrals.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground truncate">{r.referred_email}</span>
                    <Badge variant={r.status === 'credited' ? 'default' : 'secondary'} className="text-xs">
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span>{profile?.full_name || '—'}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <Separator />
            <Button variant="destructive" size="sm" onClick={handleSignOut} className="gap-1.5 mt-2">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />

      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        onAuthRequired={() => { setAuthMode('signup'); setAuthModalOpen(true); }}
      />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </div>
  );
};

export default Dashboard;
