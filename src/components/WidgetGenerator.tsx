
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from 'lucide-react';
import WidgetPreview from './WidgetPreview';
import { WIDGET_TYPES, WidgetType } from '@/lib/widgetUtils';

const WidgetGenerator: React.FC = () => {
  const [selectedWidget, setSelectedWidget] = useState<WidgetType>('chat-widget');
  const [widgetCode, setWidgetCode] = useState<string | null>(null);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const { toast } = useToast();

  // Chat Widget State
  const [chatButtonText, setChatButtonText] = useState('Need Help? Chat Now!');
  const [chatButtonColor, setChatButtonColor] = useState('#4CAF50');
  const [chatTextColor, setChatTextColor] = useState('#ffffff');
    
  // Social Share Widget State
  const [shareUrl, setShareUrl] = useState('https://widgetify.azn.sh');
  const [socialButtons, setSocialButtons] = useState(['twitter', 'facebook', 'linkedin']);

  // Google Translate Widget State
  const [translateLanguages, setTranslateLanguages] = useState(['en', 'es', 'fr', 'de']);

  // Add banner ad state
  const [bannerPosition, setBannerPosition] = useState<'top' | 'bottom'>('top');
  const [bannerMessage, setBannerMessage] = useState('Special offer: 20% off all products today!');
  const [bannerBackgroundColor, setBannerBackgroundColor] = useState('#9b87f5');
  const [bannerTextColor, setBannerTextColor] = useState('#ffffff');

  useEffect(() => {
    if (isCodeCopied) {
      const timer = setTimeout(() => setIsCodeCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCodeCopied]);

  const handleCopyCode = () => {
    if (widgetCode) {
      navigator.clipboard.writeText(widgetCode);
      setIsCodeCopied(true);
      toast({
        title: "Code copied to clipboard!",
        description: "You can now paste the widget code into your website.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "No code to copy!",
        description: "Generate widget code first.",
      });
    }
  };

  const generateWidgetCode = () => {
    let generatedCode = '';

    if (selectedWidget === 'chat-widget') {
      generatedCode = `
<button style="background-color: ${chatButtonColor}; color: ${chatTextColor}; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
  ${chatButtonText}
</button>
      `;
    }

    if (selectedWidget === 'social-share') {
      const shareButtons = socialButtons.map(button => `<a href="#">${button}</a>`).join('\n');
      generatedCode = `
<div class="social-share">
  ${shareButtons}
</div>
      `;
    }

    if (selectedWidget === 'google-translate') {
      const languageOptions = translateLanguages.map(lang => `<option value="${lang}">${lang}</option>`).join('\n');
      generatedCode = `
<select>
  ${languageOptions}
</select>
      `;
    }

    // Add banner ad code generation
    if (selectedWidget === 'banner-ad') {
      generatedCode = `
<div id="widget-banner-ad" style="position: fixed; ${bannerPosition === 'top' ? 'top: 0;' : 'bottom: 0;'} left: 0; right: 0; background-color: ${bannerBackgroundColor}; color: ${bannerTextColor}; padding: 12px; z-index: 9999; display: flex; justify-content: space-between; align-items: center;">
  <div style="flex-grow: 1; text-align: center;">${bannerMessage}</div>
  <button onclick="document.getElementById('widget-banner-ad').style.display='none'" style="background: transparent; border: none; cursor: pointer; padding: 4px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
</div>
      `;
    }

    setWidgetCode(generatedCode);
  };

  // Create proper configuration object based on the selected widget
  const getWidgetConfig = () => {
    if (selectedWidget === 'chat-widget') {
      return {
        title: 'Need help?',
        message: 'Chat with us!',
        buttonText: chatButtonText,
        backgroundColor: chatButtonColor,
        textColor: chatTextColor
      };
    }
    
    if (selectedWidget === 'social-share') {
      return {
        platforms: {
          facebook: socialButtons.includes('facebook'),
          twitter: socialButtons.includes('twitter'),
          linkedin: socialButtons.includes('linkedin'),
          whatsapp: socialButtons.includes('whatsapp'),
          email: socialButtons.includes('email')
        },
        url: shareUrl
      };
    }
    
    if (selectedWidget === 'google-translate') {
      return {
        defaultLanguage: translateLanguages[0] || 'en'
      };
    }
    
    if (selectedWidget === 'banner-ad') {
      return {
        position: bannerPosition,
        message: bannerMessage,
        backgroundColor: bannerBackgroundColor,
        textColor: bannerTextColor
      };
    }
    
    return {};
  };

  return (
    <section id="widget-generator" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Widget Generator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg md:text-xl font-semibold mb-6">Configure Your Widget</h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Widget Type</label>
              <select 
                value={selectedWidget} 
                onChange={(e) => setSelectedWidget(e.target.value as WidgetType)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                {WIDGET_TYPES.map(widget => (
                  <option key={widget.id} value={widget.id}>{widget.name}</option>
                ))}
              </select>
            </div>

            {selectedWidget === 'chat-widget' && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-3">Chat Widget Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Button Text</label>
                  <input
                    type="text"
                    value={chatButtonText}
                    onChange={(e) => setChatButtonText(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter button text"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Button Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={chatButtonColor}
                        onChange={(e) => setChatButtonColor(e.target.value)}
                        className="w-10 h-8 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={chatButtonColor}
                        onChange={(e) => setChatButtonColor(e.target.value)}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Text Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={chatTextColor}
                        onChange={(e) => setChatTextColor(e.target.value)}
                        className="w-10 h-8 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={chatTextColor}
                        onChange={(e) => setChatTextColor(e.target.value)}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedWidget === 'social-share' && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-3">Social Share Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Share URL</label>
                  <input
                    type="url"
                    value={shareUrl}
                    onChange={(e) => setShareUrl(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter URL to share"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Social Buttons</label>
                  <div className="flex flex-wrap gap-2">
                    {['twitter', 'facebook', 'linkedin'].map(button => (
                      <label key={button} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={button}
                          checked={socialButtons.includes(button)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSocialButtons([...socialButtons, button]);
                            } else {
                              setSocialButtons(socialButtons.filter(b => b !== button));
                            }
                          }}
                          className="mr-2"
                        />
                        {button}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedWidget === 'google-translate' && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-3">Google Translate Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {['en', 'es', 'fr', 'de', 'ja', 'ko', 'ar', 'hi'].map(lang => (
                      <label key={lang} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={lang}
                          checked={translateLanguages.includes(lang)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTranslateLanguages([...translateLanguages, lang]);
                            } else {
                              setTranslateLanguages(translateLanguages.filter(l => l !== lang));
                            }
                          }}
                          className="mr-2"
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedWidget === 'banner-ad' && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-purple-100">
                <h4 className="font-semibold text-purple-700 mb-3">Banner Ad Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Position</label>
                  <select
                    value={bannerPosition}
                    onChange={(e) => setBannerPosition(e.target.value as 'top' | 'bottom')}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="top">Top of Screen</option>
                    <option value="bottom">Bottom of Screen</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1 text-sm">Banner Message</label>
                  <input
                    type="text"
                    value={bannerMessage}
                    onChange={(e) => setBannerMessage(e.target.value)}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter banner message"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Background Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={bannerBackgroundColor}
                        onChange={(e) => setBannerBackgroundColor(e.target.value)}
                        className="w-10 h-8 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={bannerBackgroundColor}
                        onChange={(e) => setBannerBackgroundColor(e.target.value)}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Text Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={bannerTextColor}
                        onChange={(e) => setBannerTextColor(e.target.value)}
                        className="w-10 h-8 border-0 p-0 mr-2"
                      />
                      <input
                        type="text"
                        value={bannerTextColor}
                        onChange={(e) => setBannerTextColor(e.target.value)}
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={generateWidgetCode} className="w-full">Generate Widget Code</Button>
          </div>
          
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Widget Preview:</h4>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <WidgetPreview type={selectedWidget} config={getWidgetConfig()} />
              </div>
            </div>
            
            {selectedWidget === 'banner-ad' && (
              <div className="my-4">
                <h4 className="font-medium text-gray-700 mb-2">Banner Ad Preview:</h4>
                <div className="relative border border-gray-200 rounded-md overflow-hidden" style={{ height: '320px' }}>
                  <div className="absolute inset-x-0 top-0 bg-gray-50 text-center py-2 text-sm text-gray-600">Website Content Area</div>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">Website content goes here</p>
                  </div>
                  
                  <div className="absolute inset-x-0" style={{ [bannerPosition]: 0 }}>
                    <div style={{ backgroundColor: bannerBackgroundColor, color: bannerTextColor }} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex-1 text-center">{bannerMessage || 'Banner message'}</div>
                      <button className="ml-2 p-1 rounded-full hover:bg-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {widgetCode && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Widget Code:</h4>
                <div className="bg-gray-100 rounded-md p-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">{widgetCode}</pre>
                </div>
                <Button onClick={handleCopyCode} disabled={isCodeCopied} className="w-full mt-3 relative">
                  {isCodeCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetGenerator;
