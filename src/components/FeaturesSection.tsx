
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Multiple Platforms',
      description: 'Connect with visitors via WhatsApp, Facebook, Instagram, or Twitter. Use the platform they prefer.',
      icon: '📱',
    },
    {
      title: 'Quick Setup',
      description: 'Create your widget in less than a minute. Just provide your contact details and customize the look.',
      icon: '⚡',
    },
    {
      title: 'Fully Customizable',
      description: 'Change colors, size, position, and message to match your website design and brand identity.',
      icon: '🎨',
    },
    {
      title: 'No Coding Required',
      description: 'Our user-friendly interface generates all the code for you. Just copy and paste to your website.',
      icon: '✅',
    },
    {
      title: 'Mobile Responsive',
      description: 'Your widget will look perfect on any device, from desktops to smartphones.',
      icon: '📲',
    },
    {
      title: 'Increase Conversions',
      description: 'Make it easy for visitors to reach out, boosting engagement and conversion rates.',
      icon: '📈',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Chat Spark?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our widgets are designed to help you connect with your website visitors
            instantly and boost your engagement rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
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
