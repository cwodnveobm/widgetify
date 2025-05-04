
import React, { useState } from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size } = config;
  const [showChat, setShowChat] = useState(false);

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
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  } as React.CSSProperties;

  const chatWindowStyle = {
    position: 'absolute',
    bottom: '90px',
    [position || 'right']: '20px',
    width: '250px',
    height: '300px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    opacity: showChat ? 1 : 0,
    transform: showChat ? 'translateY(0)' : 'translateY(20px)',
    visibility: showChat ? 'visible' : 'hidden',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties;

  const WhatsAppIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#006A8E"/>
        <circle cx="21" cy="3" r="3" fill="#FF4D4D"/>
        <path d="M17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="#FFFFFF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 8.5C11.3284 8.5 12 7.82843 12 7C12 6.17157 11.3284 5.5 10.5 5.5C9.67157 5.5 9 6.17157 9 7C9 7.82843 9.67157 8.5 10.5 8.5ZM10.5 18.5C11.3284 18.5 12 17.8284 12 17C12 16.1716 11.3284 15.5 10.5 15.5C9.67157 15.5 9 16.1716 9 17C9 17.8284 9.67157 18.5 10.5 18.5Z" fill="#FFFFFF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12.5C18.3284 12.5 19 11.8284 19 11C19 10.1716 18.3284 9.5 17.5 9.5C16.6716 9.5 16 10.1716 16 11C16 11.8284 16.6716 12.5 17.5 12.5Z" fill="#FFFFFF"/>
        <path d="M12.01 4.5C7.96 4.5 4.5 7.96 4.5 12.01C4.5 16.06 7.96 19.5 12.01 19.5C16.06 19.5 19.5 16.06 19.5 12.01C19.5 7.96 16.06 4.5 12.01 4.5ZM12.01 18.2C8.68 18.2 5.8 15.32 5.8 12.01C5.8 8.7 8.68 5.8 12.01 5.8C15.33 5.8 18.2 8.7 18.2 12.01C18.2 15.32 15.32 18.2 12.01 18.2Z" fill="#FFFFFF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8.9C9.5 9.32 9.14 9.65 8.7 9.65C8.26 9.65 7.9 9.32 7.9 8.9C7.9 8.48 8.26 8.15 8.7 8.15C9.14 8.15 9.5 8.48 9.5 8.9ZM16.1 8.9C16.1 9.32 15.74 9.65 15.3 9.65C14.86 9.65 14.5 9.32 14.5 8.9C14.5 8.48 14.86 8.15 15.3 8.15C15.74 8.15 16.1 8.48 16.1 8.9Z" fill="#FFFFFF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.7 14.87C16.7 16.27 14.59 17.4 12 17.4C9.41 17.4 7.3 16.27 7.3 14.87C7.3 14.1 7.94 13.42 8.96 12.99C9.31 12.82 9.72 12.96 9.89 13.31C10.06 13.66 9.92 14.07 9.57 14.24C9.02 14.5 8.7 14.83 8.7 15.13C8.7 15.8 10.24 16.5 12 16.5C13.76 16.5 15.3 15.8 15.3 15.13C15.3 14.81 14.9 14.46 14.28 14.2C13.92 14.04 13.76 13.63 13.92 13.27C14.08 12.91 14.49 12.75 14.85 12.91C15.92 13.33 16.7 14.05 16.7 14.87Z" fill="#FFFFFF"/>
      </g>
    </svg>
  );

  const getIcon = () => {
    const iconSize = parseInt(sizeMap[size || 'medium'], 10) * 0.5;
    
    switch (type) {
      case 'whatsapp':
        return <WhatsAppIcon size={iconSize} />;
      case 'facebook':
        return <Facebook size={iconSize} color="white" />;
      case 'instagram':
        return <Instagram size={iconSize} color="white" />;
      case 'twitter':
        return <Twitter size={iconSize} color="white" />;
      default:
        return <WhatsAppIcon size={iconSize} />;
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="relative w-full h-full">
      {showChat && (
        <div style={chatWindowStyle} className="animate-fade-in">
          <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
            <div className="font-medium">Chat</div>
            <div className="text-xs text-gray-500">Powered by Widgetify</div>
          </div>
          <div className="flex-grow p-3 overflow-y-auto">
            <div className="bg-gray-100 p-2 rounded-lg mb-2 max-w-[80%]">
              <p className="text-xs">How can I help you today?</p>
            </div>
          </div>
          <div className="p-3 border-t bg-gray-50 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow text-xs p-2 border rounded"
                disabled
              />
              <button
                className="bg-gray-200 p-2 rounded"
                disabled
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <div 
        style={buttonStyle} 
        className="hover:scale-105 hover:shadow-lg" 
        onClick={toggleChat}
      >
        {getIcon()}
      </div>
    </div>
  );
};

export default WidgetPreview;
