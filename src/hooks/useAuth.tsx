import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check subscription when user changes
        if (session?.user) {
          setTimeout(() => {
            checkUserSubscription(session.user.id);
          }, 0);
        } else {
          setHasSubscription(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserSubscription(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSubscription = async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (!error && data) {
      // Check if subscription is still valid
      if (data.end_date) {
        const endDate = new Date(data.end_date);
        if (endDate > new Date()) {
          setHasSubscription(true);
        } else {
          setHasSubscription(false);
        }
      } else {
        // No end date means unlimited subscription
        setHasSubscription(true);
      }
    } else {
      setHasSubscription(false);
    }
  };

  const grantPremiumAccess = async () => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      // Create a premium subscription for testing
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          plan_type: 'premium',
          amount: 29900,
          currency: 'INR',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        })
        .select()
        .single();

      if (error) throw error;

      setHasSubscription(true);
      return { success: true, data };
    } catch (error: any) {
      console.error('Error granting premium access:', error);
      return { success: false, error: error.message };
    }
  };

  return { user, session, loading, hasSubscription, grantPremiumAccess };
};
