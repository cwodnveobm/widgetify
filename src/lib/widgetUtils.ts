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
}
