import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, QrCode, Loader, Image } from 'lucide-react';
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

      // Clear previous QR code
      qrContainerRef.current.innerHTML = '';

      // Dynamic import for QRCode library
      const QRCodeModule = await import('qrcode');

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
      QRCodeModule.default.toCanvas(canvas, upiUrl, {
        width: 200
      }, function (error) {
        if (error) {
          console.error('Error generating QR code:', error);
          fallbackQRCode();
        } else {
          if (qrContainerRef.current) {
            qrContainerRef.current.innerHTML = '';
            qrContainerRef.current.appendChild(canvas);
            setQrCodeGenerated(true);
          }
        }
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Failed to load QRCode library or generate QR code:', error);
      fallbackQRCode();
      setIsGenerating(false);
    }
  };
  const fallbackQRCode = () => {
    if (!qrContainerRef.current) return;
    try {
      // First try using API-based QR code service
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=Donation`)}`;
      img.alt = "QR Code for UPI payment";
      img.width = 200;
      img.height = 200;
      img.onload = () => {
        setQrCodeGenerated(true);
        setQrCodeFailed(false);
      };
      img.onerror = () => {
        // If the API fails too, use the static fallback image
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

    // Use static fallback image - updated to use the newly uploaded image
    const fallbackImg = document.createElement('img');
    fallbackImg.src = '/lovable-uploads/f3abf221-51f1-4f78-86e7-68587902f35a.png';
    fallbackImg.alt = "QR Code for UPI payment";
    fallbackImg.width = 200;
    fallbackImg.height = 200;
    fallbackImg.style.objectFit = 'contain';
    qrContainerRef.current.innerHTML = '';
    qrContainerRef.current.appendChild(fallbackImg);
    setQrCodeFailed(true);
    setQrCodeGenerated(true);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[375px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-center">Support Us</DialogTitle>
          <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="p-4 pt-0">
          <p className="text-center text-sm text-gray-500 mb-4">
            Scan this QR code to make a donation
          </p>
          
          <div className="flex justify-center mb-4">
            
          </div>
          
          {qrCodeFailed && <p className="text-center text-xs text-amber-600 mb-3">
              Using fallback QR code. You can manually enter UPI details.
            </p>}
          
          <div className="mb-4">
            
            
          </div>
          
          <p className="text-center text-sm mb-1">
            UPI ID: <strong>{upiId}</strong>
          </p>
          
          <p className="text-center text-xs text-gray-500 mt-2">
            Thank you for your support!
          </p>
        </div>
      </DialogContent>
    </Dialog>;
};
export default DonationModal;