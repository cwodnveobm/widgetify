
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background with liquid glass effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-600 opacity-20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
        {/* Floating glass orbs */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 glass rounded-full floating"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 glass-subtle rounded-full floating-delayed"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 glass-dark rounded-full floating"></div>
      </div>

      {/* Main content with glass container */}
      <div className="relative z-10">
        <div className="glass-subtle min-h-screen">
          <HeroSection />
          <FeaturesSection />
          <WidgetGenerator />
          <FounderSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
