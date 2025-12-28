import React from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Mail, MessageSquare, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TemplateRecommendation {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  conversionRate: string;
}

const allTemplates: TemplateRecommendation[] = [
  { id: 'newsletter', name: 'Newsletter Signup', description: 'Grow your email list', icon: Mail, category: 'lead-gen', conversionRate: '+32%' },
  { id: 'cta', name: 'Call to Action', description: 'Drive user engagement', icon: TrendingUp, category: 'engagement', conversionRate: '+45%' },
  { id: 'social', name: 'Social Proof', description: 'Build trust instantly', icon: Users, category: 'trust', conversionRate: '+28%' },
  { id: 'quiz', name: 'Lead Quiz', description: 'Qualify leads automatically', icon: MessageSquare, category: 'lead-gen', conversionRate: '+52%' },
  { id: 'feedback', name: 'Feedback Widget', description: 'Collect user insights', icon: MessageSquare, category: 'feedback', conversionRate: '+18%' },
  { id: 'download', name: 'Download CTA', description: 'Promote resources', icon: Download, category: 'conversion', conversionRate: '+38%' },
  { id: 'ai-chat', name: 'AI Chat Assistant', description: 'Instant AI support 24/7', icon: MessageSquare, category: 'support', conversionRate: '+48%' },
  { id: 'whatsapp', name: 'WhatsApp Chat', description: 'Direct messaging support', icon: MessageSquare, category: 'support', conversionRate: '+42%' },
  { id: 'lead-capture', name: 'Lead Capture Pro', description: 'High-converting forms', icon: TrendingUp, category: 'lead-gen', conversionRate: '+55%' },
];

export const PersonalizedRecommendations = () => {
  const { content, intent, segment, trackClick, behavior } = usePersonalization();

  // Get personalized template recommendations
  const getRecommendedTemplates = (): TemplateRecommendation[] => {
    let recommendations = [...allTemplates];

    // Prioritize based on interests
    if (intent.interests.includes('lead-generation')) {
      recommendations = recommendations.sort((a, b) => 
        a.category === 'lead-gen' ? -1 : b.category === 'lead-gen' ? 1 : 0
      );
    }

    // For power users, show advanced options first
    if (segment === 'power_user') {
      recommendations = recommendations.sort((a, b) => 
        a.id === 'quiz' || a.id === 'feedback' ? -1 : 1
      );
    }

    // For new visitors, show high-conversion templates
    if (segment === 'cold_visitor') {
      recommendations = recommendations.sort((a, b) => 
        parseInt(a.conversionRate) > parseInt(b.conversionRate) ? -1 : 1
      );
    }

    return recommendations.slice(0, 3);
  };

  const recommendations = getRecommendedTemplates();

  // Don't show if user hasn't engaged enough
  if (behavior.timeOnSite < 10 && behavior.scrollDepth < 20) {
    return null;
  }

  return (
    <section className="section-spacing container-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended for You
          </Badge>
          <h2 className="heading-responsive mb-3 sm:mb-4 px-2">
            {segment === 'power_user' 
              ? 'Templates That Match Your Style'
              : segment === 'hot_prospect'
              ? 'Top Converting Templates'
              : 'Popular Templates to Get Started'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            {segment === 'power_user'
              ? 'Based on your widget history, we think you\'ll love these.'
              : 'Hand-picked based on what works best for users like you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto">
          {recommendations.map((template, index) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 cursor-pointer group active:scale-[0.98]"
                onClick={() => trackClick(`recommendation-${template.id}`)}
              >
                {index === 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">
                      Best Match
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      Avg. conversion boost
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {template.conversionRate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Button 
            variant="outline" 
            asChild 
            onClick={() => trackClick('view-all-templates')}
            className="min-h-[44px] w-full sm:w-auto"
          >
            <Link to="/custom-builder">
              View All Templates
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
