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
  return <>
      <div style={{
      position: 'fixed',
      zIndex: 9999,
      ...getPositionStyles()
    }}>
        
      </div>
      
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
    </>;
};
export default DonatingWidget;