import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Widgetify</h3>
            <p className="mb-4 text-sm md:text-base">
              The easiest way to add chat widgets to your website and connect with your visitors via their preferred social media platform.
            </p>
            
            <div className="mt-4">
              <a href="https://www.producthunt.com/posts/widgetify-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-widgetify&#0045;2" target="_blank" rel="noopener noreferrer">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=961430&theme=light&t=1746523667957" alt="Widgetify - Chat&#0032;widgets | Product Hunt" style={{
                width: "250px",
                height: "54px"
              }} width="250" height="54" />
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
              
              <li>
                <a href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Donate
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs md:text-sm text-center md:text-left">© 2025 Widgetify. All rights reserved | Powered by Adwebcomic Agency</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://razorpay.me/@aznoxx?amount=zPcDiUDYF4mzSgsG00XV0w%3D%3D" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm bg-primary/80 hover:bg-primary text-white px-3 py-1.5 rounded-md transition-colors">
              Donate ₹14
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;