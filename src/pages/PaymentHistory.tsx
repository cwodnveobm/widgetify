import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, CreditCard, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthModal } from '@/components/AuthModal';

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
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setSubscriptions(data as Subscription[]);
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

  const totalSpent = subscriptions.reduce((s, sub) => s + sub.amount, 0);
  const activeCount = subscriptions.filter(s => s.status === 'active').length;

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
          <p className="text-muted-foreground text-sm">View all your subscription payments</p>
        </motion.div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-semibold">₹{totalSpent}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Subscriptions</p>
                <p className="font-semibold">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Payments</p>
                <p className="font-semibold">{subscriptions.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription list */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No subscription payments yet.</p>
              <p className="text-xs mt-1">Subscribe to Premium to unlock all features.</p>
            </div>
          ) : (
            subscriptions.map((s) => (
              <Card key={s.id}>
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
            ))
          )}
        </div>
      </main>

      <Footer />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </div>
  );
};

export default PaymentHistory;
