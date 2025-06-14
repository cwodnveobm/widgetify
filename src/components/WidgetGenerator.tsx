
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
import type { WidgetType, WidgetSize } from '@/types';

const WidgetGenerator: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(!isMobile); // Hide preview by default on mobile
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
                className="text-base" // Better for mobile
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
                className="text-base resize-none" // Better for mobile
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
                  <div key={network} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                    <Checkbox
                      id={network}
                      checked={config.networks?.includes(network) || false}
                      onCheckedChange={(checked) => handleNetworkChange(network, checked as boolean)}
                      className="min-w-[20px] min-h-[20px]" // Better touch target
                    />
                    <Label htmlFor={network} className="capitalize font-medium text-base cursor-pointer flex-1">{network}</Label>
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
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={config.amount}
                onChange={(e) => handleConfigChange('amount', parseInt(e.target.value) || 0)}
                placeholder="99"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
              <Input
                id="upiId"
                value={config.upiId}
                onChange={(e) => handleConfigChange('upiId', e.target.value)}
                placeholder="user@upi"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payeeName" className="text-sm font-medium">Payee Name</Label>
              <Input
                id="payeeName"
                value={config.payeeName}
                onChange={(e) => handleConfigChange('payeeName', e.target.value)}
                placeholder="John Doe"
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
          <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-4 floating">
            Widget Generator
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base px-4">
            Create powerful, customizable widgets in seconds. Choose your type, customize the settings, and get ready-to-use code.
          </p>
        </div>

        {/* Glass Tier Selection */}
        <div className="flex justify-center mb-6 md:mb-8 px-4">
          <div className="glass-strong rounded-2xl p-1 shadow-2xl w-full max-w-md">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setSelectedTier('free')}
                className={`px-3 md:px-6 py-3 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                  selectedTier === 'free'
                    ? 'glass-button text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:glass-subtle'
                }`}
              >
                <Sparkles size={16} />
                Free Tier
              </button>
              <button
                onClick={() => setSelectedTier('premium')}
                disabled={!isPremiumUnlocked}
                className={`px-3 md:px-6 py-3 md:py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                  selectedTier === 'premium' && isPremiumUnlocked
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                    : selectedTier === 'premium'
                    ? 'glass-subtle text-white/40'
                    : 'text-white/70 hover:text-orange-300 hover:glass-subtle'
                }`}
              >
                <Crown size={16} />
                Premium
                {!isPremiumUnlocked && <span className="text-xs hidden md:inline">(Locked)</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Banner with glass effect */}
        {selectedTier === 'premium' && !isPremiumUnlocked && (
          <div className="glass-strong liquid-border p-4 md:p-6 mb-6 md:mb-8 mx-2 md:mx-0 morphing">
            <div className="text-center">
              <Crown className="mx-auto mb-3 text-yellow-400" size={24} />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-white/80 mb-4 text-sm md:text-base">
                Get watermark-free widgets, priority support, and advanced customization options.
              </p>
              <Button
                onClick={handlePremiumUpgrade}
                className="glass-button text-white border-white/20 min-h-[48px] w-full md:w-auto hover:scale-105 transition-transform"
              >
                Upgrade Now - $9.99
              </Button>
            </div>
          </div>
        )}

        <div className={`grid gap-6 md:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
          {/* Configuration Panel with glass effect */}
          <div className="glass-card mx-2 md:mx-0">
            <div className="p-6 border-b border-white/10">
              <h3 className="flex items-center gap-2 text-lg md:text-xl text-white font-semibold">
                Configure Your Widget
                {selectedTier === 'premium' && isPremiumUnlocked && (
                  <Crown className="text-yellow-400" size={20} />
                )}
              </h3>
            </div>
            <div className="p-6 space-y-4 md:space-y-6">
              {/* Widget Type Selection with glass styling */}
              <div className="space-y-2">
                <Label htmlFor="widgetType" className="text-sm font-medium text-white/90">Widget Type</Label>
                <Select
                  value={config.type}
                  onValueChange={(value: WidgetType) => handleConfigChange('type', value)}
                >
                  <SelectTrigger className="glass text-white border-white/20 min-h-[48px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20">
                    <SelectItem value="whatsapp">WhatsApp Chat</SelectItem>
                    <SelectItem value="call-now">Call Now</SelectItem>
                    <SelectItem value="social-share">Social Share</SelectItem>
                    <SelectItem value="review-now">Review Now</SelectItem>
                    <SelectItem value="follow-us">Follow Us</SelectItem>
                    <SelectItem value="dodo-payment">Dodo Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Form Fields with glass styling */}
              <div className="space-y-4">
                {renderFormFields()}
              </div>

              {/* Universal Settings with glass styling */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-white/90">Position</Label>
                    <Select
                      value={config.position}
                      onValueChange={(value: 'left' | 'right') => handleConfigChange('position', value)}
                    >
                      <SelectTrigger className="glass text-white border-white/20 min-h-[48px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/20">
                        <SelectItem value="right">Bottom Right</SelectItem>
                        <SelectItem value="left">Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium text-white/90">Size</Label>
                    <Select
                      value={config.size}
                      onValueChange={(value: WidgetSize) => handleConfigChange('size', value)}
                    >
                      <SelectTrigger className="glass text-white border-white/20 min-h-[48px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/20">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="text-sm font-medium text-white/90">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-16 h-12 p-1 rounded glass border-white/20 flex-shrink-0"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      placeholder="#25D366"
                      className="flex-1 glass text-white border-white/20 placeholder:text-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons with glass effects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                <Button onClick={copyToClipboard} className="glass-button text-white border-white/20 min-h-[48px] order-1">
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} className="glass-button text-white border-white/20 min-h-[48px] order-2">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  className="glass-button text-white border-white/20 min-h-[48px] order-3"
                >
                  {showPreview ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                  {isMobile ? (showPreview ? 'Hide' : 'Show') : ''} Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel with glass effect */}
          {showPreview && (
            <div className="glass-card mx-2 md:mx-0">
              <div className="p-6 border-b border-white/10">
                <h3 className="flex items-center gap-2 text-lg md:text-xl text-white font-semibold">
                  <Smartphone size={20} className="md:hidden" />
                  Live Preview
                </h3>
              </div>
              <div className="p-6">
                <div className="glass-subtle rounded-lg p-4 min-h-[300px] md:min-h-[400px] relative">
                  <WidgetPreview 
                    config={{
                      ...config,
                      isPremium: selectedTier === 'premium' && isPremiumUnlocked
                    }} 
                  />
                </div>
                
                {/* Tier Info with glass styling */}
                <div className="mt-4 p-3 glass-subtle rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">
                      Current Tier: 
                      <span className={`ml-1 font-medium ${
                        selectedTier === 'premium' && isPremiumUnlocked 
                          ? 'text-yellow-400' 
                          : 'text-purple-400'
                      }`}>
                        {selectedTier === 'premium' && isPremiumUnlocked ? 'Premium' : 'Free'}
                      </span>
                    </span>
                    {selectedTier === 'free' && (
                      <span className="text-xs text-white/60">Includes watermark</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generated Code Display with glass effect */}
        <div className="glass-card mt-6 md:mt-8 mx-2 md:mx-0">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg md:text-xl text-white font-semibold">Generated Code</h3>
          </div>
          <div className="p-6">
            <div className="glass-dark rounded-lg p-3 md:p-4 overflow-auto max-h-64 md:max-h-96">
              <pre className="text-xs md:text-sm text-white/90 whitespace-pre-wrap break-all">
                <code>{generateCode()}</code>
              </pre>
            </div>
            {/* Mobile Copy Button */}
            {isMobile && (
              <Button 
                onClick={copyToClipboard} 
                className="w-full mt-3 min-h-[48px] glass-button text-white border-white/20"
              >
                <Copy size={16} className="mr-2" />
                Copy Generated Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetGenerator;
