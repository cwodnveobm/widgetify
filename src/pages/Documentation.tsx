import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';

const Documentation: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 md:pb-0">
      <Navigation onAuthModalOpen={openAuthModal} />
      
      <main className="flex-grow container mx-auto container-padding py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <FileText className="text-primary w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Documentation</h1>
          </div>
          
          <div className="prose prose-primary max-w-none">
            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Getting Started with Widgetify</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Widgetify is a powerful tool that allows you to add customizable chat widgets to your website,
                enabling your visitors to connect with you via their preferred social media platform.
                This documentation will guide you through the setup process and help you make the most of Widgetify.
              </p>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Installation</h2>
              <Card className="card-mobile">
                <CardHeader className="p-0 pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Quick Installation</CardTitle>
                  <CardDescription className="text-sm">Add the following code to your website's HTML</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="bg-muted p-3 sm:p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                    <code className="text-foreground">{`<script src="https://widgetify.com/widget.js" async defer data-id="YOUR_WIDGET_ID"></script>`}</code>
                  </pre>
                </CardContent>
              </Card>
              
              <div className="mt-4 sm:mt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Manual Installation</h3>
                <ol className="list-decimal pl-6 mt-2 sm:mt-3 space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                  <li>Generate your widget code from the <Link to="/" className="text-primary hover:underline">Widget Generator</Link></li>
                  <li>Copy the generated code</li>
                  <li>Paste it before the closing <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag in your website's HTML</li>
                </ol>
              </div>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Customization Options</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-3">
                Widgetify offers extensive customization options to match your brand's identity.
                You can customize the following aspects of your widget:
              </p>
              
              <ul className="list-disc pl-6 mt-2 sm:mt-3 space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li><strong className="text-foreground">Platform Selection:</strong> Choose from various messaging platforms including WhatsApp, Facebook, Instagram, Twitter, and more.</li>
                <li><strong className="text-foreground">Widget Position:</strong> Place your widget on the left or right side of the screen.</li>
                <li><strong className="text-foreground">Color Scheme:</strong> Customize the widget color to match your brand.</li>
                <li><strong className="text-foreground">Welcome Message:</strong> Set a custom greeting message for your visitors.</li>
              </ul>
            </section>

            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Advanced Configuration</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-3">
                For developers who need more control, Widgetify offers advanced configuration options
                via JavaScript API:
              </p>
              
              <pre className="bg-muted p-3 sm:p-4 rounded-md overflow-x-auto mt-3 sm:mt-4 text-xs sm:text-sm">
                <code className="text-foreground">{`<script>
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
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>
  );
};

export default Documentation;
