
import React, { useState, useEffect } from 'react';
import DonationModal from './DonationModal';

interface DonatingWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  buttonText?: string;
  upiId?: string;
  name?: string;
  amount?: number;
}

const DonatingWidget: React.FC<DonatingWidgetProps> = ({
  position = 'bottom-right',
  primaryColor = '#fa0000',
  buttonText = 'Donate',
  upiId = 'adnanmuhammad4393@okicici',
  name = 'Muhammed Adnan',
  amount = 299
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
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
          </svg>
          {buttonText}
        </button>
      </div>
      
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)}
        initialAmount={amount}
        upiId={upiId}
        name={name}
      />
    </>
  );
};

export default DonatingWidget;
