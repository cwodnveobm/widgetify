
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
    transition: 'transform 0.3s ease',
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

  const getIcon = () => {
    const iconSize = parseInt(sizeMap[size || 'medium'], 10) * 0.5;
    
    switch (type) {
      case 'whatsapp':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
            <path d="M17.6 6.32A8.78 8.78 0 0 0 12.14 4C7.82 4 4.3 7.53 4.3 11.86a7.8 7.8 0 0 0 1.04 3.9L4 20l4.33-1.13a7.78 7.78 0 0 0 3.8.98h.01c4.32 0 7.84-3.53 7.84-7.86 0-2.1-.82-4.07-2.3-5.55l-.08-.09ZM12.14 18.56h-.01c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.46.64.66-2.4-.16-.25a6.53 6.53 0 0 1-1-3.47c0-4 3.25-7.25 7.26-7.25a7.24 7.24 0 0 1 7.26 7.22c0 4-3.26 7.25-7.26 7.25ZM15.59 13.5c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.14.22-.55.71-.67.86-.13.14-.25.16-.47.05a5.87 5.87 0 0 1-1.74-1.07 6.58 6.58 0 0 1-1.2-1.5c-.12-.22-.01-.34.1-.45.1-.1.21-.25.32-.38.1-.13.14-.22.21-.37.07-.14.04-.27-.02-.38-.06-.1-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27c-.2.22-.77.76-.77 1.85 0 1.1.8 2.15.91 2.3.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.47.53.16 1 .14 1.38.08.42-.06 1.3-.53 1.48-1.04.19-.5.19-.94.13-1.03-.06-.08-.21-.14-.43-.25Z" />
          </svg>
        );
      case 'facebook':
        return <Facebook color="white" size={iconSize} />;
      case 'instagram':
        return <Instagram color="white" size={iconSize} />;
      case 'twitter':
        return <Twitter color="white" size={iconSize} />;
      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
            <path d="M17.6 6.32A8.78 8.78 0 0 0 12.14 4C7.82 4 4.3 7.53 4.3 11.86a7.8 7.8 0 0 0 1.04 3.9L4 20l4.33-1.13a7.78 7.78 0 0 0 3.8.98h.01c4.32 0 7.84-3.53 7.84-7.86 0-2.1-.82-4.07-2.3-5.55l-.08-.09ZM12.14 18.56h-.01c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.46.64.66-2.4-.16-.25a6.53 6.53 0 0 1-1-3.47c0-4 3.25-7.25 7.26-7.25a7.24 7.24 0 0 1 7.26 7.22c0 4-3.26 7.25-7.26 7.25ZM15.59 13.5c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.14.22-.55.71-.67.86-.13.14-.25.16-.47.05a5.87 5.87 0 0 1-1.74-1.07 6.58 6.58 0 0 1-1.2-1.5c-.12-.22-.01-.34.1-.45.1-.1.21-.25.32-.38.1-.13.14-.22.21-.37.07-.14.04-.27-.02-.38-.06-.1-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27c-.2.22-.77.76-.77 1.85 0 1.1.8 2.15.91 2.3.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.47.53.16 1 .14 1.38.08.42-.06 1.3-.53 1.48-1.04.19-.5.19-.94.13-1.03-.06-.08-.21-.14-.43-.25Z" />
          </svg>
        );
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="relative w-full h-full">
      {showChat && (
        <div style={chatWindowStyle}>
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
      <div style={buttonStyle} className="hover:scale-105" onClick={toggleChat}>
        {getIcon()}
      </div>
    </div>
  );
};

export default WidgetPreview;
