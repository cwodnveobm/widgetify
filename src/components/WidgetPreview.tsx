
import React from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import { facebook, instagram, twitter, whatsapp } from 'lucide-react';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size } = config;

  const sizeMap = {
    small: '50px',
    medium: '60px',
    large: '70px',
  };

  const buttonStyle = {
    width: sizeMap[size || 'medium'],
    height: sizeMap[size || 'medium'],
    backgroundColor: primaryColor || '#25D366',
    position: 'absolute',
    bottom: '20px',
    [position || 'right']: '20px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties;

  const getIcon = () => {
    const iconSize = parseInt(sizeMap[size || 'medium'], 10) * 0.5;
    
    switch (type) {
      case 'whatsapp':
        return <whatsapp color="white" size={iconSize} />;
      case 'facebook':
        return <facebook color="white" size={iconSize} />;
      case 'instagram':
        return <instagram color="white" size={iconSize} />;
      case 'twitter':
        return <twitter color="white" size={iconSize} />;
      default:
        return <whatsapp color="white" size={iconSize} />;
    }
  };

  return (
    <div className="relative w-full h-full">
      <div style={buttonStyle} className="hover:scale-105">
        {getIcon()}
      </div>
    </div>
  );
};

export default WidgetPreview;
