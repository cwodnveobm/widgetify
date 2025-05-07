
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';

interface SocialShareProps {
  platforms: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ platforms, url }) => {
  const handleShare = (platform: string) => {
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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check this out&body=${encodeURIComponent(url)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'Check this out',
            url: url
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="social-share flex flex-wrap gap-2">
      {platforms.facebook && (
        <button
          onClick={() => handleShare('facebook')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </button>
      )}
      
      {platforms.twitter && (
        <button
          onClick={() => handleShare('twitter')}
          className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} />
        </button>
      )}
      
      {platforms.linkedin && (
        <button
          onClick={() => handleShare('linkedin')}
          className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </button>
      )}
      
      {platforms.whatsapp && (
        <button
          onClick={() => handleShare('whatsapp')}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
          aria-label="Share on WhatsApp"
        >
          <Share2 size={18} />
        </button>
      )}
      
      {platforms.email && (
        <button
          onClick={() => handleShare('email')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full"
          aria-label="Share via Email"
        >
          <Mail size={18} />
        </button>
      )}
    </div>
  );
};

export default SocialShare;
