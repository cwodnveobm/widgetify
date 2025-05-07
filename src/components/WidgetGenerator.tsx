import React, { useState } from 'react';
import { WidgetConfig, WidgetType, generateWidgetCode, BaseWidgetConfig } from '@/lib/widgetUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import WidgetPreview from '@/components/WidgetPreview';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github, Twitch, Slack, MessageCircle, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Type definition for our widget configurations
type ExtendedWidgetConfig = {
  type: WidgetType;
  handle: string;
  welcomeMessage: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  primaryColor: string;
  size: 'small' | 'medium' | 'large';
  networks: string[];
  shareText: string;
  shareUrl: string;
  title?: string;
  message?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  defaultLanguage?: string;
};

const WidgetGenerator: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<ExtendedWidgetConfig>({
    type: 'whatsapp',
    handle: '',
    welcomeMessage: 'Hello! How can I help you today?',
    position: 'right',
    primaryColor: '#25D366',
    size: 'medium',
    networks: ['facebook', 'twitter', 'linkedin'],
    shareText: 'Check out this awesome website!',
    shareUrl: ''
  });
  
  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);

  // Function to convert our ExtendedWidgetConfig to the appropriate WidgetConfig type for the preview
  const getPreviewConfig = (): WidgetConfig => {
    const baseConfig: BaseWidgetConfig = {
      type: widgetConfig.type,
      handle: widgetConfig.handle,
      welcomeMessage: widgetConfig.welcomeMessage,
      position: widgetConfig.position,
      primaryColor: widgetConfig.primaryColor,
      size: widgetConfig.size,
    };

    switch (widgetConfig.type) {
      case 'social-share':
        return {
          ...baseConfig,
          type: 'social-share',
          networks: widgetConfig.networks,
          shareText: widgetConfig.shareText,
          shareUrl: widgetConfig.shareUrl || window.location.href,
          platforms: widgetConfig.networks
        };
      case 'google-translate':
        return {
          ...baseConfig,
          type: 'google-translate',
          defaultLanguage: widgetConfig.defaultLanguage || 'en'
        };
      case 'chat-widget':
        return {
          ...baseConfig,
          type: 'chat-widget',
          title: widgetConfig.title || 'Need help?',
          message: widgetConfig.message || 'Chat with us!',
          buttonText: widgetConfig.buttonText || 'Open Chat',
          backgroundColor: widgetConfig.backgroundColor || widgetConfig.primaryColor,
          textColor: widgetConfig.textColor || '#ffffff'
        };
      case 'banner-ad':
        return {
          ...baseConfig,
          type: 'banner-ad',
          position: (widgetConfig.position === 'top' || widgetConfig.position === 'bottom') 
            ? widgetConfig.position 
            : 'top',
          message: widgetConfig.message || 'Special offer!',
          backgroundColor: widgetConfig.backgroundColor || widgetConfig.primaryColor,
          textColor: widgetConfig.textColor || '#ffffff'
        };
      default:
        return baseConfig;
    }
  };

  const handleTypeChange = (value: WidgetType) => {
    const colorMap: Record<string, string> = {
      whatsapp: '#25D366',
      facebook: '#0084FF',
      instagram: '#E1306C',
      twitter: '#1DA1F2',
      telegram: '#0088cc',
      linkedin: '#0077b5',
      'social-share': '#6B7280',
      'google-translate': '#4285F4',
      youtube: '#FF0000',
      github: '#333333',
      twitch: '#6441A4',
      slack: '#4A154B',
      discord: '#7289DA',
      'chat-widget': '#4CAF50',
      'banner-ad': '#9b87f5'
    };

    let newPosition = widgetConfig.position;
    
    // For banner ads, default position should be 'top' or 'bottom'
    if (value === 'banner-ad') {
      newPosition = 'top';
    }
    
    setWidgetConfig({
      ...widgetConfig,
      type: value,
      primaryColor: colorMap[value] || '#25D366',
      position: newPosition
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWidgetConfig({
      ...widgetConfig,
      [e.target.name]: e.target.value
    });
  };

  const handlePositionChange = (position: 'left' | 'right' | 'top' | 'bottom') => {
    setWidgetConfig({
      ...widgetConfig,
      position
    });
  };

  const handleSizeChange = (size: string) => {
    setWidgetConfig({
      ...widgetConfig,
      size: size as 'small' | 'medium' | 'large'
    });
  };

  const handleNetworkToggle = (network: string) => {
    const currentNetworks = widgetConfig.networks || [];
    if (currentNetworks.includes(network)) {
      setWidgetConfig({
        ...widgetConfig,
        networks: currentNetworks.filter(n => n !== network)
      });
    } else {
      setWidgetConfig({
        ...widgetConfig,
        networks: [...currentNetworks, network]
      });
    }
  };

  const generateWidget = () => {
    if (widgetConfig.type !== 'social-share' && widgetConfig.type !== 'google-translate' && !widgetConfig.handle) {
      toast.error('Please enter your handle/number');
      return;
    }
    if (widgetConfig.type === 'social-share' && widgetConfig.networks && widgetConfig.networks.length === 0) {
      toast.error('Please select at least one social network');
      return;
    }

    // For social-share widgets, use the URL provided by the user or default to current URL
    if (widgetConfig.type === 'social-share') {
      const shareUrl = widgetConfig.handle || window.location.href;
      setWidgetConfig(prev => ({
        ...prev,
        shareUrl
      }));
    }
    const generatedCode = generateWidgetCode(widgetConfig);
    setCode(generatedCode);
    setShowCode(true);
    toast.success('Widget code generated successfully!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const getPlaceholderText = () => {
    switch (widgetConfig.type) {
      case 'whatsapp':
        return 'Your WhatsApp number (e.g. +1234567890)';
      case 'facebook':
        return 'Your Facebook username/page ID';
      case 'instagram':
        return 'Your Instagram username (e.g. @username)';
      case 'twitter':
        return 'Your Twitter handle (e.g. @username)';
      case 'telegram':
        return 'Your Telegram username (e.g. @username)';
      case 'linkedin':
        return 'Your LinkedIn username (e.g. johndoe)';
      case 'social-share':
        return 'Optional URL to share (defaults to current page)';
      case 'youtube':
        return 'Your YouTube channel ID or username';
      case 'github':
        return 'Your GitHub username';
      case 'twitch':
        return 'Your Twitch channel name';
      case 'slack':
        return 'Your Slack workspace URL';
      case 'discord':
        return 'Your Discord invite code';
      default:
        return 'Enter your handle';
    }
  };

  // Custom WhatsApp icon component
  const WhatsAppIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <g>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#006A8E" />
        <circle cx="21" cy="3" r="3" fill="#FF4D4D" />
        <path d="M17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 8.5C11.3284 8.5 12 7.82843 12 7C12 6.17157 11.3284 5.5 10.5 5.5C9.67157 5.5 9 6.17157 9 7C9 7.82843 9.67157 8.5 10.5 8.5ZM10.5 18.5C11.3284 18.5 12 17.8284 12 17C12 16.1716 11.3284 15.5 10.5 15.5C9.67157 15.5 9 16.1716 9 17C9 17.8284 9.67157 18.5 10.5 18.5Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12.5C18.3284 12.5 19 11.8284 19 11C19 10.1716 18.3284 9.5 17.5 9.5C16.6716 9.5 16 10.1716 16 11C16 11.8284 16.6716 12.5 17.5 12.5Z" fill="white" />
        <path d="M12.01 4.5C7.96 4.5 4.5 7.96 4.5 12.01C4.5 16.06 7.96 19.5 12.01 19.5C16.06 19.5 19.5 16.06 19.5 12.01C19.5 7.96 16.06 4.5 12.01 4.5ZM12.01 18.2C8.68 18.2 5.8 15.32 5.8 12.01C5.8 8.7 8.68 5.8 12.01 5.8C15.33 5.8 18.2 8.7 18.2 12.01C18.2 15.32 15.32 18.2 12.01 18.2Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8.9C9.5 9.32 9.14 9.65 8.7 9.65C8.26 9.65 7.9 9.32 7.9 8.9C7.9 8.48 8.26 8.15 8.7 8.15C9.14 8.15 9.5 8.48 9.5 8.9ZM16.1 8.9C16.1 9.32 15.74 9.65 15.3 9.65C14.86 9.65 14.5 9.32 14.5 8.9C14.5 8.48 14.86 8.15 15.3 8.15C15.74 8.15 16.1 8.48 16.1 8.9Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M16.7 14.87C16.7 16.27 14.59 17.4 12 17.4C9.41 17.4 7.3 16.27 7.3 14.87C7.3 14.1 7.94 13.42 8.96 12.99C9.31 12.82 9.72 12.96 9.89 13.31C10.06 13.66 9.92 14.07 9.57 14.24C9.02 14.5 8.7 14.83 8.7 15.13C8.7 15.8 10.24 16.5 12 16.5C13.76 16.5 15.3 15.8 15.3 15.13C15.3 14.81 14.9 14.46 14.28 14.2C13.92 14.04 13.76 13.63 13.92 13.27C14.08 12.91 14.49 12.75 14.85 12.91C15.92 13.33 16.7 14.05 16.7 14.87Z" fill="white" />
      </g>
    </svg>;

  // Custom Telegram icon component
  const TelegramIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z" fill="#0088cc" />
    </svg>;
  const ShareIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#6B7280" />
    </svg>;

  // New Google Translate icon component
  const GoogleTranslateIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="#4285F4" />
    </svg>;

  // New YouTube icon component
  const YoutubeIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
  </svg>;

  // New GitHub icon component
  const GithubIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.01 4.5C7.96 4.5 4.5 7.96 4.5 12.01C4.5 16.06 7.96 19.5 12.01 19.5C16.06 19.5 19.5 16.06 19.5 12.01C19.5 7.96 16.06 4.5 12.01 4.5ZM12.01 18.2C8.68 18.2 5.8 15.32 5.8 12.01C5.8 8.7 8.68 5.8 12.01 5.8C15.33 5.8 18.2 8.7 18.2 12.01C18.2 15.32 15.32 18.2 12.01 18.2Z" fill="white" />
  </svg>;

  // New Twitch icon component
  const TwitchIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" fill="#6441A4" />
  </svg>;

  // New Slack icon component
  const SlackIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#4A154B" />
  </svg>;

  // New Discord icon component
  const DiscordIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4724 0-.1634-.3933-.4058-.8742-.6091-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="#7289DA" />
  </svg>;
  
  // Chat widget icon
  const ChatWidgetIcon = () => <MessageCircle className="h-6 w-6" />;
  
  // Banner ad icon
  const BannerAdIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h18v6h-2V5H5v14h14v-4h2v6H3V3zm14 8h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
  </svg>;

  // Add these to your socialIcons object
  const socialIcons = {
    whatsapp: <WhatsAppIcon />,
    facebook: <Facebook className="h-6 w-6" />,
    instagram: <Instagram className="h-6 w-6" />,
    twitter: <Twitter className="h-6 w-6" />,
    telegram: <TelegramIcon />,
    linkedin: <Linkedin className="h-6 w-6" />,
    'social-share': <ShareIcon />,
    'google-translate': <GoogleTranslateIcon />,
    youtube: <YoutubeIcon />,
    github: <GithubIcon />,
    twitch: <TwitchIcon />,
    slack: <SlackIcon />,
    discord: <DiscordIcon />,
    'chat-widget': <ChatWidgetIcon />,
    'banner-ad': <BannerAdIcon />
  };

  // Render additional fields based on widget type
  const renderWidgetTypeFields = () => {
    switch (widgetConfig.type) {
      case 'social-share':
        return (
          <>
            <div className="mb-4">
              <Label>Select Social Networks</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="facebook-network" checked={widgetConfig.networks?.includes('facebook')} onCheckedChange={() => handleNetworkToggle('facebook')} />
                  <label htmlFor="facebook-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-[#1877F2]" />
                    Facebook
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="twitter-network" checked={widgetConfig.networks?.includes('twitter')} onCheckedChange={() => handleNetworkToggle('twitter')} />
                  <label htmlFor="twitter-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    Twitter
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="linkedin-network" checked={widgetConfig.networks?.includes('linkedin')} onCheckedChange={() => handleNetworkToggle('linkedin')} />
                  <label htmlFor="linkedin-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                    LinkedIn
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="shareText">Share Text</Label>
              <Textarea id="shareText" name="shareText" value={widgetConfig.shareText} onChange={handleInputChange} placeholder="Share this awesome content!" className="mt-1" />
            </div>
          </>
        );
        
      case 'chat-widget':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="title">Chat Title</Label>
              <Input id="title" name="title" value={widgetConfig.title || ''} onChange={handleInputChange} placeholder="Chat with us" className="mt-1" />
            </div>
            <div className="mb-4">
              <Label htmlFor="message">Welcome Message</Label>
              <Textarea id="message" name="message" value={widgetConfig.message || ''} onChange={handleInputChange} placeholder="How can we help you?" className="mt-1" />
            </div>
            <div className="mb-4">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input id="buttonText" name="buttonText" value={widgetConfig.buttonText || ''} onChange={handleInputChange} placeholder="Chat Now" className="mt-1" />
            </div>
          </>
        );
        
      case 'banner-ad':
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="message">Banner Message</Label>
              <Textarea id="message" name="message" value={widgetConfig.message || ''} onChange={handleInputChange} placeholder="Special offer!" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <RadioGroup defaultValue="top" value={widgetConfig.position} onValueChange={value => handlePositionChange(value as 'top' | 'bottom')} className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <RadioGroupItem value="top" id="top" className="peer sr-only" />
                    <Label htmlFor="top" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Top
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="bottom" id="bottom" className="peer sr-only" />
                    <Label htmlFor="bottom" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Bottom
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input id="textColor" name="textColor" type="color" value={widgetConfig.textColor || '#ffffff'} onChange={handleInputChange} className="w-12 h-12 p-1 rounded-md" />
                  <Input name="textColor" value={widgetConfig.textColor || '#ffffff'} onChange={handleInputChange} className="flex-1" />
                </div>
              </div>
            </div>
          </>
        );
        
      case 'google-translate':
        return (
          <div className="mb-4">
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select value={widgetConfig.defaultLanguage || 'en'} onValueChange={(value) => setWidgetConfig({...widgetConfig, defaultLanguage: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'whatsapp':
        return (
          <div className="mb-4">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea id="welcomeMessage" name="welcomeMessage" value={widgetConfig.welcomeMessage} onChange={handleInputChange} placeholder="Hello! How can I help you today?" className="mt-1" />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Update the position options based on widget type
  const renderPositionControl = () => {
    if (widgetConfig.type === 'banner-ad') {
      return (
        <div>
          <Label htmlFor="position">Position</Label>
          <RadioGroup value={widgetConfig.position} onValueChange={value => handlePositionChange(value as 'top' | 'bottom')} className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <RadioGroupItem value="top" id="top-position" className="peer sr-only" />
              <Label htmlFor="top-position" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                Top
              </Label>
            </div>

            <div>
              <RadioGroupItem value="bottom" id="bottom-position" className="peer sr-only" />
              <Label htmlFor="bottom-position" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                Bottom
              </Label>
            </div>
          </RadioGroup>
        </div>
      );
    }
    
    return (
      <div>
        <Label htmlFor="position">Position</Label>
        <RadioGroup value={widgetConfig.position} onValueChange={value => handlePositionChange(value as 'left' | 'right')} className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <RadioGroupItem value="left" id="left" className="peer sr-only" />
            <Label htmlFor="left" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              Left
            </Label>
          </div>

          <div>
            <RadioGroupItem value="right" id="right" className="peer sr-only" />
            <Label htmlFor="right" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              Right
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  return (
    <section id="widget-generator" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Create Your Widgetify Widget</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your chat widget in a few simple steps. Select your platform,
            enter your details, and we'll generate the code for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Widget Type</h3>
              <RadioGroup defaultValue="whatsapp" value={widgetConfig.type} onValueChange={value => handleTypeChange(value as WidgetType)} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Original widget types */}
                <div>
                  <RadioGroupItem value="whatsapp" id="whatsapp" className="peer sr-only" />
                  <Label htmlFor="whatsapp" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <WhatsAppIcon />
                    WhatsApp
                  </Label>
                </div>

                {/* ... keep existing code (other widget type radio options) */}

                {/* New widget types */}
                <div>
                  <RadioGroupItem value="chat-widget" id="chat-widget" className="peer sr-only" />
                  <Label htmlFor="chat-widget" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <ChatWidgetIcon />
                    Chat
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="banner-ad" id="banner-ad" className="peer sr-only" />
                  <Label htmlFor="banner-ad" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <BannerAdIcon />
                    Banner Ad
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Render fields based on widget type */}
            {renderWidgetTypeFields()}

            {/* Handle/URL field (except for certain types) */}
            {!['banner-ad', 'google-translate'].includes(widgetConfig.type) && (
              <div className="mb-4">
                <Label htmlFor="handle">
                  {widgetConfig.type === 'social-share' ? 'URL to Share' : 'Account Handle/Number'}
                </Label>
                <Input 
                  id="handle" 
                  name="handle" 
                  value={widgetConfig.handle} 
                  onChange={handleInputChange} 
                  placeholder={getPlaceholderText()} 
                  className="mt-1" 
                />
              </div>
            )}

            {/* Position and Size controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {renderPositionControl()}

              {!['banner-ad'].includes(widgetConfig.type) && (
                <div>
                  <Label htmlFor="size">Button Size</Label>
                  <Select value={widgetConfig.size} onValueChange={handleSizeChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Color picker */}
            <div className="mb-6">
              <Label htmlFor="primaryColor">{widgetConfig.type === 'banner-ad' ? 'Background Color' : 'Color'}</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input id="primaryColor" name="primaryColor" type="color" value={widgetConfig.primaryColor} onChange={handleInputChange} className="w-12 h-12 p-1 rounded-md" />
                <Input name="primaryColor" value={widgetConfig.primaryColor} onChange={handleInputChange} className="flex-1" />
              </div>
            </div>

            <Button onClick={generateWidget} className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded">
              Generate Widget Code
            </Button>
          </div>

          <div className="flex flex-col">
            {/* RetailX sidebar ad */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-purple-100">
              <a href="https://www.retailx.site/" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-col items-center">
                  <img src="/lovable-uploads/08c2f5ff-5a6f-4a3e-8470-7f98661e663f.png" alt="RetailX" className="h-20 mb-2" />
                  <p className="text-sm text-purple-800 font-medium text-center">Transform your retail business with RetailX</p>
                  <p className="text-xs text-gray-600 text-center mt-1">Powerful retail solutions for growing businesses</p>
                  <Button variant="outline" className="mt-3 text-sm border-purple-300 hover:bg-purple-50 text-purple-700">
                    Learn More
                  </Button>
                </div>
              </a>
            </div>
            
            <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm mb-4 WidgetPreview-container">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="relative bg-white rounded-lg shadow-sm h-80 border border-gray-100 overflow-hidden">
                <div className="h-10 bg-gray-100 border-b flex items-center px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-500">example.com</div>
                </div>
                <div className="p-4 h-full">
                  <WidgetPreview config={getPreviewConfig()} />
                </div>
              </div>
            </div>

            {showCode && <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Your Widget Code</h3>
                  <Button onClick={copyToClipboard} variant="outline" size="sm" className="text-sm">
                    Copy Code
                  </Button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-auto max-h-64">
                  <pre>{code}</pre>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Copy this code and paste it before the closing body tag of your website.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetGenerator;
