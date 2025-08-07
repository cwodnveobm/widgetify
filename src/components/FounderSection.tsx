import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
const FounderSection: React.FC = () => {
  return <section id="founder" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto container-padding">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-900 dark:text-white">Meet Our Founder</h2>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
            <img 
              src="/lovable-uploads/82cc7537-74e6-4d4f-8c9b-18fc07568b45.png" 
              alt="Muhammed Adnan - Founder & CEO" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white">Muhammed Adnan</h3>
            <p className="text-purple-600 dark:text-purple-400 font-medium mb-4 text-responsive">Founder & CEO</p>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-responsive">
                Muhammed Adnan, the founder of Widgetify. With a strong passion for technology and business, he created Widgetify to make widget creation easier for online stores and websites
              </p>
            </div>
            
            <div className="flex justify-center md:justify-start gap-3 sm:gap-4 mobile-stack">
              <a href="https://www.linkedin.com/in/muhammedadnanvv/?locale=en_US" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2 button-touch dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </Button>
              </a>
              <a href="https://x.com/MuhammadAd93421" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2 button-touch dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Twitter size={16} />
                  <span>X (Twitter)</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <a href="https://www.retailx.site/" target="_blank" rel="noopener noreferrer" className="inline-block">
            
          </a>
        </div>
      </div>
    </section>;
};
export default FounderSection;