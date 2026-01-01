import React, { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';

const Support: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16 md:pb-0">
      <SEOHead 
        title="Support & Help Center"
        description="Get help with Widgetify chat widgets. FAQs, troubleshooting guides, and contact information for technical support. We're here to help!"
        keywords="Widgetify support, chat widget help, widget troubleshooting, customer support, FAQ, technical help"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{ items: [
          { name: 'Home', url: 'https://widgetify.app/' },
          { name: 'Support', url: 'https://widgetify.app/support' }
        ]}}
      />
      <Navigation onAuthModalOpen={openAuthModal} />
      
      <main className="flex-grow container mx-auto container-padding py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <LifeBuoy className="text-primary w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">Support</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="card-mobile">
              <CardHeader className="p-0 pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Our support team is available Monday to Friday, 9 AM to 5 PM (EST) to assist you with any technical issues.
                </p>
                <Button className="w-full min-h-[48px]">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2">How do I install the widget on my website?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Installing the Widgetify chat widget is simple. Generate your widget code using our
                  Widget Generator tool, then copy and paste the generated code just before the closing
                  &lt;/body&gt; tag of your website's HTML.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2">Can I customize the appearance of the widget?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Yes, you can fully customize the widget to match your brand's identity. You can change
                  the color, position, and choose which social media platforms to include.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2">Does the widget work on mobile devices?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Yes, our widget is fully responsive and works seamlessly on all mobile devices, tablets,
                  and desktop computers.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2">Is there a cost to use Widgetify?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Widgetify offers a free plan with basic features. For advanced customization and
                  additional features, we offer premium plans. You can support our development by making
                  a donation.
                </p>
              </div>
              
              <div className="pb-4">
                <h3 className="text-base sm:text-lg font-medium mb-2">How do I add new social media platforms to my widget?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  To add or modify the social media platforms in your widget, simply return to the
                  Widget Generator tool, select your desired platforms, and generate a new code.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 sm:p-6 rounded-lg text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Still Need Help?</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm sm:text-base">
              If you couldn't find an answer to your question, please feel free to reach out to our support team.
            </p>
            <Button size="lg" className="min-h-[48px] w-full sm:w-auto">Contact Support</Button>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>;
};
export default Support;
