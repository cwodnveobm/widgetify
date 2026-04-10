import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Crown, CreditCard, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthModal } from '@/components/AuthModal';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  display_name: string;
  payment_id: string | null;
  payment_provider: string | null;
  created_at: string;
  message: string | null;
}

interface Subscription {
  id: string;
  amount: number;
  currency: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      setLoading(true);
      const [donRes, subRes] = await Promise.all([
        supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      if (donRes.data) setDonations(donRes.data as Donation[]);
      if (subRes.data) setSubscriptions(subRes.data as Subscription[]);
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') return `₹${amount}`;
    return `$${amount}`;
  };

  const totalDonated = donations.reduce((s, d) => s + d.amount, 0);
  const totalSubscription = subscriptions.reduce((s, sub) => s + sub.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAuthModalOpen={(mode) => { setAuthMode(mode); setAuthModalOpen(true); }} />

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" size="sm" asChild className="mb-4 gap-1.5">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground text-sm">View all your past transactions</p>
        </motion.div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-pink-500/10">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Donated</p>
                <p className="font-semibold">₹{totalDonated}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subscription Payments</p>
                <p className="font-semibold">₹{totalSubscription}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="font-semibold">{donations.length + subscriptions.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
            ) : donations.length === 0 && subscriptions.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {subscriptions.map((s) => (
                  <SubscriptionRow key={s.id} sub={s} formatDate={formatDate} formatCurrency={formatCurrency} />
                ))}
                {donations.map((d) => (
                  <DonationRow key={d.id} donation={d} formatDate={formatDate} formatCurrency={formatCurrency} />
                ))}
              </>
            )}
          </TabsContent>

          <TabsContent value="donations" className="space-y-3 mt-4">
            {donations.length === 0 ? (
              <EmptyState message="No donations yet." />
            ) : (
              donations.map((d) => (
                <DonationRow key={d.id} donation={d} formatDate={formatDate} formatCurrency={formatCurrency} />
              ))
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-3 mt-4">
            {subscriptions.length === 0 ? (
              <EmptyState message="No subscription payments yet." />
            ) : (
              subscriptions.map((s) => (
                <SubscriptionRow key={s.id} sub={s} formatDate={formatDate} formatCurrency={formatCurrency} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </div>
  );
};

const EmptyState = ({ message = 'No transactions found.' }: { message?: string }) => (
  <div className="text-center py-12 text-muted-foreground">
    <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

const DonationRow = ({
  donation: d,
  formatDate,
  formatCurrency,
}: {
  donation: { id: string; amount: number; currency: string; display_name: string; payment_id: string | null; created_at: string; message: string | null };
  formatDate: (d: string) => string;
  formatCurrency: (a: number, c: string) => string;
}) => (
  <Card>
    <CardContent className="py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-pink-500/10 shrink-0">
          <Heart className="w-4 h-4 text-pink-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Donation</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(d.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCurrency(d.amount, d.currency)}</p>
        {d.payment_id && (
          <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
            {d.payment_id}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

const SubscriptionRow = ({
  sub: s,
  formatDate,
  formatCurrency,
}: {
  sub: { id: string; amount: number; currency: string; plan_type: string; status: string; start_date: string; end_date: string | null; razorpay_payment_id: string | null; created_at: string };
  formatDate: (d: string) => string;
  formatCurrency: (a: number, c: string) => string;
}) => (
  <Card>
    <CardContent className="py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-amber-500/10 shrink-0">
          <Crown className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-medium">{s.plan_type} Subscription</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(s.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right flex items-center gap-2">
        <Badge
          variant={s.status === 'active' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {s.status}
        </Badge>
        <p className="font-semibold">{formatCurrency(s.amount, s.currency)}</p>
      </div>
    </CardContent>
  </Card>
);

export default PaymentHistory;
