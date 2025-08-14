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

const ResponsiveWidgetGenerator: React.FC = () => {
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handle" className="text-sm font-medium">Phone Number / Handle</Label>
              <Input
                id="handle"
                value={config.handle}
                onChange={(e) => handleConfigChange('handle', e.target.value)}
                placeholder="+1234567890"
                className="text-base min-h-[48px]"
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
                className="text-base resize-none min-h-[48px]"
              />
            </div>
          </div>
        );

      case 'social-share':
        return (
          <div className="space-y-4">
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
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareUrl" className="text-sm font-medium">Share URL</Label>
              <Input
                id="shareUrl"
                value={config.shareUrl}
                onChange={(e) => handleConfigChange('shareUrl', e.target.value)}
                placeholder="https://example.com"
                className="text-base min-h-[48px]"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Configure settings for {config.type} widget</p>
          </div>
        );
    }
  };

  return (
    <section id="widget-generator" className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-orange-950/50">
      <div className="container mx-auto px-4 responsive-container">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700 mb-4 md:mb-6">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Widget Generator</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 gradient-text">
            Create Your Widget
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Configure your widget settings and get the embed code instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Configuration Panel */}
          <Card className="h-fit shadow-elegant order-2 lg:order-1">
            <CardHeader className="space-y-4 mobile-padding">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl md:text-2xl gradient-text">Configuration</CardTitle>
                {isMobile && (
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 button-touch"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show Preview
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 mobile-padding">
              {/* Widget Type Selection */}
              <div className="space-y-3">
                <Label htmlFor="widgetType" className="text-sm font-medium">Widget Type</Label>
                <Select
                  value={config.type}
                  onValueChange={(value: WidgetType) => handleConfigChange('type', value)}
                >
                  <SelectTrigger className="text-base min-h-[48px]" id="widgetType">
                    <SelectValue placeholder="Select widget type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="whatsapp">WhatsApp Chat</SelectItem>
                    <SelectItem value="telegram">Telegram Chat</SelectItem>
                    <SelectItem value="social-share">Social Share</SelectItem>
                    <SelectItem value="call-now">Call Now</SelectItem>
                    <SelectItem value="review-now">Review Now</SelectItem>
                    <SelectItem value="follow-us">Follow Us</SelectItem>
                    <SelectItem value="dodo-payment">Dodo Payment</SelectItem>
                    <SelectItem value="email-contact">Email Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Position Settings */}
              <div className="space-y-3">
                <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                <Select
                  value={config.position}
                  onValueChange={(value: 'left' | 'right') => handleConfigChange('position', value)}
                >
                  <SelectTrigger className="text-base min-h-[48px]" id="position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Bottom Right</SelectItem>
                    <SelectItem value="left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Settings */}
              <div className="space-y-3">
                <Label htmlFor="size" className="text-sm font-medium">Size</Label>
                <Select
                  value={config.size}
                  onValueChange={(value: WidgetSize) => handleConfigChange('size', value)}
                >
                  <SelectTrigger className="text-base min-h-[48px]" id="size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Settings */}
              <div className="space-y-3">
                <Label htmlFor="primaryColor" className="text-sm font-medium">Primary Color</Label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={config.primaryColor}
                    onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    className="w-16 h-12 rounded border border-border cursor-pointer flex-shrink-0"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    placeholder="#25D366"
                    className="flex-1 text-base min-h-[48px]"
                  />
                </div>
              </div>

              {/* Dynamic Form Fields */}
              {renderFormFields()}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mobile-buttons">
                <Button onClick={copyToClipboard} className="flex-1 text-base min-h-[48px] button-touch">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} variant="outline" className="flex-1 text-base min-h-[48px] button-touch">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          {(!isMobile || showPreview) && (
            <Card className="shadow-elegant order-1 lg:order-2">
              <CardHeader className="mobile-padding">
                <CardTitle className="text-xl md:text-2xl gradient-text flex items-center gap-2">
                  <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="mobile-padding">
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg p-4 md:p-6 min-h-[350px] md:min-h-[400px] border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0 0h100v100H0z%22 fill=%22%23f8fafc%22 opacity=%22.5%22/%3E%3Cpath d=%22m0 0 100 100H0z%22 fill=%22%23e2e8f0%22 opacity=%22.1%22/%3E%3C/svg%3E')] dark:bg-none"></div>
                  <div className="relative">
                    <p className="text-sm text-muted-foreground mb-4">
                      This is how your widget will appear on your website:
                    </p>
                    <WidgetPreview config={config} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Premium Upgrade Section */}
        <Card className="mt-6 md:mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-elegant">
          <CardContent className="p-4 md:p-6 mobile-padding">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Crown className="w-5 h-5 md:w-6 md:h-6" />
                  <h3 className="text-lg md:text-xl font-bold">Upgrade to Premium</h3>
                </div>
                <p className="text-purple-100 text-sm md:text-base">
                  Remove watermarks and unlock advanced customization options
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mobile-buttons">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                  <span className="text-sm font-medium">Only ₹99</span>
                </div>
                <Button 
                  onClick={handlePremiumUpgrade}
                  disabled={isPremiumUnlocked}
                  className="bg-white text-purple-600 hover:bg-gray-100 min-h-[48px] px-6 button-touch"
                >
                  {isPremiumUnlocked ? 'Premium Activated ✓' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResponsiveWidgetGenerator;