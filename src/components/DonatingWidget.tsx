
import React, { useState } from 'react';
import DonationModal from './DonationModal';
import { Coffee, Heart, Gift, Star, DollarSign } from 'lucide-react';

interface DonatingWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  buttonText?: string;
  upiId?: string;
  name?: string;
  amount?: number;
  theme?: 'default' | 'premium' | 'minimal' | 'modern';
  icon?: 'heart' | 'coffee' | 'gift' | 'star' | 'dollar';
  showPulse?: boolean;
  showGradient?: boolean;
  title?: string;
  description?: string;
}

const DonatingWidget: React.FC<DonatingWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#fa0000',
  buttonText = 'Donate',
  upiId = 'adnanmuhammad4393@okicici',
  name = 'Muhammed Adnan',
  amount = 299,
  theme = 'default',
  icon = 'heart',
  showPulse = false,
  showGradient = false,
  title = 'Support Us',
  description = 'Scan this QR code to make a donation'
}) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom-right':
        return { bottom: '24px', right: '24px' };
      case 'bottom-left':
        return { bottom: '24px', left: '24px' };
      case 'top-right':
        return { top: '24px', right: '24px' };
      case 'top-left':
        return { top: '24px', left: '24px' };
      default:
        return { bottom: '24px', right: '24px' };
    }
  };

  const getIcon = () => {
    const iconProps = { 
      width: 18, 
      height: 18, 
      className: "text-white drop-shadow-sm" 
    };
    
    switch (icon) {
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'dollar':
        return <DollarSign {...iconProps} />;
      case 'heart':
      default:
        return <Heart {...iconProps} />;
    }
  };

  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: 'white',
      border: 'none',
      padding: theme === 'minimal' ? '12px 16px' : theme === 'modern' ? '16px 24px' : '14px 20px',
      borderRadius: theme === 'premium' ? '16px' : theme === 'minimal' ? '8px' : theme === 'modern' ? '20px' : '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: theme === 'modern' ? '16px' : '15px',
      fontWeight: theme === 'modern' ? '700' : '600',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isHovered 
        ? theme === 'modern' 
          ? '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.1)' 
          : '0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : theme === 'modern'
          ? '0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      transform: isHovered 
        ? theme === 'modern' 
          ? 'translateY(-4px) scale(1.05)' 
          : 'translateY(-2px) scale(1.02)' 
        : 'translateY(0) scale(1)',
      backdropFilter: 'blur(10px)',
    };

    if (showGradient) {
      return {
        ...baseStyles,
        background: theme === 'modern' 
          ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}88, ${primaryColor}dd)`
          : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd, ${primaryColor}bb)`
      };
    }

    return {
      ...baseStyles,
      backgroundColor: primaryColor,
      backgroundImage: isHovered 
        ? theme === 'modern'
          ? `linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent)`
          : `linear-gradient(135deg, transparent, rgba(255,255,255,0.1))`
        : 'none'
    };
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: 9999,
          ...getPositionStyles()
        }}
      >
        <button
          onClick={() => setIsDonationModalOpen(true)}
          style={getButtonStyles()}
          className={`${showPulse ? 'animate-pulse' : ''} group relative overflow-hidden`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`${buttonText} - ${title}`}
        >
          {/* Enhanced shine effect for modern theme */}
          <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform ${theme === 'modern' ? 'duration-700' : 'duration-1000'} bg-gradient-to-r from-transparent ${theme === 'modern' ? 'via-white/30' : 'via-white/20'} to-transparent`}></div>
          
          <div className="relative z-10 flex items-center gap-2">
            <div className={`transition-transform duration-300 ${isHovered ? theme === 'modern' ? 'scale-125' : 'scale-110' : 'scale-100'}`}>
              {getIcon()}
            </div>
            <span className="relative">
              {buttonText}
            </span>
          </div>
        </button>
      </div>
      
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)}
        initialAmount={amount}
        upiId={upiId}
        name={name}
        title={title}
        description={description}
      />
    </>
  );
};

export default DonatingWidget;
