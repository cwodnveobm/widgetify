import React, { useState } from 'react';
import { WidgetConfig, WidgetType, generateWidgetCode } from '@/lib/widgetUtils';
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

const WidgetGenerator: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    type: 'whatsapp',
    handle: '',
    welcomeMessage: 'Hello! How can I help you today?',
    position: 'right',
    primaryColor: '#25D366',
    size: 'medium',
  });

  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);

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
      <g>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#006A8E"/>
        <circle cx="21" cy="3" r="3" fill="#FF4D4D"/>
        <path d="M17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 8.5C11.3284 8.5 12 7.82843 12 7C12 6.17157 11.3284 5.5 10.5 5.5C9.67157 5.5 9 6.17157 9 7C9 7.82843 9.67157 8.5 10.5 8.5ZM10.5 18.5C11.3284 18.5 12 17.8284 12 17C12 16.1716 11.3284 15.5 10.5 15.5C9.67157 15.5 9 16.1716 9 17C9 17.8284 9.67157 18.5 10.5 18.5Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.5 12.5C18.3284 12.5 19 11.8284 19 11C19 10.1716 18.3284 9.5 17.5 9.5C16.6716 9.5 16 10.1716 16 11C16 11.8284 16.6716 12.5 17.5 12.5Z" fill="white"/>
        <path d="M12.01 4.5C7.96 4.5 4.5 7.96 4.5 12.01C4.5 16.06 7.96 19.5 12.01 19.5C16.06 19.5 19.5 16.06 19.5 12.01C19.5 7.96 16.06 4.5 12.01 4.5ZM12.01 18.2C8.68 18.2 5.8 15.32 5.8 12.01C5.8 8.7 8.68 5.8 12.01 5.8C15.33 5.8 18.2 8.7 18.2 12.01C18.2 15.32 15.32 18.2 12.01 18.2Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.5 8.9C9.5 9.32 9.14 9.65 8.7 9.65C8.26 9.65 7.9 9.32 7.9 8.9C7.9 8.48 8.26 8.15 8.7 8.15C9.14 8.15 9.5 8.48 9.5 8.9ZM16.1 8.9C16.1 9.32 15.74 9.65 15.3 9.65C14.86 9.65 14.5 9.32 14.5 8.9C14.5 8.48 14.86 8.15 15.3 8.15C15.74 8.15 16.1 8.48 16.1 8.9Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.7 14.87C16.7 16.27 14.59 17.4 12 17.4C9.41 17.4 7.3 16.27 7.3 14.87C7.3 14.1 7.94 13.42 8.96 12.99C9.31 12.82 9.72 12.96 9.89 13.31C10.06 13.66 9.92 14.07 9.57 14.24C9.02 14.5 8.7 14.83 8.7 15.13C8.7 15.8 10.24 16.5 12 16.5C13.76 16.5 15.3 15.8 15.3 15.13C15.3 14.81 14.9 14.46 14.28 14.2C13.92 14.04 13.76 13.63 13.92 13.27C14.08 12.91 14.49 12.75 14.85 12.91C15.92 13.33 16.7 14.05 16.7 14.87Z" fill="white"/>
      </g>
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
          <h2 className="text-3xl font-bold mb-4">Create Your Widgetify Widget</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your chat widget in a few simple steps. Select your platform,
            enter your details, and we'll generate the code for you.
          </p>
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
    </section>
  );
};

export default WidgetGenerator;
