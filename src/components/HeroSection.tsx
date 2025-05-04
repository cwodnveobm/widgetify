
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  const scrollToGenerator = () => {
    const generatorElement = document.getElementById('widget-generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPreview = () => {
    const previewElement = document.querySelector('.WidgetPreview-container');
    if (previewElement) {
      previewElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to the generator section if preview isn't found directly
      scrollToGenerator();
    }
  };

  return (
    <section className="relative py-10 md:py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-6 leading-tight">
            <span className="gradient-text">Widgetify</span> <br />
            <span className="mt-2 block text-lg md:text-2xl lg:text-4xl">Connect with visitors instantly</span>
          </h1>
          
          <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-5 md:mb-8 px-2 md:px-4">
            Generate customized chat widgets for your website in seconds.
            No coding required. Connect your social media accounts and
            start engaging with your visitors today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Button 
              onClick={scrollToGenerator} 
              size={isMobile ? "default" : "lg"}
              className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto px-6"
            >
              Create Your Widget
            </Button>
            
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 w-full sm:w-auto mt-3 sm:mt-0"
              onClick={scrollToPreview}
            >
              See Demo
            </Button>
          </div>
          
          <div className="mt-6 md:mt-10 flex justify-center animate-bounce hidden md:flex">
            <ArrowDownCircle 
              className="h-6 w-6 md:h-8 md:w-8 text-purple-400 cursor-pointer" 
              onClick={scrollToGenerator}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
