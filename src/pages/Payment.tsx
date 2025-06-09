
import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Payment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const plans = {
    basic: { name: 'Basic Plan', price: 299, features: ['5 Widgets', 'Basic Support', '1 Website'] },
    pro: { name: 'Pro Plan', price: 599, features: ['Unlimited Widgets', 'Priority Support', '5 Websites', 'Custom Styling'] },
    enterprise: { name: 'Enterprise Plan', price: 1299, features: ['Everything in Pro', 'Custom Development', 'Unlimited Websites', '24/7 Support'] }
  };

  const currentPlan = plans[selectedPlan];
  const upiId = 'adnanmuhammad4393@okicici';
  const payeeName = 'Widgetify Platform';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&ecc=M&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${currentPlan.name}`)}`)}`;

  const handlePayment = () => {
    setShowPaymentGateway(true);
  };

  const handleUpiPayment = () => {
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${currentPlan.name}`)}`;
    window.location.href = upiLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 px-4 md:px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors min-h-[44px] min-w-[44px] justify-center">
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back to Home</span>
            <span className="font-medium sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Widgetify
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
            <p className="text-gray-600 text-sm md:text-base">Upgrade your Widgetify experience with premium features</p>
          </div>

          {!showPaymentGateway ? (
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Plan Selection */}
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Select a Plan</h2>
                {Object.entries(plans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all touch-manipulation ${selectedPlan === key ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                    onClick={() => setSelectedPlan(key as 'basic' | 'pro' | 'enterprise')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <CardTitle className="text-base md:text-lg">{plan.name}</CardTitle>
                        <div className="text-xl md:text-2xl font-bold text-purple-600">₹{plan.price}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check size={14} className="text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Card 
                      className={`cursor-pointer transition-all touch-manipulation ${paymentMethod === 'upi' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <CardContent className="p-4 text-center">
                        <Smartphone className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-purple-600" />
                        <div className="font-medium text-sm md:text-base">UPI</div>
                        <div className="text-xs text-gray-500">Quick & Secure</div>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer transition-all touch-manipulation ${paymentMethod === 'card' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CardContent className="p-4 text-center">
                        <CreditCard className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-purple-600" />
                        <div className="font-medium text-sm md:text-base">Card</div>
                        <div className="text-xs text-gray-500">Credit/Debit</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span>{currentPlan.name}</span>
                      <span>₹{currentPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>GST (18%)</span>
                      <span>₹{Math.round(currentPlan.price * 0.18)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-purple-600">₹{Math.round(currentPlan.price * 1.18)}</span>
                    </div>
                    <Button 
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-h-[48px] text-base font-medium"
                    >
                      Proceed to Pay
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Payment Gateway */
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <CardTitle className="text-center text-lg md:text-xl">Complete Payment</CardTitle>
                  <CardDescription className="text-purple-100 text-center text-sm md:text-base">
                    {currentPlan.name} - ₹{Math.round(currentPlan.price * 1.18)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {paymentMethod === 'upi' ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="text-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="UPI Payment QR Code" 
                          className="w-40 h-40 md:w-48 md:h-48 mx-auto border-2 border-gray-200 rounded-lg"
                        />
                        <p className="text-xs md:text-sm text-gray-600 mt-3">Scan with any UPI app</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                        <div className="text-xs md:text-sm"><strong>UPI ID:</strong> {upiId}</div>
                        <div className="text-xs md:text-sm"><strong>Payee:</strong> {payeeName}</div>
                        <div className="text-xs md:text-sm"><strong>Amount:</strong> ₹{Math.round(currentPlan.price * 1.18)}</div>
                      </div>

                      <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-600 mb-3">Or pay directly</p>
                        <Button 
                          onClick={handleUpiPayment}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 min-h-[48px] text-sm md:text-base font-medium"
                        >
                          💳 Pay via UPI App
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 text-center leading-relaxed">
                        Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br/>
                        Secure payment powered by UPI
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="min-h-[44px]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-sm">Expiry</Label>
                          <Input id="expiry" placeholder="MM/YY" className="min-h-[44px]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm">CVV</Label>
                          <Input id="cvv" placeholder="123" className="min-h-[44px]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">Cardholder Name</Label>
                        <Input id="name" placeholder="Full Name" className="min-h-[44px]" />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-h-[48px] text-base font-medium">
                        Pay ₹{Math.round(currentPlan.price * 1.18)}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowPaymentGateway(false)}
                  className="text-gray-600 hover:text-gray-800 min-h-[44px]"
                >
                  ← Back to Plan Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
