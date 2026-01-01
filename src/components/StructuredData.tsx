import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'organization' | 'webApplication' | 'faqPage' | 'breadcrumb' | 'article' | 'product';
  data?: Record<string, unknown>;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Widgetify",
  "alternateName": "Widgetify Chat Widgets",
  "url": "https://widgetify.app",
  "logo": "https://widgetify.app/favicon.png",
  "description": "Generate customized chat widgets for your website in seconds. Connect with visitors via WhatsApp, Telegram, Messenger, and more.",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Muhammed Adnan",
    "url": "https://www.linkedin.com/in/muhammedadnanvv/"
  },
  "sameAs": [
    "https://www.linkedin.com/in/muhammedadnanvv/",
    "https://www.instagram.com/adnanvv.ad/",
    "https://x.com/MuhammadAd93421",
    "https://www.producthunt.com/products/widgetify-2"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://widgetify.app/support",
    "availableLanguage": ["English"]
  }
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Widgetify",
  "alternateName": "Widgetify Widget Generator",
  "url": "https://widgetify.app",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "description": "Free chat widget generator for websites. Create custom WhatsApp, Telegram, Messenger, and social media chat widgets without coding.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free to use with unlimited widgets"
  },
  "featureList": [
    "WhatsApp Chat Widget",
    "Telegram Chat Widget", 
    "Facebook Messenger Widget",
    "Instagram Chat Widget",
    "Custom Widget Builder",
    "A/B Testing",
    "50+ JavaScript Scripts Library",
    "Platform Integrations",
    "No Coding Required",
    "Mobile Responsive"
  ],
  "screenshot": "https://widgetify.app/images/og-widgetify.jpg",
  "softwareVersion": "2.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Widgetify?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Widgetify is a free tool that lets you create customized chat widgets for your website. Connect with visitors through WhatsApp, Telegram, Messenger, Instagram, and more social platforms without any coding required."
      }
    },
    {
      "@type": "Question",
      "name": "How do I add a chat widget to my website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply choose your preferred chat platform, customize the widget appearance, and copy the generated code. Paste it into your website's HTML before the closing </body> tag. Works with any website platform including WordPress, Shopify, Wix, and custom sites."
      }
    },
    {
      "@type": "Question",
      "name": "Is Widgetify free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Widgetify is completely free to use. You can generate unlimited chat widgets for any platform without any cost or subscription required."
      }
    },
    {
      "@type": "Question",
      "name": "Which platforms does Widgetify support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Widgetify supports WhatsApp, Telegram, Facebook Messenger, Instagram, Discord, Slack, Snapchat, Viber, Line, WeChat, Signal, Skype, and many more messaging platforms."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize the chat widget appearance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! You can customize colors, size, position, welcome messages, button text, animations, and more. The Custom Builder provides even more advanced customization options."
      }
    },
    {
      "@type": "Question",
      "name": "Does Widgetify work with WordPress, Shopify, and other platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Widgetify widgets work with any website platform including WordPress, Shopify, Wix, Squarespace, Webflow, Framer, Bubble, and custom HTML/JavaScript sites."
      }
    }
  ]
};

const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  useEffect(() => {
    const scriptId = `structured-data-${type}`;
    
    // Remove existing script if any
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    let schema: Record<string, unknown>;
    
    switch (type) {
      case 'organization':
        schema = organizationSchema;
        break;
      case 'webApplication':
        schema = webApplicationSchema;
        break;
      case 'faqPage':
        schema = faqSchema;
        break;
      case 'breadcrumb':
        schema = breadcrumbSchema(data?.items as Array<{ name: string; url: string }> || []);
        break;
      default:
        schema = data || {};
    }

    // Create and append script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
};

// Composite component for homepage with all schemas
export const HomePageStructuredData: React.FC = () => {
  return (
    <>
      <StructuredData type="organization" />
      <StructuredData type="webApplication" />
      <StructuredData type="faqPage" />
    </>
  );
};

export default StructuredData;
