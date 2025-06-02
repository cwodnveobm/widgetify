
import React, { useState } from 'react';
import DonationModal from './DonationModal';
import { Coffee, Heart, Gift, Star } from 'lucide-react';

interface DonatingWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  buttonText?: string;
  upiId?: string;
  name?: string;
  amount?: number;
  theme?: 'default' | 'premium' | 'minimal';
  icon?: 'heart' | 'coffee' | 'gift' | 'star';
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

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      default:
        return { bottom: '20px', right: '20px' };
    }
  };

  const getIcon = () => {
    const iconProps = { width: 16, height: 16, className: "text-white" };
    
    switch (icon) {
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'heart':
      default:
        return <Heart {...iconProps} />;
    }
  };

  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      border: 'none',
      padding: theme === 'minimal' ? '8px 12px' : '10px 16px',
      borderRadius: theme === 'premium' ? '8px' : '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: theme === 'minimal' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    if (showGradient) {
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`
      };
    }

    return {
      ...baseStyles,
      backgroundColor: primaryColor
    };
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const shadow = theme === 'minimal' ? '0 4px 6px rgba(0, 0, 0, 0.15)' : '0 6px 8px rgba(0, 0, 0, 0.2)';
    e.currentTarget.style.boxShadow = shadow;
    if (theme === 'premium') {
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    const shadow = theme === 'minimal' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.boxShadow = shadow;
    if (theme === 'premium') {
      e.currentTarget.style.transform = 'translateY(0)';
    }
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
          className={showPulse ? 'animate-pulse' : ''}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          aria-label={`${buttonText} - ${title}`}
        >
          {getIcon()}
          {buttonText}
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
