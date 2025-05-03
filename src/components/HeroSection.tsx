
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="gradient-text">Widgetify</span> <br />
            <span className="mt-2 block">Connect with visitors instantly</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Generate customized chat widgets for your website in seconds.
            No coding required. Connect your social media accounts and
            start engaging with your visitors today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToGenerator} 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white px-8"
            >
              Create Your Widget
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={scrollToPreview}
            >
              See Demo
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center animate-bounce">
            <ArrowDownCircle 
              className="h-10 w-10 text-purple-400 cursor-pointer" 
              onClick={scrollToGenerator}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
