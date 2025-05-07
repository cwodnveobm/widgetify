
import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  platforms: string[];
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ platforms, url }) => {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-lg p-3">
      <div className="text-center text-sm font-medium mb-2">Share this page</div>
      <div className="flex justify-center gap-2">
        {platforms.includes('facebook') && (
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center"
          >
            <Facebook size={18} />
          </a>
        )}
        
        {platforms.includes('twitter') && (
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center"
          >
            <Twitter size={18} />
          </a>
        )}
        
        {platforms.includes('linkedin') && (
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center"
          >
            <Linkedin size={18} />
          </a>
        )}
      </div>
      <div className="text-xs text-center text-gray-500 mt-2">
        <a 
          href="https://widgetify.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="no-underline text-gray-500"
        >
          Powered by Widgetify
        </a>
      </div>
    </div>
  );
};

export default SocialShare;
