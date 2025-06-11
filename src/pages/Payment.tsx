
import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&ecc=M&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${currentPlan.name}`)}`)}`;

  const handlePayment = () => {
    setShowPaymentGateway(true);
  };

  const handleUpiPayment = () => {
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(`Payment for ${currentPlan.name}`)}`;
    window.location.href = upiLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Enhanced Mobile Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 py-3 md:py-4 px-3 md:px-6 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center gap-3 md:gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors min-h-[48px] min-w-[48px] justify-center p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back to Home</span>
            <span className="font-medium sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Widgetify
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
        <div className="w-full">
          <div className="text-center mb-6 md:mb-8 px-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">Choose Your Plan</h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">Upgrade your Widgetify experience with premium features</p>
          </div>

          {!showPaymentGateway ? (
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {/* Enhanced Plan Selection */}
              <div className="space-y-4 order-2 lg:order-1">
                <h2 className="text-lg md:text-xl font-semibold mb-4 px-1">Select a Plan</h2>
                {Object.entries(plans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all duration-300 touch-manipulation ${selectedPlan === key ? 'ring-2 ring-purple-500 bg-purple-50 shadow-lg scale-[1.02]' : 'hover:shadow-md hover:scale-[1.01] active:scale-100'}`}
                    onClick={() => setSelectedPlan(key as 'basic' | 'pro' | 'enterprise')}
                  >
                    <CardHeader className="pb-3 p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <CardTitle className="text-lg md:text-xl">{plan.name}</CardTitle>
                        <div className="text-2xl md:text-3xl font-bold text-purple-600">₹{plan.price}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm md:text-base text-gray-600">
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Payment Method Selection */}
              <div className="space-y-6 order-1 lg:order-2">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-4 px-1">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <Card 
                      className={`cursor-pointer transition-all duration-300 touch-manipulation ${paymentMethod === 'upi' ? 'ring-2 ring-purple-500 bg-purple-50 shadow-lg' : 'hover:shadow-md hover:scale-[1.02] active:scale-100'}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <CardContent className="p-4 md:p-6 text-center">
                        <Smartphone className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-purple-600" />
                        <div className="font-semibold text-base md:text-lg">UPI</div>
                        <div className="text-xs md:text-sm text-gray-500 mt-1">Quick & Secure</div>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer transition-all duration-300 touch-manipulation ${paymentMethod === 'card' ? 'ring-2 ring-purple-500 bg-purple-50 shadow-lg' : 'hover:shadow-md hover:scale-[1.02] active:scale-100'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CardContent className="p-4 md:p-6 text-center">
                        <CreditCard className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-purple-600" />
                        <div className="font-semibold text-base md:text-lg">Card</div>
                        <div className="text-xs md:text-sm text-gray-500 mt-1">Credit/Debit</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Enhanced Order Summary */}
                <Card className="shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-6 pt-0">
                    <div className="flex justify-between text-base md:text-lg">
                      <span className="font-medium">{currentPlan.name}</span>
                      <span className="font-semibold">₹{currentPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base text-gray-600">
                      <span>GST (18%)</span>
                      <span>₹{Math.round(currentPlan.price * 0.18)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg md:text-xl">
                      <span>Total</span>
                      <span className="text-purple-600">₹{Math.round(currentPlan.price * 1.18)}</span>
                    </div>
                    <Button 
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-h-[52px] text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Proceed to Pay
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Enhanced Payment Gateway */
            <div className="max-w-lg mx-auto">
              <Card className="overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 md:p-6">
                  <CardTitle className="text-center text-xl md:text-2xl font-bold">Complete Payment</CardTitle>
                  <CardDescription className="text-purple-100 text-center text-base md:text-lg font-medium">
                    {currentPlan.name} - ₹{Math.round(currentPlan.price * 1.18)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {paymentMethod === 'upi' ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="UPI Payment QR Code" 
                          className="w-52 h-52 md:w-60 md:h-60 mx-auto border-4 border-gray-200 rounded-xl shadow-lg"
                        />
                        <p className="text-sm md:text-base text-gray-600 mt-4 font-medium">Scan with any UPI app</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 md:p-5 space-y-3 border border-gray-200">
                        <div className="text-sm md:text-base"><strong>UPI ID:</strong> <span className="font-mono text-purple-600">{upiId}</span></div>
                        <div className="text-sm md:text-base"><strong>Payee:</strong> {payeeName}</div>
                        <div className="text-sm md:text-base"><strong>Amount:</strong> <span className="font-bold text-green-600">₹{Math.round(currentPlan.price * 1.18)}</span></div>
                      </div>

                      <div className="text-center space-y-4">
                        <p className="text-sm md:text-base text-gray-600 font-medium">Or pay directly</p>
                        <Button 
                          onClick={handleUpiPayment}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 min-h-[52px] text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          💳 Pay via UPI App
                        </Button>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                        <p className="text-xs md:text-sm text-blue-800 text-center leading-relaxed">
                          <strong>Supports:</strong> PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br/>
                          🔒 Secure payment powered by UPI
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm md:text-base font-medium">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          className="min-h-[48px] md:min-h-[52px] text-base"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-sm md:text-base font-medium">Expiry</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY" 
                            className="min-h-[48px] md:min-h-[52px] text-base"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm md:text-base font-medium">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            className="min-h-[48px] md:min-h-[52px] text-base"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm md:text-base font-medium">Cardholder Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Full Name" 
                          className="min-h-[48px] md:min-h-[52px] text-base"
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-h-[52px] text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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
                  className="text-gray-600 hover:text-gray-800 min-h-[48px] px-6 text-base font-medium hover:bg-gray-100 transition-all duration-300"
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
