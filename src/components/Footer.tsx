import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HandHeart } from 'lucide-react';
import DonationModal from './DonationModal';
const Footer: React.FC = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  return <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Widgetify</h3>
            <p className="mb-4 text-sm md:text-base">
              The easiest way to add chat widgets to your website and connect with your visitors via their preferred social media platform.
            </p>
            
            <div className="mt-4 flex justify-center md:justify-start">
              <a href="https://widgetify-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=961430&theme=light&t=1746523667957" alt="Widgetify - Chat&#0032;widgets | Product Hunt" style={{
                width: "250px",
                height: "54px"
              }} width="250" height="54" className="max-w-full" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="text-white font-medium mb-4">Links</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#widget-generator" className="hover:text-white transition-colors">Generate Widget</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          
          
        </div>
        
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs md:text-sm text-center md:text-left mb-4 md:mb-0">© 2025 Widgetify. All rights reserved | Powered by Muhammed Adnan</p>
          <div className="flex gap-4">
            
          </div>
        </div>
      </div>

      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
    </footer>;
};
export default Footer;