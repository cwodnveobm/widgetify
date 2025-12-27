import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesSection: React.FC = () => {
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
    <section className="section-spacing bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="heading-responsive mb-3 sm:mb-4 text-foreground px-2">
            Why Choose Widgetify?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Our widgets are designed to help you connect with your website visitors
            instantly and boost your engagement rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border border-border hover:shadow-elegant transition-all duration-300 p-4 sm:p-5 md:p-6 bg-card group hover:border-primary/30"
            >
              <CardHeader className="pb-2 p-0 mb-2 sm:mb-3">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-base sm:text-lg md:text-xl text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;