import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FounderSection: React.FC = () => {
  return (
    <section id="founder" className="section-spacing bg-muted/30">
      <div className="container mx-auto container-padding">
        <h2 className="heading-responsive text-center mb-8 sm:mb-12 text-foreground">
          Meet Our Founder
        </h2>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10 max-w-4xl mx-auto">
          <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden flex-shrink-0 shadow-elegant ring-4 ring-primary/10">
            <img 
              src="/lovable-uploads/82cc7537-74e6-4d4f-8c9b-18fc07568b45.png" 
              alt="Muhammed Adnan - Founder & CEO" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-foreground">
              Muhammed Adnan
            </h3>
            <p className="text-primary font-medium mb-4 text-sm sm:text-base">
              Founder & CEO
            </p>
            
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg max-w-xl">
                Muhammed Adnan, the founder of Widgetify. With a strong passion for technology and business, he created Widgetify to make widget creation easier for online stores and websites.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <a 
                href="https://www.linkedin.com/in/muhammedadnanvv/?locale=en_US" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 min-h-[44px] w-full sm:w-auto"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </Button>
              </a>
              <a 
                href="https://x.com/MuhammadAd93421" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 min-h-[44px] w-full sm:w-auto"
                >
                  <Twitter size={18} />
                  <span>X (Twitter)</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;