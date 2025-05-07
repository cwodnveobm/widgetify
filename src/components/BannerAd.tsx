
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BannerAdProps {
  position: 'top' | 'bottom';
  message: string;
  backgroundColor?: string;
  textColor?: string;
  showDelay?: number; // delay in milliseconds before showing the banner
  dismissible?: boolean;
  onClose?: () => void;
}

const BannerAd: React.FC<BannerAdProps> = ({
  position = 'top',
  message,
  backgroundColor = '#9b87f5',
  textColor = '#ffffff',
  showDelay = 0,
  dismissible = true,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show banner after specified delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // animation duration
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${isClosing ? 'opacity-0 translate-y-[-100%]' : 'opacity-100 translate-y-0'}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-center sm:text-left">{message}</div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="ml-4 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BannerAd;
