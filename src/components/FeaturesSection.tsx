import React from 'react';
import { 
  AdaptiveSection, 
  AdaptiveHeading, 
  AdaptiveSubheading,
  AdaptiveGrid,
  AdaptiveCard 
} from '@/components/adaptive';
import { useAdaptiveStyles } from '@/hooks/useAdaptiveUI';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesSection: React.FC = () => {
  const { showEmoji, density } = useAdaptiveStyles();
  const { getOptimizedSectionContent } = useConversionOptimization();
  
  const sectionContent = getOptimizedSectionContent('features');
  
  const features = [
    {
      title: 'Multiple Platforms',
      description: 'Connect with visitors via WhatsApp, Facebook, Instagram, or Twitter. Use the platform they prefer.',
      icon: '📱'
    },
    {
      title: 'Quick Setup',
      description: 'Create your widget in less than a minute. Just provide your contact details and customize the look.',
      icon: '⚡'
    },
    {
      title: 'Fully Customizable',
      description: 'Change colors, size, position, and message to match your website design and brand identity.',
      icon: '🎨'
    },
    {
      title: 'No Coding Required',
      description: 'Our user-friendly interface generates all the code for you. Just copy and paste to your website.',
      icon: '✅'
    },
    {
      title: 'Mobile Responsive',
      description: 'Your widget will look perfect on any device, from desktops to smartphones.',
      icon: '📲'
    },
    {
      title: 'Increase Conversions',
      description: 'Make it easy for visitors to reach out, boosting engagement and conversion rates.',
      icon: '📈'
    }
  ];

  return (
    <AdaptiveSection variant="muted" id="features">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <AdaptiveHeading as="h2" className="mb-3 sm:mb-4 px-2">
            {sectionContent.title}
          </AdaptiveHeading>
          <AdaptiveSubheading className="max-w-2xl mx-auto px-4">
            {sectionContent.subtitle || 'Our widgets are designed to help you connect with your website visitors instantly and boost your engagement rates.'}
          </AdaptiveSubheading>
        </div>

        <AdaptiveGrid 
          columns="auto" 
          gap={density === 'compact' ? 'sm' : 'md'} 
          className="max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <AdaptiveCard 
              key={index} 
              variant="interactive"
              className="p-4 sm:p-5 md:p-6"
            >
              <CardHeader className="pb-2 p-0 mb-2 sm:mb-3">
                {showEmoji && (
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                )}
                <CardTitle className="text-base sm:text-lg md:text-xl text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </AdaptiveCard>
          ))}
        </AdaptiveGrid>
      </div>
    </AdaptiveSection>
  );
};

export default FeaturesSection;
