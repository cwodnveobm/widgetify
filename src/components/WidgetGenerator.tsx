
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
import { Copy, Download, Eye, EyeOff, Sparkles, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { WidgetType, WidgetSize } from '@/types';

const WidgetGenerator: React.FC = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(true);
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
    // Simulate payment process
    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your upgrade.",
    });
    
    setTimeout(() => {
      setIsPremiumUnlocked(true);
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
              <Label htmlFor="handle">Phone Number / Handle</Label>
              <Input
                id="handle"
                value={config.handle}
                onChange={(e) => handleConfigChange('handle', e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={config.welcomeMessage}
                onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                placeholder="Hello! How can I help you today?"
                rows={3}
              />
            </div>
          </>
        );

      case 'social-share':
        return (
          <>
            <div className="space-y-2">
              <Label>Social Networks</Label>
              <div className="space-y-2">
                {['facebook', 'twitter', 'linkedin'].map((network) => (
                  <div key={network} className="flex items-center space-x-2">
                    <Checkbox
                      id={network}
                      checked={config.networks?.includes(network) || false}
                      onCheckedChange={(checked) => handleNetworkChange(network, checked as boolean)}
                    />
                    <Label htmlFor={network} className="capitalize">{network}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareText">Share Text</Label>
              <Input
                id="shareText"
                value={config.shareText}
                onChange={(e) => handleConfigChange('shareText', e.target.value)}
                placeholder="Check this out!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shareUrl">Share URL</Label>
              <Input
                id="shareUrl"
                value={config.shareUrl}
                onChange={(e) => handleConfigChange('shareUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </>
        );

      case 'call-now':
        return (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={config.phoneNumber}
              onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        );

      case 'review-now':
        return (
          <div className="space-y-2">
            <Label htmlFor="reviewUrl">Review URL</Label>
            <Input
              id="reviewUrl"
              value={config.reviewUrl}
              onChange={(e) => handleConfigChange('reviewUrl', e.target.value)}
              placeholder="https://google.com/reviews"
            />
          </div>
        );

      case 'follow-us':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="followPlatform">Platform</Label>
              <Select
                value={config.followPlatform}
                onValueChange={(value: 'linkedin' | 'instagram' | 'youtube') => 
                  handleConfigChange('followPlatform', value)
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="handle">Username/Handle</Label>
              <Input
                id="handle"
                value={config.handle}
                onChange={(e) => handleConfigChange('handle', e.target.value)}
                placeholder="username"
              />
            </div>
          </>
        );

      case 'dodo-payment':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={config.amount}
                onChange={(e) => handleConfigChange('amount', parseInt(e.target.value) || 0)}
                placeholder="99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={config.upiId}
                onChange={(e) => handleConfigChange('upiId', e.target.value)}
                placeholder="user@upi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payeeName">Payee Name</Label>
              <Input
                id="payeeName"
                value={config.payeeName}
                onChange={(e) => handleConfigChange('payeeName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
              placeholder="Hello! How can I help you today?"
              rows={3}
            />
          </div>
        );
    }
  };

  return (
    <section id="widget-generator" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Widget Generator
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create powerful, customizable widgets in seconds. Choose your type, customize the settings, and get ready-to-use code.
          </p>
        </div>

        {/* Tier Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <div className="flex">
              <button
                onClick={() => setSelectedTier('free')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
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
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
                  selectedTier === 'premium' && isPremiumUnlocked
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm'
                    : selectedTier === 'premium'
                    ? 'bg-gray-100 text-gray-400'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Crown size={16} />
                Premium Tier
                {!isPremiumUnlocked && <span className="text-xs">(Locked)</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        {selectedTier === 'premium' && !isPremiumUnlocked && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="text-center">
              <Crown className="mx-auto mb-3 text-yellow-600" size={32} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-4">
                Get watermark-free widgets, priority support, and advanced customization options.
              </p>
              <Button
                onClick={handlePremiumUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Upgrade Now - $9.99
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Configure Your Widget
                {selectedTier === 'premium' && isPremiumUnlocked && (
                  <Crown className="text-yellow-500" size={20} />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Widget Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="widgetType">Widget Type</Label>
                <Select
                  value={config.type}
                  onValueChange={(value: WidgetType) => handleConfigChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp Chat</SelectItem>
                    <SelectItem value="call-now">Call Now</SelectItem>
                    <SelectItem value="social-share">Social Share</SelectItem>
                    <SelectItem value="review-now">Review Now</SelectItem>
                    <SelectItem value="follow-us">Follow Us</SelectItem>
                    <SelectItem value="dodo-payment">Dodo Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Form Fields */}
              {renderFormFields()}

              {/* Universal Settings */}
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value: 'left' | 'right') => handleConfigChange('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right">Bottom Right</SelectItem>
                      <SelectItem value="left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select
                    value={config.size}
                    onValueChange={(value: WidgetSize) => handleConfigChange('size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      placeholder="#25D366"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={copyToClipboard} className="flex-1">
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} variant="outline" className="flex-1">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="icon"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] relative">
                  <WidgetPreview 
                    config={{
                      ...config,
                      isPremium: selectedTier === 'premium' && isPremiumUnlocked
                    }} 
                  />
                </div>
                
                {/* Tier Info */}
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

        {/* Generated Code Display */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm">
                <code>{generateCode()}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WidgetGenerator;
