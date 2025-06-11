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
  const totalAmount = Math.round(currentPlan.price * 1.18);

  const handlePayment = () => {
    setShowPaymentGateway(true);
  };

  const handleUpiPayment = () => {
    const upiLink = `upi://pay?pa=adnanmuhammad4393@okicici&pn=Widgetify Platform&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Payment for ${currentPlan.name}`)}`;
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
                      <span className="text-purple-600">₹{totalAmount}</span>
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
            /* Enhanced Payment Gateway with Functional UPI */
            <div className="max-w-lg mx-auto">
              <Card className="overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 md:p-6">
                  <CardTitle className="text-center text-xl md:text-2xl font-bold">Complete Payment</CardTitle>
                  <CardDescription className="text-purple-100 text-center text-base md:text-lg font-medium">
                    {currentPlan.name} - ₹{totalAmount}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {paymentMethod === 'upi' ? (
                    <div className="space-y-6">
                      {/* Functional UPI Payment Gateway */}
                      <div 
                        style={{
                          maxWidth: '400px', 
                          margin: '0 auto', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '12px', 
                          padding: '20px', 
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
                          background: '#ffffff'
                        }}
                      >
                        <style>
                          {`
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
                          `}
                        </style>
                        
                        <h3 style={{margin: '0 0 16px 0', color: '#1f2937', fontSize: '20px', fontWeight: '600', textAlign: 'center'}} className="upi-gateway-title">
                          Pay with UPI
                        </h3>
                        
                        <div style={{textAlign: 'center', marginBottom: '20px'}}>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=adnanmuhammad4393@okicici&pn=Widgetify Platform&am=${totalAmount}&cu=INR&tn=Payment for ${currentPlan.name}`)}`}
                            alt="UPI Payment QR Code" 
                            style={{
                              width: '200px', 
                              height: '200px', 
                              border: '2px solid #f3f4f6', 
                              borderRadius: '8px', 
                              display: 'block', 
                              margin: '0 auto'
                            }} 
                            className="upi-gateway-qr"
                          />
                          <p style={{margin: '12px 0 0 0', fontSize: '12px', color: '#6b7280', fontWeight: '500'}}>
                            Scan with any UPI app
                          </p>
                        </div>

                        <div style={{background: '#f9fafb', borderRadius: '8px', padding: '12px', marginBottom: '16px'}}>
                          <p style={{margin: '4px 0', fontSize: '14px', color: '#374151'}} className="upi-gateway-details">
                            <strong>UPI ID:</strong> adnanmuhammad4393@okicici
                          </p>
                          <p style={{margin: '4px 0', fontSize: '14px', color: '#374151'}} className="upi-gateway-details">
                            <strong>Payee:</strong> Widgetify Platform
                          </p>
                          <p style={{margin: '4px 0', fontSize: '14px', color: '#374151'}} className="upi-gateway-details">
                            <strong>Amount:</strong> ₹{totalAmount}
                          </p>
                        </div>

                        <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '16px', textAlign: 'center'}}>
                          <p style={{margin: '0 0 12px 0', fontSize: '13px', color: '#6b7280'}}>
                            Or click to pay directly
                          </p>
                          <button 
                            onClick={handleUpiPayment}
                            style={{
                              width: '100%', 
                              padding: '16px 0', 
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                              color: 'white', 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              border: 'none', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              transition: 'all 0.3s ease', 
                              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                            }} 
                            className="upi-gateway-button"
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
                            }}
                          >
                            💳 Pay ₹{totalAmount} via UPI
                          </button>
                        </div>

                        <p style={{
                          margin: '16px 0 0 0', 
                          fontSize: '11px', 
                          color: '#9ca3af', 
                          textAlign: 'center', 
                          lineHeight: '1.4'
                        }} className="upi-gateway-note">
                          Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br/>
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
                        Pay ₹{totalAmount}
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
