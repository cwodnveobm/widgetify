
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CopyIcon, Check } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  const upiId = "adnanmuhammad4393@okicici";
  const bankDetails = {
    name: "Muhammed Adnan vv",
    accountNumber: "19020100094298",
    ifscCode: "FDRL0001902"
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 14) {
      setAmount(14);
    } else if (value > 2214) {
      setAmount(2214);
    } else {
      setAmount(value);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };

  const copyBankDetails = () => {
    const details = `Name: ${bankDetails.name}\nAccount Number: ${bankDetails.accountNumber}\nIFSC Code: ${bankDetails.ifscCode}`;
    navigator.clipboard.writeText(details);
    toast.success("Bank details copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Support Widgetify</DialogTitle>
          <DialogDescription>
            Choose your donation amount to support the continued development of Widgetify
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Donation Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min={14}
              max={2214}
              className="w-full"
            />
            <span className="text-xs text-gray-500 mt-1 block">
              Min: ₹14 - Max: ₹2214
            </span>
          </div>
          
          <div className="mb-4 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">UPI ID</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 text-xs" 
                onClick={copyUpiId}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <CopyIcon className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="text-sm font-mono bg-gray-100 p-2 rounded border border-gray-200 break-all">
              {upiId}
            </div>
          </div>
          
          <div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide bank details" : "Show bank details"}
            </Button>
            
            {showDetails && (
              <div className="mt-2 bg-gray-50 p-4 rounded-md space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Beneficiary name:</span> {bankDetails.name}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Account number:</span> {bankDetails.accountNumber}
                </div>
                <div className="text-sm">
                  <span className="font-medium">IFSC code:</span> {bankDetails.ifscCode}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 h-8 text-xs" 
                  onClick={copyBankDetails}
                >
                  <CopyIcon className="h-4 w-4 mr-1" /> Copy bank details
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
