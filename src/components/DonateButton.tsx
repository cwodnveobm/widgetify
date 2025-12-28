import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface DonateButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const DonateButton: React.FC<DonateButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  showText = true,
}) => {
  const handleDonate = () => {
    window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleDonate}
      variant={variant}
      size={size}
      className={`${className} gap-2`}
    >
      {showIcon && <Heart className="w-4 h-4" />}
      {showText && 'Donate'}
    </Button>
  );
};

export default DonateButton;
