import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Heart, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DonationPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Show popup after 45 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 45000);

    // Auto-hide after 30 seconds if not closed
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 75000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('adnanmuhammad4393@okicici').then(() => {
      toast({
        title: "UPI ID Copied!",
        description: "UPI ID has been copied to your clipboard.",
      });
    });
  };

  const handleDonate = () => {
    const upiUrl = 'upi://pay?pa=adnanmuhammad4393@okicici&pn=Muhammed%20Adnan&am=50&cu=INR&tn=Donation%20for%20Widgetify';
    window.open(upiUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-foreground">Support Widgetify</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enjoying the experience? 🙌 Support the platform with a small donation—every bit helps us grow and improve! 
            You can contribute as little as ₹20 via UPI at <span className="font-mono text-primary">adnanmuhammad4393@okicici</span>. 
            Your support fuels new features, better performance, and continued development. Thank you for being part of our journey!
          </p>

          {/* UPI Details */}
          <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">UPI ID</p>
                <p className="font-mono text-sm text-foreground">adnanmuhammad4393@okicici</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUPI}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleDonate}
              className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Donate ₹50 via UPI
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopyUPI}
                className="flex-1 text-xs"
              >
                Copy UPI ID
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex-1 text-xs"
              >
                Maybe Later
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center">
            🙏 Every contribution, no matter how small, makes a difference!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationPopup;