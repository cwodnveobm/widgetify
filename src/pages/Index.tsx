import React, { useEffect, useState, useCallback } from 'react';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';
import StoreLinkAd from '@/components/StoreLinkAd';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import FloatingDonateButton from '@/components/FloatingDonateButton';
import { QuizGenerator } from '@/components/QuizGenerator';
import { DonationBanner } from '@/components/DonationBanner';
import { PersonalizedHero } from '@/components/PersonalizedHero';
import { PersonalizedCTA } from '@/components/PersonalizedCTA';
import { PersonalizedRecommendations } from '@/components/PersonalizedRecommendations';
import { PersonalizationDebug } from '@/components/PersonalizationDebug';
import { PersonalizedOnboarding } from '@/components/PersonalizedOnboarding';
import { PredictiveActions } from '@/components/PredictiveActions';
import { SmartAutoSuggestions } from '@/components/SmartAutoSuggestions';
import { SEOHead } from '@/components/SEOHead';
import SmartNudgeSystem from '@/components/SmartNudgeSystem';
import { HomePageStructuredData } from '@/components/StructuredData';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { useRealTimeBehavior } from '@/hooks/useRealTimeBehavior';
import { useReferralTracking } from '@/hooks/useReferralTracking';
import { WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AuthModal } from '@/components/AuthModal';
import type { WidgetType } from '@/types';

const Index: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const hasTrackedPageView = React.useRef(false);
  const emailCaptureShownRef = React.useRef(false);
  const { user } = useAuth();
  const { trackPageView, content, session, behavior } = usePersonalization();
  const { shouldShowOnboarding, extendedProfile, uiPersonalization } = useHyperPersonalization();
  const { trackClick: trackBehaviorClick, psychologicalProfile } = useRealTimeBehavior();
  const isMobile = useIsMobile();
  
  // Track referral code from URL
  useReferralTracking();

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
    
    if (alreadyCaptured || alreadyDismissed || user || emailCaptureShownRef.current) {
      return;
    }
    
    const shouldShow = (
      (session.isReturningUser && behavior.timeOnSite > 15) ||
      (behavior.widgetsGenerated > 0 && behavior.timeOnSite > 30) ||
      (behavior.scrollDepth > 60 && behavior.timeOnSite > 45)
    );
    
    if (shouldShow) {
      emailCaptureShownRef.current = true;
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

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const handleOnboardingWidgetSelect = useCallback((widgetType: string) => {
    setShowOnboarding(false);
    scrollToSection('widget-generator');
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

      {/* Shared Navigation */}
      <Navigation onAuthModalOpen={openAuthModal} />
      
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
      
      {/* Real-Time Behavior Smart Nudge System */}
      <SmartNudgeSystem />
      
      {/* Personalization Debug (dev only) */}
      <PersonalizationDebug />
    </div>
  );
};

export default Index;
