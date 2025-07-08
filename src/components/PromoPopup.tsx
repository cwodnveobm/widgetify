import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, MessageCircle, Eye } from 'lucide-react';

const PromoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Auto-dismiss after 15 seconds of being visible
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 20000); // 5s delay + 15s visible = 20s total

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in building an AI SaaS product. Let's discuss!");
    window.open(`https://wa.me/916567785508?text=${message}`, '_blank');
  };

  const handleProductsClick = () => {
    window.open('https://www.producthunt.com/@muhammad_adnan45', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0 animate-fade-in">
        <CardContent className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Content */}
          <div className="text-center space-y-4">
            {/* Headline */}
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Build Your Own AI SaaS Product
            </h2>

            {/* Subtext */}
            <p className="text-gray-600 text-sm leading-relaxed">
              Have an AI startup idea? I'll turn it into a fully functional product — fast. 
              From concept to launch, done for you.
            </p>

            {/* Contact Info */}
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p className="text-purple-800 font-semibold text-sm">
                📞 +91 65677 8508
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Connect with Me
              </Button>
              
              <Button
                onClick={handleProductsClick}
                variant="outline"
                className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                See My Products
              </Button>
            </div>

            {/* Auto-dismiss indicator */}
            <p className="text-xs text-gray-400 mt-3">
              This popup will auto-close in a few seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoPopup;