import React from 'react';
import { JSScriptGenerator } from '@/components/JSScriptGenerator';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { SEOHead } from '@/components/SEOHead';
import { useState } from 'react';
import { AuthModal } from '@/components/AuthModal';

const ScriptLibrary: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <SEOHead 
        title="JavaScript Script Library - Ready-to-Use Scripts"
        description="Browse 50+ ready-to-use JavaScript scripts for security, analytics, performance, and engagement. Copy and paste into your website instantly."
        keywords="javascript scripts, website scripts, security scripts, analytics scripts, performance optimization"
      />
      
      <Navigation onAuthModalOpen={openAuthModal} />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <JSScriptGenerator />
      </main>
      
      <Footer />
      <BottomNavigation />
      
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
};

export default ScriptLibrary;
