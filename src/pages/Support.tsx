
import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Support: React.FC = () => {
  return <div className="min-h-screen flex flex-col">
      <header className="bg-background/80 backdrop-blur-md border-b border-border py-4 px-6 sticky top-0 z-40 shadow-soft">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">Widgetify</div>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/support" className="text-primary font-medium">Support</Link>
          </nav>
          <div className="md:hidden">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <LifeBuoy className="text-primary" size={32} />
            <h1 className="text-3xl font-bold">Support</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our support team is available Monday to Friday, 9 AM to 5 PM (EST) to assist you with any technical issues.
                </p>
                <Button className="w-full">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-medium mb-2">How do I install the widget on my website?</h3>
                <p className="text-muted-foreground">
                  Installing the Widgetify chat widget is simple. Generate your widget code using our
                  Widget Generator tool, then copy and paste the generated code just before the closing
                  &lt;/body&gt; tag of your website's HTML.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-medium mb-2">Can I customize the appearance of the widget?</h3>
                <p className="text-muted-foreground">
                  Yes, you can fully customize the widget to match your brand's identity. You can change
                  the color, position, and choose which social media platforms to include.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-medium mb-2">Does the widget work on mobile devices?</h3>
                <p className="text-muted-foreground">
                  Yes, our widget is fully responsive and works seamlessly on all mobile devices, tablets,
                  and desktop computers.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-medium mb-2">Is there a cost to use Widgetify?</h3>
                <p className="text-muted-foreground">
                  Widgetify offers a free plan with basic features. For advanced customization and
                  additional features, we offer premium plans. You can support our development by making
                  a donation.
                </p>
              </div>
              
              <div className="pb-4">
                <h3 className="text-lg font-medium mb-2">How do I add new social media platforms to my widget?</h3>
                <p className="text-muted-foreground">
                  To add or modify the social media platforms in your widget, simply return to the
                  Widget Generator tool, select your desired platforms, and generate a new code.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-3">Still Need Help?</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              If you couldn't find an answer to your question, please feel free to reach out to our support team.
            </p>
            <Button size="lg">Contact Support</Button>
          </div>
        </div>
      </main>
    </div>;
};
export default Support;
