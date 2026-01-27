import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const REFERRAL_CODE_KEY = 'widgetify_referral_code';
const REFERRAL_EXPIRY_KEY = 'widgetify_referral_expiry';
const EXPIRY_DAYS = 30;

export const useReferralTracking = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      // Store the referral code with expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
      
      localStorage.setItem(REFERRAL_CODE_KEY, refCode);
      localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.toISOString());
      
      console.log('[Referral] Stored referral code:', refCode);
    }
  }, [searchParams]);

  return null;
};

export const getStoredReferralCode = (): string | null => {
  const code = localStorage.getItem(REFERRAL_CODE_KEY);
  const expiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);
  
  if (!code || !expiry) return null;
  
  // Check if expired
  if (new Date() > new Date(expiry)) {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(REFERRAL_EXPIRY_KEY);
    return null;
  }
  
  return code;
};

export const clearStoredReferralCode = () => {
  localStorage.removeItem(REFERRAL_CODE_KEY);
  localStorage.removeItem(REFERRAL_EXPIRY_KEY);
};
