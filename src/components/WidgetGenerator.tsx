import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { generateWidgetCode, WidgetConfig } from '@/lib/widgetUtils';
import WidgetPreview from './WidgetPreview';
import { Copy, Download, Eye, EyeOff, Sparkles, Crown, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { WidgetType, WidgetSize } from '@/types';

const WidgetGenerator: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(!isMobile);
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium'>('free');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const [config, setConfig] = useState<WidgetConfig>({
    type: 'whatsapp' as WidgetType,
    handle: '',
    welcomeMessage: 'Hello! How can I help you today?',
    position: 'right',
    primaryColor: '#25D366',
    size: 'medium' as WidgetSize,
    networks: ['facebook', 'twitter', 'linkedin'],
    shareText: 'Check this out!',
    shareUrl: '',
    phoneNumber: '',
    reviewUrl: '',
    followPlatform: 'linkedin',
    amount: 99,
    currency: 'INR',
    paymentDescription: 'Payment for services',
    upiId: 'adnanmuhammad4393@okicici',
    payeeName: 'Muhammed Adnan',
    isPremium: false,
    emailAddress: '',
    bookingUrl: '',
    appStoreUrl: '',
    playStoreUrl: '',
    feedbackUrl: '',
    whatsappNumber: '',
    businessName: '',
    targetDate: '',
    title: '',
    countdownStyle: 'digital',
    showLabels: true,
  });

  const handleConfigChange = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleNetworkChange = (network: string, checked: boolean) => {
    const currentNetworks = config.networks || [];
    if (checked) {
      handleConfigChange('networks', [...currentNetworks, network]);
    } else {
      handleConfigChange('networks', currentNetworks.filter(n => n !== network));
    }
  };

  const generateCode = () => {
    try {
      const finalConfig = {
        ...config,
        isPremium: selectedTier === 'premium' && isPremiumUnlocked
      };
      
      const code = generateWidgetCode(finalConfig);
      
      if (!code || code.trim() === '') {
        throw new Error('Failed to generate widget code');
      }
      
      return code;
    } catch (error) {
      console.error('Code generation error:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate widget code. Please check your configuration.",
        variant: "destructive",
      });
      return '';
    }
  };

  const copyToClipboard = () => {
    const code = generateCode();
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        toast({
          title: "Code Copied!",
          description: "Widget code has been copied to your clipboard.",
        });
      }).catch(() => {
        toast({
          title: "Copy Failed",
          description: "Please manually copy the code from the text area.",
          variant: "destructive",
        });
      });
    }
  };

  const downloadCode = () => {
    const code = generateCode();
    if (code) {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.type}-widget.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your widget code is being downloaded.",
      });
    }
  };

  const handlePremiumUpgrade = () => {
    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your upgrade.",
    });
    
    setTimeout(() => {
      setIsPremiumUnlocked(true);
      setSelectedTier('premium');
      toast({
        title: "Premium Unlocked! 🎉",
        description: "You now have access to watermark-free widgets.",
      });
    }, 2000);
  };

  const renderFormFields = () => {
    switch (config.type) {
      case 'whatsapp':
      case 'telegram':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="handle" className="text-sm font-medium">Phone Number / Handle</Label>
              <Input
                id="handle"
                value={config.handle}
                onChange={(e) => handleConfigChange('handle', e.target.value)}
                placeholder="+1234567890"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage" className="text-sm font-medium">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={config.welcomeMessage}
                onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                placeholder="Hello! How can I help you today?"
                rows={3}
                className="text-base resize-none"
              />
            </div>
          </>
        );

      case 'social-share':
        return (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Social Networks</Label>
              <div className="grid grid-cols-1 gap-3">
                {['facebook', 'twitter', 'linkedin'].map((network) => (
                  <div key={network} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors">
                    <Checkbox
                      id={network}
                      checked={config.networks?.includes(network) || false}
                      onCheckedChange={(checked) => handleNetworkChange(network, checked as boolean)}
                      className="min-w-[20px] min-h-[20px]"
                    />
                    <Label htmlFor={network} className="capitalize font-medium text-base cursor-pointer flex-1 text-foreground">{network}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareText" className="text-sm font-medium">Share Text</Label>
              <Input
                id="shareText"
                value={config.shareText}
                onChange={(e) => handleConfigChange('shareText', e.target.value)}
                placeholder="Check this out!"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareUrl" className="text-sm font-medium">Share URL</Label>
              <Input
                id="shareUrl"
                value={config.shareUrl}
                onChange={(e) => handleConfigChange('shareUrl', e.target.value)}
                placeholder="https://example.com"
                className="text-base"
              />
            </div>
          </>
        );

      case 'call-now':
        return (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={config.phoneNumber}
              onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
              placeholder="+1234567890"
              className="text-base"
            />
          </div>
        );

      case 'review-now':
        return (
          <div className="space-y-2">
            <Label htmlFor="reviewUrl" className="text-sm font-medium">Review URL</Label>
            <Input
              id="reviewUrl"
              value={config.reviewUrl}
              onChange={(e) => handleConfigChange('reviewUrl', e.target.value)}
              placeholder="https://google.com/reviews"
              className="text-base"
            />
          </div>
        );

      case 'follow-us':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="followPlatform" className="text-sm font-medium">Platform</Label>
              <Select
                value={config.followPlatform}
                onValueChange={(value: 'linkedin' | 'instagram' | 'youtube') => 
                  handleConfigChange('followPlatform', value)
                }
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle" className="text-sm font-medium">Username/Handle</Label>
              <Input
                id="handle"
                value={config.handle}
                onChange={(e) => handleConfigChange('handle', e.target.value)}
                placeholder="username"
                className="text-base"
              />
            </div>
          </>
        );

      case 'dodo-payment':
      case 'payment':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={config.amount}
                onChange={(e) => handleConfigChange('amount', parseInt(e.target.value) || 0)}
                placeholder="199"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
              <Input
                id="upiId"
                value={config.upiId}
                onChange={(e) => handleConfigChange('upiId', e.target.value)}
                placeholder="adnanmuhammad4393@okicici"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payeeName" className="text-sm font-medium">Payee Name</Label>
              <Input
                id="payeeName"
                value={config.payeeName}
                onChange={(e) => handleConfigChange('payeeName', e.target.value)}
                placeholder="Muhammed Adnan"
                className="text-base"
              />
            </div>
          </>
        );

      case 'email-contact':
        return (
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="text-sm font-medium">Email Address</Label>
            <Input
              id="emailAddress"
              value={config.emailAddress}
              onChange={(e) => handleConfigChange('emailAddress', e.target.value)}
              placeholder="contact@example.com"
              className="text-base"
            />
          </div>
        );

      case 'live-chat':
        return (
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage" className="text-sm font-medium">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
              placeholder="Hello! How can I help you today?"
              rows={3}
              className="text-base resize-none"
            />
          </div>
        );

      case 'booking-calendar':
        return (
          <div className="space-y-2">
            <Label htmlFor="bookingUrl" className="text-sm font-medium">Booking URL</Label>
            <Input
              id="bookingUrl"
              value={config.bookingUrl}
              onChange={(e) => handleConfigChange('bookingUrl', e.target.value)}
              placeholder="https://calendly.com/your-link"
              className="text-base"
            />
          </div>
        );

      case 'newsletter-signup':
        return (
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage" className="text-sm font-medium">Newsletter Description</Label>
            <Textarea
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
              placeholder="Get the latest news and updates"
              rows={2}
              className="text-base resize-none"
            />
          </div>
        );

      case 'feedback-form':
        return (
          <div className="space-y-2">
            <Label htmlFor="feedbackUrl" className="text-sm font-medium">Feedback URL (optional)</Label>
            <Input
              id="feedbackUrl"
              value={config.feedbackUrl}
              onChange={(e) => handleConfigChange('feedbackUrl', e.target.value)}
              placeholder="mailto:feedback@example.com"
              className="text-base"
            />
          </div>
        );

      case 'download-app':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="appStoreUrl" className="text-sm font-medium">App Store URL</Label>
              <Input
                id="appStoreUrl"
                value={config.appStoreUrl}
                onChange={(e) => handleConfigChange('appStoreUrl', e.target.value)}
                placeholder="https://apps.apple.com/..."
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playStoreUrl" className="text-sm font-medium">Play Store URL</Label>
              <Input
                id="playStoreUrl"
                value={config.playStoreUrl}
                onChange={(e) => handleConfigChange('playStoreUrl', e.target.value)}
                placeholder="https://play.google.com/store/..."
                className="text-base"
              />
            </div>
          </>
        );

      case 'contact-form':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="text-sm font-medium">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={config.whatsappNumber}
                onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                placeholder="+1234567890"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
              <Input
                id="businessName"
                value={config.businessName}
                onChange={(e) => handleConfigChange('businessName', e.target.value)}
                placeholder="Your Business Name"
                className="text-base"
              />
            </div>
          </>
        );

      case 'countdown-timer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="targetDate" className="text-sm font-medium">Target Date & Time</Label>
              <Input
                id="targetDate"
                type="datetime-local"
                value={config.targetDate}
                onChange={(e) => handleConfigChange('targetDate', e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Timer Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                placeholder="e.g., Sale Ends In"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countdownStyle" className="text-sm font-medium">Visual Style</Label>
              <Select
                value={config.countdownStyle}
                onValueChange={(value: 'circular' | 'digital' | 'minimal' | 'bold') => 
                  handleConfigChange('countdownStyle', value)
                }
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital Display</SelectItem>
                  <SelectItem value="circular">Circular Progress</SelectItem>
                  <SelectItem value="minimal">Minimal Clean</SelectItem>
                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <Checkbox
                id="showLabels"
                checked={config.showLabels || false}
                onCheckedChange={(checked) => handleConfigChange('showLabels', checked as boolean)}
                className="min-w-[20px] min-h-[20px]"
              />
              <Label htmlFor="showLabels" className="text-sm font-medium cursor-pointer flex-1">Show time unit labels</Label>
            </div>
          </>
        );

      case 'back-to-top':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="scroll-offset" className="text-sm font-medium">Show After Scroll (px)</Label>
              <Input
                id="scroll-offset"
                type="number"
                value={config.scrollOffset || '300'}
                onChange={(e) => handleConfigChange('scrollOffset', e.target.value)}
                placeholder="300"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <Checkbox
                id="smooth-scroll"
                checked={config.smoothScroll !== false}
                onCheckedChange={(checked) => handleConfigChange('smoothScroll', checked as boolean)}
                className="min-w-[20px] min-h-[20px]"
              />
              <Label htmlFor="smooth-scroll" className="text-sm font-medium cursor-pointer flex-1">Enable smooth scrolling</Label>
            </div>
          </>
        );

      case 'qr-generator':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="qr-text" className="text-sm font-medium">Text/URL to Encode</Label>
              <Input
                id="qr-text"
                value={config.qrText || window.location.href}
                onChange={(e) => handleConfigChange('qrText', e.target.value)}
                placeholder="Enter text or URL"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-size" className="text-sm font-medium">QR Code Size</Label>
              <Select
                value={config.qrSize || '200'}
                onValueChange={(value) => handleConfigChange('qrSize', value)}
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">Small (150px)</SelectItem>
                  <SelectItem value="200">Medium (200px)</SelectItem>
                  <SelectItem value="300">Large (300px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'dark-mode-toggle':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="toggle-style" className="text-sm font-medium">Toggle Style</Label>
              <Select
                value={config.toggleStyle || 'switch'}
                onValueChange={(value) => handleConfigChange('toggleStyle', value)}
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="icon">Icon Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <Checkbox
                id="save-preference"
                checked={config.savePreference !== false}
                onCheckedChange={(checked) => handleConfigChange('savePreference', checked as boolean)}
                className="min-w-[20px] min-h-[20px]"
              />
              <Label htmlFor="save-preference" className="text-sm font-medium cursor-pointer flex-1">Save user preference</Label>
            </div>
          </>
        );

      case 'weather-widget':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="weather-city" className="text-sm font-medium">City</Label>
              <Input
                id="weather-city"
                value={config.weatherCity || 'London'}
                onChange={(e) => handleConfigChange('weatherCity', e.target.value)}
                placeholder="Enter city name"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weather-units" className="text-sm font-medium">Temperature Units</Label>
              <Select
                value={config.weatherUnits || 'metric'}
                onValueChange={(value) => handleConfigChange('weatherUnits', value)}
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Celsius (°C)</SelectItem>
                  <SelectItem value="imperial">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'crypto-prices':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="crypto-coins" className="text-sm font-medium">Cryptocurrencies</Label>
              <Input
                id="crypto-coins"
                value={config.cryptoCoins || 'bitcoin,ethereum,cardano'}
                onChange={(e) => handleConfigChange('cryptoCoins', e.target.value)}
                placeholder="bitcoin,ethereum,cardano"
                className="text-base min-h-[48px]"
              />
              <p className="text-xs text-gray-500">Enter coin IDs separated by commas</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crypto-currency" className="text-sm font-medium">Display Currency</Label>
              <Select
                value={config.cryptoCurrency || 'usd'}
                onValueChange={(value) => handleConfigChange('cryptoCurrency', value)}
              >
                <SelectTrigger className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'click-to-copy':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="copy-text" className="text-sm font-medium">Text to Copy</Label>
              <Input
                id="copy-text"
                value={config.copyText || window.location.href}
                onChange={(e) => handleConfigChange('copyText', e.target.value)}
                placeholder="Enter text to copy"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copy-button-text" className="text-sm font-medium">Button Text</Label>
              <Input
                id="copy-button-text"
                value={config.copyButtonText || 'Copy Link'}
                onChange={(e) => handleConfigChange('copyButtonText', e.target.value)}
                placeholder="Copy Link"
                className="text-base min-h-[48px]"
              />
            </div>
          </>
        );

      case 'spotify-embed':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Spotify URL</label>
              <input
                type="url"
                placeholder="https://open.spotify.com/track/..."
                className="w-full p-2 border rounded-md bg-background"
                value={config.spotifyUrl || ''}
                onChange={(e) => setConfig({ ...config, spotifyUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste any Spotify track, album, playlist, or artist URL
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Player Height</label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={config.height || '352'}
                onChange={(e) => setConfig({ ...config, height: e.target.value })}
              >
                <option value="152">Compact (152px)</option>
                <option value="352">Standard (352px)</option>
                <option value="452">Large (452px)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="compact-mode"
                className="rounded"
                checked={config.compact || false}
                onChange={(e) => setConfig({ ...config, compact: e.target.checked })}
              />
              <label htmlFor="compact-mode" className="text-sm">Compact Mode</label>
            </div>
          </div>
        );

      case 'popup-ad-creator':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="adMessage" className="text-sm font-medium">Ad Message</Label>
              <Textarea
                id="adMessage"
                value={config.welcomeMessage}
                onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                placeholder="Special Offer Just for You!"
                rows={2}
                className="text-base resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adLink" className="text-sm font-medium">Landing Page URL</Label>
              <Input
                id="adLink"
                value={config.shareUrl}
                onChange={(e) => handleConfigChange('shareUrl', e.target.value)}
                placeholder="https://yoursite.com/offer"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adImage" className="text-sm font-medium">Ad Image URL (optional)</Label>
              <Input
                id="adImage"
                value={config.videoUrl}
                onChange={(e) => handleConfigChange('videoUrl', e.target.value)}
                placeholder="https://yoursite.com/image.jpg"
                className="text-base"
              />
            </div>
          </>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage" className="text-sm font-medium">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
              placeholder="Hello! How can I help you today?"
              rows={3}
              className="text-base resize-none"
            />
          </div>
        );
    }
  };

  return (
    <section id="widget-generator" className="py-8 md:py-20 px-2 md:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Widget Generator
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
            Create powerful, customizable widgets in seconds. Choose your type, customize the settings, and get ready-to-use code.
          </p>
        </div>

        {/* Mobile-Optimized Tier Selection */}
        <div className="flex justify-center mb-6 md:mb-8 px-4">
          <div className="bg-white rounded-lg p-1 shadow-md w-full max-w-md">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setSelectedTier('free')}
                className={`px-3 md:px-6 py-3 md:py-3 rounded-md flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                  selectedTier === 'free'
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Sparkles size={16} />
                Free Tier
              </button>
              <button
                onClick={() => setSelectedTier('premium')}
                disabled={!isPremiumUnlocked}
                className={`px-3 md:px-6 py-3 md:py-3 rounded-md flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                  selectedTier === 'premium' && isPremiumUnlocked
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm'
                    : selectedTier === 'premium'
                    ? 'bg-gray-100 text-gray-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Crown size={16} />
                Premium
                {!isPremiumUnlocked && <span className="text-xs hidden md:inline">(Locked)</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        {selectedTier === 'premium' && !isPremiumUnlocked && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8 mx-2 md:mx-0">
            <div className="text-center">
              <Crown className="mx-auto mb-3 text-yellow-600" size={24} />
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Get watermark-free widgets, priority support, and advanced customization options.
              </p>
              <Button
                onClick={handlePremiumUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 min-h-[48px] w-full md:w-auto"
              >
                Upgrade Now - $9.99
              </Button>
            </div>
          </div>
        )}

        <div className={`grid gap-6 md:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
          {/* Configuration Panel */}
          <Card className="mx-2 md:mx-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                Configure Your Widget
                {selectedTier === 'premium' && isPremiumUnlocked && (
                  <Crown className="text-yellow-500" size={20} />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {/* Widget Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="widgetType" className="text-sm font-medium">Widget Type</Label>
                <Select
                  value={config.type}
                  onValueChange={(value: WidgetType) => handleConfigChange('type', value)}
                >
                  <SelectTrigger className="text-base min-h-[48px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp Chat</SelectItem>
                    <SelectItem value="call-now">Call Now</SelectItem>
                    <SelectItem value="contact-form">Contact Form</SelectItem>
                    <SelectItem value="social-share">Social Share</SelectItem>
                    <SelectItem value="review-now">Review Now</SelectItem>
                    <SelectItem value="follow-us">Follow Us</SelectItem>
                    <SelectItem value="dodo-payment">Dodo Payment</SelectItem>
                    <SelectItem value="payment">Payment Gateway</SelectItem>
                    <SelectItem value="email-contact">Email Contact</SelectItem>
                    <SelectItem value="live-chat">Live Chat</SelectItem>
                    <SelectItem value="booking-calendar">Booking Calendar</SelectItem>
                    <SelectItem value="newsletter-signup">Newsletter Signup</SelectItem>
                    <SelectItem value="feedback-form">Feedback Form</SelectItem>
                    <SelectItem value="download-app">Download App</SelectItem>
                    <SelectItem value="countdown-timer">Countdown Timer</SelectItem>
                    <SelectItem value="spotify-embed">Spotify Music Player</SelectItem>
                    <SelectItem value="print-page">Print Page</SelectItem>
                    <SelectItem value="scroll-progress">Scroll Progress</SelectItem>
                    <SelectItem value="cookie-consent">Cookie Consent</SelectItem>
                    <SelectItem value="age-verification">Age Verification</SelectItem>
                    <SelectItem value="pdf-viewer">PDF Viewer</SelectItem>
                    <SelectItem value="floating-video">Floating Video</SelectItem>
                    <SelectItem value="popup-ad-creator">Popup Ad Creator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Form Fields */}
              {renderFormFields()}

              {/* Universal Settings */}
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                    <Select
                      value={config.position}
                      onValueChange={(value: 'left' | 'right') => handleConfigChange('position', value)}
                    >
                      <SelectTrigger className="text-base min-h-[48px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">Bottom Right</SelectItem>
                        <SelectItem value="left">Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium">Size</Label>
                    <Select
                      value={config.size}
                      onValueChange={(value: WidgetSize) => handleConfigChange('size', value)}
                    >
                      <SelectTrigger className="text-base min-h-[48px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="text-sm font-medium">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-16 h-12 p-1 rounded flex-shrink-0"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      placeholder="#25D366"
                      className="flex-1 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                <Button onClick={copyToClipboard} className="min-h-[48px] order-1">
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} variant="outline" className="min-h-[48px] order-2">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  className="min-h-[48px] order-3 md:order-3"
                >
                  {showPreview ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                  {isMobile ? (showPreview ? 'Hide' : 'Show') : ''} Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel - Conditional rendering for mobile */}
          {showPreview && (
            <Card className="mx-2 md:mx-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Smartphone size={20} className="md:hidden" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] md:min-h-[400px] relative">
                  <WidgetPreview 
                    config={{
                      ...config,
                      isPremium: selectedTier === 'premium' && isPremiumUnlocked
                    }} 
                  />
                </div>
                
                {/* Mobile-Optimized Tier Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Current Tier: 
                      <span className={`ml-1 font-medium ${
                        selectedTier === 'premium' && isPremiumUnlocked 
                          ? 'text-yellow-600' 
                          : 'text-purple-600'
                      }`}>
                        {selectedTier === 'premium' && isPremiumUnlocked ? 'Premium' : 'Free'}
                      </span>
                    </span>
                    {selectedTier === 'free' && (
                      <span className="text-xs text-gray-500">Includes watermark</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mobile-Optimized Generated Code Display */}
        <Card className="mt-6 md:mt-8 mx-2 md:mx-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-auto max-h-64 md:max-h-96">
              <pre className="text-xs md:text-sm whitespace-pre-wrap break-all">
                <code>{generateCode()}</code>
              </pre>
            </div>
            {/* Mobile Copy Button */}
            {isMobile && (
              <Button 
                onClick={copyToClipboard} 
                className="w-full mt-3 min-h-[48px]"
                variant="outline"
              >
                <Copy size={16} className="mr-2" />
                Copy Generated Code
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WidgetGenerator;
