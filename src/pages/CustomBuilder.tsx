import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Eye, Palette, Type, Layout } from "lucide-react";

const CustomBuilder = () => {
  const [widgetConfig, setWidgetConfig] = useState({
    title: "My Custom Widget",
    description: "Widget description",
    buttonText: "Click Me",
    buttonColor: "#9b87f5",
    textColor: "#1A1F2C",
    backgroundColor: "#ffffff",
    position: "bottom-right",
    size: "medium",
  });

  const [previewKey, setPreviewKey] = useState(0);

  const updateConfig = (key: string, value: string) => {
    setWidgetConfig(prev => ({ ...prev, [key]: value }));
    setPreviewKey(prev => prev + 1);
  };

  const generateCode = () => {
    const code = `<!-- Custom Widgetify Widget -->
<div id="custom-widgetify-widget" style="
  position: fixed;
  ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  background: ${widgetConfig.backgroundColor};
  padding: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '24px' : '16px'};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: ${widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px'};
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
">
  <h3 style="color: ${widgetConfig.textColor}; margin: 0 0 8px 0; font-size: ${widgetConfig.size === 'small' ? '14px' : widgetConfig.size === 'large' ? '20px' : '16px'};">
    ${widgetConfig.title}
  </h3>
  <p style="color: ${widgetConfig.textColor}; margin: 0 0 12px 0; font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'}; opacity: 0.8;">
    ${widgetConfig.description}
  </p>
  <button style="
    background: ${widgetConfig.buttonColor};
    color: white;
    border: none;
    padding: ${widgetConfig.size === 'small' ? '6px 12px' : widgetConfig.size === 'large' ? '12px 24px' : '8px 16px'};
    border-radius: 6px;
    cursor: pointer;
    font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'};
    font-weight: 500;
    width: 100%;
    transition: opacity 0.2s;
  " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
    ${widgetConfig.buttonText}
  </button>
</div>`;

    navigator.clipboard.writeText(code);
    toast.success("Widget code copied to clipboard!");
  };

  const downloadCode = () => {
    const code = `<!-- Custom Widgetify Widget -->
<div id="custom-widgetify-widget" style="
  position: fixed;
  ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  background: ${widgetConfig.backgroundColor};
  padding: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '24px' : '16px'};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: ${widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px'};
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
">
  <h3 style="color: ${widgetConfig.textColor}; margin: 0 0 8px 0; font-size: ${widgetConfig.size === 'small' ? '14px' : widgetConfig.size === 'large' ? '20px' : '16px'};">
    ${widgetConfig.title}
  </h3>
  <p style="color: ${widgetConfig.textColor}; margin: 0 0 12px 0; font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'}; opacity: 0.8;">
    ${widgetConfig.description}
  </p>
  <button style="
    background: ${widgetConfig.buttonColor};
    color: white;
    border: none;
    padding: ${widgetConfig.size === 'small' ? '6px 12px' : widgetConfig.size === 'large' ? '12px 24px' : '8px 16px'};
    border-radius: 6px;
    cursor: pointer;
    font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'};
    font-weight: 500;
    width: 100%;
    transition: opacity 0.2s;
  " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
    ${widgetConfig.buttonText}
  </button>
</div>`;

    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-widget.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Widget downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Custom Widget Builder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create unique widgets with our visual drag-and-drop interface. No coding required!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Layout className="w-6 h-6" />
                Widget Configuration
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4" />
                    <Label htmlFor="title">Widget Title</Label>
                  </div>
                  <Input
                    id="title"
                    value={widgetConfig.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    placeholder="Enter widget title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={widgetConfig.description}
                    onChange={(e) => updateConfig('description', e.target.value)}
                    placeholder="Enter widget description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={widgetConfig.buttonText}
                    onChange={(e) => updateConfig('buttonText', e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={widgetConfig.position} onValueChange={(v) => updateConfig('position', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Select value={widgetConfig.size} onValueChange={(v) => updateConfig('size', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4" />
                    <Label>Color Customization</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="buttonColor" className="text-xs">Button</Label>
                      <Input
                        id="buttonColor"
                        type="color"
                        value={widgetConfig.buttonColor}
                        onChange={(e) => updateConfig('buttonColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="textColor" className="text-xs">Text</Label>
                      <Input
                        id="textColor"
                        type="color"
                        value={widgetConfig.textColor}
                        onChange={(e) => updateConfig('textColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor" className="text-xs">Background</Label>
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={widgetConfig.backgroundColor}
                        onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={generateCode} className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button onClick={downloadCode} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>

            {/* Live Preview */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Live Preview
              </h2>

              <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg h-[600px] overflow-hidden border-2 border-dashed">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                  Preview Area
                </div>
                
                {/* Live Widget Preview */}
                <div
                  key={previewKey}
                  style={{
                    position: 'absolute',
                    [widgetConfig.position.includes('bottom') ? 'bottom' : 'top']: '20px',
                    [widgetConfig.position.includes('right') ? 'right' : 'left']: '20px',
                    background: widgetConfig.backgroundColor,
                    padding: widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '24px' : '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    maxWidth: widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px',
                  }}
                >
                  <h3
                    style={{
                      color: widgetConfig.textColor,
                      margin: '0 0 8px 0',
                      fontSize: widgetConfig.size === 'small' ? '14px' : widgetConfig.size === 'large' ? '20px' : '16px',
                    }}
                  >
                    {widgetConfig.title}
                  </h3>
                  <p
                    style={{
                      color: widgetConfig.textColor,
                      margin: '0 0 12px 0',
                      fontSize: widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px',
                      opacity: 0.8,
                    }}
                  >
                    {widgetConfig.description}
                  </p>
                  <button
                    style={{
                      background: widgetConfig.buttonColor,
                      color: 'white',
                      border: 'none',
                      padding: widgetConfig.size === 'small' ? '6px 12px' : widgetConfig.size === 'large' ? '12px 24px' : '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px',
                      fontWeight: 500,
                      width: '100%',
                    }}
                  >
                    {widgetConfig.buttonText}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBuilder;
