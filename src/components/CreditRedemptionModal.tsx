import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { IndianRupee, Wallet, Building2, Loader2 } from 'lucide-react';

const upiSchema = z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID format (e.g., name@upi)');

const bankSchema = z.object({
  accountNumber: z.string().min(9, 'Account number must be at least 9 digits').max(18, 'Account number too long'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  accountHolderName: z.string().min(2, 'Name is required').max(100, 'Name too long'),
});

interface CreditRedemptionModalProps {
  open: boolean;
  onClose: () => void;
  availableCredits: number;
  userId: string;
  onSuccess: () => void;
}

export const CreditRedemptionModal = ({ 
  open, 
  onClose, 
  availableCredits, 
  userId,
  onSuccess 
}: CreditRedemptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  const MIN_CREDITS = 2000;
  const creditsToRedeem = Math.floor(availableCredits / MIN_CREDITS) * MIN_CREDITS;
  const rupeesToReceive = (creditsToRedeem / MIN_CREDITS) * 100;

  const canRedeem = availableCredits >= MIN_CREDITS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canRedeem) {
      toast.error(`You need at least ${MIN_CREDITS} credits to redeem`);
      return;
    }

    setLoading(true);

    try {
      // Validate inputs
      if (paymentMethod === 'upi') {
        upiSchema.parse(upiId);
      } else {
        bankSchema.parse({
          accountNumber,
          ifscCode: ifscCode.toUpperCase(),
          accountHolderName,
        });
      }

      // Create payout request
      const { error } = await supabase
        .from('payout_requests')
        .insert({
          user_id: userId,
          amount_credits: creditsToRedeem,
          amount_rupees: rupeesToReceive,
          payment_method: paymentMethod,
          upi_id: paymentMethod === 'upi' ? upiId : null,
          bank_account: paymentMethod === 'bank_transfer' ? accountNumber : null,
          ifsc_code: paymentMethod === 'bank_transfer' ? ifscCode.toUpperCase() : null,
          account_holder_name: paymentMethod === 'bank_transfer' ? accountHolderName : null,
          status: 'pending',
        });

      if (error) throw error;

      // Update user credits (mark as redeemed)
      const { error: creditsError } = await supabase
        .from('user_credits')
        .update({
          redeemed_credits: availableCredits,
        })
        .eq('user_id', userId);

      if (creditsError) {
        console.error('Credits update error:', creditsError);
      }

      // Add transaction record
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -creditsToRedeem,
          transaction_type: 'redeemed',
          description: `Redeemed ${creditsToRedeem} credits for ₹${rupeesToReceive}`,
        });

      toast.success(`Payout request submitted for ₹${rupeesToReceive}!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || 'Failed to submit payout request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-primary" />
            Redeem Credits
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Convert your earned credits to real money
          </DialogDescription>
        </DialogHeader>

        {!canRedeem ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Not enough credits</p>
              <p className="text-sm text-muted-foreground mt-1">
                You need at least {MIN_CREDITS} credits to redeem. 
                You have {availableCredits.toFixed(2)} credits.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep referring to earn more credits!
              </p>
            </div>
            <Button onClick={onClose} variant="outline" className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Redemption Summary */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available Credits</span>
                <span className="font-medium">{availableCredits.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Credits to Redeem</span>
                <span className="font-medium">{creditsToRedeem}</span>
              </div>
              <div className="border-t border-primary/20 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>You'll Receive</span>
                  <span className="text-primary">₹{rupeesToReceive}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'upi' | 'bank_transfer')}
                className="grid grid-cols-2 gap-3"
              >
                <div className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="w-4 h-4" />
                    UPI
                  </Label>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    Bank
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* UPI Fields */}
            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  placeholder="yourname@upi"
                  className="min-h-[48px] text-base"
                />
              </div>
            )}

            {/* Bank Transfer Fields */}
            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-sm font-medium">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="min-h-[48px] text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="1234567890123"
                    className="min-h-[48px] text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-sm font-medium">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    required
                    placeholder="SBIN0001234"
                    className="min-h-[48px] text-base uppercase"
                    maxLength={11}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full min-h-[48px] text-base font-medium" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Request Payout of ₹{rupeesToReceive}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Payouts are processed within 3-5 business days
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
