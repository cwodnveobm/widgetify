
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CopyIcon, Check, QrCode } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);
  const [bankDetailsCopied, setBankDetailsCopied] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  
  const upiId = "adnanmuhammad4393@okicici";
  const bankDetails = {
    name: "Muhammed Adnan vv",
    accountNumber: "19020100094298",
    ifscCode: "FDRL0001902"
  };

  // Reset copied state when modal opens/closes
  useEffect(() => {
    setCopied(false);
    setBankDetailsCopied(false);
  }, [isOpen]);

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
    navigator.clipboard.writeText(upiId)
      .then(() => {
        setCopied(true);
        toast.success("UPI ID copied to clipboard");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        toast.error("Failed to copy UPI ID");
        console.error("Could not copy text: ", err);
      });
  };

  const copyBankDetails = () => {
    const details = `Name: ${bankDetails.name}\nAccount Number: ${bankDetails.accountNumber}\nIFSC Code: ${bankDetails.ifscCode}`;
    navigator.clipboard.writeText(details)
      .then(() => {
        setBankDetailsCopied(true);
        toast.success("Bank details copied to clipboard");
        setTimeout(() => setBankDetailsCopied(false), 3000);
      })
      .catch(err => {
        toast.error("Failed to copy bank details");
        console.error("Could not copy text: ", err);
      });
  };

  const generateQrCodeUrl = () => {
    // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR&tn=TRANSACTION_NOTE
    return `upi://pay?pa=${upiId}&pn=Widgetify&am=${amount}&cu=INR&tn=Donation to Widgetify`;
  };

  const generateQrCodeImageUrl = () => {
    const upiDeepLink = generateQrCodeUrl();
    return `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(upiDeepLink)}&chs=200x200&choe=UTF-8&chld=L|2`;
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 text-xs" 
                  onClick={() => setShowQrCode(!showQrCode)}
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  {showQrCode ? "Hide QR" : "Show QR"}
                </Button>
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
            </div>
            <div className="text-sm font-mono bg-gray-100 p-2 rounded border border-gray-200 break-all">
              {upiId}
            </div>
            
            {showQrCode && (
              <div className="mt-4 flex flex-col items-center">
                <div className="bg-white p-4 rounded-md border">
                  <img 
                    src={generateQrCodeImageUrl()} 
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-xs text-center mt-2 text-gray-500">
                  Scan this QR code with any UPI app to donate ₹{amount}
                </p>
                <p className="text-xs text-center mt-1 text-gray-500">
                  QR code updates automatically when you change the amount
                </p>
              </div>
            )}
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
                  {bankDetailsCopied ? <Check className="h-4 w-4 mr-1" /> : <CopyIcon className="h-4 w-4 mr-1" />}
                  {bankDetailsCopied ? "Copied" : "Copy bank details"}
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
