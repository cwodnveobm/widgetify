
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, Check } from 'lucide-react';

interface PaymentGateProps {
  widgetType: string;
  onPaymentComplete?: () => void;
}

const PaymentGate: React.FC<PaymentGateProps> = ({ widgetType, onPaymentComplete }) => {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl md:text-2xl text-gray-900">
          Widget Code Locked
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Complete payment to access your {widgetType} widget implementation code
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            What you'll get after payment:
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Complete HTML/JavaScript widget code</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Easy copy-paste implementation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Mobile-responsive design</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Lifetime access to your widget</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Priority support</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-purple-600">₹299</div>
          <p className="text-sm text-gray-500">One-time payment • Lifetime access</p>
          
          <Link to="/payment" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Unlock Widget Code - Pay ₹299
            </Button>
          </Link>
          
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Secure payment via UPI • Instant access after payment
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGate;
