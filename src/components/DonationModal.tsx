
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  upiId?: string;
  name?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ 
  isOpen, 
  onClose, 
  initialAmount = 299,
  upiId = "adnanmuhammad4393@okicici",
  name = "Muhammed Adnan vv"
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && amount) {
      generateQR();
    }
  }, [isOpen, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);
  };

  const generateQR = async () => {
    if (!qrContainerRef.current) return;
    
    try {
      // Dynamic import for QRCode library
      const QRCodeModule = await import('qrcode');
      
      // Clear previous QR code
      qrContainerRef.current.innerHTML = '';
      
      // Create the UPI URL for donation
      const baseUrl = 'upi://pay';
      const params = new URLSearchParams();
      params.append('pa', upiId);
      params.append('pn', name);
      params.append('am', amount.toString());
      params.append('tn', 'Donation');
      const upiUrl = `${baseUrl}?${params.toString()}`;
      
      // Generate QR code
      const canvas = document.createElement('canvas');
      QRCodeModule.default.toCanvas(canvas, upiUrl, { width: 200 }, function(error) {
        if (error) console.error('Error generating QR code:', error);
      });
      
      if (qrContainerRef.current) {
        qrContainerRef.current.appendChild(canvas);
      }
    } catch (error) {
      console.error('Failed to load QRCode library or generate QR code:', error);
      
      // Fallback to using API-based QR code if the library fails
      if (qrContainerRef.current) {
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=Donation`)}`;
        img.alt = "QR Code for UPI payment";
        img.width = 200;
        img.height = 200;
        qrContainerRef.current.innerHTML = '';
        qrContainerRef.current.appendChild(img);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[375px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-center">Support Us</DialogTitle>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <p className="text-center text-sm text-gray-500 mb-4">
            Scan this QR code to make a donation
          </p>
          
          <div className="flex justify-center mb-4">
            <div 
              ref={qrContainerRef} 
              className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-sm text-gray-500"
            >
              Loading QR Code...
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              onBlur={generateQR}
              className="w-full text-right"
            />
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
