import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
const Documentation: React.FC = () => {
  return <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">Widgetify</div>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            
            <Link to="/support" className="text-gray-600 hover:text-purple-600">Support</Link>
          </nav>
          <div className="md:hidden">
            <Link to="/" className="text-gray-600 hover:text-purple-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="text-purple-600" size={32} />
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
          
          <div className="prose prose-purple max-w-none">
            <section className="mb-12">
              <h2>Getting Started with Widgetify</h2>
              <p>
                Widgetify is a powerful tool that allows you to add customizable chat widgets to your website,
                enabling your visitors to connect with you via their preferred social media platform.
                This documentation will guide you through the setup process and help you make the most of Widgetify.
              </p>
            </section>

            <section className="mb-12">
              <h2>Installation</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Installation</CardTitle>
                  <CardDescription>Add the following code to your website's HTML</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <code>{`<script src="https://widgetify.com/widget.js" async defer data-id="YOUR_WIDGET_ID"></script>`}</code>
                  </pre>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h3>Manual Installation</h3>
                <ol className="list-decimal pl-6 mt-3 space-y-3">
                  <li>Generate your widget code from the <a href="/#widget-generator" className="text-purple-600 hover:underline">Widget Generator</a></li>
                  <li>Copy the generated code</li>
                  <li>Paste it before the closing <code>&lt;/body&gt;</code> tag in your website's HTML</li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2>Customization Options</h2>
              <p>
                Widgetify offers extensive customization options to match your brand's identity.
                You can customize the following aspects of your widget:
              </p>
              
              <ul className="list-disc pl-6 mt-3 space-y-3">
                <li><strong>Platform Selection:</strong> Choose from various messaging platforms including WhatsApp, Facebook, Instagram, Twitter, and more.</li>
                <li><strong>Widget Position:</strong> Place your widget on the left or right side of the screen.</li>
                <li><strong>Color Scheme:</strong> Customize the widget color to match your brand.</li>
                <li><strong>Welcome Message:</strong> Set a custom greeting message for your visitors.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Advanced Configuration</h2>
              <p>
                For developers who need more control, Widgetify offers advanced configuration options
                via JavaScript API:
              </p>
              
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mt-4">
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
            </section>
          </div>
        </div>
      </main>
    </div>;
};
export default Documentation;