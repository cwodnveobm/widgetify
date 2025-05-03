import React from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
const Index: React.FC = () => {
  return <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">Widgetify</div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Features</a>
            
            <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
          </nav>
          <div>
            <a href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md inline-block">
              Donate ₹14
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        <WidgetGenerator />
        <FeaturesSection />
      </main>
      
      <Footer />
    </div>;
};
export default Index;