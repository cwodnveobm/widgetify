import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
const FeaturesSection: React.FC = () => {
  const features = [{
    title: 'Multiple Platforms',
    description: 'Connect with visitors via WhatsApp, Facebook, Instagram, or Twitter. Use the platform they prefer.',
    icon: '📱'
  }, {
    title: 'Quick Setup',
    description: 'Create your widget in less than a minute. Just provide your contact details and customize the look.',
    icon: '⚡'
  }, {
    title: 'Fully Customizable',
    description: 'Change colors, size, position, and message to match your website design and brand identity.',
    icon: '🎨'
  }, {
    title: 'No Coding Required',
    description: 'Our user-friendly interface generates all the code for you. Just copy and paste to your website.',
    icon: '✅'
  }, {
    title: 'Mobile Responsive',
    description: 'Your widget will look perfect on any device, from desktops to smartphones.',
    icon: '📲'
  }, {
    title: 'Increase Conversions',
    description: 'Make it easy for visitors to reach out, boosting engagement and conversion rates.',
    icon: '📈'
  }];
  return <section className="section-spacing bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white px-4">Why Choose Widgetify?</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Our widgets are designed to help you connect with your website visitors
            instantly and boost your engagement rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => <Card key={index} className="border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2 p-0 mb-2 sm:mb-3">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{feature.icon}</div>
                <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default FeaturesSection;