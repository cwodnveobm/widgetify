import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

const Integrations = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const integrations = [
    {
      id: "webflow",
      name: "Webflow",
      description: "Add widgets to your Webflow sites with custom code embed",
      logo: "/lovable-uploads/Webflow.jpeg",
      instructions: [
        "Generate your widget code from the Widget Generator",
        "In Webflow Designer, add an Embed component where you want the widget",
        "Paste the widget code into the embed component",
        "Publish your site to see the widget live"
      ],
      docUrl: "https://university.webflow.com/lesson/custom-code-embed"
    },
    {
      id: "wix",
      name: "Wix",
      description: "Integrate widgets into your Wix website using HTML iframe",
      logo: "/lovable-uploads/wix.jpeg",
      instructions: [
        "Create your widget and copy the HTML code",
        "In Wix Editor, click '+' and go to Embed Code",
        "Select 'HTML iframe' or 'Custom Element'",
        "Paste your widget code and adjust positioning"
      ],
      docUrl: "https://support.wix.com/en/article/embedding-custom-code-to-your-site"
    },
    {
      id: "squarespace",
      name: "Squarespace",
      description: "Embed widgets in Squarespace with Code Blocks",
      logo: "/lovable-uploads/squarespace.jpeg",
      instructions: [
        "Generate widget code from Widgetify",
        "In Squarespace, add a Code Block to your page",
        "Paste the HTML widget code into the block",
        "Save and preview to test functionality"
      ],
      docUrl: "https://support.squarespace.com/hc/en-us/articles/205815928-Code-Blocks"
    },
    {
      id: "framer",
      name: "Framer",
      description: "Add widgets to Framer sites with custom code components",
      logo: "/lovable-uploads/framer.png",
      instructions: [
        "Generate your widget code from Widgetify",
        "In Framer, add a Code Component to your canvas",
        "Paste the widget HTML/JavaScript code",
        "Publish your site to make the widget live"
      ],
      docUrl: "https://www.framer.com/developers/guides/custom-code/"
    },
    {
      id: "bubble",
      name: "Bubble",
      description: "Integrate widgets into Bubble apps using HTML elements",
      logo: "/lovable-uploads/bubble.png",
      instructions: [
        "Create your widget and copy the embed code",
        "In Bubble Editor, add an HTML element to your page",
        "Paste your widget code into the HTML element",
        "Preview and publish to see the widget in action"
      ],
      docUrl: "https://manual.bubble.io/core-resources/api/the-bubble-api"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16 md:pb-0">
      <Navigation onAuthModalOpen={openAuthModal} />
      <div className="container mx-auto container-padding py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
              No-Code Platform Integrations
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Seamlessly connect Widgetify with popular website builders. Follow our step-by-step guides to add widgets to your site.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img 
                    src={integration.logo} 
                    alt={`${integration.name} logo`}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">{integration.name}</h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  {integration.description}
                </p>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  <h4 className="font-medium text-xs sm:text-sm">Quick Setup:</h4>
                  <ol className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {integration.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-medium text-primary flex-shrink-0">{idx + 1}.</span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px] text-sm"
                  onClick={() => window.open(integration.docUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                  View Official Docs
                </Button>
              </Card>
            ))}
          </div>

          <Card className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Universal Embed Code</h2>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Use this code snippet structure for any platform that supports custom HTML:
            </p>
            <div className="bg-background/50 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 min-h-[36px] min-w-[36px]"
                onClick={() => handleCopy(
                  `<!-- Widgetify Widget -->\n<div id="widgetify-container"></div>\n<script>\n  // Your widget code here\n</script>`,
                  'universal'
                )}
              >
                {copiedId === 'universal' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <pre className="text-xs overflow-x-auto scrollbar-hide pr-10">
{`<!-- Widgetify Widget -->
<div id="widgetify-container"></div>
<script>
  // Your widget code here
</script>`}
              </pre>
            </div>
          </Card>
        </div>
      </div>
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

export default Integrations;
