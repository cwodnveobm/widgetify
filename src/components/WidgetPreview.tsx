import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import SocialShare from './SocialShare';
import GoogleTranslate from './GoogleTranslate';
import BannerAd from './BannerAd';

export interface ChatWidgetConfig {
  title: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
}

export interface SocialShareConfig {
  platforms: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  url: string;
}

export interface GoogleTranslateConfig {
  defaultLanguage: string;
}

export interface BannerAdConfig {
  position: 'top' | 'bottom';
  message: string;
  backgroundColor: string;
  textColor: string;
}

// Update WidgetConfig type to include BannerAdConfig
export type WidgetConfig = ChatWidgetConfig | SocialShareConfig | GoogleTranslateConfig | BannerAdConfig;

interface WidgetPreviewProps {
  type: string;
  config: WidgetConfig;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ type, config }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  if (type === 'chat-widget') {
    const chatConfig = config as ChatWidgetConfig;
    return (
      <ChatWidget
        title={chatConfig.title || 'Need help?'}
        message={chatConfig.message || 'Chat with us!'}
        buttonText={chatConfig.buttonText || 'Open Chat'}
        backgroundColor={chatConfig.backgroundColor || '#4CAF50'}
        textColor={chatConfig.textColor || '#fff'}
        isOpen={chatOpen}
        onToggle={handleChatToggle}
      />
    );
  }

  if (type === 'social-share') {
    const socialConfig = config as SocialShareConfig;
    return <SocialShare platforms={socialConfig.platforms} url={socialConfig.url || 'https://example.com'} />;
  }

  if (type === 'google-translate') {
    const googleConfig = config as GoogleTranslateConfig;
    return <GoogleTranslate defaultLanguage={googleConfig.defaultLanguage || 'en'} />;
  }

  // Render banner ad widget
  if (type === 'banner-ad' && bannerVisible) {
    const bannerConfig = config as BannerAdConfig;
    return (
      <BannerAd
        position={bannerConfig.position || 'top'}
        message={bannerConfig.message || 'Special offer!'}
        backgroundColor={bannerConfig.backgroundColor || '#9b87f5'}
        textColor={bannerConfig.textColor || '#ffffff'}
        onClose={() => setBannerVisible(false)}
      />
    );
  }

  return null;
};

export default WidgetPreview;
