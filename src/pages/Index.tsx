
import React from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">ChatSpark</div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Features</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
          </nav>
          <div>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
              Sign Up Free
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        <WidgetGenerator />
        <FeaturesSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
