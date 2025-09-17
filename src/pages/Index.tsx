
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';
import DonationPopup from '@/components/DonationPopup';
import MobileNavigation from '@/components/MobileNavigation';
import { Menu, X, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close menu when clicking outside or when switching to desktop view
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-toggle-button');
      if (menu && menuButton && !menu.contains(event.target as Node) && !menuButton.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Close menu when switching to desktop
    if (!isMobile) {
      setMenuOpen(false);
    }

    // Prevent body scroll when menu is open
    if (menuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, menuOpen]);
  
  const handleMenuItemClick = () => {
    // Close menu after clicking a menu item on mobile
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    handleMenuItemClick();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground text-center py-2 px-4 text-sm flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          <span>You're currently offline. Some features may not work.</span>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border py-3 md:py-4 px-2 md:px-6 sticky top-0 z-40 shadow-soft">
        <div className="max-w-full md:container mx-auto flex justify-between items-center px-1 md:px-0">
          <div className="flex items-center gap-2">
            <div className="text-xl md:text-2xl font-bold gradient-text">
              Widgetify
            </div>
            <Sparkles className="w-5 h-5 text-primary" />
            {isOnline ? (
              <Wifi className="w-4 h-4 text-primary md:hidden" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive md:hidden" />
            )}
          </div>
          
          {isMobile ? (
            <>
              <button 
                id="menu-toggle-button" 
                onClick={toggleMenu} 
                className="md:hidden text-muted-foreground focus:outline-none p-3 rounded-xl hover:bg-muted min-h-[44px] min-w-[44px] transition-all duration-200" 
                aria-label="Toggle menu" 
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              <div 
                id="mobile-menu" 
                className={`fixed top-[73px] left-0 right-0 bg-background/95 backdrop-blur-md shadow-elegant py-4 px-6 flex flex-col gap-2
                           border-t border-border transition-all duration-300 max-h-[calc(100vh-73px)] overflow-y-auto
                           ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`} 
                aria-hidden={!menuOpen}
              >
                <button onClick={() => scrollToSection('hero')} className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left">
                  Home
                </button>
                <button onClick={() => scrollToSection('widget-generator')} className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left">
                  Generate
                </button>
                <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left">
                  Features
                </button>
                <button onClick={() => scrollToSection('founder')} className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left">
                  Founder
                </button>
                <Link to="/support" className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Support
                </Link>
              </div>
            </>
          ) : (
            <nav className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('hero')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Home</button>
              <button onClick={() => scrollToSection('widget-generator')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Generate</button>
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Features</button>
              <button onClick={() => scrollToSection('founder')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Founder</button>
              <Link to="/support" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Support</Link>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow flex flex-col">
        <div className="flex-1 w-full sm:w-auto px-0 sm:px-4">
          <div id="hero">
            <HeroSection />
          </div>
          <div id="widget-generator">
            <WidgetGenerator />
          </div>
          <div id="features">
            <FeaturesSection />
          </div>
          <div id="founder">
            <FounderSection />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Promotional Popup */}
      <PromoPopup />
      
      {/* Donation Popup */}
      <DonationPopup />
    </div>
  );
};

export default Index;
