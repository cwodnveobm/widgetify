import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  Download, 
  ArrowRight, 
  Filter,
  Bot,
  UserPlus,
  Heart,
  ShoppingCart,
  HeadphonesIcon,
  Calendar,
  Share2,
  LayoutGrid,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Eye,
  X,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SEOHead } from '@/components/SEOHead';
import { marketplaceCategories, marketplaceTemplates, getTemplatesByCategory, searchTemplates } from '@/data/marketplaceTemplates';
import type { MarketplaceTemplate, MarketplaceCategory } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Bot,
  UserPlus,
  Heart,
  ShoppingCart,
  HeadphonesIcon,
  Calendar,
  Share2,
};

const TemplateCard: React.FC<{
  template: MarketplaceTemplate;
  onPreview: (template: MarketplaceTemplate) => void;
  onUse: (template: MarketplaceTemplate) => void;
}> = ({ template, onPreview, onUse }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/30">
        {/* Preview Area */}
        <div className="relative h-40 bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary" />
            </div>
          </div>
          {template.isPremium && (
            <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {template.conversionRate && (
            <Badge variant="secondary" className="absolute top-3 left-3">
              <TrendingUp className="w-3 h-3 mr-1" />
              {template.conversionRate}
            </Badge>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button size="sm" variant="outline" onClick={() => onPreview(template)}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={() => onUse(template)}>
              Use Template
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-1">{template.name}</CardTitle>
          </div>
          <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0 mt-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{template.downloads.toLocaleString()}</span>
            </div>
            <span className="text-primary font-medium">{template.author}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TemplatePreviewModal: React.FC<{
  template: MarketplaceTemplate | null;
  open: boolean;
  onClose: () => void;
  onUse: (template: MarketplaceTemplate) => void;
}> = ({ template, open, onClose, onUse }) => {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl">{template.name}</DialogTitle>
            {template.isPremium && (
              <Badge className="bg-amber-500">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Preview */}
            <div className="rounded-lg bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 flex items-center justify-center">
              <div className="w-full max-w-sm bg-background rounded-2xl border border-border shadow-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{template.config.title as string || template.name}</h4>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{template.config.welcomeMessage as string || 'Welcome! How can I help you today?'}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    Type a message...
                  </div>
                  <Button size="sm" style={{ backgroundColor: template.config.primaryColor as string }}>
                    Send
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-amber-500">
                  <Star className="w-5 h-5 fill-current" />
                  {template.rating}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Rating</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-primary">
                  {template.downloads.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Downloads</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-green-500">
                  {template.conversionRate || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Conversion</p>
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="font-semibold mb-3">Best For</h4>
              <div className="flex flex-wrap gap-2">
                {template.useCases.map(useCase => (
                  <Badge key={useCase} variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button onClick={() => onUse(template)} className="flex-1">
            Use This Template
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    let templates = selectedCategory === 'all' 
      ? marketplaceTemplates 
      : getTemplatesByCategory(selectedCategory);
    
    if (searchQuery) {
      templates = searchTemplates(searchQuery);
      if (selectedCategory !== 'all') {
        templates = templates.filter(t => t.category === selectedCategory);
      }
    }
    
    return templates;
  }, [searchQuery, selectedCategory]);

  const handleUseTemplate = (template: MarketplaceTemplate) => {
    // Navigate to home page with template data
    navigate('/', { state: { selectedTemplate: template } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Widget Template Marketplace | Widgetify"
        description="Browse and use community-created widget templates. High-converting chatbots, lead generation widgets, e-commerce assistants, and more."
        keywords="widget templates, chatbot templates, lead generation, marketing widgets, conversion optimization"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold">Template Marketplace</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild>
                <Link to="/">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Widget
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              {marketplaceTemplates.length}+ Templates Available
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="gradient-text">High-Converting</span> Widget Templates
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse community-created templates for chatbots, lead generation, e-commerce, 
              and more. One click to customize and deploy.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Templates */}
      <section className="container mx-auto px-4 pb-16">
        {/* Category Tabs */}
        <div className="mb-8">
          <ScrollArea className="w-full">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0">
                {marketplaceCategories.map(category => {
                  const Icon = iconMap[category.icon] || LayoutGrid;
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-full border border-border/50 data-[state=active]:border-primary"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </ScrollArea>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredTemplates.length}</span> templates
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          {filteredTemplates.length > 0 ? (
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={setPreviewTemplate}
                  onUse={handleUseTemplate}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
      />
    </div>
  );
};

export default Marketplace;
