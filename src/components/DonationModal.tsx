
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CopyIcon, Check, QrCode, CreditCard } from 'lucide-react';

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
  const [showDodoPayment, setShowDodoPayment] = useState<boolean>(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
  const upiId = "adnanmuhammad4393@okicici";
  const bankDetails = {
    name: "Muhammed Adnan vv",
    accountNumber: "19020100094298",
    ifscCode: "FDRL0001902"
  };

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setBankDetailsCopied(false);
      setShowDodoPayment(false);
      setProcessingPayment(false);
      setPaymentSuccess(false);
    }
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
    // Use UPI QR code generator
    return `https://upiqr.in/api/qr?name=Widgetify&vpa=${upiId}&amount=${amount}&currency=INR`;
  };

  const processPayment = () => {
    setProcessingPayment(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      toast.success("Payment successful!");
    }, 2000);
  };

  // Generate a random transaction ID for the payment receipt
  const generateTransactionId = () => {
    return `DDP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
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
        
        {!showDodoPayment && !paymentSuccess && (
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Option 1: UPI */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-center mb-2">
                  <h3 className="font-medium">Pay with UPI</h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">UPI ID</span>
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
                        key={amount} // Force re-render when amount changes
                      />
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-500">
                      Scan this QR code with any UPI app to donate ₹{amount}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Option 2: Credit Card */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-center mb-2">
                  <h3 className="font-medium">Pay with Card</h3>
                </div>
                <div className="text-center py-4">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-gray-600 mb-4">
                    Secure card payment
                  </p>
                  <Button 
                    onClick={() => setShowDodoPayment(true)} 
                    className="w-full"
                  >
                    Pay ₹{amount}
                  </Button>
                </div>
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
                    {bankDetailsCopied ? <Check className="h-4 w-4 mr-1" /> : <CopyIcon className="h-4 w-4 mr-1" />}
                    {bankDetailsCopied ? "Copied" : "Copy bank details"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Dodo Payment Form */}
        {showDodoPayment && !paymentSuccess && (
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Amount (₹)
              </label>
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <span className="px-3 bg-gray-50 border-r border-gray-200 text-gray-500">₹</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={handleAmountChange}
                  min={14} 
                  max={2214}
                  className="flex-1 p-2 outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Card Information
              </label>
              <input 
                type="text" 
                placeholder="Card Number" 
                className="w-full p-2 border border-gray-200 rounded-md mb-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  className="p-2 border border-gray-200 rounded-md text-sm"
                />
                <input 
                  type="text" 
                  placeholder="CVC" 
                  className="p-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Cardholder Name
              </label>
              <input 
                type="text" 
                placeholder="Name on card" 
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              />
            </div>
            
            <Button 
              onClick={processPayment} 
              className="w-full" 
              disabled={processingPayment}
            >
              {processingPayment ? "Processing..." : `Pay ₹${amount}`}
            </Button>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowDodoPayment(false)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {/* Payment Success */}
        {paymentSuccess && (
          <div className="py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for your donation of ₹{amount}
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-left mb-4">
                <p className="text-sm mb-1"><span className="font-medium">Amount:</span> ₹{amount}</p>
                <p className="text-sm mb-1"><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                <p className="text-sm"><span className="font-medium">Transaction ID:</span> {generateTransactionId()}</p>
              </div>
              <Button 
                onClick={onClose} 
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
        
        {!paymentSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Done</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
