import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Download, Eye, Palette, Type, Layout, Upload, Save, Trash2, Edit, Plus, 
  Image as ImageIcon, Zap, Sparkles, Mail, Bell, Tag, Calendar, MessageCircle,
  HelpCircle, Heart, Share2, Inbox, Rocket, MessageSquare, Star, FileDown,
  LayoutTemplate, Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import { widgetTemplates, templateCategories, WidgetTemplate } from "@/data/widgetTemplates";
import { SEOHead } from "@/components/SEOHead";
import { StructuredData } from "@/components/StructuredData";
interface CustomWidget {
  id: string;
  name: string;
  title: string;
  description: string | null;
  button_text: string;
  button_color: string;
  text_color: string;
  background_color: string;
  position: string;
  size: string;
  logo_url: string | null;
  border_radius: string | null;
  shadow: string | null;
  font_family: string | null;
  button_action: string | null;
}

// Icon mapping for templates
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Sparkles, Mail, Bell, Tag, Calendar, MessageCircle, HelpCircle, 
  Heart, Share2, Inbox, Rocket, MessageSquare, Star, Download, FileDown
};

// Template Card Component
const TemplateCard = ({ 
  template, 
  onSelect 
}: { 
  template: WidgetTemplate; 
  onSelect: (template: WidgetTemplate) => void;
}) => {
  const IconComponent = iconMap[template.icon] || Zap;
  
  return (
    <Card 
      className="group p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
      onClick={() => onSelect(template)}
    >
      {/* Mini Preview */}
      <div 
        className="mb-4 p-3 rounded-lg min-h-[100px] flex flex-col justify-center"
        style={{
          background: template.preview.backgroundColor,
          boxShadow: template.preview.shadow,
          borderRadius: template.preview.borderRadius,
        }}
      >
        <h4 
          className="text-xs font-semibold mb-1 line-clamp-1"
          style={{ color: template.preview.textColor }}
        >
          {template.preview.title}
        </h4>
        <p 
          className="text-[10px] mb-2 line-clamp-2 opacity-70"
          style={{ color: template.preview.textColor }}
        >
          {template.preview.description}
        </p>
        <div 
          className="text-[9px] py-1 px-2 rounded text-center text-white font-medium"
          style={{ backgroundColor: template.preview.buttonColor }}
        >
          {template.preview.buttonText}
        </div>
      </div>

      {/* Template Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <IconComponent className="w-4 h-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-sm truncate">{template.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity min-h-[32px]"
        >
          <Check className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
        {template.description}
      </p>
    </Card>
  );
};

const CustomBuilder = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [savedWidgets, setSavedWidgets] = useState<CustomWidget[]>([]);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const [widgetConfig, setWidgetConfig] = useState({
    name: "My Widget",
    title: "My Custom Widget",
    description: "Widget description",
    buttonText: "Click Me",
    buttonColor: "#9b87f5",
    textColor: "#1A1F2C",
    backgroundColor: "#ffffff",
    position: "bottom-right",
    size: "medium",
    logoUrl: "",
    borderRadius: "12px",
    shadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    buttonAction: "",
  });

  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (user) {
      loadSavedWidgets();
    }
  }, [user]);

  const loadSavedWidgets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('custom_widgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading widgets:', error);
      return;
    }

    setSavedWidgets(data || []);
  };

  const updateConfig = (key: string, value: string) => {
    setWidgetConfig(prev => ({ ...prev, [key]: value }));
    setPreviewKey(prev => prev + 1);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("Please sign in to upload logos");
      setShowAuthModal(true);
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('widget-logos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('widget-logos')
        .getPublicUrl(fileName);

      updateConfig('logoUrl', publicUrl);
      toast.success("Logo uploaded successfully!");
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const saveWidget = async () => {
    if (!user) {
      toast.error("Please sign in to save widgets");
      setShowAuthModal(true);
      return;
    }

    try {
      const widgetData = {
        user_id: user.id,
        name: widgetConfig.name,
        title: widgetConfig.title,
        description: widgetConfig.description,
        button_text: widgetConfig.buttonText,
        button_color: widgetConfig.buttonColor,
        text_color: widgetConfig.textColor,
        background_color: widgetConfig.backgroundColor,
        position: widgetConfig.position,
        size: widgetConfig.size,
        logo_url: widgetConfig.logoUrl || null,
        border_radius: widgetConfig.borderRadius,
        shadow: widgetConfig.shadow,
        font_family: widgetConfig.fontFamily,
        button_action: widgetConfig.buttonAction || null,
      };

      if (editingWidget) {
        const { error } = await supabase
          .from('custom_widgets')
          .update(widgetData)
          .eq('id', editingWidget);

        if (error) throw error;
        toast.success("Widget updated successfully!");
        setEditingWidget(null);
      } else {
        const { error } = await supabase
          .from('custom_widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success("Widget saved successfully!");
      }

      await loadSavedWidgets();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || "Failed to save widget");
    }
  };

  const loadWidget = (widget: CustomWidget) => {
    setWidgetConfig({
      name: widget.name,
      title: widget.title,
      description: widget.description || "",
      buttonText: widget.button_text,
      buttonColor: widget.button_color,
      textColor: widget.text_color,
      backgroundColor: widget.background_color,
      position: widget.position,
      size: widget.size,
      logoUrl: widget.logo_url || "",
      borderRadius: widget.border_radius || "12px",
      shadow: widget.shadow || "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: widget.font_family || "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      buttonAction: widget.button_action || "",
    });
    setEditingWidget(widget.id);
    setPreviewKey(prev => prev + 1);
    toast.success(`Loaded widget: ${widget.name}`);
  };

  const deleteWidget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this widget?")) return;

    try {
      const { error } = await supabase
        .from('custom_widgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Widget deleted successfully!");
      await loadSavedWidgets();

      if (editingWidget === id) {
        setEditingWidget(null);
        resetWidget();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || "Failed to delete widget");
    }
  };

  const resetWidget = () => {
    setWidgetConfig({
      name: "My Widget",
      title: "My Custom Widget",
      description: "Widget description",
      buttonText: "Click Me",
      buttonColor: "#9b87f5",
      textColor: "#1A1F2C",
      backgroundColor: "#ffffff",
      position: "bottom-right",
      size: "medium",
      logoUrl: "",
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      buttonAction: "",
    });
    setEditingWidget(null);
    setPreviewKey(prev => prev + 1);
  };

  const generateCode = () => {
    const logoHtml = widgetConfig.logoUrl
      ? `  <img src="${widgetConfig.logoUrl}" alt="Logo" style="width: 40px; height: 40px; margin-bottom: 8px; border-radius: 8px; object-fit: contain;" />\n`
      : '';

    const code = `<!-- Custom Widgetify Widget -->
<div id="custom-widgetify-widget" style="
  position: fixed;
  ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  background: ${widgetConfig.backgroundColor};
  padding: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '24px' : '16px'};
  border-radius: ${widgetConfig.borderRadius};
  box-shadow: ${widgetConfig.shadow};
  max-width: ${widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px'};
  z-index: 9999;
  font-family: ${widgetConfig.fontFamily};
">
${logoHtml}  <h3 style="color: ${widgetConfig.textColor}; margin: 0 0 8px 0; font-size: ${widgetConfig.size === 'small' ? '14px' : widgetConfig.size === 'large' ? '20px' : '16px'};">
    ${widgetConfig.title}
  </h3>
  <p style="color: ${widgetConfig.textColor}; margin: 0 0 12px 0; font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'}; opacity: 0.8;">
    ${widgetConfig.description}
  </p>
  <button ${widgetConfig.buttonAction ? `onclick="${widgetConfig.buttonAction}"` : ''} style="
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
    const logoHtml = widgetConfig.logoUrl
      ? `  <img src="${widgetConfig.logoUrl}" alt="Logo" style="width: 40px; height: 40px; margin-bottom: 8px; border-radius: 8px; object-fit: contain;" />\n`
      : '';

    const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Widget</title>
</head>
<body>
<!-- Custom Widgetify Widget -->
<div id="custom-widgetify-widget" style="
  position: fixed;
  ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  background: ${widgetConfig.backgroundColor};
  padding: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '24px' : '16px'};
  border-radius: ${widgetConfig.borderRadius};
  box-shadow: ${widgetConfig.shadow};
  max-width: ${widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px'};
  z-index: 9999;
  font-family: ${widgetConfig.fontFamily};
">
${logoHtml}  <h3 style="color: ${widgetConfig.textColor}; margin: 0 0 8px 0; font-size: ${widgetConfig.size === 'small' ? '14px' : widgetConfig.size === 'large' ? '20px' : '16px'};">
    ${widgetConfig.title}
  </h3>
  <p style="color: ${widgetConfig.textColor}; margin: 0 0 12px 0; font-size: ${widgetConfig.size === 'small' ? '12px' : widgetConfig.size === 'large' ? '16px' : '14px'}; opacity: 0.8;">
    ${widgetConfig.description}
  </p>
  <button ${widgetConfig.buttonAction ? `onclick="${widgetConfig.buttonAction}"` : ''} style="
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
</div>
</body>
</html>`;

    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${widgetConfig.name.replace(/\s+/g, '-').toLowerCase()}-widget.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Widget downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16 md:pb-0">
        <SEOHead 
          title="Custom Widget Builder"
          description="Create custom chat widgets with your own branding, logos, and styling. Build unique widgets from templates or from scratch. Free custom widget generator."
          keywords="custom widget builder, widget generator, branded widgets, custom chat widget, widget templates, widget designer"
        />
        <Navigation onAuthModalOpen={openAuthModal} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-6 sm:p-8 max-w-md text-center mx-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Please sign in to access the Custom Widget Builder and manage your widgets.
            </p>
            <Button onClick={() => openAuthModal('signin')} className="w-full min-h-[48px]">
              Sign In
            </Button>
          </Card>
        </div>
        <Footer />
        <BottomNavigation />
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16 md:pb-0">
      <SEOHead 
        title="Custom Widget Builder"
        description="Create custom chat widgets with your own branding, logos, and styling. Build unique widgets from templates or from scratch. Free custom widget generator."
        keywords="custom widget builder, widget generator, branded widgets, custom chat widget, widget templates, widget designer"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{ items: [
          { name: 'Home', url: 'https://widgetify.app/' },
          { name: 'Custom Builder', url: 'https://widgetify.app/custom-builder' }
        ]}}
      />
      <Navigation onAuthModalOpen={openAuthModal} />
      <div className="flex-1 container mx-auto container-padding py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
              Custom Widget Builder
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Create unique widgets with custom logos and styling. Save and manage all your widgets in one place.
            </p>
          </div>

          <Tabs defaultValue="templates" className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-12">
              <TabsTrigger value="templates" className="text-sm sm:text-base flex items-center gap-1.5">
                <LayoutTemplate className="w-4 h-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="builder" className="text-sm sm:text-base flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Builder</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-sm sm:text-base flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
                <Badge variant="secondary" className="ml-1 text-xs">{savedWidgets.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {templateCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="min-h-[36px]"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {widgetTemplates
                  .filter(template => selectedCategory === "All" || template.category === selectedCategory)
                  .map((template) => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onSelect={(template) => {
                        setWidgetConfig({
                          ...widgetConfig,
                          name: template.name,
                          title: template.preview.title,
                          description: template.preview.description,
                          buttonText: template.preview.buttonText,
                          buttonColor: template.preview.buttonColor,
                          textColor: template.preview.textColor,
                          backgroundColor: template.preview.backgroundColor.startsWith('linear') 
                            ? '#ffffff' 
                            : template.preview.backgroundColor,
                          borderRadius: template.preview.borderRadius,
                          shadow: template.preview.shadow,
                        });
                        toast.success(`Template "${template.name}" applied!`);
                      }}
                    />
                  ))}
              </div>
            </TabsContent>


            <TabsContent value="builder" className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Configuration Panel */}
                <Card className="p-4 sm:p-5 md:p-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                    <Layout className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    Widget Configuration
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Widget Name</Label>
                      <Input
                        id="name"
                        value={widgetConfig.name}
                        onChange={(e) => updateConfig('name', e.target.value)}
                        placeholder="Enter widget name"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <Label htmlFor="logo" className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4" />
                        Widget Logo
                      </Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </Button>
                        {widgetConfig.logoUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => updateConfig('logoUrl', '')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {widgetConfig.logoUrl && (
                        <div className="mt-2">
                          <img
                            src={widgetConfig.logoUrl}
                            alt="Widget logo"
                            className="w-20 h-20 object-contain border rounded-lg"
                          />
                        </div>
                      )}
                    </div>

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

                    <div>
                      <Label htmlFor="buttonAction">Button Action (Optional)</Label>
                      <Input
                        id="buttonAction"
                        value={widgetConfig.buttonAction}
                        onChange={(e) => updateConfig('buttonAction', e.target.value)}
                        placeholder="e.g., window.open('https://example.com')"
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="borderRadius">Border Radius</Label>
                        <Input
                          id="borderRadius"
                          value={widgetConfig.borderRadius}
                          onChange={(e) => updateConfig('borderRadius', e.target.value)}
                          placeholder="12px"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select value={widgetConfig.fontFamily} onValueChange={(v) => updateConfig('fontFamily', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">System</SelectItem>
                            <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
                            <SelectItem value="'Georgia', serif">Georgia</SelectItem>
                            <SelectItem value="'Courier New', monospace">Courier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={saveWidget} variant="default" className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        {editingWidget ? "Update" : "Save"} Widget
                      </Button>
                      {editingWidget && (
                        <Button onClick={resetWidget} variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          New
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={generateCode} variant="outline" className="flex-1">
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
                        borderRadius: widgetConfig.borderRadius,
                        boxShadow: widgetConfig.shadow,
                        maxWidth: widgetConfig.size === 'small' ? '200px' : widgetConfig.size === 'large' ? '400px' : '300px',
                        fontFamily: widgetConfig.fontFamily,
                      }}
                    >
                      {widgetConfig.logoUrl && (
                        <img
                          src={widgetConfig.logoUrl}
                          alt="Logo"
                          style={{
                            width: '40px',
                            height: '40px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            objectFit: 'contain',
                          }}
                        />
                      )}
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
            </TabsContent>

            <TabsContent value="saved">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Saved Widgets</h2>
                
                {savedWidgets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No saved widgets yet. Create your first widget!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedWidgets.map((widget) => (
                      <Card key={widget.id} className="p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {widget.logo_url && (
                              <img
                                src={widget.logo_url}
                                alt={widget.name}
                                className="w-8 h-8 rounded object-contain"
                              />
                            )}
                            <h3 className="font-semibold">{widget.name}</h3>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p><strong>Title:</strong> {widget.title}</p>
                          <p><strong>Position:</strong> {widget.position}</p>
                          <p><strong>Size:</strong> {widget.size}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadWidget(widget)}
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteWidget(widget.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>
  );
};

export default CustomBuilder;
