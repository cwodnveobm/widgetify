
import React from 'react';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import DonationModal from './DonationModal';

interface DonatingWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  buttonText?: string;
}

const DonatingWidget: React.FC<DonatingWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#8B5CF6',
  buttonText = 'Donate Us'
}) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  // Calculate position styles based on the position prop
  const getPositionStyles = () => {
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: primaryColor,
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
          onClick={() => setIsDonationModalOpen(true)}
        >
          <Heart size={16} />
          {buttonText}
        </button>
      </div>
      
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />
    </>
  );
};

export default DonatingWidget;
