
import React from 'react';
import { X } from 'lucide-react';

interface BannerAdProps {
  position: 'top' | 'bottom';
  message: string;
  backgroundColor: string;
  textColor: string;
  onClose: () => void;
}

const BannerAd: React.FC<BannerAdProps> = ({
  position,
  message,
  backgroundColor,
  textColor,
  onClose
}) => {
  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';
  
  return (
    <div 
      className={`fixed left-0 right-0 z-50 ${positionClass} shadow-md`}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex-1 text-center" style={{ color: textColor }}>
          {message}
        </div>
        <button 
          onClick={onClose}
          className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          style={{ color: textColor }}
        >
          <X size={18} />
        </button>
      </div>
      <div className="absolute right-1 bottom-0 text-xs opacity-50" style={{ color: textColor }}>
        <a 
          href="https://widgetify.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="no-underline"
          style={{ color: textColor }}
        >
          Powered by Widgetify
        </a>
      </div>
    </div>
  );
};

export default BannerAd;
