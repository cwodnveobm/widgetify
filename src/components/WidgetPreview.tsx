
import React, { useState } from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size, networks } = config;
  const [showChat, setShowChat] = useState(false);
  const [showSocialButtons, setShowSocialButtons] = useState(false);

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

  const socialButtonsContainerStyle = {
    position: 'absolute',
    bottom: '90px',
    [position || 'right']: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'all 0.3s ease',
    opacity: showSocialButtons ? 1 : 0,
    transform: showSocialButtons ? 'translateY(0)' : 'translateY(20px)',
    visibility: showSocialButtons ? 'visible' : 'hidden',
  } as React.CSSProperties;

  const socialButtonStyle = (color: string) => ({
    width: parseInt(sizeMap[size || 'medium'], 10) * 0.8 + 'px',
    height: parseInt(sizeMap[size || 'medium'], 10) * 0.8 + 'px',
    backgroundColor: color,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
  });

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

  const TelegramIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
    </svg>
  );

  const LinkedInIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );

  const ShareIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
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
      case 'telegram':
        return <TelegramIcon size={iconSize} />;
      case 'linkedin':
        return <LinkedInIcon size={iconSize} />;
      case 'social-share':
        return <ShareIcon size={iconSize} />;
      default:
        return <WhatsAppIcon size={iconSize} />;
    }
  };

  const toggleChat = () => {
    if (type === 'social-share') {
      setShowSocialButtons(!showSocialButtons);
    } else {
      setShowChat(!showChat);
    }
  };

  const renderSocialButtons = () => {
    if (type !== 'social-share' || !networks) return null;
    
    return (
      <div style={socialButtonsContainerStyle} className="animate-fade-in">
        {networks.includes('facebook') && (
          <div style={socialButtonStyle('#1877F2')}>
            <Facebook size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
        {networks.includes('twitter') && (
          <div style={socialButtonStyle('#1DA1F2')}>
            <Twitter size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
        {networks.includes('linkedin') && (
          <div style={socialButtonStyle('#0077B5')}>
            <Linkedin size={parseInt(sizeMap[size || 'medium'], 10) * 0.4} color="white" />
          </div>
        )}
        <div className="text-xs text-gray-500 text-center mt-1">
          <a 
            href="https://widgetify.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 no-underline"
          >
            Powered by Widgetify
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      {showChat && type !== 'social-share' && (
        <div style={chatWindowStyle} className="animate-fade-in">
          <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
            <div className="font-medium">Chat</div>
            <div className="text-xs text-gray-500">
              <a 
                href="https://widgetify.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 no-underline"
              >
                Powered by Widgetify
              </a>
            </div>
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

      {renderSocialButtons()}

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
