
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/50 to-transparent"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Next-Gen Widget Builder</span>
          </div>

          {/* Enhanced title with better typography */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight hero-title">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Widgetify
            </span>
            <br />
            <span className="mt-2 sm:mt-3 block text-xl sm:text-2xl md:text-3xl lg:text-5xl text-foreground font-bold">
              Connect • Engage • Convert
            </span>
          </h1>
          
          {/* Enhanced description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-12 px-2 md:px-8 mx-auto max-w-3xl leading-relaxed">
            Create stunning, customizable widgets that transform your website visitors into engaged customers. 
            <span className="font-semibold text-primary"> No coding required.</span> 
            Launch in seconds, not hours.
          </p>

          {/* Enhanced feature highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Zap className="w-4 h-4 text-chart-1" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Globe className="w-4 h-4 text-chart-2" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Works Everywhere</span>
            </div>
            <div className="flex items-center gap-2 bg-background/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Fully Customizable</span>
            </div>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mobile-stack">
            <Button 
              onClick={scrollToGenerator} 
              size={isMobile ? "lg" : "lg"}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-h-[48px]"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Create Your Widget
            </Button>
            
            <Button 
              variant="outline" 
              size={isMobile ? "lg" : "lg"}
              className="border-2 border-primary/30 text-primary hover:bg-primary/5 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm bg-background/80 hover:border-primary/50 transition-all duration-300 min-h-[48px]"
              onClick={scrollToPreview}
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Enhanced scroll indicator */}
          <div className="mt-12 md:mt-16 justify-center animate-bounce hidden md:flex">
            <div className="bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg cursor-pointer hover:bg-background transition-all duration-300" onClick={scrollToGenerator}>
              <ArrowDownCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
