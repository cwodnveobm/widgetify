
import React from 'react';
import HeroSection from '@/components/HeroSection';
import WidgetGenerator from '@/components/WidgetGenerator';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-4 md:px-6 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">Widgetify</div>
          
          {isMobile ? (
            <>
              <button onClick={toggleMenu} className="md:hidden text-gray-600 focus:outline-none">
                <Menu size={24} />
              </button>
              
              {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md py-3 px-6 flex flex-col gap-4 border-t border-gray-100 animate-fade-in">
                  <a href="#" className="text-gray-600 hover:text-purple-600 py-2">Home</a>
                  <a href="#widget-generator" className="text-gray-600 hover:text-purple-600 py-2">Generate</a>
                  <a href="#features" className="text-gray-600 hover:text-purple-600 py-2">Features</a>
                  <a href="#" className="text-gray-600 hover:text-purple-600 py-2">Contact</a>
                  <div className="pt-2">
                    <a href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md inline-block w-full text-center">
                      Donate ₹14
                    </a>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
                <a href="#widget-generator" className="text-gray-600 hover:text-purple-600">Generate</a>
                <a href="#features" className="text-gray-600 hover:text-purple-600">Features</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
              </nav>
              <div>
                <a href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md inline-block">
                  Donate ₹14
                </a>
              </div>
            </>
          )}
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
