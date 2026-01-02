
import React from 'react';
import ReferAFriend from '@/components/ReferAFriend';
import { Button } from '@/components/ui/button';
import { Linkedin, Instagram } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return <footer className="bg-secondary/5 text-muted-foreground border-t border-border w-full">
      <div className="container mx-auto container-padding py-6 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">Widgetify</h3>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base text-muted-foreground">
              The easiest way to add chat widgets to your website and connect with your visitors via their preferred social media platform.
            </p>
            
            <div className="mt-4 flex flex-col gap-3 items-center md:items-start">
              <a href="https://widgetify-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=961430&theme=light&t=1746523667957" 
                  alt="Widgetify - Chat widgets | Product Hunt" 
                  style={{
                    width: "250px",
                    height: "54px"
                  }} 
                  width="250" 
                  height="54" 
                  className="max-w-full h-auto"
                  loading="lazy"
                />
              </a>
              
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-border"
              >
                <a 
                  href="https://www.producthunt.com/products/widgetify-2/reviews/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  ⭐ Leave a Review
                </a>
              </Button>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base text-foreground font-medium mb-3 sm:mb-4">Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="/" className="hover:text-primary transition-colors min-h-[44px] flex items-center text-xs sm:text-sm md:text-base">Home</a></li>
              <li><a href="#widget-generator" className="hover:text-primary transition-colors min-h-[44px] flex items-center text-xs sm:text-sm md:text-base">Generate Widget</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors min-h-[44px] flex items-center text-xs sm:text-sm md:text-base">Features</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors min-h-[44px] flex items-center text-xs sm:text-sm md:text-base">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 sm:mt-10 md:mt-12 pt-4 sm:pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-center md:text-left text-muted-foreground">© 2025 Widgetify. All rights reserved | Powered by Muhammed Adnan</p>
          <div className="flex gap-3 sm:gap-4 items-center flex-wrap justify-center">
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/in/muhammedadnanvv/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/adnanvv.ad/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://x.com/MuhammadAd93421" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>
            </div>
            <ReferAFriend />
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
