import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface CreatorVerification {
  id: string;
  user_id: string;
  instagram_handle: string;
  follower_count: number;
  status: 'pending' | 'approved' | 'rejected';
  verified_at: string | null;
  earning_multiplier: number;
  badge_type: 'none' | 'verified' | 'premium' | 'elite';
  rejection_reason: string | null;
  application_note: string | null;
  created_at: string;
  updated_at: string;
}

interface ApplyForVerificationParams {
  instagramHandle: string;
  followerCount: number;
  applicationNote?: string;
}

export const useCreatorVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [verification, setVerification] = useState<CreatorVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchVerification = useCallback(async () => {
    if (!user) {
      setVerification(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setVerification(data as CreatorVerification | null);
    } catch (error) {
      console.error('Error fetching verification:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const applyForVerification = useCallback(async ({
    instagramHandle,
    followerCount,
    applicationNote
  }: ApplyForVerificationParams) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to apply for creator verification.',
        variant: 'destructive'
      });
      return { success: false };
    }

    try {
      setApplying(true);

      // Check if already applied
      if (verification) {
        toast({
          title: 'Already applied',
          description: 'You have already submitted a verification application.',
          variant: 'destructive'
        });
        return { success: false };
      }

      const { data, error } = await supabase
        .from('creator_verifications')
        .insert({
          user_id: user.id,
          instagram_handle: instagramHandle.replace('@', ''),
          follower_count: followerCount,
          application_note: applicationNote || null
        })
        .select()
        .single();

      if (error) throw error;

      setVerification(data as CreatorVerification);
      toast({
        title: 'Application submitted!',
        description: 'We will review your application within 24-48 hours.',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Application failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setApplying(false);
    }
  }, [user, verification, toast]);

  const updateApplication = useCallback(async ({
    instagramHandle,
    followerCount,
    applicationNote
  }: ApplyForVerificationParams) => {
    if (!user || !verification || verification.status !== 'pending') {
      return { success: false };
    }

    try {
      setApplying(true);

      const { data, error } = await supabase
        .from('creator_verifications')
        .update({
          instagram_handle: instagramHandle.replace('@', ''),
          follower_count: followerCount,
          application_note: applicationNote || null
        })
        .eq('id', verification.id)
        .select()
        .single();

      if (error) throw error;

      setVerification(data as CreatorVerification);
      toast({
        title: 'Application updated!',
        description: 'Your changes have been saved.',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
      return { success: false };
    } finally {
      setApplying(false);
    }
  }, [user, verification, toast]);

  // Badge display helpers
  const getBadgeConfig = useCallback((badgeType: string) => {
    const badges = {
      none: { label: 'Unverified', color: 'bg-gray-500', icon: null },
      verified: { label: 'Verified Creator', color: 'bg-blue-500', icon: '✓' },
      premium: { label: 'Premium Creator', color: 'bg-purple-500', icon: '★' },
      elite: { label: 'Elite Creator', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: '👑' }
    };
    return badges[badgeType as keyof typeof badges] || badges.none;
  }, []);

  const getMultiplierDisplay = useCallback((multiplier: number) => {
    if (multiplier === 1) return 'Standard rate';
    return `${multiplier}x earning rate`;
  }, []);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  return {
    verification,
    loading,
    applying,
    isVerified: verification?.status === 'approved',
    isPending: verification?.status === 'pending',
    isRejected: verification?.status === 'rejected',
    badgeType: verification?.badge_type || 'none',
    earningMultiplier: verification?.earning_multiplier || 1,
    applyForVerification,
    updateApplication,
    refetch: fetchVerification,
    getBadgeConfig,
    getMultiplierDisplay
  };
};
