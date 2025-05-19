
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type WidgetType =
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'telegram'
  | 'linkedin'
  | 'social-share'
  | 'google-translate'
  | 'youtube'
  | 'github'
  | 'twitch'
  | 'slack'
  | 'discord'
  | 'call-now'
  | 'review-now'
  | 'follow-us';

export interface WidgetConfig {
  type: WidgetType;
  handle?: string;
  welcomeMessage?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
  size?: 'small' | 'medium' | 'large';
  networks?: string[];
  shareText?: string;
  shareUrl?: string;
  phoneNumber?: string;
  reviewUrl?: string;
  followPlatform?: 'linkedin' | 'instagram' | 'youtube';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWidgetCode(config: WidgetConfig): string {
  const {
    type,
    handle = '',
    welcomeMessage = 'Hello! How can I help you today?',
    position = 'right',
    primaryColor = '#25D366',
    size = 'medium',
    networks = [],
    shareText = 'Check out this awesome website!',
    shareUrl = '',
    phoneNumber = '',
    reviewUrl = '',
    followPlatform = 'linkedin'
  } = config;

  // Set button size based on the selected size
  const buttonSizeMap = {
    small: 50,
    medium: 60,
    large: 70,
  };
  const buttonSize = buttonSizeMap[size];

  // Generate different widget code based on the type
  switch (type) {
    case 'whatsapp':
      return generateWhatsAppWidget(handle, welcomeMessage, position, primaryColor, buttonSize);
    case 'facebook':
      return generateFacebookWidget(handle, position, primaryColor, buttonSize);
    case 'instagram':
      return generateInstagramWidget(handle, position, primaryColor, buttonSize);
    case 'twitter':
      return generateTwitterWidget(handle, position, primaryColor, buttonSize);
    case 'telegram':
      return generateTelegramWidget(handle, position, primaryColor, buttonSize);
    case 'linkedin':
      return generateLinkedInWidget(handle, position, primaryColor, buttonSize);
    case 'social-share':
      return generateSocialShareWidget(networks, shareText, shareUrl, position, primaryColor, buttonSize);
    case 'google-translate':
      return generateGoogleTranslateWidget(position, primaryColor, buttonSize);
    case 'youtube':
      return generateYoutubeWidget(handle, position, primaryColor, buttonSize);
    case 'github':
      return generateGithubWidget(handle, position, primaryColor, buttonSize);
    case 'twitch':
      return generateTwitchWidget(handle, position, primaryColor, buttonSize);
    case 'slack':
      return generateSlackWidget(handle, position, primaryColor, buttonSize);
    case 'discord':
      return generateDiscordWidget(handle, position, primaryColor, buttonSize);
    case 'call-now':
      return generateCallNowWidget(phoneNumber, position, primaryColor, buttonSize);
    case 'review-now':
      return generateReviewNowWidget(reviewUrl, position, primaryColor, buttonSize);  
    case 'follow-us':
      return generateFollowUsWidget(handle, followPlatform, position, primaryColor, buttonSize);
    default:
      return '';
  }
}

// WhatsApp Widget Generator
function generateWhatsAppWidget(
  phoneNumber: string,
  welcomeMessage: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Sanitize phone number by removing any non-digit characters
  const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');

  const whatsappLink = `https://wa.me/${sanitizedPhoneNumber}?text=${encodeURIComponent(welcomeMessage)}`;

  return `
<!-- WhatsApp Chat Widget by Widgetify -->
<style>
  .widgetify-whatsapp-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-whatsapp-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-whatsapp-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-whatsapp-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-whatsapp-widget">
  <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-whatsapp-button">
      <svg class="widgetify-whatsapp-icon" viewBox="0 0 24 24" fill="white">
        <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32zm-5.6 12.2c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.47.65.66-2.41-.16-.25a6.63 6.63 0 0 1-1.02-3.52 6.57 6.57 0 0 1 11.29-4.57 6.45 6.45 0 0 1 2 4.55 6.57 6.57 0 0 1-6.57 6.57l-.16.04zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33-.11 0-.24-.02-.37-.02-.13 0-.34.05-.52.25-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2 .1.14 1.4 2.16 3.42 3.02.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.12-.37-.21z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Facebook Widget Generator
function generateFacebookWidget(
  pageId: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- Facebook Messenger Widget by Widgetify -->
<style>
  .widgetify-facebook-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-facebook-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-facebook-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-facebook-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-facebook-widget">
  <a href="https://m.me/${pageId}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-facebook-button">
      <svg class="widgetify-facebook-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.04C6.5 2.04 2 6.13 2 11.22c0 2.83 1.14 5.34 3 7.09V22l2.92-1.49c1.23.35 2.59.55 4.01.55 5.5 0 10-4.1 10-9.18S17.5 2.04 12 2.04zm0 16.54c-1.19 0-2.32-.2-3.38-.56L6 19l.94-2.89C5.8 14.76 5 13.07 5 11.22c0-3.86 3.13-7 7-7s7 3.14 7 7-3.13 7-7 7zm4.26-5.25l-2.37-.93c-.21-.08-.42 0-.51.09l-1.13 1.19c-.11.11-.26.14-.4.08-1.3-.56-3.18-2.46-3.74-3.76-.06-.13-.03-.29.08-.39l1.19-1.14c.09-.09.19-.27.09-.5l-.89-2.37c-.09-.24-.38-.4-.62-.31l-2.66.88c-.22.07-.37.28-.37.52 0 4.4 3.6 8.05 8.04 8.05.24 0 .45-.15.53-.37l.87-2.65c.07-.28-.11-.55-.35-.64z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Instagram Widget Generator
function generateInstagramWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Remove @ if it's included at the beginning of the username
  const sanitizedUsername = username.startsWith('@') ? username.substring(1) : username;

  return `
<!-- Instagram Widget by Widgetify -->
<style>
  .widgetify-instagram-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-instagram-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-instagram-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-instagram-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-instagram-widget">
  <a href="https://instagram.com/${sanitizedUsername}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-instagram-button">
      <svg class="widgetify-instagram-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Twitter Widget Generator
function generateTwitterWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Remove @ if it's included at the beginning of the username
  const sanitizedUsername = username.startsWith('@') ? username.substring(1) : username;

  return `
<!-- Twitter Widget by Widgetify -->
<style>
  .widgetify-twitter-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-twitter-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-twitter-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-twitter-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-twitter-widget">
  <a href="https://twitter.com/${sanitizedUsername}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-twitter-button">
      <svg class="widgetify-twitter-icon" viewBox="0 0 24 24" fill="white">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Telegram Widget Generator
function generateTelegramWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Remove @ if it's included at the beginning of the username
  const sanitizedUsername = username.startsWith('@') ? username.substring(1) : username;

  return `
<!-- Telegram Widget by Widgetify -->
<style>
  .widgetify-telegram-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-telegram-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-telegram-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-telegram-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-telegram-widget">
  <a href="https://t.me/${sanitizedUsername}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-telegram-button">
      <svg class="widgetify-telegram-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// LinkedIn Widget Generator
function generateLinkedInWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- LinkedIn Widget by Widgetify -->
<style>
  .widgetify-linkedin-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-linkedin-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-linkedin-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-linkedin-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-linkedin-widget">
  <a href="https://linkedin.com/in/${username}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-linkedin-button">
      <svg class="widgetify-linkedin-icon" viewBox="0 0 24 24" fill="white">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Social Share Widget Generator
function generateSocialShareWidget(
  networks: string[],
  shareText: string,
  shareUrl: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  const url = shareUrl || 'window.location.href';
  const text = encodeURIComponent(shareText);

  // Generate social network buttons based on selected networks
  let socialNetworkButtons = '';

  if (networks.includes('facebook')) {
    socialNetworkButtons += `
      <a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(${url}) + '" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #1877F2;">
        <svg class="widgetify-social-icon" viewBox="0 0 24 24" fill="white">
          <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127c-.82-.088-1.643-.13-2.467-.127-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
        </svg>
      </a>
    `;
  }

  if (networks.includes('twitter')) {
    socialNetworkButtons += `
      <a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(${url}) + '&text=${text}" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #1DA1F2;">
        <svg class="widgetify-social-icon" viewBox="0 0 24 24" fill="white">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
        </svg>
      </a>
    `;
  }

  if (networks.includes('linkedin')) {
    socialNetworkButtons += `
      <a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(${url}) + '&title=${text}" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #0077B5;">
        <svg class="widgetify-social-icon" viewBox="0 0 24 24" fill="white">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      </a>
    `;
  }

  return `
<!-- Social Share Widget by Widgetify -->
<style>
  .widgetify-social-share-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-share-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-share-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-share-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-social-popup {
    position: absolute;
    bottom: ${buttonSize + 15}px;
    ${position}: 0;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    padding: 15px;
    display: none;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
  }
  .widgetify-social-popup.active {
    display: flex;
  }
  .widgetify-social-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s ease;
  }
  .widgetify-social-button:hover {
    transform: scale(1.1);
  }
  .widgetify-social-icon {
    width: 20px;
    height: 20px;
  }
  .widgetify-social-networks {
    display: flex;
    gap: 10px;
  }
  .widgetify-popup-title {
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 8px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-social-share-widget">
  <div class="widgetify-share-button" id="widgetify-share-button">
    <svg class="widgetify-share-icon" viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
    </svg>
  </div>
  
  <div class="widgetify-social-popup" id="widgetify-social-popup">
    <div class="widgetify-popup-title">Share this page</div>
    <div class="widgetify-social-networks">
      ${socialNetworkButtons}
    </div>
    <div class="widgetify-credit">
      <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
    </div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const shareButton = document.getElementById('widgetify-share-button');
      const socialPopup = document.getElementById('widgetify-social-popup');
      
      shareButton.addEventListener('click', function() {
        socialPopup.classList.toggle('active');
      });
      
      document.addEventListener('click', function(event) {
        if (!shareButton.contains(event.target) && !socialPopup.contains(event.target)) {
          socialPopup.classList.remove('active');
        }
      });
    });
  </script>
</div>
  `;
}

// Google Translate Widget Generator
function generateGoogleTranslateWidget(
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- Google Translate Widget by Widgetify -->
<style>
  .widgetify-translate-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-translate-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-translate-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-translate-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-translate-popup {
    position: absolute;
    bottom: ${buttonSize + 15}px;
    ${position}: 0;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    padding: 15px;
    display: none;
    min-width: 250px;
  }
  .widgetify-translate-popup.active {
    display: block;
  }
  .widgetify-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .widgetify-popup-title {
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  .widgetify-popup-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #666;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 8px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-translate-widget">
  <div class="widgetify-translate-button" id="widgetify-translate-button">
    <svg class="widgetify-translate-icon" viewBox="0 0 24 24" fill="white">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  </div>
  
  <div class="widgetify-translate-popup" id="widgetify-translate-popup">
    <div class="widgetify-popup-header">
      <div class="widgetify-popup-title">Translate</div>
      <button class="widgetify-popup-close" id="widgetify-popup-close">&times;</button>
    </div>
    <div id="google_translate_element"></div>
    <div class="widgetify-credit">
      <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
    </div>
  </div>

  <script type="text/javascript">
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'auto',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }

    document.addEventListener('DOMContentLoaded', function() {
      // Load Google Translate API
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      
      // Button toggle
      const translateButton = document.getElementById('widgetify-translate-button');
      const translatePopup = document.getElementById('widgetify-translate-popup');
      const closeButton = document.getElementById('widgetify-popup-close');
      
      translateButton.addEventListener('click', function() {
        translatePopup.classList.toggle('active');
      });
      
      closeButton.addEventListener('click', function() {
        translatePopup.classList.remove('active');
      });
      
      document.addEventListener('click', function(event) {
        if (!translateButton.contains(event.target) && 
            !translatePopup.contains(event.target)) {
          translatePopup.classList.remove('active');
        }
      });
    });
  </script>
</div>
  `;
}

// YouTube Widget Generator
function generateYoutubeWidget(
  channelId: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Handle both username and channel ID formats
  let youtubeUrl = '';
  if (channelId.startsWith('@')) {
    youtubeUrl = `https://www.youtube.com/${channelId}`;
  } else if (channelId.startsWith('UC')) {
    youtubeUrl = `https://www.youtube.com/channel/${channelId}`;
  } else {
    youtubeUrl = `https://www.youtube.com/user/${channelId}`;
  }

  return `
<!-- YouTube Widget by Widgetify -->
<style>
  .widgetify-youtube-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-youtube-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-youtube-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-youtube-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-youtube-widget">
  <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-youtube-button">
      <svg class="widgetify-youtube-icon" viewBox="0 0 24 24" fill="white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// GitHub Widget Generator
function generateGithubWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- GitHub Widget by Widgetify -->
<style>
  .widgetify-github-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-github-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-github-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-github-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-github-widget">
  <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-github-button">
      <svg class="widgetify-github-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Twitch Widget Generator
function generateTwitchWidget(
  username: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- Twitch Widget by Widgetify -->
<style>
  .widgetify-twitch-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-twitch-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-twitch-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-twitch-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-twitch-widget">
  <a href="https://twitch.tv/${username}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-twitch-button">
      <svg class="widgetify-twitch-icon" viewBox="0 0 24 24" fill="white">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Slack Widget Generator
function generateSlackWidget(
  workspaceUrl: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Clean up the workspace URL
  let slackUrl = workspaceUrl;
  if (!slackUrl.startsWith('http')) {
    slackUrl = `https://${slackUrl}`;
  }
  if (!slackUrl.endsWith('.slack.com') && !slackUrl.includes('.slack.com/')) {
    slackUrl = `${slackUrl}.slack.com`;
  }

  return `
<!-- Slack Widget by Widgetify -->
<style>
  .widgetify-slack-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-slack-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-slack-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-slack-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-slack-widget">
  <a href="${slackUrl}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-slack-button">
      <svg class="widgetify-slack-icon" viewBox="0 0 24 24" fill="white">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52zm3.792-10.123a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 3.792a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-3.793 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Discord Widget Generator
function generateDiscordWidget(
  inviteCode: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Clean up the invite code
  const sanitizedInviteCode = inviteCode.replace(/https?:\/\/discord\.gg\/|https?:\/\/discord\.com\/invite\//, '');

  return `
<!-- Discord Widget by Widgetify -->
<style>
  .widgetify-discord-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-discord-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-discord-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-discord-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-discord-widget">
  <a href="https://discord.gg/${sanitizedInviteCode}" target="_blank" rel="noopener noreferrer">
    <div class="widgetify-discord-button">
      <svg class="widgetify-discord-icon" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4724 0-.1634-.3933-.4058-.8742-.6091-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Call Now Widget Generator
function generateCallNowWidget(
  phoneNumber: string,
  position: string, 
  primaryColor: string,
  buttonSize: number
): string {
  // Sanitize phone number by removing any non-digit characters
  const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');

  return `
<!-- Call Now Widget by Widgetify -->
<style>
  .widgetify-call-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-call-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-call-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-call-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-call-tooltip {
    position: absolute;
    bottom: ${buttonSize + 10}px;
    ${position}: 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 5px 10px;
    white-space: nowrap;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }
  .widgetify-call-button:hover + .widgetify-call-tooltip {
    opacity: 1;
    transform: translateY(0);
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-call-widget">
  <a href="tel:${sanitizedPhoneNumber}" aria-label="Call now">
    <div class="widgetify-call-button">
      <svg class="widgetify-call-icon" viewBox="0 0 24 24" fill="white">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-call-tooltip">Call Now</div>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Review Now Widget Generator
function generateReviewNowWidget(
  reviewUrl: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  return `
<!-- Review Now Widget by Widgetify -->
<style>
  .widgetify-review-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-review-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-review-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-review-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-review-tooltip {
    position: absolute;
    bottom: ${buttonSize + 10}px;
    ${position}: 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 5px 10px;
    white-space: nowrap;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }
  .widgetify-review-button:hover + .widgetify-review-tooltip {
    opacity: 1;
    transform: translateY(0);
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-review-widget">
  <a href="${reviewUrl}" target="_blank" rel="noopener noreferrer" aria-label="Leave a review">
    <div class="widgetify-review-button">
      <svg class="widgetify-review-icon" viewBox="0 0 24 24" fill="white">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    </div>
  </a>
  <div class="widgetify-review-tooltip">Leave a Review</div>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}

// Follow Us Widget Generator
function generateFollowUsWidget(
  handle: string,
  platform: string,
  position: string,
  primaryColor: string,
  buttonSize: number
): string {
  // Define platform-specific URLs and icons
  let platformUrl = '';
  let platformIcon = '';
  let platformName = '';

  switch(platform) {
    case 'linkedin':
      platformUrl = `https://linkedin.com/in/${handle}`;
      platformIcon = `<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>`;
      platformName = 'LinkedIn';
      break;
    case 'instagram':
      const sanitizedUsername = handle.startsWith('@') ? handle.substring(1) : handle;
      platformUrl = `https://instagram.com/${sanitizedUsername}`;
      platformIcon = `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>`;
      platformName = 'Instagram';
      break;
    case 'youtube':
      platformUrl = handle.startsWith('@') ? `https://youtube.com/${handle}` : 
                    handle.startsWith('UC') ? `https://youtube.com/channel/${handle}` : 
                    `https://youtube.com/user/${handle}`;
      platformIcon = `<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`;
      platformName = 'YouTube';
      break;
    default:
      platformUrl = `https://linkedin.com/in/${handle}`;
      platformIcon = `<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>`;
      platformName = 'LinkedIn';
  }

  return `
<!-- Follow Us Widget by Widgetify -->
<style>
  .widgetify-follow-widget {
    position: fixed;
    bottom: 20px;
    ${position}: 20px;
    z-index: 9999;
  }
  .widgetify-follow-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    background-color: ${primaryColor};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .widgetify-follow-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .widgetify-follow-icon {
    width: ${buttonSize * 0.5}px;
    height: ${buttonSize * 0.5}px;
  }
  .widgetify-follow-tooltip {
    position: absolute;
    bottom: ${buttonSize + 10}px;
    ${position}: 0;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 5px 10px;
    white-space: nowrap;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }
  .widgetify-follow-button:hover + .widgetify-follow-tooltip {
    opacity: 1;
    transform: translateY(0);
  }
  .widgetify-credit {
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: #888;
    text-align: center;
    margin-top: 5px;
  }
  .widgetify-credit a {
    color: #888;
    text-decoration: none;
  }
</style>

<div class="widgetify-follow-widget">
  <a href="${platformUrl}" target="_blank" rel="noopener noreferrer" aria-label="Follow us on ${platformName}">
    <div class="widgetify-follow-button">
      <svg class="widgetify-follow-icon" viewBox="0 0 24 24" fill="white">
        ${platformIcon}
      </svg>
    </div>
  </a>
  <div class="widgetify-follow-tooltip">Follow on ${platformName}</div>
  <div class="widgetify-credit">
    <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer">Powered by Widgetify</a>
  </div>
</div>
  `;
}
