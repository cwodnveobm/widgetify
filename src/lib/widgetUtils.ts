
import { WidgetType, WidgetSize } from '@/types';

export interface WidgetConfig {
  type: WidgetType;
  handle?: string;
  welcomeMessage?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
  size?: WidgetSize;
  networks?: string[];
  shareText?: string;
  shareUrl?: string;
  phoneNumber?: string;
  reviewUrl?: string;
  followPlatform?: 'linkedin' | 'instagram' | 'youtube';
  paymentApiKey?: string;
  amount?: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
  paymentAmount?: string;
  paymentDescription?: string;
}

export const generateWidgetCode = (config: WidgetConfig): string => {
  const {
    type,
    handle,
    welcomeMessage,
    position = 'right',
    primaryColor,
    size,
    networks,
    shareText,
    shareUrl,
    phoneNumber,
    reviewUrl,
    followPlatform,
    paymentApiKey,
    amount = 10,
    currency = 'USD',
    successUrl,
    cancelUrl
  } = config;

  const containerId = `widgetify-${type}`;

  const sizeMap: Record<WidgetSize, string> = {
    small: '50px',
    medium: '60px',
    large: '70px'
  };

  const baseCode = `
  <div id="${containerId}" 
       style="position: fixed; 
              bottom: 20px; 
              ${position === 'left' ? 'left: 20px;' : 'right: 20px;'}
              z-index: 9999;">
    <!-- Widgetify ${type} Widget -->
  </div>

  <script>
    (function() {
      const widget = document.createElement('div');
      widget.innerHTML = \`
        <div style="width: ${sizeMap[size || 'medium']}; 
                    height: ${sizeMap[size || 'medium']}; 
                    background-color: ${primaryColor}; 
                    border-radius: 50%; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;"
             onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(0, 0, 0, 0.2)';"
             onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)';"
             onclick="handleWidgetClick()"
             class="widgetify-button">
          ${getIconSvg(type, size, followPlatform)}
        </div>
      \`;

      document.getElementById('${containerId}').appendChild(widget);

      function handleWidgetClick() {
        ${getClickHandlerCode(type, handle, welcomeMessage, shareText, shareUrl, phoneNumber, reviewUrl, followPlatform, networks, paymentApiKey, amount, currency, successUrl, cancelUrl, containerId, position)}
      }
    })();
  </script>

  <div style="font-size: 10px; text-align: center; margin-top: 5px; opacity: 0.7;">
    <a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #666; text-decoration: none;">
      Powered by Widgetify
    </a>
  </div>
  `;

  return baseCode;
};

function getIconSvg(type: WidgetType, size: WidgetSize = 'medium', followPlatform?: string): string {
  const sizeMap: Record<WidgetSize, number> = {
    small: 20,
    medium: 24,
    large: 30
  };
  
  const iconSize = sizeMap[size];
  
  switch (type) {
    case 'whatsapp':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32zm-5.6 12.2c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.47.65.66-2.41-.16-.25a6.63 6.63 0 0 1-1.02-3.52 6.57 6.57 0 0 1 11.29-4.57 6.45 6.45 0 0 1 2 4.55 6.57 6.57 0 0 1-6.57 6.57l-.16.04zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33-.11 0-.24-.02-.37-.02-.13 0-.34.05-.52.25-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2 .1.14 1.4 2.16 3.42 3.02.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.12-.37-.21z" fill="white"/>
      </svg>`;
    case 'facebook':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`;
    case 'instagram':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>`;
    case 'twitter':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`;
    case 'telegram':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
      </svg>`;
    case 'linkedin':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>`;
    case 'social-share':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12zm0 0z"/>
      </svg>`;
    case 'google-translate':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 4.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
      </svg>`;
    case 'youtube':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>`;
    case 'github':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>`;
    case 'twitch':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429Z"/>
      </svg>`;
    case 'slack':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#4A154B"/>
      </svg>`;
    case 'discord':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4724 0-.1634-.3933-.4058-.8742-.6091-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.462-.6304.874-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.094-.8382-9.5204-3.5495-13.442a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="#7289DA"/>
      </svg>`;
    case 'call-now':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
      </svg>`;
    case 'review-now':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`;
    case 'dodo-payment':
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
      </svg>`;
    case 'follow-us':
      if (followPlatform === 'instagram') {
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>`;
      } else if (followPlatform === 'youtube') {
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>`;
      } else {
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>`;
      }
    default:
      return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
        <path d="M7 9h10v2H7z"/>
        <path d="M7 12h7v2H7z"/>
        <path d="M7 6h10v2H7z"/>
      </svg>`;
  }
}

function getClickHandlerCode(
  type: WidgetType,
  handle?: string,
  welcomeMessage?: string,
  shareText?: string,
  shareUrl?: string,
  phoneNumber?: string,
  reviewUrl?: string,
  followPlatform?: string,
  networks?: string[],
  paymentApiKey?: string,
  amount?: number,
  currency?: string,
  successUrl?: string,
  cancelUrl?: string,
  containerId?: string,
  position?: string
): string {
  switch (type) {
    case 'whatsapp':
      const whatsappMessage = encodeURIComponent(welcomeMessage || 'Hello! I have a question.');
      return `window.open('https://wa.me/${handle?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}', '_blank');`;
    
    case 'facebook':
      return `window.open('https://m.me/${handle}', '_blank');`;
    
    case 'instagram':
      return `window.open('https://instagram.com/${handle?.replace('@', '')}', '_blank');`;
    
    case 'twitter':
      return `window.open('https://twitter.com/messages/compose?recipient_id=${handle?.replace('@', '')}', '_blank');`;
    
    case 'telegram':
      return `window.open('https://t.me/${handle?.replace('@', '')}', '_blank');`;
    
    case 'linkedin':
      return `window.open('https://www.linkedin.com/in/${handle}', '_blank');`;
    
    case 'youtube':
      return `window.open('https://www.youtube.com/${handle}', '_blank');`;
    
    case 'github':
      return `window.open('https://github.com/${handle}', '_blank');`;
    
    case 'twitch':
      return `window.open('https://twitch.tv/${handle}', '_blank');`;
    
    case 'slack':
      return `window.open('${handle}', '_blank');`;
    
    case 'discord':
      return `window.open('https://discord.gg/${handle}', '_blank');`;
    
    case 'dodo-payment':
      return `
        // Check if popup already exists and remove it
        const existingPopup = document.querySelector('#${containerId} > div:not(.widgetify-button)');
        if (existingPopup) {
          existingPopup.remove();
          return;
        }
        
        const paymentPopup = document.createElement('div');
        paymentPopup.style.position = 'absolute';
        paymentPopup.style.bottom = '90px';
        paymentPopup.style.${position === 'left' ? 'left' : 'right'} = '20px';
        paymentPopup.style.width = '300px';
        paymentPopup.style.backgroundColor = 'white';
        paymentPopup.style.borderRadius = '10px';
        paymentPopup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        paymentPopup.style.zIndex = '9999';
        paymentPopup.style.overflow = 'hidden';
        
        paymentPopup.innerHTML = \`
          <div style="background-color: #f3f4f6; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 500;">Dodo Payment</div>
            <button id="close-payment-popup" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;">×</button>
          </div>
          <div style="padding: 16px;">
            <div style="margin-bottom: 12px; font-size: 14px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">Amount (${currency || 'USD'})</label>
              <div style="display: flex; align-items: center; border: 1px solid #d1d5db; border-radius: 4px; overflow: hidden;">
                <span style="padding: 0 8px; background-color: #f3f4f6; border-right: 1px solid #d1d5db; font-weight: 500;">${currency || 'USD'}</span>
                <input id="payment-amount" type="number" value="${amount || 10}" min="1" style="flex-grow: 1; padding: 8px; border: none; outline: none; font-size: 14px;">
              </div>
            </div>
            <div style="margin-bottom: 16px; font-size: 14px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">Card Information</label>
              <input type="text" placeholder="Card Number" style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
              <div style="display: flex; gap: 8px;">
                <input type="text" placeholder="MM/YY" style="width: 50%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                <input type="text" placeholder="CVC" style="width: 50%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
              </div>
            </div>
            <button id="process-payment-btn" style="width: 100%; padding: 10px; background-color: #4f46e5; color: white; border: none; border-radius: 4px; font-weight: 500; cursor: pointer; transition: background-color 0.3s;">
              Pay Now
            </button>
          </div>
          <div style="font-size: 10px; text-align: center; margin-top: 5px; padding-bottom: 10px; color: #6b7280;">
            <a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #6b7280; text-decoration: none;">
              Powered by Widgetify
            </a>
          </div>
        \`;
        
        document.getElementById('${containerId}').appendChild(paymentPopup);
        
        document.querySelector('#close-payment-popup').addEventListener('click', function() {
          paymentPopup.remove();
        });
        
        document.querySelector('#process-payment-btn').addEventListener('click', function() {
          const paymentAmount = document.getElementById('payment-amount').value;
          const paymentBtn = this;
          
          paymentBtn.textContent = 'Processing...';
          paymentBtn.disabled = true;
          paymentBtn.style.backgroundColor = '#818cf8';
          
          setTimeout(function() {
            console.log('Processing payment with API key:', '${paymentApiKey}');
            console.log('Amount:', paymentAmount, '${currency}');
            
            paymentPopup.innerHTML = \`
              <div style="background-color: #f3f4f6; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: 500;">Payment Successful</div>
                <button id="close-success-popup" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;">×</button>
              </div>
              <div style="padding: 24px 16px; text-align: center;">
                <div style="width: 48px; height: 48px; margin: 0 auto 16px; background-color: #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 500;">Payment Complete</h3>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Your payment of \${paymentAmount} ${currency || 'USD'} has been processed successfully.</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Transaction ID: DDP-\${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
              <div style="font-size: 10px; text-align: center; margin-top: 5px; padding-bottom: 10px; color: #6b7280;">
                <a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #6b7280; text-decoration: none;">
                  Powered by Widgetify
                </a>
              </div>
            \`;
            
            document.querySelector('#close-success-popup').addEventListener('click', function() {
              paymentPopup.remove();
            });
            
            if ('${successUrl}') {
              // Redirect if success URL provided
              setTimeout(() => {
                window.location.href = '${successUrl}';
              }, 3000);
            }
          }, 2000);
        });
      `;
    
    case 'social-share':
      const url = shareUrl || window.location.href;
      const text = encodeURIComponent(shareText || 'Check out this page!');
      
      let socialPopup = `
        const socialPopup = document.createElement('div');
        socialPopup.style.position = 'absolute';
        socialPopup.style.bottom = '90px';
        socialPopup.style.${position === 'left' ? 'left' : 'right'} = '20px';
        socialPopup.style.display = 'flex';
        socialPopup.style.flexDirection = 'column';
        socialPopup.style.gap = '10px';
        socialPopup.style.zIndex = '9999';
        
        let socialButtons = '';
      `;
      
      if (networks?.includes('facebook')) {
        socialPopup += `
          const fbButton = document.createElement('div');
          fbButton.style.width = '40px';
          fbButton.style.height = '40px';
          fbButton.style.backgroundColor = '#1877F2';
          fbButton.style.borderRadius = '50%';
          fbButton.style.display = 'flex';
          fbButton.style.justifyContent = 'center';
          fbButton.style.alignItems = 'center';
          fbButton.style.cursor = 'pointer';
          fbButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          fbButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
          fbButton.onclick = function() {
            window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}', '_blank', 'width=600,height=400');
          };
          socialPopup.appendChild(fbButton);
        `;
      }
      
      if (networks?.includes('twitter')) {
        socialPopup += `
          const twitterButton = document.createElement('div');
          twitterButton.style.width = '40px';
          twitterButton.style.height = '40px';
          twitterButton.style.backgroundColor = '#1DA1F2';
          twitterButton.style.borderRadius = '50%';
          twitterButton.style.display = 'flex';
          twitterButton.style.justifyContent = 'center';
          twitterButton.style.alignItems = 'center';
          twitterButton.style.cursor = 'pointer';
          twitterButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          twitterButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>';
          twitterButton.onclick = function() {
            window.open('https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}', '_blank', 'width=600,height=400');
          };
          socialPopup.appendChild(twitterButton);
        `;
      }
      
      if (networks?.includes('linkedin')) {
        socialPopup += `
          const linkedinButton = document.createElement('div');
          linkedinButton.style.width = '40px';
          linkedinButton.style.height = '40px';
          linkedinButton.style.backgroundColor = '#0077B5';
          linkedinButton.style.borderRadius = '50%';
          linkedinButton.style.display = 'flex';
          linkedinButton.style.justifyContent = 'center';
          linkedinButton.style.alignItems = 'center';
          linkedinButton.style.cursor = 'pointer';
          linkedinButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          linkedinButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>';
          linkedinButton.onclick = function() {
            window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}', '_blank', 'width=600,height=400');
          };
          socialPopup.appendChild(linkedinButton);
        `;
      }
      
      socialPopup += `
        const branding = document.createElement('div');
        branding.style.fontSize = '10px';
        branding.style.textAlign = 'center';
        branding.style.marginTop = '5px';
        branding.innerHTML = '<a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #666; text-decoration: none;">Powered by Widgetify</a>';
        socialPopup.appendChild(branding);
        
        const existingPopup = document.querySelector('.widgetify-social-popup');
        if (existingPopup) {
          existingPopup.remove();
        } else {
          socialPopup.className = 'widgetify-social-popup';
          document.getElementById('${containerId}').appendChild(socialPopup);
        }
      `;
      
      return socialPopup;
    
    case 'google-translate':
      return `
        if (!window.googleTranslateElementInit) {
          const translatePopup = document.createElement('div');
          translatePopup.style.position = 'absolute';
          translatePopup.style.bottom = '90px';
          translatePopup.style.${position === 'left' ? 'left' : 'right'} = '20px';
          translatePopup.style.width = '280px';
          translatePopup.style.backgroundColor = 'white';
          translatePopup.style.borderRadius = '10px';
          translatePopup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          translatePopup.style.zIndex = '9999';
          translatePopup.style.overflow = 'hidden';
          
          translatePopup.innerHTML = \`
            <div style="background-color: #f3f4f6; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
              <div style="font-weight: 500;">Google Translate</div>
              <button style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;">×</button>
            </div>
            <div style="padding: 12px;">
              <div id="google_translate_element"></div>
            </div>
            <div style="font-size: 10px; text-align: center; margin-top: 5px; padding: 8px;">
              <a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #666; text-decoration: none;">
                Powered by Widgetify
              </a>
            </div>
          \`;
          
          translatePopup.querySelector('button').onclick = function() {
            translatePopup.remove();
          };
          
          document.getElementById('${containerId}').appendChild(translatePopup);
          
          window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
              pageLanguage: 'auto',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          };
          
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          document.body.appendChild(script);
        } else {
          const existingPopup = document.querySelector('#${containerId} > div:not(.widgetify-button)');
          if (existingPopup) {
            existingPopup.remove();
          } else {
            googleTranslateElementInit();
          }
        }
      `;
    
    case 'call-now':
      return `window.location.href = 'tel:${phoneNumber}';`;
    
    case 'review-now':
      return `window.open('${reviewUrl}', '_blank');`;
    
    case 'follow-us':
      if (followPlatform === 'instagram') {
        return `window.open('https://instagram.com/${handle?.replace('@', '')}', '_blank');`;
      } else if (followPlatform === 'youtube') {
        return `window.open('https://www.youtube.com/${handle}', '_blank');`;
      } else {
        return `window.open('https://www.linkedin.com/in/${handle}', '_blank');`;
      }
    
    default:
      return `
        const chatPopup = document.createElement('div');
        chatPopup.style.position = 'absolute';
        chatPopup.style.bottom = '90px';
        chatPopup.style.${position === 'left' ? 'left' : 'right'} = '20px';
        chatPopup.style.width = '280px';
        chatPopup.style.height = '350px';
        chatPopup.style.backgroundColor = 'white';
        chatPopup.style.borderRadius = '10px';
        chatPopup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        chatPopup.style.zIndex = '9999';
        chatPopup.style.display = 'flex';
        chatPopup.style.flexDirection = 'column';
        chatPopup.style.overflow = 'hidden';
        
        chatPopup.innerHTML = \`
          <div style="background-color: #f3f4f6; padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 500;">Chat</div>
            <button style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;">×</button>
          </div>
          <div style="flex-grow: 1; padding: 12px; overflow-y: auto; background-color: white;">
            <div style="background-color: #f3f4f6; padding: 8px; border-radius: 8px; margin-bottom: 8px; max-width: 80%;">
              <p style="font-size: 12px; margin: 0;">How can I help you today?</p>
            </div>
          </div>
          <div style="padding: 12px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
            <div style="display: flex; gap: 8px;">
              <input type="text" placeholder="Type a message..." style="flex-grow: 1; font-size: 12px; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              <button style="background-color: #e5e7eb; padding: 8px; border: none; border-radius: 4px; cursor: pointer;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <div style="font-size: 10px; text-align: center; margin-top: 8px; color: #6b7280;">
              <a href="https://widgetify-two.vercel.app/" target="_blank" style="color: #6b7280; text-decoration: none;">
                Powered by Widgetify
              </a>
            </div>
          </div>
        \`;
        
        chatPopup.querySelector('button').onclick = function() {
          chatPopup.remove();
        };
        
        const existingPopup = document.querySelector('#${containerId} > div:not(.widgetify-button)');
        if (existingPopup) {
          existingPopup.remove();
        } else {
          document.getElementById('${containerId}').appendChild(chatPopup);
        }
      `;
  }
}
