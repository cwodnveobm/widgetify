
import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  platforms: string[];
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ platforms, url }) => {
  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => shareToSocial(platform)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          style={{ 
            backgroundColor: platform === 'facebook' ? '#1877F2' : 
                            platform === 'twitter' ? '#1DA1F2' : 
                            platform === 'linkedin' ? '#0A66C2' : '#6B7280' 
          }}
        >
          {platform === 'facebook' && <Facebook color="white" size={24} />}
          {platform === 'twitter' && <Twitter color="white" size={24} />}
          {platform === 'linkedin' && <Linkedin color="white" size={24} />}
        </button>
      ))}
      <div className="text-xs text-center text-gray-500 mt-1">
        <a 
          href="https://widgetify.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 no-underline"
        >
          Powered by Widgetify
        </a>
      </div>
    </div>
  );
};

export default SocialShare;
