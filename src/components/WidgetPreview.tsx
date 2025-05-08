
import React, { useState } from 'react';
import { WidgetConfig } from '@/lib/widgetUtils';
import { Facebook, Instagram, Twitter, Linkedin, X, Github, Youtube, Twitch, Slack, MessageCircle, Star, Phone, MessageSquare } from 'lucide-react';

interface WidgetPreviewProps {
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config }) => {
  const { type, position, primaryColor, size, networks } = config;
  const [showPopup, setShowPopup] = useState(false);

  const sizeMap = {
    small: '50px',
    medium: '60px',
    large: '70px',
  };

  const buttonStyle = {
    width: sizeMap[size || 'medium'],
    height: sizeMap[size || 'medium'],
    backgroundColor: primaryColor || '#25D366',
    position: 'absolute' as const,
    bottom: '20px',
    [position || 'right']: '20px',
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
    position: 'absolute' as const,
    bottom: '90px',
    [position || 'right']: '20px',
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

  const socialButtonsContainerStyle = {
    position: 'absolute' as const,
    bottom: '90px',
    [position || 'right']: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'all 0.3s ease',
    opacity: showPopup ? 1 : 0,
    transform: showPopup ? 'translateY(0)' : 'translateY(20px)',
    visibility: showPopup ? 'visible' : 'hidden',
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

  const tooltipStyle = {
    position: 'absolute' as const,
    bottom: parseInt(sizeMap[size || 'medium']) + 10 + 'px',
    [position || 'right']: '10px',
    backgroundColor: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    opacity: 0.8,
  } as React.CSSProperties;

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

  const LinkedInIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );

  const ShareIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
    </svg>
  );

  const GoogleTranslateIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  );

  const DiscordIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.898-.608 1.297a19.42 19.42 0 0 0-5.834 0 12.517 12.517 0 0 0-.617-1.297.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.028C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.209 13.209 0 0 1-1.872-.878.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.291.074.074 0 0 1 .077-.01c3.928 1.764 8.18 1.764 12.061 0a.074.074 0 0 1 .078.01c.12.098.245.198.372.292a.077.077 0 0 0-.006.127c-.598.344-1.22.635-1.873.877a.077.077 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.964 19.964 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
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
      case 'google-translate':
        return <GoogleTranslateIcon size={iconSize} />;
      case 'youtube':
        return <Youtube size={iconSize} color="white" />;
      case 'github':
        return <Github size={iconSize} color="white" />;
      case 'twitch':
        return <Twitch size={iconSize} color="white" />;
      case 'slack':
        return <Slack size={iconSize} color="white" />;
      case 'discord':
        return <DiscordIcon size={iconSize} />;
      case 'call-now':
        return <Phone size={iconSize} color="white" />;
      case 'review-now':
        return <Star size={iconSize} color="white" />;
      case 'live-chat':
        return <MessageSquare size={iconSize} color="white" />;
      case 'follow-us':
        const platform = config.followPlatform || 'linkedin';
        if (platform === 'instagram') return <Instagram size={iconSize} color="white" />;
        if (platform === 'youtube') return <Youtube size={iconSize} color="white" />;
        return <Linkedin size={iconSize} color="white" />;
      default:
        return <MessageCircle size={iconSize} color="white" />;
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
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

  const getTooltipText = () => {
    switch (type) {
      case 'call-now':
        return 'Call Now';
      case 'review-now':
        return 'Leave a Review';
      case 'live-chat':
        return 'Live Chat';
      case 'follow-us':
        const platform = config.followPlatform || 'linkedin';
        return `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
      default:
        return null;
    }
  };

  const getWidgetTitle = () => {
    switch (type) {
      case 'whatsapp': return 'WhatsApp Chat';
      case 'facebook': return 'Facebook Messenger';
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter';
      case 'telegram': return 'Telegram';
      case 'linkedin': return 'LinkedIn';
      case 'social-share': return 'Share';
      case 'google-translate': return 'Google Translate';
      case 'youtube': return 'YouTube';
      case 'github': return 'GitHub';
      case 'twitch': return 'Twitch';
      case 'slack': return 'Slack';
      case 'discord': return 'Discord';
      case 'call-now': return 'Call Now';
      case 'review-now': return 'Leave a Review';
      case 'follow-us': return 'Follow Us';
      case 'live-chat': return 'Live Chat';
      default: return 'Chat';
    }
  };

  const getWidgetContent = () => {
    switch (type) {
      case 'social-share':
        return renderSocialButtons();
      case 'google-translate':
        return (
          <div style={popupStyle} className="animate-fade-in">
            <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
              <div className="font-medium">{getWidgetTitle()}</div>
              <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto bg-white">
              <div className="bg-gray-100 p-2 rounded-lg mb-2">
                <p className="text-xs text-center">Standard Google Translate Element</p>
                <div className="border border-dashed p-2 mt-2 text-center">
                  <code className="text-xs">&lt;div id="google_translate_element"&gt;&lt;/div&gt;</code>
                </div>
              </div>
            </div>
          </div>
        );
      case 'call-now':
      case 'review-now':
      case 'follow-us':
        // These types show tooltips instead of popups
        const tooltipText = getTooltipText();
        return tooltipText ? <div style={tooltipStyle}>{tooltipText}</div> : null;
      case 'live-chat':
        // Live Chat content
        return (
          <div style={popupStyle} className="animate-fade-in">
            <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
              <div className="font-medium">{getWidgetTitle()}</div>
              <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 text-lg">
                ×
              </button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto bg-white flex flex-col justify-center items-center">
              <div className="text-center p-4">
                <MessageSquare className="mx-auto mb-3 text-purple-500" size={40} />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-2">Coming Soon!</p>
                <p className="text-sm text-gray-500">
                  We're working hard to bring you real-time chat support.
                </p>
              </div>
            </div>
            <div className="p-3 border-t bg-gray-50 rounded-b-lg">
              <div className="text-xs text-gray-500 text-center">
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
          </div>
        );
      default:
        return (
          <div style={popupStyle} className="animate-fade-in">
            <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-lg border-b">
              <div className="font-medium">{getWidgetTitle()}</div>
              <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700 text-lg">
                ×
              </button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto bg-white">
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
                />
                <button
                  className="bg-gray-200 p-2 rounded"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
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
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      {showPopup && getWidgetContent()}
      {!showPopup && (type === 'call-now' || type === 'review-now' || type === 'follow-us' || type === 'live-chat') && getWidgetContent()}
      
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
