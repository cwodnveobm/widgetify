import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type PlanType = 'free' | 'starter' | 'pro' | 'business';

interface SubscriptionState {
  plan: PlanType;
  isActive: boolean;
  loading: boolean;
  endDate: string | null;
}

const PLAN_HIERARCHY: Record<PlanType, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    plan: 'free',
    isActive: false,
    loading: true,
    endDate: null,
  });

  useEffect(() => {
    if (!user) {
      setState({ plan: 'free', isActive: false, loading: false, endDate: null });
      return;
    }

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type, status, end_date')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setState({ plan: 'free', isActive: false, loading: false, endDate: null });
        return;
      }

      const isExpired = data.end_date && new Date(data.end_date) < new Date();
      
      setState({
        plan: isExpired ? 'free' : (data.plan_type as PlanType),
        isActive: !isExpired,
        loading: false,
        endDate: data.end_date,
      });
    };

    fetchSubscription();
  }, [user]);

  const hasAccess = (requiredPlan: PlanType): boolean => {
    return PLAN_HIERARCHY[state.plan] >= PLAN_HIERARCHY[requiredPlan];
  };

  return { ...state, hasAccess };
};
