import React, { useState } from 'react';
import { WidgetConfig, generateWidgetCode } from '@/lib/widgetUtils';
import { WidgetType, WidgetSize } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import WidgetPreview from '@/components/WidgetPreview';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github, Twitch, Slack, Phone, Star, CreditCard, Crown, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const WidgetGenerator: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    type: 'whatsapp',
    handle: '',
    welcomeMessage: 'Hello! How can I help you today?',
    position: 'right',
    primaryColor: '#25D366',
    size: 'medium',
    networks: ['facebook', 'twitter', 'linkedin'],
    shareText: 'Check out this awesome website!',
    shareUrl: '',
    phoneNumber: '',
    reviewUrl: '',
    followPlatform: 'linkedin',
    amount: 10,
    currency: 'USD',
    paymentDescription: 'Product or service payment'
  });
  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium'>('free');
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean>(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);

  const handleTypeChange = (value: WidgetType) => {
    const colorMap: Record<WidgetType, string> = {
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
      'call-now': '#4CAF50',
      'review-now': '#FFC107',
      'follow-us': '#0077b5',
      'dodo-payment': '#6366F1'
    };
    setWidgetConfig({
      ...widgetConfig,
      type: value,
      primaryColor: colorMap[value]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWidgetConfig({
      ...widgetConfig,
      [e.target.name]: e.target.value
    });
  };

  const handlePositionChange = (position: 'left' | 'right') => {
    setWidgetConfig({
      ...widgetConfig,
      position
    });
  };

  const handleSizeChange = (size: WidgetSize) => {
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

  const handleFollowPlatformChange = (platform: string) => {
    setWidgetConfig({
      ...widgetConfig,
      followPlatform: platform as 'linkedin' | 'instagram' | 'youtube'
    });
  };

  const handleCurrencyChange = (currency: string) => {
    setWidgetConfig({
      ...widgetConfig,
      currency
    });
  };

  const handleTierChange = (tier: 'free' | 'premium') => {
    setSelectedTier(tier);
    if (tier === 'premium' && !hasPremiumAccess) {
      setShowPaymentDialog(true);
    }
  };

  const handlePaymentSuccess = () => {
    setHasPremiumAccess(true);
    setShowPaymentDialog(false);
    toast.success('Premium access activated! You can now generate watermark-free widgets.');
  };

  const generateWidget = () => {
    // Enhanced validation with better error messages
    switch (widgetConfig.type) {
      case 'whatsapp':
        if (!widgetConfig.handle || widgetConfig.handle.trim() === '') {
          toast.error('Please enter a valid WhatsApp number');
          return;
        }
        break;
      case 'social-share':
        if (widgetConfig.networks && widgetConfig.networks.length === 0) {
          toast.error('Please select at least one social network');
          return;
        }
        // Use the URL provided by the user or default to current URL
        const shareUrl = widgetConfig.handle || window.location.href;
        setWidgetConfig(prev => ({
          ...prev,
          shareUrl
        }));
        break;
      case 'call-now':
        if (!widgetConfig.phoneNumber || widgetConfig.phoneNumber.trim() === '') {
          toast.error('Please enter a valid phone number');
          return;
        }
        break;
      case 'review-now':
        if (!widgetConfig.reviewUrl || widgetConfig.reviewUrl.trim() === '') {
          toast.error('Please enter a valid review URL');
          return;
        }
        break;
      case 'follow-us':
        if (!widgetConfig.handle || widgetConfig.handle.trim() === '') {
          toast.error('Please enter a valid username/handle');
          return;
        }
        break;
      case 'dodo-payment':
        if (!widgetConfig.amount || widgetConfig.amount <= 0) {
          toast.error('Please enter a valid payment amount greater than 0');
          return;
        }
        break;
      case 'google-translate':
        // No validation needed for Google Translate
        break;
      default:
        // For all other widget types that require a handle
        if (!widgetConfig.handle || widgetConfig.handle.trim() === '') {
          toast.error(`Please enter your ${widgetConfig.type} handle/username`);
          return;
        }
    }

    try {
      const isPremium = selectedTier === 'premium' && hasPremiumAccess;
      const generatedCode = generateWidgetCode({ ...widgetConfig, isPremium });
      setCode(generatedCode);
      setShowCode(true);
      
      if (isPremium) {
        toast.success('Premium widget code generated successfully! (No watermark)');
      } else {
        toast.success('Free widget code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating widget code:', error);
      toast.error('Failed to generate widget code. Please try again.');
    }
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
      case 'call-now':
        return 'Your phone number (e.g. +1234567890)';
      case 'review-now':
        return 'URL for reviews (e.g. Google or Yelp review page)';
      case 'follow-us':
        return `${widgetConfig.followPlatform?.charAt(0).toUpperCase()}${widgetConfig.followPlatform?.slice(1)} Username`;
      case 'dodo-payment':
        return 'Payment amount';
      default:
        return 'Enter your handle';
    }
  };

  const getInputLabel = () => {
    switch (widgetConfig.type) {
      case 'social-share':
        return 'URL to Share';
      case 'call-now':
        return 'Phone Number';
      case 'review-now':
        return 'Review URL';
      case 'follow-us':
        return `${widgetConfig.followPlatform?.charAt(0).toUpperCase()}${widgetConfig.followPlatform?.slice(1)} Username`;
      case 'dodo-payment':
        return 'Payment Amount';
      default:
        return 'Account Handle/Number';
    }
  };

  // Custom WhatsApp icon component
  const WhatsAppIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="#25D366"/>
    </svg>
  );

  // Custom Telegram icon component
  const TelegramIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24v-3H6.857V1.714h3.24v15.429Z" fill="#0088cc" />
    </svg>
  );

  const ShareIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.01 1.04.015 2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.274 1.295 1.226 1.9942a.076.076 0 00-.0416.1057c-.6528.2476-1.2743.5495-1.8722.8923a.077.077 0 01-.0076.1277c.1258.0943.2517.1923.3718.2914a.0743.0743 0 01.0776.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785-.0095c.1202-.099.246-.1981.3728-.2924a.077.077 0 01-.0066-.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0312-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.79-2.4189 2.157-2.4189 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#6B7280" />
    </svg>
  );

  // New Google Translate icon component
  const GoogleTranslateIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24v-3H6.857V1.714h3.24v15.429Z" fill="#4285F4" />
    </svg>
  );

  // YouTube icon component
  const YoutubeIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.52 2.523A3.016 3.016 0 0020.885 3.488" fill="#FF0000" />
    </svg>
  );

  // GitHub icon component
  const GithubIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#333333" />
    </svg>
  );

  // Twitch icon component
  const TwitchIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#6441A4" />
    </svg>
  );

  // Slack icon component
  const SlackIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521 2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.526 2.526 0 01-2.521 2.521H2.522A2.527 2.527 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.527 2.527 0 01-2.52-2.522v-2.522h2.52v1.67c1.52.29 2.72 1.16 2.73 2.77.01 2.2-1.9 2.96-3.66 3.42z" fill="#4A154B" />
    </svg>
  );

  // Discord icon component
  const DiscordIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4724 0-.1634-.3933-.4058-.8742-.6091-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 6.0023 3.0294a.077.077 0 00.0313.0552c.5004 5.177 1.4999 9.6739 3.5485 13.6604a.061.061 0 00.0312.0286c.1202.099.246.1981.3728.2924a.077.077 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.79-2.4189 2.157-2.4189 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#7289DA" />
    </svg>
  );

  // Dodo Payment icon component
  const DodoPaymentIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#6366F1" />
    </svg>
  );

  // Social media icons
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
    'call-now': <Phone className="h-6 w-6" />,
    'review-now': <Star className="h-6 w-6" />,
    'follow-us': <Linkedin className="h-6 w-6" />,
    'dodo-payment': <DodoPaymentIcon />
  };

  // UPI Payment Gateway Component
  const UPIPaymentGateway = () => (
    <div className="max-w-md mx-auto border border-gray-200 rounded-xl p-5 shadow-lg bg-white font-sans">
      <style>{`
        @media (max-width: 480px) {
          .upi-gateway-container {
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 8px !important;
            padding: 16px !important;
          }
          .upi-gateway-title {
            font-size: 18px !important;
          }
          .upi-gateway-details {
            font-size: 13px !important;
          }
          .upi-gateway-button {
            padding: 14px 0 !important;
            font-size: 15px !important;
          }
          .upi-gateway-qr {
            width: 160px !important;
            height: 160px !important;
          }
          .upi-gateway-note {
            font-size: 11px !important;
          }
        }
      `}</style>
      
      <div className="upi-gateway-container">
        <h3 className="upi-gateway-title text-center text-gray-800 text-xl font-semibold mb-4">
          Pay with UPI
        </h3>
        
        <div className="text-center mb-5">
          <img 
            src="data:image/png;base64,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" 
            alt="UPI Payment QR Code" 
            className="upi-gateway-qr w-48 h-48 border-2 border-gray-100 rounded-lg mx-auto block"
          />
          <p className="mt-3 text-xs text-gray-500 font-medium">Scan with any UPI app</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="upi-gateway-details my-1 text-sm text-gray-700">
            <strong>UPI ID:</strong> adnanmuhammad4393@okicici
          </p>
          <p className="upi-gateway-details my-1 text-sm text-gray-700">
            <strong>Payee:</strong> Widgetify
          </p>
          <p className="upi-gateway-details my-1 text-sm text-gray-700">
            <strong>Amount:</strong> ₹9.99
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="mb-3 text-xs text-gray-500">Or click to pay directly</p>
          <a 
            href="upi://pay?pa=adnanmuhammad4393@okicici&pn=Widgetify&am=9.99&cu=INR" 
            className="block no-underline"
          >
            <button 
              className="upi-gateway-button w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-semibold border-none rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={handlePaymentSuccess}
            >
              💳 Pay ₹9.99 via UPI
            </button>
          </a>
        </div>

        <p className="upi-gateway-note mt-4 text-xs text-gray-400 text-center leading-relaxed">
          Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br />
          Secure payment powered by UPI
        </p>
      </div>
    </div>
  );

  return (
    <section id="widget-generator" className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Create Your Widgetify Widget
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Customize your chat widget in a few simple steps. Choose between free or premium tiers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm order-2 lg:order-1">
            {/* Tier Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Tier</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className={`cursor-pointer transition-all ${selectedTier === 'free' ? 'ring-2 ring-blue-500' : ''}`} onClick={() => handleTierChange('free')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Free Tier</CardTitle>
                      <Badge variant="secondary">$0</Badge>
                    </div>
                    <CardDescription>Perfect for personal projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        All widget types
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Full customization
                      </li>
                      <li className="flex items-center gap-2 text-orange-600">
                        <span className="h-4 w-4 text-center text-xs">⚠</span>
                        Includes watermark
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${selectedTier === 'premium' ? 'ring-2 ring-purple-500' : ''}`} onClick={() => handleTierChange('premium')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-500" />
                      <CardTitle className="text-lg">Premium Tier</CardTitle>
                      <Badge variant="default" className="bg-purple-600">$9.99</Badge>
                    </div>
                    <CardDescription>Professional & commercial use</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        All widget types
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Full customization
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        No watermark
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Priority support
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {hasPremiumAccess && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">Premium Access Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Widget Configuration */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Platform</h3>
              <RadioGroup 
                defaultValue="whatsapp" 
                value={widgetConfig.type} 
                onValueChange={value => handleTypeChange(value as WidgetType)} 
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                <div>
                  <RadioGroupItem value="whatsapp" id="whatsapp" className="peer sr-only" />
                  <Label htmlFor="whatsapp" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <WhatsAppIcon />
                    WhatsApp
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="facebook" id="facebook" className="peer sr-only" />
                  <Label htmlFor="facebook" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Facebook className="mb-3 h-6 w-6" />
                    Facebook
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="instagram" id="instagram" className="peer sr-only" />
                  <Label htmlFor="instagram" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Instagram className="mb-3 h-6 w-6" />
                    Instagram
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="twitter" id="twitter" className="peer sr-only" />
                  <Label htmlFor="twitter" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Twitter className="mb-3 h-6 w-6" />
                    Twitter
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="telegram" id="telegram" className="peer sr-only" />
                  <Label htmlFor="telegram" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <TelegramIcon />
                    Telegram
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="linkedin" id="linkedin" className="peer sr-only" />
                  <Label htmlFor="linkedin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Linkedin className="mb-3 h-6 w-6" />
                    LinkedIn
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="youtube" id="youtube" className="peer sr-only" />
                  <Label htmlFor="youtube" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <YoutubeIcon />
                    YouTube
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="github" id="github" className="peer sr-only" />
                  <Label htmlFor="github" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <GithubIcon />
                    GitHub
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="twitch" id="twitch" className="peer sr-only" />
                  <Label htmlFor="twitch" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <TwitchIcon />
                    Twitch
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="slack" id="slack" className="peer sr-only" />
                  <Label htmlFor="slack" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <SlackIcon />
                    Slack
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="discord" id="discord" className="peer sr-only" />
                  <Label htmlFor="discord" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <DiscordIcon />
                    Discord
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="google-translate" id="google-translate" className="peer sr-only" />
                  <Label htmlFor="google-translate" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <GoogleTranslateIcon />
                    Translate
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="social-share" id="social-share" className="peer sr-only" />
                  <Label htmlFor="social-share" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <ShareIcon />
                    Share
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="call-now" id="call-now" className="peer sr-only" />
                  <Label htmlFor="call-now" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Phone className="mb-3 h-6 w-6" />
                    Call Now
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="review-now" id="review-now" className="peer sr-only" />
                  <Label htmlFor="review-now" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Star className="mb-3 h-6 w-6" />
                    Reviews
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="follow-us" id="follow-us" className="peer sr-only" />
                  <Label htmlFor="follow-us" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Linkedin className="mb-3 h-6 w-6" />
                    Follow Us
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="dodo-payment" id="dodo-payment" className="peer sr-only" />
                  <Label htmlFor="dodo-payment" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <DodoPaymentIcon />
                    Payment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Widget type specific configurations */}
            {widgetConfig.type === 'social-share' && (
              <>
                <div className="mb-4">
                  <Label>Select Social Networks</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="facebook-network" 
                        checked={widgetConfig.networks?.includes('facebook')} 
                        onCheckedChange={() => handleNetworkToggle('facebook')} 
                      />
                      <label htmlFor="facebook-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                        Facebook
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="twitter-network" 
                        checked={widgetConfig.networks?.includes('twitter')} 
                        onCheckedChange={() => handleNetworkToggle('twitter')} 
                      />
                      <label htmlFor="twitter-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                        <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                        Twitter
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="linkedin-network" 
                        checked={widgetConfig.networks?.includes('linkedin')} 
                        onCheckedChange={() => handleNetworkToggle('linkedin')} 
                      />
                      <label htmlFor="linkedin-network" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                        LinkedIn
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="shareUrl">{getInputLabel()}</Label>
                  <Input
                    id="shareUrl"
                    name="handle"
                    placeholder={getPlaceholderText()}
                    value={widgetConfig.handle}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="shareText">Share Text</Label>
                  <Textarea
                    id="shareText"
                    name="shareText"
                    placeholder="Text to share with the link"
                    value={widgetConfig.shareText}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </>
            )}

            {(widgetConfig.type === 'whatsapp' || widgetConfig.type === 'facebook' || widgetConfig.type === 'instagram' || widgetConfig.type === 'twitter' || widgetConfig.type === 'telegram' || widgetConfig.type === 'linkedin' || widgetConfig.type === 'youtube' || widgetConfig.type === 'github' || widgetConfig.type === 'twitch' || widgetConfig.type === 'slack' || widgetConfig.type === 'discord' || widgetConfig.type === 'follow-us') && (
              <div className="mb-4">
                <Label htmlFor="handle">{getInputLabel()}</Label>
                <Input
                  id="handle"
                  name="handle"
                  placeholder={getPlaceholderText()}
                  value={widgetConfig.handle}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {widgetConfig.type === 'call-now' && (
              <div className="mb-4">
                <Label htmlFor="phoneNumber">{getInputLabel()}</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder={getPlaceholderText()}
                  value={widgetConfig.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {widgetConfig.type === 'review-now' && (
              <div className="mb-4">
                <Label htmlFor="reviewUrl">{getInputLabel()}</Label>
                <Input
                  id="reviewUrl"
                  name="reviewUrl"
                  placeholder={getPlaceholderText()}
                  value={widgetConfig.reviewUrl}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {widgetConfig.type === 'follow-us' && (
              <div className="mb-4">
                <Label htmlFor="handle">{getInputLabel()}</Label>
                <Input
                  id="handle"
                  name="handle"
                  placeholder={getPlaceholderText()}
                  value={widgetConfig.handle}
                  onChange={handleInputChange}
                />
                <div className="mt-3">
                  <Label>Platform</Label>
                  <Select value={widgetConfig.followPlatform} onValueChange={handleFollowPlatformChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {widgetConfig.type === 'dodo-payment' && (
              <>
                <div className="mb-4">
                  <Label htmlFor="amount">{getInputLabel()}</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min={0}
                    placeholder={getPlaceholderText()}
                    value={widgetConfig.amount}
                    onChange={e => setWidgetConfig({ ...widgetConfig, amount: Number(e.target.value) })}
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={widgetConfig.currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <Label htmlFor="paymentDescription">Payment Description</Label>
                  <Input
                    id="paymentDescription"
                    name="paymentDescription"
                    placeholder="Description for the payment"
                    value={widgetConfig.paymentDescription}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <Label>Position</Label>
              <RadioGroup value={widgetConfig.position} onValueChange={handlePositionChange} className="flex space-x-4">
                <div>
                  <RadioGroupItem value="left" id="position-left" className="peer sr-only" />
                  <Label htmlFor="position-left" className="cursor-pointer rounded-md border border-muted px-3 py-1 text-sm peer-checked:bg-primary peer-checked:text-white">
                    Left
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="right" id="position-right" className="peer sr-only" />
                  <Label htmlFor="position-right" className="cursor-pointer rounded-md border border-muted px-3 py-1 text-sm peer-checked:bg-primary peer-checked:text-white">
                    Right
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-4">
              <Label>Size</Label>
              <RadioGroup value={widgetConfig.size} onValueChange={handleSizeChange} className="flex space-x-4">
                <div>
                  <RadioGroupItem value="small" id="size-small" className="peer sr-only" />
                  <Label htmlFor="size-small" className="cursor-pointer rounded-md border border-muted px-3 py-1 text-sm peer-checked:bg-primary peer-checked:text-white">
                    Small
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="medium" id="size-medium" className="peer sr-only" />
                  <Label htmlFor="size-medium" className="cursor-pointer rounded-md border border-muted px-3 py-1 text-sm peer-checked:bg-primary peer-checked:text-white">
                    Medium
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="large" id="size-large" className="peer sr-only" />
                  <Label htmlFor="size-large" className="cursor-pointer rounded-md border border-muted px-3 py-1 text-sm peer-checked:bg-primary peer-checked:text-white">
                    Large
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between items-center">
              <Button onClick={generateWidget} variant="primary">
                Generate Widget Code
              </Button>
              {showCode && (
                <Button onClick={copyToClipboard} variant="outline">
                  Copy Code
                </Button>
              )}
            </div>

            {showCode && (
              <div className="mt-6">
                <Label>Generated Code</Label>
                <Textarea readOnly value={code} rows={10} />
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <WidgetPreview config={widgetConfig} />
          </div>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            To access premium features and generate watermark-free widgets, please complete the payment.
          </p>
          <UPIPaymentGateway />
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WidgetGenerator;
