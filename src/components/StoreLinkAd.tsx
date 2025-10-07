import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ExternalLink, Store } from 'lucide-react';
import storeLinkLogo from '@/assets/storelink-logo.png';

const StoreLinkAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 10 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    // Auto-dismiss after 20 seconds of being visible
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleVisitStore = () => {
    window.open('https://store.link?via=Um4wGCfwh0xG', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-background shadow-2xl border-0 animate-fade-in">
        <CardContent className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent transition-colors duration-200"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src={storeLinkLogo} 
                alt="store.link" 
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              Turn Your Sheet into an Online Store
            </h2>

            {/* Subtext */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              Just like Widgetify makes embedding widgets easy, <span className="font-semibold text-green-600">store.link</span> transforms your spreadsheet into a fully functional online store in seconds. No coding required!
            </p>

            {/* Features */}
            <div className="bg-accent/50 rounded-lg p-4 text-left space-y-2">
              <div className="flex items-start gap-2">
                <Store className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Quick Setup:</span> Launch your store within seconds
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Store className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">No Technical Skills:</span> Simple as updating a spreadsheet
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Store className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Perfect Match:</span> Great for widget-powered e-commerce sites
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleVisitStore}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Try store.link Now
            </Button>

            {/* Auto-dismiss indicator */}
            <p className="text-xs text-muted-foreground mt-3">
              This popup will auto-close in a few seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreLinkAd;
