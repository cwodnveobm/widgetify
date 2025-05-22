import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DonationModal from '@/components/DonationModal';
import DonatingWidget from '@/components/DonatingWidget';
import Button from '@/components/Button';

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
  return <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-3 md:py-4 px-4 md:px-6 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold gradient-text">Widgetify</div>
          
          {isMobile ? <>
              <button id="menu-toggle-button" onClick={toggleMenu} className="md:hidden text-gray-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 min-h-[44px] min-w-[44px]" aria-label="Toggle menu" aria-expanded={menuOpen}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              <div id="mobile-menu" className={`fixed top-[57px] left-0 right-0 bg-white shadow-md py-3 px-6 flex flex-col gap-4 
                           border-t border-gray-100 transition-all duration-300 max-h-[calc(100vh-57px)] overflow-y-auto
                           ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`} aria-hidden={!menuOpen}>
                <a href="#" className="text-gray-600 hover:text-purple-600 py-3 flex items-center justify-between border-b border-gray-50 pb-2 min-h-[44px]" onClick={handleMenuItemClick}>
                  Home
                </a>
                <a href="#widget-generator" className="text-gray-600 hover:text-purple-600 py-3 flex items-center justify-between border-b border-gray-50 pb-2 min-h-[44px]" onClick={handleMenuItemClick}>
                  Generate
                </a>
                <a href="#features" className="text-gray-600 hover:text-purple-600 py-3 flex items-center justify-between border-b border-gray-50 pb-2 min-h-[44px]" onClick={handleMenuItemClick}>
                  Features
                </a>
                <a href="#founder" className="text-gray-600 hover:text-purple-600 py-3 flex items-center justify-between border-b border-gray-50 pb-2 min-h-[44px]" onClick={handleMenuItemClick}>
                  Founder
                </a>
                <a href="/support" className="text-gray-600 hover:text-purple-600 py-3 flex items-center justify-between border-b border-gray-50 pb-2 min-h-[44px]" onClick={handleMenuItemClick}>
                  Support
                </a>
                <div className="pt-2 pb-3">
                  <button onClick={() => {
                setIsDonationModalOpen(true);
                handleMenuItemClick();
              }} className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-md inline-block w-full text-center min-h-[44px]">
                    Donate
                  </button>
                </div>
              </div>
            </> : <>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
                <a href="#widget-generator" className="text-gray-600 hover:text-purple-600">Generate</a>
                <a href="#features" className="text-gray-600 hover:text-purple-600">Features</a>
                <a href="#founder" className="text-gray-600 hover:text-purple-600">Founder</a>
                <a href="/support" className="text-gray-600 hover:text-purple-600">Support</a>
              </nav>
              <div>
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setIsDonationModalOpen(true)}
                >
                  Donate
                </Button>
              </div>
            </>}
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        <WidgetGenerator />
        <FeaturesSection />
        <FounderSection />
      </main>
      
      <Footer />
      
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      
      {/* Add the DonatingWidget with the specified properties */}
      <DonatingWidget 
        upiId="adnanmuhammad4393@okicici"
        name="Muhammed Adnan"
        amount={299}
        position="bottom-right"
        primaryColor="#8B5CF6"
        buttonText="Donate Us"
      />
    </div>;
};

export default Index;
