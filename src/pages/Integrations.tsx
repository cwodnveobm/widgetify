import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Check, Globe, Layers, Box, Layout, Blocks, Smartphone, ShoppingCart, FileText, Palette, Zap, Code2, PenTool, Laptop, Store, BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import BottomNavigation from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo?: string;
  icon?: React.ComponentType<{ className?: string }>;
  instructions: string[];
  docUrl: string;
  category: 'website-builder' | 'ecommerce' | 'app-builder' | 'cms' | 'landing-page';
  popular?: boolean;
}

const Integrations = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const categories = [
    { id: 'all', label: 'All Platforms' },
    { id: 'website-builder', label: 'Website Builders' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'app-builder', label: 'App Builders' },
    { id: 'cms', label: 'CMS' },
    { id: 'landing-page', label: 'Landing Pages' },
  ];

  const integrations: Integration[] = [
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
      docUrl: "https://university.webflow.com/lesson/custom-code-embed",
      category: "website-builder",
      popular: true
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
      docUrl: "https://support.wix.com/en/article/embedding-custom-code-to-your-site",
      category: "website-builder",
      popular: true
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
      docUrl: "https://support.squarespace.com/hc/en-us/articles/205815928-Code-Blocks",
      category: "website-builder",
      popular: true
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
      docUrl: "https://www.framer.com/developers/guides/custom-code/",
      category: "website-builder",
      popular: true
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
      docUrl: "https://manual.bubble.io/core-resources/api/the-bubble-api",
      category: "app-builder",
      popular: true
    },
    {
      id: "wordpress",
      name: "WordPress",
      description: "Add widgets to WordPress with Custom HTML blocks or plugins",
      icon: Globe,
      instructions: [
        "Generate your widget code from Widgetify",
        "In WordPress editor, add a Custom HTML block",
        "Paste the widget code into the HTML block",
        "Update and preview your page"
      ],
      docUrl: "https://wordpress.org/support/article/custom-html-block/",
      category: "cms",
      popular: true
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Embed widgets in your Shopify store theme",
      icon: ShoppingCart,
      instructions: [
        "Generate your widget code from Widgetify",
        "Go to Online Store > Themes > Edit code",
        "Add the code to theme.liquid or specific template",
        "Save and preview your store"
      ],
      docUrl: "https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code",
      category: "ecommerce",
      popular: true
    },
    {
      id: "carrd",
      name: "Carrd",
      description: "Add widgets to Carrd one-page sites with embed elements",
      icon: FileText,
      instructions: [
        "Create your widget and copy the code",
        "In Carrd, add an Embed element to your page",
        "Select 'Code' type and paste your widget code",
        "Publish your site to see the widget live"
      ],
      docUrl: "https://carrd.co/docs/elements/embed",
      category: "landing-page"
    },
    {
      id: "notion",
      name: "Notion",
      description: "Embed widgets in Notion pages for enhanced functionality",
      icon: BookOpen,
      instructions: [
        "Generate your widget and host it on a URL",
        "In Notion, type /embed and paste the widget URL",
        "Adjust the embed size and positioning",
        "Share your Notion page to display the widget"
      ],
      docUrl: "https://www.notion.so/help/embed-and-connect-other-apps",
      category: "cms"
    },
    {
      id: "weebly",
      name: "Weebly",
      description: "Integrate widgets into Weebly sites with Embed Code element",
      icon: Layers,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Weebly Editor, drag an Embed Code element",
        "Click 'Edit Custom HTML' and paste your code",
        "Publish to make the widget live"
      ],
      docUrl: "https://www.weebly.com/app/help/us/en/topics/create-widgets-and-badges",
      category: "website-builder"
    },
    {
      id: "ghost",
      name: "Ghost",
      description: "Add widgets to Ghost blogs using HTML cards",
      icon: PenTool,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Ghost editor, add an HTML card",
        "Paste your widget code into the HTML card",
        "Preview and publish your post or page"
      ],
      docUrl: "https://ghost.org/help/cards/#html",
      category: "cms"
    },
    {
      id: "bigcommerce",
      name: "BigCommerce",
      description: "Embed widgets in your BigCommerce storefront",
      icon: Store,
      instructions: [
        "Generate your widget code from Widgetify",
        "Go to Storefront > Script Manager",
        "Create a new script and paste your widget code",
        "Set placement and save changes"
      ],
      docUrl: "https://support.bigcommerce.com/s/article/Using-Script-Manager",
      category: "ecommerce"
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      description: "Add widgets to WooCommerce WordPress stores",
      icon: ShoppingCart,
      instructions: [
        "Generate your widget code from Widgetify",
        "Add Custom HTML block in WordPress editor",
        "Or add to theme files for site-wide display",
        "Update and preview your store"
      ],
      docUrl: "https://woocommerce.com/document/woocommerce-codex/",
      category: "ecommerce"
    },
    {
      id: "webnode",
      name: "Webnode",
      description: "Embed widgets in Webnode websites with HTML widget",
      icon: Globe,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Webnode editor, add an HTML widget",
        "Paste your widget code into the HTML area",
        "Publish your site to see changes"
      ],
      docUrl: "https://www.webnode.com/blog/how-to-add-html-code/",
      category: "website-builder"
    },
    {
      id: "strikingly",
      name: "Strikingly",
      description: "Add widgets to Strikingly sites with App Store or HTML",
      icon: Zap,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Strikingly, add an 'HTML' section",
        "Paste your widget code into the section",
        "Publish and preview your site"
      ],
      docUrl: "https://support.strikingly.com/hc/en-us/articles/215046347-Adding-Custom-HTML-Code",
      category: "landing-page"
    },
    {
      id: "duda",
      name: "Duda",
      description: "Integrate widgets into Duda websites with HTML widget",
      icon: Layout,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Duda editor, add an HTML widget",
        "Paste your widget code into the widget",
        "Publish to make changes live"
      ],
      docUrl: "https://support.duda.co/hc/en-us/articles/115001467967-Adding-HTML-Widgets",
      category: "website-builder"
    },
    {
      id: "unbounce",
      name: "Unbounce",
      description: "Add widgets to Unbounce landing pages with Custom HTML",
      icon: Laptop,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Unbounce, add a Custom HTML element",
        "Paste your widget code into the element",
        "Preview and publish your landing page"
      ],
      docUrl: "https://documentation.unbounce.com/hc/en-us/articles/203510044-Using-Custom-HTML",
      category: "landing-page"
    },
    {
      id: "leadpages",
      name: "Leadpages",
      description: "Embed widgets in Leadpages with HTML widget",
      icon: FileText,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Leadpages, drag an HTML widget to your page",
        "Paste your widget code into the widget",
        "Publish your landing page"
      ],
      docUrl: "https://help.leadpages.com/hc/en-us/articles/360035879291-Using-Custom-HTML",
      category: "landing-page"
    },
    {
      id: "instapage",
      name: "Instapage",
      description: "Add widgets to Instapage landing pages with Custom Code",
      icon: Blocks,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Instapage builder, add a Custom Code block",
        "Paste your widget code into the block",
        "Preview and publish your page"
      ],
      docUrl: "https://help.instapage.com/hc/en-us/articles/206342207-Using-Custom-Code",
      category: "landing-page"
    },
    {
      id: "elementor",
      name: "Elementor",
      description: "Add widgets to WordPress sites using Elementor's HTML widget",
      icon: Palette,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Elementor, add an HTML widget",
        "Paste your widget code into the HTML area",
        "Update and preview your page"
      ],
      docUrl: "https://elementor.com/help/html-widget/",
      category: "website-builder"
    },
    {
      id: "adalo",
      name: "Adalo",
      description: "Integrate widgets into Adalo mobile apps with WebView",
      icon: Smartphone,
      instructions: [
        "Host your widget on a public URL",
        "In Adalo, add a WebView component",
        "Set the URL to your hosted widget",
        "Preview and publish your app"
      ],
      docUrl: "https://help.adalo.com/integrations/custom-components",
      category: "app-builder"
    },
    {
      id: "glide",
      name: "Glide",
      description: "Add widgets to Glide apps using WebView or Web Embed",
      icon: Smartphone,
      instructions: [
        "Host your widget on a public URL",
        "In Glide, add a Web Embed component",
        "Set the URL to your hosted widget",
        "Publish your app to see the widget"
      ],
      docUrl: "https://www.glideapps.com/docs/reference/components/web-embed",
      category: "app-builder"
    },
    {
      id: "softr",
      name: "Softr",
      description: "Embed widgets in Softr apps with Custom Code blocks",
      icon: Box,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Softr, add a Custom Code block",
        "Paste your widget code into the block",
        "Publish your app to see changes"
      ],
      docUrl: "https://docs.softr.io/building-blocks/custom-code",
      category: "app-builder"
    },
    {
      id: "typedream",
      name: "Typedream",
      description: "Add widgets to Typedream sites with Embed blocks",
      icon: Code2,
      instructions: [
        "Generate your widget code from Widgetify",
        "In Typedream, add an Embed block",
        "Paste your widget code into the block",
        "Publish your site to see the widget"
      ],
      docUrl: "https://typedream.com/docs/embeds",
      category: "website-builder"
    }
  ];

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

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
              Seamlessly connect Widgetify with {integrations.length}+ popular website builders. Follow our step-by-step guides to add widgets to your site.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="text-xs sm:text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow relative">
                {integration.popular && (
                  <Badge className="absolute top-2 right-2 text-[10px]" variant="secondary">
                    Popular
                  </Badge>
                )}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {integration.logo ? (
                    <img 
                      src={integration.logo} 
                      alt={`${integration.name} logo`}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                      loading="lazy"
                    />
                  ) : integration.icon ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                      <integration.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  ) : null}
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
