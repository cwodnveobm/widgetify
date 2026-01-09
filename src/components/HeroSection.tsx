
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle, Sparkles, Zap, Globe, ArrowRight } from 'lucide-react';
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
      {/* Premium Background with layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8 z-0" />
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/25 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-2xl" />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.015] dark:opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium badge with glow */}
          <div className="inline-flex items-center gap-2 bg-background/90 backdrop-blur-xl border border-primary/20 rounded-full px-4 sm:px-5 py-2.5 mb-6 sm:mb-8 shadow-brand">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-primary/30 blur-md rounded-full" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground">Next-Gen Widget Platform</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live
            </span>
          </div>

          {/* Brand Name with premium typography */}
          <h1 className="mb-6 sm:mb-8 leading-none">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold brand-logo-xl brand-gradient-vibrant tracking-tight">
              Widgetify
            </span>
            <span className="block mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground tracking-wide">
              <span className="text-foreground font-semibold">Connect</span>
              <span className="mx-2 sm:mx-3 text-primary/40">•</span>
              <span className="text-foreground font-semibold">Engage</span>
              <span className="mx-2 sm:mx-3 text-accent/60">•</span>
              <span className="text-foreground font-semibold">Convert</span>
            </span>
          </h1>
          
          {/* Value proposition with better typography */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 px-2 md:px-12 mx-auto max-w-3xl leading-relaxed">
            Build stunning, high-converting widgets in seconds.
            <span className="text-foreground font-medium"> Zero code required.</span>
            <br className="hidden sm:block" />
            Seamlessly integrate with any platform and watch your engagement soar.
          </p>

          {/* Feature pills with modern styling */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            {[
              { icon: Zap, label: 'Lightning Fast', color: 'text-amber-500' },
              { icon: Globe, label: 'Universal Embed', color: 'text-accent' },
              { icon: Sparkles, label: 'AI-Powered', color: 'text-primary' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2.5 shadow-soft hover:shadow-elegant hover:border-primary/30 transition-all duration-300">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
          
          {/* Premium CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Button 
              onClick={scrollToGenerator} 
              size="lg"
              className="group brand-gradient-bg hover:opacity-90 text-white w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-semibold shadow-brand hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Building Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-border hover:border-primary/40 text-foreground hover:text-primary w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-semibold bg-background/80 backdrop-blur-sm transition-all duration-300 rounded-xl"
              onClick={scrollToPreview}
            >
              See Examples
            </Button>
          </div>
          
          {/* Stats bar */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
            {[
              { value: '10K+', label: 'Widgets Created' },
              { value: '50+', label: 'Platforms Supported' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold brand-gradient-text">{value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</span>
              </div>
            ))}
          </div>
          
          {/* Enhanced scroll indicator */}
          <div className="mt-12 md:mt-16 justify-center hidden md:flex">
            <button 
              onClick={scrollToGenerator}
              className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-xs font-medium uppercase tracking-wider">Explore</span>
              <div className="p-3 rounded-full border border-border group-hover:border-primary/40 bg-background/80 backdrop-blur-sm shadow-soft group-hover:shadow-elegant transition-all duration-300 animate-bounce">
                <ArrowDownCircle className="h-6 w-6" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
