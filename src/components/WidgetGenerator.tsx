import React, { useState, useEffect } from 'react';
import { WidgetType, WidgetSize } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChromePicker } from 'react-color';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { Code } from 'lucide-react';
import WidgetPreview from './WidgetPreview';
import PaymentGate from './PaymentGate';
import WidgetImplementation from './WidgetImplementation';

const WidgetGenerator: React.FC = () => {
  const [type, setType] = useState<WidgetType>('whatsapp');
  const [handle, setHandle] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const [primaryColor, setPrimaryColor] = useState('#25D366');
  const [size, setSize] = useState<WidgetSize>('medium');
  const [networks, setNetworks] = useState<string[]>([]);
  const [shareText, setShareText] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [followPlatform, setFollowPlatform] = useState<'linkedin' | 'instagram' | 'youtube'>('linkedin');
  const [amount, setAmount] = useState<number>(99);
  const [currency, setCurrency] = useState<string>('INR');
  const [paymentDescription, setPaymentDescription] = useState<string>('Payment for awesome service');
  const [upiId, setUpiId] = useState<string>('adnanmuhammad4393@okicici');
  const [payeeName, setPayeeName] = useState<string>('Muhammed Adnan');
  const [hasAccess, setHasAccess] = useState(false); // New state for payment verification

  useEffect(() => {
    document.title = 'Widgetify - Widget Generator';
  }, []);

  const config = {
    type,
    handle,
    welcomeMessage,
    position,
    primaryColor,
    size,
    networks,
    shareText,
    shareUrl,
    phoneNumber,
    reviewUrl,
    followPlatform,
    amount,
    currency,
    paymentDescription,
    upiId,
    payeeName
  };

  const handleColorChange = (color: { hex: string }) => {
    setPrimaryColor(color.hex);
  };

  const handleNetworkChange = (network: string) => {
    if (networks.includes(network)) {
      setNetworks(networks.filter(n => n !== network));
    } else {
      setNetworks([...networks, network]);
    }
  };

  const getWidgetDisplayName = (widgetType: WidgetType): string => {
    switch (widgetType) {
      case 'whatsapp': return 'WhatsApp';
      case 'call-now': return 'Call Now';
      case 'social-share': return 'Social Share';
      case 'dodo-payment': return 'Payment Widget';
      case 'review-now': return 'Review Widget';
      case 'follow-us': return 'Follow Us';
      default: return 'Custom Widget';
    }
  };

  const handlePaymentComplete = () => {
    setHasAccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget Generator</h1>
          <p className="text-gray-600">Customize your widget and generate the code</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Widget Type Section */}
            <Card>
              <CardHeader>
                <CardTitle>Widget Type</CardTitle>
                <CardDescription>Choose the type of widget you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a widget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="call-now">Call Now</SelectItem>
                    <SelectItem value="social-share">Social Share</SelectItem>
                    <SelectItem value="dodo-payment">Payment Widget</SelectItem>
                    <SelectItem value="review-now">Review Widget</SelectItem>
                    <SelectItem value="follow-us">Follow Us</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Configure the widget based on its type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {type === 'whatsapp' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappHandle">WhatsApp Number</Label>
                      <Input
                        type="tel"
                        id="whatsappHandle"
                        placeholder="Enter WhatsApp number with country code"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea
                        id="welcomeMessage"
                        placeholder="Enter welcome message"
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                      />
                    </div>
                  </>
                )}
                {type === 'call-now' && (
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      placeholder="Enter phone number with country code"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                )}
                {type === 'social-share' && (
                  <>
                    <div className="space-y-2">
                      <Label>Networks to Share On</Label>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="facebook"
                            checked={networks.includes('facebook')}
                            onCheckedChange={() => handleNetworkChange('facebook')}
                          />
                          <Label htmlFor="facebook">Facebook</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="twitter"
                            checked={networks.includes('twitter')}
                            onCheckedChange={() => handleNetworkChange('twitter')}
                          />
                          <Label htmlFor="twitter">Twitter</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="linkedin"
                            checked={networks.includes('linkedin')}
                            onCheckedChange={() => handleNetworkChange('linkedin')}
                          />
                          <Label htmlFor="linkedin">LinkedIn</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shareText">Share Text</Label>
                      <Input
                        type="text"
                        id="shareText"
                        placeholder="Enter share text"
                        value={shareText}
                        onChange={(e) => setShareText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shareUrl">Share URL</Label>
                      <Input
                        type="url"
                        id="shareUrl"
                        placeholder="Enter share URL"
                        value={shareUrl}
                        onChange={(e) => setShareUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}
                {type === 'review-now' && (
                  <div className="space-y-2">
                    <Label htmlFor="reviewUrl">Review URL</Label>
                    <Input
                      type="url"
                      id="reviewUrl"
                      placeholder="Enter review URL"
                      value={reviewUrl}
                      onChange={(e) => setReviewUrl(e.target.value)}
                    />
                  </div>
                )}
                {type === 'follow-us' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="followPlatform">Platform to Follow</Label>
                      <Select value={followPlatform} onValueChange={setFollowPlatform}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="handle">Handle</Label>
                      <Input
                        type="text"
                        id="handle"
                        placeholder="Enter handle (e.g., @widgetify)"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                      />
                    </div>
                  </>
                )}
                {type === 'dodo-payment' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        type="text"
                        id="currency"
                        placeholder="Enter currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDescription">Payment Description</Label>
                      <Input
                        type="text"
                        id="paymentDescription"
                        placeholder="Enter payment description"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        type="text"
                        id="upiId"
                        placeholder="Enter UPI ID"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payeeName">Payee Name</Label>
                      <Input
                        type="text"
                        id="payeeName"
                        placeholder="Enter Payee Name"
                        value={payeeName}
                        onChange={(e) => setPayeeName(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Customization Section */}
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Customize the appearance and behavior of the widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <ChromePicker color={primaryColor} onChange={handleColorChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="position">Position</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="left">Left</Label>
                    <Switch
                      id="position"
                      checked={position === 'left'}
                      onCheckedChange={(checked) => setPosition(checked ? 'left' : 'right')}
                    />
                    <Label htmlFor="right">Right</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Section - Modified */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasAccess ? (
                  <WidgetImplementation config={config} />
                ) : (
                  <PaymentGate 
                    widgetType={getWidgetDisplayName(config.type)} 
                    onPaymentComplete={handlePaymentComplete}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how the widget will look on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 relative bg-gray-100 rounded-md overflow-hidden">
                  <WidgetPreview config={config} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetGenerator;
