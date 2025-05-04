import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Chat Spark</h3>
            <p className="mb-4">
              The easiest way to add chat widgets to your website and connect with your visitors via their preferred social media platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                {/* Using a custom SVG for WhatsApp since it's not in lucide-react */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 6.32A8.78 8.78 0 0 0 12.14 4C7.82 4 4.3 7.53 4.3 11.86a7.8 7.8 0 0 0 1.04 3.9L4 20l4.33-1.13a7.78 7.78 0 0 0 3.8.98h.01c4.32 0 7.84-3.53 7.84-7.86 0-2.1-.82-4.07-2.3-5.55l-.08-.09ZM12.14 18.56h-.01c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.46.64.66-2.4-.16-.25a6.53 6.53 0 0 1-1-3.47c0-4 3.25-7.25 7.26-7.25a7.24 7.24 0 0 1 7.26 7.22c0 4-3.26 7.25-7.26 7.25ZM15.59 13.5c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.14.22-.55.71-.67.86-.13.14-.25.16-.47.05a5.87 5.87 0 0 1-1.74-1.07 6.58 6.58 0 0 1-1.2-1.5c-.12-.22-.01-.34.1-.45.1-.1.21-.25.32-.38.1-.13.14-.22.21-.37.07-.14.04-.27-.02-.38-.06-.1-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27c-.2.22-.77.76-.77 1.85 0 1.1.8 2.15.91 2.3.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.47.53.16 1 .14 1.38.08.42-.06 1.3-.53 1.48-1.04.19-.5.19-.94.13-1.03-.06-.08-.21-.14-.43-.25Z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          
          
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Chat Spark. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-white">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;