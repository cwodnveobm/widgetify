-- Create payout requests table for credit redemption
CREATE TABLE public.payout_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount_credits NUMERIC NOT NULL,
  amount_rupees NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  upi_id TEXT,
  bank_account TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  payment_method TEXT NOT NULL DEFAULT 'upi',
  processed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('upi', 'bank_transfer')),
  CONSTRAINT minimum_credits CHECK (amount_credits >= 2000)
);

-- Enable RLS
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payout requests
CREATE POLICY "Users can view their own payout requests"
  ON public.payout_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create payout requests for themselves
CREATE POLICY "Users can create payout requests"
  ON public.payout_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_payout_requests_updated_at
  BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();