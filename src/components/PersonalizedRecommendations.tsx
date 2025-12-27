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
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended for You
          </Badge>
          <h2 className="heading-responsive mb-4">
            {segment === 'power_user' 
              ? 'Templates That Match Your Style'
              : segment === 'hot_prospect'
              ? 'Top Converting Templates'
              : 'Popular Templates to Get Started'}
          </h2>
          <p className="text-muted-foreground subheading-responsive max-w-2xl mx-auto">
            {segment === 'power_user'
              ? 'Based on your widget history, we think you\'ll love these.'
              : 'Hand-picked based on what works best for users like you.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {recommendations.map((template, index) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 cursor-pointer group"
                onClick={() => trackClick(`recommendation-${template.id}`)}
              >
                {index === 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Best Match
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Avg. conversion boost
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {template.conversionRate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild onClick={() => trackClick('view-all-templates')}>
            <Link to="/custom-builder">
              View All Templates
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
