
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import { Menu, X, Zap, CircuitBoard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
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
    <div className="min-h-screen flex flex-col bg-background relative cyber-grid">
      {/* Futuristic Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 md:py-4 px-2 md:px-6 sticky top-0 z-40 holographic-card">
        <div className="max-w-full md:container mx-auto flex justify-between items-center px-1 md:px-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CircuitBoard className="w-8 h-8 text-primary absolute animate-pulse" />
              <CircuitBoard className="w-8 h-8 text-primary/50" />
            </div>
            <div className="text-xl md:text-2xl font-bold gradient-text font-orbitron">
              WIDGETIFY
            </div>
            <Zap className="w-5 h-5 text-primary animate-pulse" />
          </div>
          
          {isMobile ? (
            <>
              <button 
                id="menu-toggle-button" 
                onClick={toggleMenu} 
                className="md:hidden text-foreground focus:outline-none p-3 rounded-xl hover:bg-secondary/50 min-h-[48px] min-w-[48px] transition-all duration-300 cyber-glow border border-primary/30" 
                aria-label="Toggle menu" 
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              <div 
                id="mobile-menu" 
                className={`fixed top-[73px] left-0 right-0 bg-background/95 backdrop-blur-xl shadow-2xl py-4 px-6 flex flex-col gap-2
                           border-t border-primary/30 transition-all duration-300 max-h-[calc(100vh-73px)] overflow-y-auto holographic-card
                           ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`} 
                aria-hidden={!menuOpen}
              >
                <a href="#" className="text-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border/30 pb-3 min-h-[48px] font-medium transition-all duration-300 font-orbitron hover:bg-secondary/30 px-4 rounded-lg" onClick={handleMenuItemClick}>
                  INITIALIZE
                </a>
                <a href="#widget-generator" className="text-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border/30 pb-3 min-h-[48px] font-medium transition-all duration-300 font-orbitron hover:bg-secondary/30 px-4 rounded-lg" onClick={handleMenuItemClick}>
                  GENERATE
                </a>
                <a href="#features" className="text-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border/30 pb-3 min-h-[48px] font-medium transition-all duration-300 font-orbitron hover:bg-secondary/30 px-4 rounded-lg" onClick={handleMenuItemClick}>
                  FEATURES
                </a>
                <a href="#founder" className="text-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border/30 pb-3 min-h-[48px] font-medium transition-all duration-300 font-orbitron hover:bg-secondary/30 px-4 rounded-lg" onClick={handleMenuItemClick}>
                  ARCHITECT
                </a>
                <a href="/support" className="text-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border/30 pb-3 min-h-[48px] font-medium transition-all duration-300 font-orbitron hover:bg-secondary/30 px-4 rounded-lg" onClick={handleMenuItemClick}>
                  SUPPORT
                </a>
              </div>
            </>
          ) : (
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-foreground hover:text-primary font-medium transition-all duration-300 relative font-orbitron text-sm tracking-wider hover:after:w-full after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_theme(colors.primary)]">INITIALIZE</a>
              <a href="#widget-generator" className="text-foreground hover:text-primary font-medium transition-all duration-300 relative font-orbitron text-sm tracking-wider hover:after:w-full after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_theme(colors.primary)]">GENERATE</a>
              <a href="#features"ClassName="text-foreground hover:text-primary font-medium transition-all duration-300 relative font-orbitron text-sm tracking-wider hover:after:w-full after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_theme(colors.primary)]">FEATURES</a>
              <a href="#founder" className="text-foreground hover:text-primary font-medium transition-all duration-300 relative font-orbitron text-sm tracking-wider hover:after:w-full after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_theme(colors.primary)]">ARCHITECT</a>
              <a href="/support" className="text-foreground hover:text-primary font-medium transition-all duration-300 relative font-orbitron text-sm tracking-wider hover:after:w-full after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_theme(colors.primary)]">SUPPORT</a>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow flex flex-col relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl floating"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl floating" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="flex-1 w-full sm:w-auto px-0 sm:px-4 relative z-10">
          <HeroSection />
          <WidgetGenerator />
          <FeaturesSection />
          <FounderSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
