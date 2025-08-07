
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle, Sparkles, Zap, Globe } from 'lucide-react';
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
      scrollToGenerator();
    }
  };

  return (
    <section className="relative py-8 sm:py-12 md:py-20 lg:py-32 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-cyan-900/20 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 dark:via-gray-900/50 to-transparent"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">Next-Gen Widget Builder</span>
          </div>

          {/* Enhanced title with better typography */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight hero-title">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Widgetify
            </span>
            <br />
            <span className="mt-2 sm:mt-3 block text-xl sm:text-2xl md:text-3xl lg:text-5xl text-gray-800 dark:text-gray-200 font-bold">
              Connect • Engage • Convert
            </span>
          </h1>
          
          {/* Enhanced description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-12 px-2 md:px-8 mx-auto max-w-3xl leading-relaxed">
            Create stunning, customizable widgets that transform your website visitors into engaged customers. 
            <span className="font-semibold text-purple-700 dark:text-purple-400"> No coding required.</span> 
            Launch in seconds, not hours.
          </p>

          {/* Enhanced feature highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Globe className="w-4 h-4 text-green-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Works Everywhere</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Fully Customizable</span>
            </div>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mobile-stack">
            <Button 
              onClick={scrollToGenerator} 
              size={isMobile ? "lg" : "lg"}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 button-touch"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Create Your Widget
            </Button>
            
            <Button 
              variant="outline" 
              size={isMobile ? "lg" : "lg"}
              className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 button-touch"
              onClick={scrollToPreview}
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Enhanced scroll indicator */}
          <div className="mt-12 md:mt-16 flex justify-center animate-bounce hidden md:flex">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg cursor-pointer hover:bg-white transition-all duration-300" onClick={scrollToGenerator}>
              <ArrowDownCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
