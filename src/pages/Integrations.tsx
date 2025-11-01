import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Integrations = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              No-Code Platform Integrations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seamlessly connect Widgetify with popular website builders. Follow our step-by-step guides to add widgets to your site.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={integration.logo} 
                    alt={`${integration.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{integration.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>

                <div className="space-y-3 mb-4">
                  <h4 className="font-medium text-sm">Quick Setup:</h4>
                  <ol className="space-y-2 text-sm">
                    {integration.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-medium text-primary">{idx + 1}.</span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(integration.docUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Official Docs
                </Button>
              </Card>
            ))}
          </div>

          <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h2 className="text-2xl font-bold mb-4">Universal Embed Code</h2>
            <p className="text-muted-foreground mb-6">
              Use this code snippet structure for any platform that supports custom HTML:
            </p>
            <div className="bg-background/50 p-4 rounded-lg font-mono text-sm relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
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
              <pre className="text-xs overflow-x-auto">
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
    </div>
  );
};

export default Integrations;
