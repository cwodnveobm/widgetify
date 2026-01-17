import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';
import StoreLinkAd from '@/components/StoreLinkAd';
import MobileNavigation from '@/components/MobileNavigation';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import FloatingDonateButton from '@/components/FloatingDonateButton';
import { QuizGenerator } from '@/components/QuizGenerator';
import { DonationBanner } from '@/components/DonationBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PersonalizedHero } from '@/components/PersonalizedHero';
import { PersonalizedCTA } from '@/components/PersonalizedCTA';
import { PersonalizedRecommendations } from '@/components/PersonalizedRecommendations';
import { PersonalizationDebug } from '@/components/PersonalizationDebug';
import { PersonalizedOnboarding } from '@/components/PersonalizedOnboarding';
import { PredictiveActions } from '@/components/PredictiveActions';
import { PricingNudge } from '@/components/PricingNudge';
import { SmartAutoSuggestions } from '@/components/SmartAutoSuggestions';
import { DonateButton } from '@/components/DonateButton';
import { SEOHead } from '@/components/SEOHead';
import { HomePageStructuredData } from '@/components/StructuredData';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { supabase } from '@/integrations/supabase/client';
import { Menu, X, Sparkles, Wifi, WifiOff, User, LogOut, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import type { WidgetType } from '@/types';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const hasTrackedPageView = React.useRef(false);
  const emailCaptureShownRef = React.useRef(false);
  const widgetGeneratorRef = React.useRef<{ selectWidget: (type: string) => void } | null>(null);
  const { user } = useAuth();
  const { trackPageView, trackClick, content, session, behavior } = usePersonalization();
  const { shouldShowOnboarding, extendedProfile, uiPersonalization } = useHyperPersonalization();
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Track page view on mount (only once)
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      trackPageView('/');
      hasTrackedPageView.current = true;
    }
  }, [trackPageView]);

  // Show email capture modal for returning users with engagement
  useEffect(() => {
    const alreadyCaptured = localStorage.getItem('widgetify_email_captured') === 'true';
    const alreadyDismissed = sessionStorage.getItem('widgetify_email_dismissed') === 'true';
    
    // Don't show if already captured, dismissed, user is logged in, or already shown this session
    if (alreadyCaptured || alreadyDismissed || user || emailCaptureShownRef.current) {
      return;
    }
    
    // Show for returning users OR users with significant engagement
    const shouldShow = (
      (session.isReturningUser && behavior.timeOnSite > 15) ||
      (behavior.widgetsGenerated > 0 && behavior.timeOnSite > 30) ||
      (behavior.scrollDepth > 60 && behavior.timeOnSite > 45)
    );
    
    if (shouldShow) {
      emailCaptureShownRef.current = true;
      // Delay showing the modal to not be intrusive
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [session.isReturningUser, behavior.timeOnSite, behavior.widgetsGenerated, behavior.scrollDepth, user]);

  const handleCloseEmailCapture = () => {
    setShowEmailCapture(false);
    sessionStorage.setItem('widgetify_email_dismissed', 'true');
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    handleMenuItemClick();
  };

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const handleOnboardingWidgetSelect = useCallback((widgetType: string) => {
    setShowOnboarding(false);
    // Scroll to widget generator and select widget
    scrollToSection('widget-generator');
    // Small delay to allow scroll to complete
    setTimeout(() => {
      const event = new CustomEvent('select-widget', { detail: { type: widgetType } });
      window.dispatchEvent(event);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      {/* SEO Components */}
      <SEOHead 
        title="Free Chat Widgets for Your Website"
        description="Generate customized chat widgets for WhatsApp, Telegram, Messenger & 15+ platforms. Easy integration with WordPress, Shopify, Wix. Free, no coding required."
        keywords="chat widget, WhatsApp widget, website chat, social media widget, customer support, free chat widget, WordPress, Shopify, Telegram, Messenger"
      />
      <HomePageStructuredData />
      
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground text-center py-2 px-4 text-sm flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          <span>You're currently offline. Some features may not work.</span>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border py-3 md:py-4 px-3 sm:px-4 md:px-6 sticky top-0 z-40 shadow-soft">
        <div className="max-w-full md:container mx-auto flex justify-between items-center px-0">
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
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle */}
            <ThemeToggle />
            
            {/* Donate Button */}
            <DonateButton variant="outline" size="sm" className="hidden sm:flex" />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full min-h-[44px] min-w-[44px]">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isMobile && (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => openAuthModal('signin')}>
                    Sign In
                  </Button>
                  <Button onClick={() => openAuthModal('signup')}>
                    Get Started
                  </Button>
                </div>
              )
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
                <Link to="/integrations" className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Integrations
                </Link>
                <Link to="/custom-builder" className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Custom Builder
                </Link>
                <Link to="/support" className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200" onClick={handleMenuItemClick}>
                  Support
                </Link>
                <button 
                  onClick={() => { window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer'); handleMenuItemClick(); }} 
                  className="text-destructive hover:text-destructive/80 py-4 flex items-center gap-2 border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left w-full"
                >
                  <Heart className="w-4 h-4" />
                  Donate
                </button>
                {!user && (
                  <>
                    <button onClick={() => { openAuthModal('signin'); handleMenuItemClick(); }} className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left w-full">
                      Sign In
                    </button>
                    <button onClick={() => { openAuthModal('signup'); handleMenuItemClick(); }} className="text-primary hover:text-primary/80 py-4 flex items-center justify-between min-h-[44px] font-medium transition-colors duration-200 text-left w-full">
                      Get Started
                    </button>
                  </>
                )}
                {user && (
                  <button onClick={() => { handleSignOut(); handleMenuItemClick(); }} className="text-destructive hover:text-destructive/80 py-4 flex items-center gap-2 min-h-[44px] font-medium transition-colors duration-200 text-left w-full">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                )}
              </div>
            </>
          ) : (
            <nav className="hidden md:flex gap-8">
              <button onClick={() => scrollToSection('hero')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Home</button>
              <button onClick={() => scrollToSection('widget-generator')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Generate</button>
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Features</button>
              <button onClick={() => scrollToSection('founder')} className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Founder</button>
              <Link to="/integrations" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Integrations</Link>
              <Link to="/custom-builder" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Custom Builder</Link>
              <Link to="/support" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Support</Link>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow flex flex-col w-full overflow-x-hidden">
        <div className="flex-1 w-full">
          <div id="hero" className="w-full">
            <PersonalizedHero onScrollToGenerator={() => scrollToSection('widget-generator')} />
          </div>
          <div id="widget-generator" className="w-full">
            <WidgetGenerator />
          </div>
          <PersonalizedRecommendations />
          <div id="features" className="w-full">
            <FeaturesSection />
          </div>
          <div id="quiz-generator" className="w-full">
            <QuizGenerator />
          </div>
          <PersonalizedCTA />
          <div id="founder" className="w-full">
            <FounderSection />
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Promotional Popup */}
      <PromoPopup />
      
      {/* Store.link Advertisement */}
      <StoreLinkAd />
      
      {/* Mobile Navigation Components */}
      <FloatingActionButton />
      <FloatingDonateButton />
      <BottomNavigation />
      
      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      
      {/* Email Capture Modal for Returning Users */}
      <EmailCaptureModal
        open={showEmailCapture}
        onClose={handleCloseEmailCapture}
      />
      
      {/* Personalized Onboarding Flow */}
      {showOnboarding && shouldShowOnboarding && (
        <PersonalizedOnboarding
          onComplete={handleOnboardingComplete}
          onSelectWidget={handleOnboardingWidgetSelect}
        />
      )}
      
      {/* Smart Auto-Suggestions based on widget affinities */}
      {!showOnboarding && behavior.timeOnSite > 10 && (
        <SmartAutoSuggestions
          onSelectWidget={(widgetType: WidgetType) => handleOnboardingWidgetSelect(widgetType)}
          currentWidget={undefined}
        />
      )}
      
      {/* Predictive Actions Floating Widget */}
      {!showOnboarding && uiPersonalization.showRecommendations && behavior.widgetsGenerated > 0 && (
        <PredictiveActions 
          variant="floating" 
          onSelectWidget={handleOnboardingWidgetSelect}
        />
      )}
      
      {/* Smart Donation Banner - shows after engagement */}
      <DonationBanner variant="floating" />
      
      {/* Personalization Debug (dev only) */}
      <PersonalizationDebug />
    </div>
  );
};

export default Index;
