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
            
          </div>
          
          
          
          
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Chat Spark. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            
            
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;