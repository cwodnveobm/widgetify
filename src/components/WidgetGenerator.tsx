
import React, { useState } from 'react';
import { WidgetConfig, WidgetType, AnimationType, generateWidgetCode } from '@/lib/widgetUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import WidgetPreview from '@/components/WidgetPreview';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const WidgetGenerator: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    type: 'whatsapp',
    handle: '',
    welcomeMessage: 'Hello! How can I help you today?',
    position: 'right',
    primaryColor: '#25D366',
    size: 'medium',
    animation: 'none',
    isPremium: false,
  });

  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  const handleTypeChange = (value: WidgetType) => {
    const colorMap: Record<WidgetType, string> = {
      whatsapp: '#25D366',
      facebook: '#0084FF',
      instagram: '#E1306C',
      twitter: '#1DA1F2',
    };

    setWidgetConfig({
      ...widgetConfig,
      type: value,
      primaryColor: colorMap[value],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWidgetConfig({
      ...widgetConfig,
      [e.target.name]: e.target.value,
    });
  };

  const handlePositionChange = (position: 'left' | 'right') => {
    setWidgetConfig({
      ...widgetConfig,
      position,
    });
  };

  const handleSizeChange = (size: string) => {
    setWidgetConfig({
      ...widgetConfig,
      size: size as 'small' | 'medium' | 'large',
    });
  };

  const handleAnimationChange = (animation: string) => {
    // If user selects an animation but isn't premium, show modal
    if (animation !== 'none' && !widgetConfig.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    setWidgetConfig({
      ...widgetConfig,
      animation: animation as AnimationType,
    });
  };

  const handlePremiumUpgrade = () => {
    // Redirect to payment link
    window.open('https://razorpay.me/@aznoxx?amount=CVDUr6Uxp2FOGZGwAHntNg%3D%3D', '_blank');
    toast.success('Thank you for upgrading! After payment, refresh and animations will be available.');
    setShowPremiumModal(false);
    
    // For demo purposes, enable premium features immediately
    // In a real app, this would happen after payment verification
    setWidgetConfig({
      ...widgetConfig,
      isPremium: true,
    });
  };

  const generateWidget = () => {
    if (!widgetConfig.handle) {
      toast.error('Please enter your handle/number');
      return;
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
      default:
        return 'Enter your handle';
    }
  };

  const WhatsAppIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 6.32A8.78 8.78 0 0 0 12.14 4C7.82 4 4.3 7.53 4.3 11.86a7.8 7.8 0 0 0 1.04 3.9L4 20l4.33-1.13a7.78 7.78 0 0 0 3.8.98h.01c4.32 0 7.84-3.53 7.84-7.86 0-2.1-.82-4.07-2.3-5.55l-.08-.09ZM12.14 18.56h-.01c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.46.64.66-2.4-.16-.25a6.53 6.53 0 0 1-1-3.47c0-4 3.25-7.25 7.26-7.25a7.24 7.24 0 0 1 7.26 7.22c0 4-3.26 7.25-7.26 7.25ZM15.59 13.5c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.14.22-.55.71-.67.86-.13.14-.25.16-.47.05a5.87 5.87 0 0 1-1.74-1.07 6.58 6.58 0 0 1-1.2-1.5c-.12-.22-.01-.34.1-.45.1-.1.21-.25.32-.38.1-.13.14-.22.21-.37.07-.14.04-.27-.02-.38-.06-.1-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27c-.2.22-.77.76-.77 1.85 0 1.1.8 2.15.91 2.3.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.47.53.16 1 .14 1.38.08.42-.06 1.3-.53 1.48-1.04.19-.5.19-.94.13-1.03-.06-.08-.21-.14-.43-.25Z" />
    </svg>
  );

  const socialIcons = {
    whatsapp: <WhatsAppIcon />,
    facebook: <Facebook className="h-6 w-6" />,
    instagram: <Instagram className="h-6 w-6" />,
    twitter: <Twitter className="h-6 w-6" />,
  };

  return (
    <section id="widget-generator" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Create Your Chat Widget</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your chat widget in a few simple steps. Select your platform,
            enter your details, and we'll generate the code for you.
          </p>
        </div>

        {/* Freemium Banner */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg mb-8 text-center">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">Free Plan</h3>
              <p className="text-gray-600">Basic chat widget creation</p>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-purple-800">Premium Plan</h3>
              <p className="text-gray-600">Animated widgets + more features</p>
              <p className="text-lg font-bold text-purple-700">Just ₹99 one-time</p>
              {!widgetConfig.isPremium && (
                <Button 
                  onClick={handlePremiumUpgrade} 
                  className="mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  Upgrade Now
                </Button>
              )}
              {widgetConfig.isPremium && (
                <div className="mt-2 text-green-600 font-medium">Premium Active ✓</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Platform</h3>
              <RadioGroup
                defaultValue="whatsapp"
                value={widgetConfig.type}
                onValueChange={(value) => handleTypeChange(value as WidgetType)}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <div>
                  <RadioGroupItem
                    value="whatsapp"
                    id="whatsapp"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="whatsapp"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="facebook"
                    id="facebook"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="facebook"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Facebook className="mb-3 h-6 w-6" />
                    Facebook
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="instagram"
                    id="instagram"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="instagram"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Instagram className="mb-3 h-6 w-6" />
                    Instagram
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="twitter"
                    id="twitter"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="twitter"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Twitter className="mb-3 h-6 w-6" />
                    Twitter
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-4">
              <Label htmlFor="handle">Account Handle/Number</Label>
              <Input
                id="handle"
                name="handle"
                value={widgetConfig.handle}
                onChange={handleInputChange}
                placeholder={getPlaceholderText()}
                className="mt-1"
              />
            </div>

            {widgetConfig.type === 'whatsapp' && (
              <div className="mb-4">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={widgetConfig.welcomeMessage}
                  onChange={handleInputChange}
                  placeholder="Hello! How can I help you today?"
                  className="mt-1"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="position">Position</Label>
                <RadioGroup
                  defaultValue="right"
                  value={widgetConfig.position}
                  onValueChange={(value) => handlePositionChange(value as 'left' | 'right')}
                  className="grid grid-cols-2 gap-3 mt-1"
                >
                  <div>
                    <RadioGroupItem
                      value="left"
                      id="left"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="left"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Left
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="right"
                      id="right"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="right"
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Right
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="size">Button Size</Label>
                <Select 
                  value={widgetConfig.size} 
                  onValueChange={handleSizeChange}
                >
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
            </div>

            {/* Animation Selection (Premium Feature) */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <Label htmlFor="animation">Animation Effect</Label>
                {!widgetConfig.isPremium && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Premium Feature
                  </span>
                )}
              </div>
              <Select 
                value={widgetConfig.animation} 
                onValueChange={handleAnimationChange}
                disabled={!widgetConfig.isPremium}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="spin">Spin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <Label htmlFor="primaryColor">Color</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={widgetConfig.primaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-12 p-1 rounded-md"
                />
                <Input
                  name="primaryColor"
                  value={widgetConfig.primaryColor}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
            </div>

            <Button 
              onClick={generateWidget} 
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded"
            >
              Generate Widget Code
            </Button>
          </div>

          <div className="flex flex-col">
            <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm mb-4">
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
                  <WidgetPreview config={widgetConfig} />
                </div>
              </div>
            </div>

            {showCode && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Your Widget Code</h3>
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline" 
                    size="sm"
                    className="text-sm"
                  >
                    Copy Code
                  </Button>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-auto max-h-64">
                  <pre>{code}</pre>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Copy this code and paste it before the closing body tag of your website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
            <p className="mb-4">
              Animations are a premium feature. Upgrade to premium for just ₹99 (one-time payment) to access all animation effects and future premium features.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowPremiumModal(false)} 
                variant="outline"
              >
                Not Now
              </Button>
              <Button 
                onClick={handlePremiumUpgrade} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WidgetGenerator;
