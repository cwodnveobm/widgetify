import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Referral {
  id: string;
  referred_email: string;
  status: 'pending' | 'signed_up' | 'credited';
  referral_code: string;
  created_at: string;
  converted_at: string | null;
  credited_at: string | null;
}

interface UserCredits {
  total_credits: number;
  total_referrals: number;
  redeemed_credits: number;
}

interface ReferralTier {
  id: string;
  tier_name: string;
  min_referrals: number;
  credits_per_referral: number;
  bonus_credits: number;
  badge_color: string;
}

interface CreditTransaction {
  id: string;
  amount: number;
  transaction_type: 'earned' | 'redeemed' | 'bonus';
  description: string | null;
  created_at: string;
}

// Constants based on requirements: 2000 referrals = 10 credits, 2000 credits = 100 rs
const CREDITS_PER_2000_REFERRALS = 10;
const RS_PER_2000_CREDITS = 100;

export const useReferrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [tiers, setTiers] = useState<ReferralTier[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('');

  // Generate unique referral code for user
  const generateReferralCode = useCallback(() => {
    if (!user) return '';
    const userPart = user.id.substring(0, 8).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WGT-${userPart}-${randomPart}`;
  }, [user]);

  // Get referral link
  const getReferralLink = useCallback(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  }, [referralCode]);

  // Calculate current tier
  const getCurrentTier = useCallback((totalReferrals: number): ReferralTier | null => {
    const sortedTiers = [...tiers].sort((a, b) => b.min_referrals - a.min_referrals);
    return sortedTiers.find(tier => totalReferrals >= tier.min_referrals) || null;
  }, [tiers]);

  // Calculate next tier
  const getNextTier = useCallback((totalReferrals: number): ReferralTier | null => {
    const sortedTiers = [...tiers].sort((a, b) => a.min_referrals - b.min_referrals);
    return sortedTiers.find(tier => totalReferrals < tier.min_referrals) || null;
  }, [tiers]);

  // Convert credits to rupees
  const creditsToRupees = (creditAmount: number): number => {
    return (creditAmount / 2000) * RS_PER_2000_CREDITS;
  };

  // Calculate progress to next tier
  const getProgressToNextTier = useCallback((totalReferrals: number): number => {
    const currentTier = getCurrentTier(totalReferrals);
    const nextTier = getNextTier(totalReferrals);
    
    if (!nextTier) return 100;
    if (!currentTier) return (totalReferrals / nextTier.min_referrals) * 100;
    
    const progressInTier = totalReferrals - currentTier.min_referrals;
    const tierRange = nextTier.min_referrals - currentTier.min_referrals;
    
    return Math.min((progressInTier / tierRange) * 100, 100);
  }, [getCurrentTier, getNextTier]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch tiers (public)
      const { data: tiersData } = await supabase
        .from('referral_tiers')
        .select('*')
        .order('min_referrals', { ascending: true });

      if (tiersData) setTiers(tiersData);

      // Fetch user referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referralsData) setReferrals(referralsData as Referral[]);

      // Fetch or create user credits
      let { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creditsData) {
        const { data: newCredits, error } = await supabase
          .from('user_credits')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (!error && newCredits) creditsData = newCredits;
      }

      if (creditsData) {
        setCredits({
          total_credits: Number(creditsData.total_credits),
          total_referrals: creditsData.total_referrals,
          redeemed_credits: Number(creditsData.redeemed_credits)
        });
      }

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsData) setTransactions(transactionsData as CreditTransaction[]);

      // Set referral code
      if (referralsData && referralsData.length > 0) {
        setReferralCode(referralsData[0].referral_code);
      } else {
        setReferralCode(generateReferralCode());
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, generateReferralCode]);

  // Add a referral (when sharing link)
  const trackReferralShare = useCallback(async (email: string) => {
    if (!user || !email) return { success: false, error: 'Invalid data' };

    try {
      const code = referralCode || generateReferralCode();
      
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: email,
          referral_code: code,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Referral Tracked!',
        description: `Invitation sent to ${email}`,
      });

      await fetchData();
      return { success: true };

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to track referral',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    }
  }, [user, referralCode, generateReferralCode, toast, fetchData]);

  // Copy referral link
  const copyReferralLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      toast({
        title: 'Link Copied!',
        description: 'Your referral link has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  }, [getReferralLink, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    referrals,
    credits,
    tiers,
    transactions,
    loading,
    referralCode,
    referralLink: getReferralLink(),
    currentTier: credits ? getCurrentTier(credits.total_referrals) : null,
    nextTier: credits ? getNextTier(credits.total_referrals) : null,
    progressToNextTier: credits ? getProgressToNextTier(credits.total_referrals) : 0,
    creditsToRupees,
    trackReferralShare,
    copyReferralLink,
    refetch: fetchData,
    CREDITS_PER_2000_REFERRALS,
    RS_PER_2000_CREDITS
  };
};
