import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Code, Palette, Settings, Zap } from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { motion } from 'framer-motion';
import { 
  AdaptiveSection, 
  AdaptiveHeading, 
  AdaptiveCard, 
  AdaptiveGrid,
  AdaptiveBadge 
} from '@/components/adaptive';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';

const Documentation: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { config, classes } = useAdaptiveUI();

  const shouldAnimate = config.content.animationLevel !== 'none';
  const animationDuration = config.content.animationLevel === 'full' ? 0.5 : 0.3;

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const sections = [
    {
      icon: Code,
      title: 'Installation',
      description: 'Quick setup guide for adding Widgetify to your website',
    },
    {
      icon: Palette,
      title: 'Customization',
      description: 'Extensive options to match your brand identity',
    },
    {
      icon: Settings,
      title: 'Advanced Config',
      description: 'Developer-friendly JavaScript API options',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <Navigation onAuthModalOpen={openAuthModal} />
      
      <AdaptiveSection variant="default" className="flex-grow">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div 
              className="flex items-center gap-3 mb-6 sm:mb-8"
              initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration }}
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="text-primary w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              </div>
              <AdaptiveHeading as="h1">Documentation</AdaptiveHeading>
              <AdaptiveBadge className="ml-auto">
                <Zap className="w-3 h-3 mr-1" />
                Updated
              </AdaptiveBadge>
            </motion.div>

            {/* Quick Overview Cards */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animationDuration, delay: 0.1 }}
            >
              <AdaptiveGrid columns={3} gap="md" className="mb-8">
                {sections.map((section, index) => (
                  <AdaptiveCard 
                    key={section.title} 
                    variant="interactive"
                    className="p-4 text-center"
                  >
                    <section.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">{section.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                  </AdaptiveCard>
                ))}
              </AdaptiveGrid>
            </motion.div>
            
            <div className="prose prose-primary max-w-none">
              {/* Getting Started */}
              <motion.section 
                className="mb-8 sm:mb-12"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animationDuration }}
              >
                <h2 className={`${classes.heading} mb-3 sm:mb-4`}>Getting Started with Widgetify</h2>
                <p className={`${classes.muted} text-sm sm:text-base`}>
                  Widgetify is a powerful tool that allows you to add customizable chat widgets to your website,
                  enabling your visitors to connect with you via their preferred social media platform.
                  This documentation will guide you through the setup process and help you make the most of Widgetify.
                </p>
              </motion.section>

              {/* Installation */}
              <motion.section 
                className="mb-8 sm:mb-12"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animationDuration }}
              >
                <h2 className={`${classes.heading} mb-3 sm:mb-4`}>Installation</h2>
                <AdaptiveCard variant="elevated" className="p-0 overflow-hidden">
                  <CardHeader className="pb-3 sm:pb-4 bg-muted/30">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      Quick Installation
                    </CardTitle>
                    <CardDescription className="text-sm">Add the following code to your website's HTML</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
                      <code>{`<script src="https://widgetify.com/widget.js" async defer data-id="YOUR_WIDGET_ID"></script>`}</code>
                    </pre>
                  </CardContent>
                </AdaptiveCard>
                
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Manual Installation</h3>
                  <ol className="list-decimal pl-6 mt-2 sm:mt-3 space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li>Generate your widget code from the <Link to="/" className="text-primary hover:underline">Widget Generator</Link></li>
                    <li>Copy the generated code</li>
                    <li>Paste it before the closing <code className="bg-muted px-1 rounded text-foreground">&lt;/body&gt;</code> tag in your website's HTML</li>
                  </ol>
                </div>
              </motion.section>

              {/* Customization */}
              <motion.section 
                className="mb-8 sm:mb-12"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animationDuration }}
              >
                <h2 className={`${classes.heading} mb-3 sm:mb-4`}>Customization Options</h2>
                <p className={`${classes.muted} text-sm sm:text-base mb-3`}>
                  Widgetify offers extensive customization options to match your brand's identity.
                  You can customize the following aspects of your widget:
                </p>
                
                <AdaptiveGrid columns={2} gap="sm" className="mt-4">
                  {[
                    { title: 'Platform Selection', desc: 'Choose from WhatsApp, Facebook, Instagram, Twitter, and more.' },
                    { title: 'Widget Position', desc: 'Place your widget on the left or right side of the screen.' },
                    { title: 'Color Scheme', desc: 'Customize the widget color to match your brand.' },
                    { title: 'Welcome Message', desc: 'Set a custom greeting message for your visitors.' },
                  ].map((item) => (
                    <AdaptiveCard key={item.title} variant="default" className="p-3">
                      <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </AdaptiveCard>
                  ))}
                </AdaptiveGrid>
              </motion.section>

              {/* Advanced Configuration */}
              <motion.section 
                className="mb-8 sm:mb-12"
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: animationDuration }}
              >
                <h2 className={`${classes.heading} mb-3 sm:mb-4`}>Advanced Configuration</h2>
                <p className={`${classes.muted} text-sm sm:text-base mb-3`}>
                  For developers who need more control, Widgetify offers advanced configuration options
                  via JavaScript API:
                </p>
                
                <AdaptiveCard variant="elevated" className="p-0 overflow-hidden">
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
                    <code>{`<script>
  window.widgetifyConfig = {
    delay: 2000,           // Delay widget appearance (ms)
    mobile: true,          // Enable on mobile devices
    position: 'right',     // Widget position
    platforms: ['whatsapp', 'facebook'],  // Active platforms
    theme: {
      primary: '#25D366',  // Primary color
      text: '#ffffff'      // Text color
    }
  };
</script>
<script src="https://widgetify.com/widget.js" async defer></script>`}</code>
                  </pre>
                </AdaptiveCard>
              </motion.section>
            </div>
          </div>
        </div>
      </AdaptiveSection>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>
  );
};

export default Documentation;
