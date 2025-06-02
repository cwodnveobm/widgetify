
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, QrCode, Loader } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  upiId?: string;
  name?: string;
  title?: string;
  description?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 299,
  upiId = "adnanmuhammad4393@okicici",
  name = "Muhammed Adnan",
  title = "Support Us",
  description = "Scan this QR code to make a donation"
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [qrCodeFailed, setQrCodeFailed] = useState<boolean>(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && amount) {
      generateQR();
    }
  }, [isOpen, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    }
  };

  const generateQR = async () => {
    if (!qrContainerRef.current) return;
    
    try {
      setIsGenerating(true);
      setQrCodeGenerated(false);
      setQrCodeFailed(false);

      qrContainerRef.current.innerHTML = '';

      const img = document.createElement('img');
      img.src = '/lovable-uploads/20d2f0ed-b9a7-4342-a47a-f886ae3f0e2c.png';
      img.alt = "QR Code for UPI payment";
      img.width = 200;
      img.height = 200;
      img.style.objectFit = 'contain';
      
      img.onload = () => {
        setQrCodeGenerated(true);
        setIsGenerating(false);
      };
      
      img.onerror = () => {
        fallbackQRCode();
      };
      
      qrContainerRef.current.appendChild(img);
    } catch (error) {
      console.error('Failed to load QR code:', error);
      fallbackQRCode();
    }
  };

  const fallbackQRCode = () => {
    if (!qrContainerRef.current) return;
    
    try {
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=Donation`)}`;
      img.alt = "QR Code for UPI payment";
      img.width = 200;
      img.height = 200;
      
      img.onload = () => {
        setQrCodeGenerated(true);
        setQrCodeFailed(false);
        setIsGenerating(false);
      };
      
      img.onerror = () => {
        useStaticFallbackImage();
      };
      
      qrContainerRef.current.innerHTML = '';
      qrContainerRef.current.appendChild(img);
    } catch (error) {
      console.error('Failed to load fallback QR code from API:', error);
      useStaticFallbackImage();
    }
  };

  const useStaticFallbackImage = () => {
    if (!qrContainerRef.current) return;

    const fallbackImg = document.createElement('img');
    fallbackImg.src = '/lovable-uploads/f3abf221-51f1-4f78-86e7-68587902f35a.png';
    fallbackImg.alt = "QR Code for UPI payment";
    fallbackImg.width = 200;
    fallbackImg.height = 200;
    fallbackImg.style.objectFit = 'contain';
    
    fallbackImg.onload = () => {
      setQrCodeFailed(true);
      setQrCodeGenerated(true);
      setIsGenerating(false);
    };
    
    qrContainerRef.current.innerHTML = '';
    qrContainerRef.current.appendChild(fallbackImg);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[375px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {description}
          </DialogDescription>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <div className="flex justify-center mb-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-4">
                <Loader className="h-8 w-8 animate-spin text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Generating QR code...</span>
              </div>
            ) : (
              <div ref={qrContainerRef} className="border border-gray-200 rounded-md p-4 bg-white"></div>
            )}
          </div>
          
          {qrCodeFailed && (
            <p className="text-center text-xs text-amber-600 mb-3">
              Using fallback QR code. You can manually enter UPI details.
            </p>
          )}
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Donation Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full"
              min="1"
              onBlur={() => generateQR()}
            />
            <Button 
              onClick={generateQR} 
              className="w-full mt-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <QrCode className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Refresh QR Code'}
            </Button>
          </div>
          
          <p className="text-center text-sm mb-1">
            UPI ID: <strong>{upiId}</strong>
          </p>
          
          <p className="text-center text-xs text-gray-500 mt-2">
            Thank you for your support!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
