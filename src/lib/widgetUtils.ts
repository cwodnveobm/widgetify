
// Define allowed widget types
export type WidgetType = 
  'whatsapp' | 
  'facebook' | 
  'instagram' | 
  'twitter' | 
  'telegram' | 
  'linkedin' | 
  'youtube' | 
  'github' | 
  'twitch' | 
  'slack' | 
  'discord' | 
  'google-translate' | 
  'social-share' | 
  'call-now' | 
  'review-now' | 
  'follow-us' |
  'live-chat';

export type WidgetPosition = 'left' | 'right';
export type WidgetSize = 'small' | 'medium' | 'large';
export type FollowPlatform = 'instagram' | 'linkedin' | 'youtube';

// Widget configuration interface
export interface WidgetConfig {
  type: WidgetType;
  position?: WidgetPosition;
  primaryColor?: string;
  size?: WidgetSize;
  networks?: string[];
  followPlatform?: FollowPlatform;
  
  // Added the missing properties
  handle?: string;
  welcomeMessage?: string;
  shareText?: string;
  shareUrl?: string;
  phoneNumber?: string;
  reviewUrl?: string;
}

// Add the generateWidgetCode function
export const generateWidgetCode = (config: WidgetConfig): string => {
  const { type, position = 'right', primaryColor, size = 'medium' } = config;
  
  // Basic widget initialization code
  let code = `
<!-- Widgetify Chat Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widgetify.vercel.app/widget.js';
    script.defer = true;
    script.onload = function() {
      Widgetify.init({
        type: '${type}',
        position: '${position}',
        primaryColor: '${primaryColor}',
        size: '${size}'`;
  
  // Add type-specific configurations
  switch (type) {
    case 'whatsapp':
      if (config.handle) {
        code += `,
        phoneNumber: '${config.handle}',
        welcomeMessage: ${JSON.stringify(config.welcomeMessage || 'Hello! How can I help you today?')}`;
      }
      break;
    case 'social-share':
      if (config.networks && config.networks.length > 0) {
        code += `,
        networks: ${JSON.stringify(config.networks)},
        shareText: ${JSON.stringify(config.shareText || 'Check out this awesome website!')},
        shareUrl: '${config.shareUrl || ''}'`;
      }
      break;
    case 'call-now':
      if (config.phoneNumber) {
        code += `,
        phoneNumber: '${config.phoneNumber}'`;
      }
      break;
    case 'review-now':
      if (config.reviewUrl) {
        code += `,
        reviewUrl: '${config.reviewUrl}'`;
      }
      break;
    case 'follow-us':
      if (config.handle && config.followPlatform) {
        code += `,
        handle: '${config.handle}',
        platform: '${config.followPlatform}'`;
      }
      break;
    default:
      if (config.handle) {
        code += `,
        handle: '${config.handle}'`;
      }
  }
  
  // Close the initialization
  code += `
      });
    };
    document.head.appendChild(script);
  })();
</script>
<!-- End Widgetify Chat Widget -->`;
  
  return code;
};
