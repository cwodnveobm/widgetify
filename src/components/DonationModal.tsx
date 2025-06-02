
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, QrCode, Loader, Sparkles, Heart } from 'lucide-react';

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

  // Preset amounts for quick selection
  const presetAmounts = [99, 199, 299, 499, 999];

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
      img.width = 220;
      img.height = 220;
      img.style.objectFit = 'contain';
      img.style.borderRadius = '12px';
      img.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      
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
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=Donation`)}`;
      img.alt = "QR Code for UPI payment";
      img.width = 220;
      img.height = 220;
      img.style.borderRadius = '12px';
      img.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      
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
    fallbackImg.width = 220;
    fallbackImg.height = 220;
    fallbackImg.style.objectFit = 'contain';
    fallbackImg.style.borderRadius = '12px';
    fallbackImg.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
    
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
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-2xl">
        {/* Enhanced Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-300" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-purple-100 mt-2">
              {description}
            </DialogDescription>
          </div>
          <button 
            className="absolute right-4 top-4 rounded-full p-2 bg-white/20 backdrop-blur-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:pointer-events-none z-20" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          {/* QR Code Section */}
          <div className="flex justify-center mb-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                <Loader className="h-8 w-8 animate-spin text-purple-500" />
                <span className="mt-3 text-sm text-gray-600 font-medium">Generating QR code...</span>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                <div ref={qrContainerRef}></div>
              </div>
            )}
          </div>
          
          {qrCodeFailed && (
            <div className="text-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-700 font-medium">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Using fallback QR code. You can manually enter UPI details.
              </p>
            </div>
          )}
          
          {/* Quick Amount Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    amount === preset
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Amount Input */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-semibold mb-2 text-gray-700">
              Custom Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full text-lg font-semibold text-center border-2 border-purple-200 focus:border-purple-500 rounded-xl py-3"
              min="1"
              onBlur={() => generateQR()}
            />
            <Button 
              onClick={generateQR} 
              className="w-full mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Refresh QR Code
                </>
              )}
            </Button>
          </div>
          
          {/* UPI ID Display */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
            <p className="text-sm mb-1 text-gray-600">
              UPI ID
            </p>
            <p className="font-bold text-purple-700 text-lg">
              {upiId}
            </p>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-red-400" />
            Thank you for your generous support!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
