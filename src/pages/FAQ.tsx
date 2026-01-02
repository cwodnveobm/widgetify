import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import SEOHead from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { AuthModal } from '@/components/AuthModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, HelpCircle, Wrench, Palette, Code, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is Widgetify?',
    answer: 'Widgetify is a free tool that helps you create customizable chat widgets for your website. These widgets allow your visitors to connect with you through popular messaging platforms like WhatsApp, Telegram, Instagram, and more.'
  },
  {
    category: 'Getting Started',
    question: 'Is Widgetify really free to use?',
    answer: 'Yes! Widgetify is completely free to use. You can generate unlimited widgets, customize them to match your brand, and embed them on your website without any cost.'
  },
  {
    category: 'Getting Started',
    question: 'Do I need to create an account?',
    answer: 'No account is required to generate and use widgets. However, creating a free account allows you to save your favorite widgets, access additional features, and sync your preferences across devices.'
  },
  {
    category: 'Getting Started',
    question: 'Which platforms are supported?',
    answer: 'Widgetify supports all major website platforms including WordPress, Shopify, Wix, Squarespace, Webflow, Framer, Bubble, and any custom HTML website. We provide easy-to-follow integration guides for each platform.'
  },
  
  // Setup & Installation
  {
    category: 'Setup & Installation',
    question: 'How do I install a widget on my website?',
    answer: 'After customizing your widget, click the "Copy Code" button to copy the embed code. Then paste this code into your website\'s HTML, typically just before the closing </body> tag. The widget will appear automatically on your site.'
  },
  {
    category: 'Setup & Installation',
    question: 'Can I add the widget to specific pages only?',
    answer: 'Yes! You can control where the widget appears by placing the embed code only on the pages where you want it. For WordPress and other CMS platforms, you can use conditional logic or page-specific code injection.'
  },
  {
    category: 'Setup & Installation',
    question: 'Will the widget slow down my website?',
    answer: 'No, our widgets are optimized for performance. The code is lightweight and loads asynchronously, meaning it won\'t block your page content from loading. Your website speed will remain unaffected.'
  },
  {
    category: 'Setup & Installation',
    question: 'Do I need coding knowledge to use Widgetify?',
    answer: 'Not at all! Widgetify is designed for everyone. Simply use our visual customizer to design your widget, copy the generated code, and paste it into your website. No coding skills required.'
  },
  
  // Customization
  {
    category: 'Customization',
    question: 'Can I customize the widget colors?',
    answer: 'Absolutely! You can fully customize your widget\'s colors including background, text, buttons, and icons. Use our color picker or enter specific hex/RGB values to match your brand identity perfectly.'
  },
  {
    category: 'Customization',
    question: 'Can I change the widget position?',
    answer: 'Yes, you can position your widget in any corner of the screen - bottom-right (default), bottom-left, top-right, or top-left. You can also adjust the offset from the screen edges.'
  },
  {
    category: 'Customization',
    question: 'How do I add my own logo or icon?',
    answer: 'In the widget customizer, you\'ll find an option to upload your custom logo or icon. We support PNG, JPG, and SVG formats. Your logo will be displayed on the widget button for better brand recognition.'
  },
  {
    category: 'Customization',
    question: 'Can I add multiple chat channels to one widget?',
    answer: 'Yes! You can add multiple messaging platforms to a single widget. When visitors click the widget, they\'ll see all available channels and can choose their preferred way to contact you.'
  },
  {
    category: 'Customization',
    question: 'How do I change the widget greeting message?',
    answer: 'You can customize the greeting message in the widget settings. This message appears when visitors hover over or open the widget, welcoming them and encouraging engagement.'
  },
  
  // Technical
  {
    category: 'Technical',
    question: 'Is the widget mobile-friendly?',
    answer: 'Yes, all Widgetify widgets are fully responsive and optimized for mobile devices. They adapt to different screen sizes and touch interactions for the best user experience on any device.'
  },
  {
    category: 'Technical',
    question: 'Does the widget work with all browsers?',
    answer: 'Our widgets are compatible with all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. They also work on mobile browsers for iOS and Android devices.'
  },
  {
    category: 'Technical',
    question: 'Can I use the widget on multiple websites?',
    answer: 'Yes, you can use your generated widget code on as many websites as you want. There are no restrictions on the number of sites or domains.'
  },
  {
    category: 'Technical',
    question: 'Is my data secure?',
    answer: 'Widgetify doesn\'t store or process any of your visitors\' personal data. The widget simply redirects users to their chosen messaging platform. All conversations happen directly on those platforms.'
  },
  
  // Features
  {
    category: 'Features',
    question: 'What is A/B Testing?',
    answer: 'Our A/B Testing feature allows you to test different widget variations to see which performs better. You can compare colors, positions, messages, and more to optimize your engagement rates.'
  },
  {
    category: 'Features',
    question: 'What is the Custom Builder?',
    answer: 'The Custom Builder is an advanced tool that gives you complete control over your widget design. You can create unique widgets with custom CSS, animations, and advanced styling options.'
  },
  {
    category: 'Features',
    question: 'Can I track widget performance?',
    answer: 'Yes! With A/B Testing enabled, you can track metrics like impressions, clicks, and conversion rates. This helps you understand how visitors interact with your widgets and optimize accordingly.'
  },
  {
    category: 'Features',
    question: 'How do I remove the Widgetify branding?',
    answer: 'You can remove the Widgetify branding by following our social accounts. Once verified, the branding will be removed from all your widgets, giving them a completely white-label appearance.'
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'Getting Started': <HelpCircle className="w-5 h-5" />,
  'Setup & Installation': <Wrench className="w-5 h-5" />,
  'Customization': <Palette className="w-5 h-5" />,
  'Technical': <Code className="w-5 h-5" />,
  'Features': <Zap className="w-5 h-5" />,
};

const FAQ: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [searchQuery, setSearchQuery] = useState('');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Filter FAQs based on search query
  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group FAQs by category
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const categories = Object.keys(groupedFAQs);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about Widgetify widgets, setup, customization, and features. Get help with installation and troubleshooting."
        keywords="FAQ, help, support, widget questions, chat widget help, Widgetify FAQ"
      />
      <StructuredData type="faqPage" />
      
      <Navigation onAuthModalOpen={openAuthModal} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto container-padding">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8">
                Find quick answers to common questions about Widgetify widgets, setup, and customization.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base rounded-xl border-border bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto container-padding">
            {categories.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                {categories.map((category) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {categoryIcons[category]}
                      </div>
                      <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                        {category}
                      </h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="space-y-3">
                      {groupedFAQs[category].map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category}-${index}`}
                          className="border border-border rounded-xl px-4 md:px-6 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors data-[state=open]:bg-card"
                        >
                          <AccordionTrigger className="text-left text-sm md:text-base font-medium text-foreground hover:no-underline py-4 md:py-5">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse all categories.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary hover:underline font-medium"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Still Need Help */}
            <div className="max-w-4xl mx-auto mt-12 md:mt-16">
              <div className="text-center p-6 md:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
      
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
};

export default FAQ;
