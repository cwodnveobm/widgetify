
import React, { useState, useEffect } from 'react';
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

  // Calculate position styles based on the position prop
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right':
        return {
          bottom: '20px',
          right: '20px'
        };
      case 'bottom-left':
        return {
          bottom: '20px',
          left: '20px'
        };
      case 'top-right':
        return {
          top: '20px',
          right: '20px'
        };
      case 'top-left':
        return {
          top: '20px',
          left: '20px'
        };
      default:
        return {
          bottom: '20px',
          right: '20px'
        };
    }
  };

  // Get icon component based on icon prop
  const getIcon = () => {
    const iconProps = { width: 16, height: 16, fill: "white" };
    
    switch (icon) {
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'heart':
      default:
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
        </svg>;
    }
  };

  // Get button styles based on theme
  const getButtonStyles = () => {
    const baseStyles = {
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
          onMouseOver={(e) => {
            const shadow = theme === 'minimal' ? '0 4px 6px rgba(0, 0, 0, 0.15)' : '0 6px 8px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.boxShadow = shadow;
            if (theme === 'premium') {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            const shadow = theme === 'minimal' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.boxShadow = shadow;
            if (theme === 'premium') {
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
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
