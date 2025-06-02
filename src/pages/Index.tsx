import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import { Menu, X, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DonationModal from '@/components/DonationModal';
import DonatingWidget from '@/components/DonatingWidget';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 px-4 md:px-6 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Widgetify
            </div>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          {isMobile ? (
            <>
              <button 
                id="menu-toggle-button" 
                onClick={toggleMenu} 
                className="md:hidden text-gray-600 focus:outline-none p-3 rounded-xl hover:bg-gray-100 min-h-[44px] min-w-[44px] transition-all duration-200" 
                aria-label="Toggle menu" 
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              <div 
                id="mobile-menu" 
                className={`fixed top-[73px] left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl py-4 px-6 flex flex-col gap-2
                           border-t border-gray-100 transition-all duration-300 max-h-[calc(100vh-73px)] overflow-y-auto
                           ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`} 
                aria-hidden={!menuOpen}
              >
                <a href="#" className="text-gray-600 hover:text-purple-600 py-4 flex items-center justify-between border-b border-gray-50 pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Home
                </a>
                <a href="#widget-generator" className="text-gray-600 hover:text-purple-600 py-4 flex items-center justify-between border-b border-gray-50 pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Generate
                </a>
                <a href="#features" className="text-gray-600 hover:text-purple-600 py-4 flex items-center justify-between border-b border-gray-50 pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Features
                </a>
                <a href="#founder" className="text-gray-600 hover:text-purple-600 py-4 flex items-center justify-between border-b border-gray-50 pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Founder
                </a>
                <a href="/support" className="text-gray-600 hover:text-purple-600 py-4 flex items-center justify-between border-b border-gray-50 pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Support
                </a>
                <div className="pt-4 pb-2">
                  <button 
                    onClick={() => {
                      setIsDonationModalOpen(true);
                      handleMenuItemClick();
                    }} 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-4 rounded-xl inline-block w-full text-center min-h-[44px] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Donate
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <nav className="hidden md:flex gap-8">
                <a href="#" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">Home</a>
                <a href="#widget-generator" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">Generate</a>
                <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">Features</a>
                <a href="#founder" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">Founder</a>
                <a href="/support" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-purple-600 after:transition-all after:duration-300 hover:after:w-full">Support</a>
              </nav>
              <div>
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setIsDonationModalOpen(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Donate
                </Button>
              </div>
            </>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        <WidgetGenerator />
        <FeaturesSection />
        <FounderSection />
      </main>
      
      <Footer />
      
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />
      
      {/* Updated DonatingWidget with your specifications */}
      <DonatingWidget 
        upiId="adnanmuhammad4393@okicici"
        name="Muhammed Adnan"
        amount={599}
        position="bottom-right"
        primaryColor="#8B5CF6"
        buttonText="Donate"
        theme="modern"
        icon="dollar"
        showPulse={false}
        showGradient={true}
        title="Support Us"
        description="Scan this QR code to make a donation"
      />
    </div>
  );
};

export default Index;
