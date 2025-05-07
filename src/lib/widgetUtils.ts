import { ChatWidgetConfig, GoogleTranslateConfig, SocialShareConfig } from "@/components/WidgetPreview";

export const WIDGET_TYPES = [
  { id: 'chat-widget', name: 'Chat Widget', description: 'Add a live chat to your website' },
  { id: 'social-share', name: 'Social Share', description: 'Enable social sharing buttons' },
  { id: 'google-translate', name: 'Google Translate', description: 'Add Google Translate to your website' },
  { id: 'banner-ad', name: 'Banner Ad', description: 'Show a banner ad at the top or bottom of the screen' }
] as const;

export type WidgetType = typeof WIDGET_TYPES[number]['id'];

export function generateWidgetCode(type: WidgetType, config: ChatWidgetConfig | SocialShareConfig | GoogleTranslateConfig | any): string {
  switch (type) {
    case 'chat-widget':
      const chatConfig = config as ChatWidgetConfig;
      return `
        <!-- Chat Widget Code -->
        <script>
          // Your chat widget initialization code here
          console.log('Chat widget initialized with config:', ${JSON.stringify(chatConfig)});
        </script>
      `;
    case 'social-share':
      const socialConfig = config as SocialShareConfig;
      return `
        <!-- Social Share Code -->
        <div class="social-share">
          <a href="#" data-social="facebook">Facebook</a>
          <a href="#" data-social="twitter">Twitter</a>
          <!-- Add more social platforms as needed -->
          <script>
            console.log('Social share initialized with config:', ${JSON.stringify(socialConfig)});
          </script>
        </div>
      `;
    case 'google-translate':
      const googleConfig = config as GoogleTranslateConfig;
      return `
        <!-- Google Translate Code -->
        <div id="google_translate_element"></div>
        <script type="text/javascript">
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: '${googleConfig.pageLanguage}',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        </script>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      `;
    
    case 'banner-ad':
      const { position, message, backgroundColor, textColor } = config;
      return `
<div id="widget-banner-ad" style="position: fixed; ${position === 'top' ? 'top: 0;' : 'bottom: 0;'} left: 0; right: 0; background-color: ${backgroundColor}; color: ${textColor}; padding: 12px; z-index: 9999; display: flex; justify-content: space-between; align-items: center;">
  <div style="flex-grow: 1; text-align: center;">${message}</div>
  <button onclick="document.getElementById('widget-banner-ad').style.display='none'" style="background: transparent; border: none; cursor: pointer; padding: 4px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
</div>
      `;
    
    default:
      return '<!-- Unknown Widget Type -->';
  }
}
