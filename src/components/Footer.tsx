
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Widgetify</h3>
            <p className="mb-4 text-sm md:text-base">
              The easiest way to add chat widgets to your website and connect with your visitors via their preferred social media platform.
            </p>
            <div className="flex gap-4 mt-6 mb-8 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5 md:w-6 md:h-6" />
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
          <div className="col-span-1">
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li>
                <a 
                  href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs md:text-sm text-center md:text-left">© 2025 Widgetify. All rights reserved | Powered by Adwebcomic Agency</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a 
              href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs md:text-sm bg-primary/80 hover:bg-primary text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Donate ₹14
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
