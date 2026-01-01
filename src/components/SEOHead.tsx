import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

const defaultSEO = {
  siteName: 'Widgetify',
  title: 'Widgetify - Free Chat Widgets for Your Website',
  description: 'Generate customized chat widgets for WhatsApp, Telegram, Messenger, and more. Easy integration with any website platform. Free, no coding required.',
  keywords: 'chat widget, WhatsApp widget, website chat, social media widget, customer support widget, free chat widget, website integration, messenger widget, telegram widget',
  image: '/images/og-widgetify.jpg',
  url: 'https://widgetify.app',
  twitterHandle: '@widgetify',
  author: 'Muhammed Adnan',
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  noindex = false,
}) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title;
  const fullDescription = description || defaultSEO.description;
  const fullImage = image || defaultSEO.image;
  const fullUrl = `${defaultSEO.url}${location.pathname}`;
  const fullKeywords = keywords || defaultSEO.keywords;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', fullDescription);
    updateMeta('keywords', fullKeywords);
    updateMeta('author', defaultSEO.author);
    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', fullDescription, true);
    updateMeta('og:image', fullImage.startsWith('http') ? fullImage : `${defaultSEO.url}${fullImage}`, true);
    updateMeta('og:url', fullUrl, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', defaultSEO.siteName, true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', defaultSEO.twitterHandle);
    updateMeta('twitter:creator', defaultSEO.twitterHandle);
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', fullDescription);
    updateMeta('twitter:image', fullImage.startsWith('http') ? fullImage : `${defaultSEO.url}${fullImage}`);

    // Additional AI-discovery and search optimization meta tags
    updateMeta('application-name', defaultSEO.siteName);
    updateMeta('apple-mobile-web-app-title', defaultSEO.siteName);
    updateMeta('format-detection', 'telephone=no');
    updateMeta('mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-status-bar-style', 'default');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

  }, [fullTitle, fullDescription, fullImage, fullUrl, fullKeywords, type, noindex]);

  return null;
};

export default SEOHead;
