
import React, { useState } from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import { Facebook, Instagram, Twitter, Linkedin, X, Github, Youtube, Twitch, Slack, MessageCircle } from 'lucide-react';
import BannerAd from './BannerAd';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size, networks } = config;
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // For banner ad type
  if (type === 'banner-ad' && showBanner) {
    const bannerConfig = config as any;
    return (
      <BannerAd
        position={bannerConfig.position || 'top'}
        message={bannerConfig.message || 'Special offer!'}
        backgroundColor={bannerConfig.backgroundColor || primaryColor || '#9b87f5'}
        textColor={bannerConfig.textColor || '#ffffff'}
        onClose={() => setShowBanner(false)}
      />
    );
  }

  // For chat widget type - simplified for now
  if (type === 'chat-widget') {
    // Just show a placeholder for now
    return (
      <div 
        className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg cursor-pointer"
        style={{ backgroundColor: primaryColor || '#4CAF50' }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <span>Chat with us</span>
        </div>
      </div>
    );
  }

  // For social share type - simplified for now
  if (type === 'social-share') {
    return (
      <div className="fixed bottom-5 right-5 flex flex-col gap-2">
        <div className="bg-white p-2 rounded-lg shadow-lg text-xs text-center">
          Share on social media
        </div>
        <div className="flex gap-2">
          {networks?.includes('facebook') && (
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <Facebook size={16} />
            </div>
          )}
          {networks?.includes('twitter') && (
            <div className="bg-blue-400 text-white p-2 rounded-full">
              <Twitter size={16} />
            </div>
          )}
          {networks?.includes('linkedin') && (
            <div className="bg-blue-800 text-white p-2 rounded-full">
              <Linkedin size={16} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // For google translate type - simplified for now
  if (type === 'google-translate') {
    return (
      <div className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
          </svg>
          <span>Translate</span>
        </div>
      </div>
    );
  }

  // Default widget behavior (from original code)
  const sizeMap = {
    small: '50px',
    medium: '60px',
    large: '70px',
  };

  const buttonSize = sizeMap[size || 'medium'];
  const buttonStyle = {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: primaryColor || '#25D366',
    position: 'absolute',
    bottom: '20px',
    [position === 'left' ? 'left' : 'right']: '20px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    zIndex: 50,
  } as React.CSSProperties;

  const popupStyle = {
    position: 'absolute',
    bottom: '90px',
    [position === 'left' ? 'left' : 'right']: '20px',
    width: '280px',
    height: '350px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    opacity: showPopup ? 1 : 0,
    transform: showPopup ? 'translateY(0)' : 'translateY(20px)',
    visibility: showPopup ? 'visible' : 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    overflow: 'hidden',
  } as React.CSSProperties;

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Custom Icon Components
  const WhatsAppIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32zm-5.6 12.2c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.47.65.66-2.41-.16-.25a6.63 6.63 0 0 1-1.02-3.52 6.57 6.57 0 0 1 11.29-4.57 6.45 6.45 0 0 1 2 4.55 6.57 6.57 0 0 1-6.57 6.57l-.16.04zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33-.11 0-.24-.02-.37-.02-.13 0-.34.05-.52.25-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2 .1.14 1.4 2.16 3.42 3.02.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.12-.37-.21z" fill="white"/>
    </svg>
  );

  const TelegramIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
    </svg>
  );

  const getIcon = () => {
    const iconSize = parseInt(buttonSize, 10) * 0.5;
    
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
        return <Linkedin size={iconSize} color="white" />;
      case 'youtube':
        return <Youtube size={iconSize} color="white" />;
      case 'github':
        return <Github size={iconSize} color="white" />;
      case 'twitch':
        return <Twitch size={iconSize} color="white" />;
      case 'slack':
        return <Slack size={iconSize} color="white" />;
      case 'discord':
        return <MessageCircle size={iconSize} color="white" />;
      default:
        return <MessageCircle size={iconSize} color="white" />;
    }
  };

  const widgetContent = showPopup && (
    <div style={popupStyle} className="animate-fade-in">
      <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
        <div className="font-medium">{type.toUpperCase()}</div>
        <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <div className="flex-grow p-3 overflow-y-auto bg-white">
        <div className="bg-gray-100 p-2 rounded-lg mb-2 max-w-[80%]">
          <p className="text-xs">How can I help you today?</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {widgetContent}
      
      <div 
        style={buttonStyle} 
        className="hover:scale-105 hover:shadow-lg" 
        onClick={togglePopup}
      >
        {getIcon()}
      </div>
    </div>
  );
};

export default WidgetPreview;
