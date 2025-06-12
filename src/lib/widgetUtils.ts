import { WidgetType, WidgetSize } from '@/types';

export interface WidgetConfig {
  type: WidgetType;
  handle: string;
  welcomeMessage: string;
  position: 'left' | 'right';
  primaryColor: string;
  size: WidgetSize;
  networks?: string[];
  shareText?: string;
  shareUrl?: string;
  phoneNumber?: string;
  reviewUrl?: string;
  followPlatform?: 'linkedin' | 'instagram' | 'youtube';
  amount?: number;
  currency?: string;
  paymentDescription?: string;
  upiId?: string;
  payeeName?: string;
  isPremium?: boolean;
}

/**
 * FREE TIER WIDGET CODE
 * - Includes Widgetify watermark and footer
 * - Fully functional with all widget types
 * - Perfect for personal projects and testing
 * - No payment required
 */

/**
 * PREMIUM TIER WIDGET CODE  
 * - No watermark or branding
 * - Clean, professional appearance
 * - Optimized for commercial use
 * - Requires one-time payment validation
 */

export const generateWidgetCode = (config: WidgetConfig): string => {
  const { type, handle, welcomeMessage, position, primaryColor, size, networks, shareText, shareUrl, phoneNumber, reviewUrl, followPlatform, amount, currency, paymentDescription, upiId, payeeName, isPremium = false } = config;
  
  const sizeMap = {
    small: '50px',
    medium: '60px', 
    large: '70px',
  };

  const widgetSize = sizeMap[size || 'medium'];
  const buttonColor = primaryColor || '#25D366';
  const positionStyle = position === 'left' ? 'left: 20px;' : 'right: 20px;';

  // Watermark styles - only show if not premium
  const watermarkStyles = !isPremium ? `
    .widgetify-watermark {
      position: absolute;
      bottom: 2px;
      ${position === 'left' ? 'left: 2px;' : 'right: 2px;'}
      font-size: 9px;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 8px;
      backdrop-filter: blur(5px);
      z-index: 100;
    }
    
    .widgetify-watermark a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.3px;
      transition: color 0.2s ease;
    }
    
    .widgetify-watermark a:hover {
      color: rgba(255, 255, 255, 1);
    }
  ` : '';

  const watermarkHTML = !isPremium ? `<div class="widgetify-watermark"><a href="https://widgetify-two.vercel.app/" target="_blank" rel="noopener noreferrer">✨ Widgetify</a></div>` : '';

  const footerHTML = !isPremium ? `
    <div class="widgetify-footer" style="text-align: center; padding: 8px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
      <a href="https://widgetify-two.vercel.app/" target="_blank" rel="noopener noreferrer" style="font-size: 10px; color: #6b7280; text-decoration: none;">Powered by Widgetify</a>
    </div>
  ` : '';

  // Base responsive widget styles with conditional watermark
  const baseStyles = `
    <style>
      /* Widgetify Core Styles - Responsive & Mobile-First */
      .widgetify-widget {
        position: fixed;
        bottom: 20px;
        ${positionStyle}
        width: ${widgetSize};
        height: ${widgetSize};
        background-color: ${buttonColor};
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        z-index: 1000;
        border: none;
        outline: none;
      }

      .widgetify-widget:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .widgetify-popup {
        position: fixed;
        bottom: ${parseInt(widgetSize) + 30}px;
        ${positionStyle}
        width: 400px;
        max-width: 90vw;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        z-index: 999;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .widgetify-popup.show {
        display: flex;
        animation: fadeInUp 0.3s ease;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .widgetify-header {
        background-color: #f3f4f6;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 0 -20px;
      }

      .widgetify-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }

      .widgetify-close {
        background: none;
        border: none;
        font-size: 18px;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .widgetify-close:hover {
        color: #374151;
      }

      /* UPI Gateway Specific Styles */
      .upi-gateway-title {
        margin: 16px 0 16px 0;
        color: #1f2937;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
      }

      .upi-gateway-qr {
        width: 200px;
        height: 200px;
        border: 2px solid #f3f4f6;
        border-radius: 8px;
        display: block;
        margin: 0 auto;
      }

      .upi-gateway-details {
        margin: 4px 0;
        font-size: 14px;
        color: #374151;
      }

      .upi-gateway-button {
        width: 100%;
        padding: 16px 0;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
      }

      .upi-gateway-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
      }

      .upi-gateway-note {
        margin: 16px 0 0 0;
        font-size: 11px;
        color: #9ca3af;
        text-align: center;
        line-height: 1.4;
      }

      /* Responsive Mobile Design */
      @media (max-width: 480px) {
        .widgetify-widget {
          bottom: 15px;
          ${position === 'left' ? 'left: 15px;' : 'right: 15px;'}
        }
        
        .widgetify-popup {
          bottom: ${parseInt(widgetSize) + 25}px;
          ${position === 'left' ? 'left: 15px;' : 'right: 15px;'}
          max-width: calc(100vw - 30px) !important;
          margin: 0 !important;
          border-radius: 8px !important;
          padding: 16px !important;
        }
        
        .upi-gateway-title {
          font-size: 18px !important;
        }
        
        .upi-gateway-details {
          font-size: 13px !important;
        }
        
        .upi-gateway-button {
          padding: 14px 0 !important;
          font-size: 15px !important;
        }
        
        .upi-gateway-qr {
          width: 160px !important;
          height: 160px !important;
        }
        
        .upi-gateway-note {
          font-size: 11px !important;
        }
      }

      .widgetify-footer {
        text-align: center;
        padding: 8px;
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
        margin: 12px -20px -20px -20px;
        border-radius: 0 0 10px 10px;
      }

      .widgetify-footer a {
        font-size: 10px;
        color: #6b7280;
        text-decoration: none;
      }

      .widgetify-footer a:hover {
        color: #374151;
      }

      ${watermarkStyles}
    </style>
  `;

  // Generate widget based on type
  switch (type) {
    case 'whatsapp':
      return `${baseStyles}
        <div id="widgetify-whatsapp" class="widgetify-widget" onclick="toggleWidgetifyPopup()" aria-label="Open WhatsApp Chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32zm-5.6 12.2c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.47.65.66-2.41-.16-.25a6.63 6.63 0 0 1-1.02-3.52 6.57 6.57 0 0 1 11.29-4.57 6.45 6.45 0 0 1 2 4.55 6.57 6.57 0 0 1-6.57 6.57l-.16.04zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33-.11 0-.24-.02-.37-.02-.13 0-.34.05-.52.25-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2 .1.14 1.4 2.16 3.42 3.02.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.12-.37-.21z" fill="white"/>
          </svg>
          ${watermarkHTML}
        </div>

        <div id="widgetify-popup" class="widgetify-popup" role="dialog" aria-labelledby="chat-title">
          <div class="widgetify-header">
            <h3 id="chat-title">WhatsApp Chat</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyPopup()" aria-label="Close chat">×</button>
          </div>
          <div class="widgetify-content">
            <div style="background-color: #f3f4f6; padding: 8px; border-radius: 8px; margin-bottom: 8px; max-width: 80%;">
              <p style="margin: 0; font-size: 12px; color: #374151;">${welcomeMessage || 'Hello! How can I help you today?'}</p>
            </div>
          </div>
          <div style="padding: 12px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 10px 10px;">
            <div style="display: flex; gap: 8px;">
              <input type="text" placeholder="Type a message..." style="flex-grow: 1; font-size: 12px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;">
              <button onclick="window.open('https://wa.me/${(handle || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(welcomeMessage || 'Hello')}')" style="background-color: ${buttonColor}; color: white; padding: 8px; border: none; border-radius: 6px; cursor: pointer;" aria-label="Send message on WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            ${footerHTML}
          </div>
        </div>

        <script>
          function toggleWidgetifyPopup() {
            const popup = document.getElementById('widgetify-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'call-now':
      return `${baseStyles}
        <div id="widgetify-call" class="widgetify-widget" onclick="window.location.href='tel:${phoneNumber || '+1234567890'}'" aria-label="Call now">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          ${watermarkHTML}
        </div>`;

    case 'social-share':
      const shareButtons = networks?.map((network, index) => {
        const colors = { facebook: '#1877F2', twitter: '#1DA1F2', linkedin: '#0077B5' };
        const icons = {
          facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
          twitter: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
          linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'
        };
        
        return `
          <div style="width: ${parseInt(widgetSize) * 0.8}px; height: ${parseInt(widgetSize) * 0.8}px; background-color: ${colors[network as keyof typeof colors]}; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); cursor: pointer; transition: transform 0.2s ease; margin-bottom: 10px;" 
               onclick="shareOn${network.charAt(0).toUpperCase() + network.slice(1)}()" 
               onmouseover="this.style.transform='scale(1.05)'" 
               onmouseout="this.style.transform='scale(1)'">
            <svg width="${parseInt(widgetSize) * 0.4}" height="${parseInt(widgetSize) * 0.4}" viewBox="0 0 24 24" fill="white">
              ${icons[network as keyof typeof icons]}
            </svg>
          </div>
        `;
      }).join('');

      return `${baseStyles}
        <style>
          .widgetify-social-container {
            position: fixed;
            bottom: ${parseInt(widgetSize) + 30}px;
            ${positionStyle}
            display: none;
            flex-direction: column;
            align-items: center;
            z-index: 999;
          }
          .widgetify-social-container.show {
            display: flex;
            animation: fadeInUp 0.3s ease;
          }
        </style>

        <div id="widgetify-share" class="widgetify-widget" onclick="toggleWidgetifyShare()">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
          </svg>
          ${watermarkHTML}
        </div>

        <div id="widgetify-social-container" class="widgetify-social-container">
          ${shareButtons}
        </div>

        <script>
          function toggleWidgetifyShare() {
            const container = document.getElementById('widgetify-social-container');
            container.classList.toggle('show');
          }

          function shareOnFacebook() {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('${shareUrl || window.location.href}'), '_blank');
          }

          function shareOnTwitter() {
            window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('${shareText || 'Check this out!'}') + '&url=' + encodeURIComponent('${shareUrl || window.location.href}'), '_blank');
          }

          function shareOnLinkedin() {
            window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('${shareUrl || window.location.href}'), '_blank');
          }
        </script>`;

    case 'dodo-payment':
      const paymentAmount = amount || 99;
      const paymentUpiId = upiId || 'adnanmuhammad4393@okicici';
      const paymentPayeeName = payeeName || 'Muhammed Adnan';
      const qrCodeData = `upi://pay?pa=${paymentUpiId}&pn=${encodeURIComponent(paymentPayeeName)}&am=${paymentAmount}&cu=INR`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&ecc=M&data=${encodeURIComponent(qrCodeData)}`;

      return `${baseStyles}
        <div id="widgetify-payment" class="widgetify-widget" onclick="toggleWidgetifyPayment()" aria-label="Open payment gateway">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
          </svg>
          ${watermarkHTML}
        </div>

        <div id="widgetify-payment-popup" class="widgetify-popup" role="dialog" aria-labelledby="payment-title">
          <div class="widgetify-header">
            <h3 id="payment-title">Payment Gateway</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyPayment()" aria-label="Close payment">×</button>
          </div>
          
          <h3 class="upi-gateway-title">Pay with UPI</h3>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${qrCodeUrl}" alt="UPI Payment QR Code" class="upi-gateway-qr">
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280; font-weight: 500;">Scan with any UPI app</p>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <p class="upi-gateway-details"><strong>UPI ID:</strong> ${paymentUpiId}</p>
            <p class="upi-gateway-details"><strong>Payee:</strong> ${paymentPayeeName}</p>
            <p class="upi-gateway-details"><strong>Amount:</strong> ₹${paymentAmount}</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280;">Or click to pay directly</p>
            <a href="${qrCodeData}" style="text-decoration: none; display: block;">
              <button class="upi-gateway-button">
                💳 Pay ₹${paymentAmount} via UPI
              </button>
            </a>
          </div>

          <p class="upi-gateway-note">Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br>Secure payment powered by UPI</p>
          ${footerHTML}
        </div>

        <script>
          function toggleWidgetifyPayment() {
            const popup = document.getElementById('widgetify-payment-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    default:
      return `${baseStyles}
        <div id="widgetify-widget" class="widgetify-widget" onclick="toggleWidgetifyPopup()" aria-label="Open chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          ${watermarkHTML}
        </div>

        <div id="widgetify-popup" class="widgetify-popup" role="dialog" aria-labelledby="widget-title">
          <div class="widgetify-header">
            <h3 id="widget-title">Chat</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyPopup()" aria-label="Close chat">×</button>
          </div>
          <div class="widgetify-content">
            <p>Start a conversation!</p>
          </div>
          ${footerHTML}
        </div>

        <script>
          function toggleWidgetifyPopup() {
            const popup = document.getElementById('widgetify-popup');
            popup.classList.toggle('show');
          }
        </script>`;
  }
};
