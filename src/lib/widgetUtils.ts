
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
  emailAddress?: string;
  bookingUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  feedbackUrl?: string;
}

export const generateWidgetCode = (config: WidgetConfig): string => {
  const { type, handle, welcomeMessage, position, primaryColor, size, networks, shareText, shareUrl, phoneNumber, reviewUrl, followPlatform, amount, currency, paymentDescription, upiId, payeeName, emailAddress, bookingUrl, appStoreUrl, playStoreUrl, feedbackUrl } = config;
  
  const sizeMap = {
    small: '50px',
    medium: '60px', 
    large: '70px',
  };

  const widgetSize = sizeMap[size || 'medium'];
  const buttonColor = primaryColor || '#25D366';
  const positionStyle = position === 'left' ? 'left: 20px;' : 'right: 20px;';

  // Base responsive widget styles with watermark for chat widgets
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

      .widgetify-watermark {
        background-color: #f9fafb;
        border-top: 1px solid #e5e7eb;
        padding: 8px 12px;
        text-align: center;
        margin: 20px -20px -20px -20px;
        border-radius: 0 0 10px 10px;
      }

      .widgetify-watermark a {
        color: #6b7280;
        text-decoration: none;
        font-size: 10px;
        font-weight: 500;
      }

      .widgetify-watermark a:hover {
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
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
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
          
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyPayment() {
            const popup = document.getElementById('widgetify-payment-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'payment':
      const paymentAmount2 = amount || 199;
      const paymentUpiId2 = upiId || 'adnanmuhammad4393@okicici';
      const paymentPayeeName2 = payeeName || 'Muhammed Adnan';
      const qrCodeData2 = `upi://pay?pa=${paymentUpiId2}&pn=${encodeURIComponent(paymentPayeeName2)}&am=${paymentAmount2}&cu=INR`;
      const qrCodeUrl2 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&ecc=M&data=${encodeURIComponent(qrCodeData2)}`;

      return `<!-- Payment Gateway Widget -->
<style>
  /* Widgetify Core Styles - Responsive & Mobile-First */
  .widgetify-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    width: 60px;
    height: 60px;
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
    bottom: 90px;
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

  .widgetify-watermark {
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: center;
    margin: 20px -20px -20px -20px;
    border-radius: 0 0 10px 10px;
  }

  .widgetify-watermark a {
    color: #6b7280;
    text-decoration: none;
    font-size: 10px;
    font-weight: 500;
  }

  .widgetify-watermark a:hover {
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
      bottom: 85px;
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
</style>

<div id="widgetify-payment" class="widgetify-widget" onclick="toggleWidgetifyPayment()" aria-label="Open payment gateway">
  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
  </svg>
</div>

<div id="widgetify-payment-popup" class="widgetify-popup" role="dialog" aria-labelledby="payment-title">
  <div class="widgetify-header">
    <h3 id="payment-title">Payment Gateway</h3>
    <button class="widgetify-close" onclick="toggleWidgetifyPayment()" aria-label="Close payment">×</button>
  </div>
  
  <h3 class="upi-gateway-title">Pay with UPI</h3>
  
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${qrCodeUrl2}" alt="UPI Payment QR Code" class="upi-gateway-qr">
    <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280; font-weight: 500;">Scan with any UPI app</p>
  </div>

  <div style="background: #f9fafb; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
    <p class="upi-gateway-details"><strong>UPI ID:</strong> ${paymentUpiId2}</p>
    <p class="upi-gateway-details"><strong>Payee:</strong> ${paymentPayeeName2}</p>
    <p class="upi-gateway-details"><strong>Amount:</strong> ₹${paymentAmount2}</p>
  </div>

  <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
    <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280;">Or click to pay directly</p>
    <a href="${qrCodeData2}" style="text-decoration: none; display: block;">
      <button class="upi-gateway-button">
        💳 Pay ₹${paymentAmount2} via UPI
      </button>
    </a>
  </div>

  <p class="upi-gateway-note">Supports PhonePe, Google Pay, Paytm, BHIM & all UPI apps<br>Secure payment powered by UPI</p>
  
  <div class="widgetify-watermark">
    <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
  </div>
</div>

<script>
  function toggleWidgetifyPayment() {
    const popup = document.getElementById('widgetify-payment-popup');
    popup.classList.toggle('show');
  }
</script>`;

    case 'email-contact':
      return `${baseStyles}
        <div id="widgetify-email" class="widgetify-widget" onclick="toggleWidgetifyEmail()" aria-label="Send Email">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <div id="widgetify-email-popup" class="widgetify-popup" role="dialog" aria-labelledby="email-title">
          <div class="widgetify-header">
            <h3 id="email-title">Send Email</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyEmail()" aria-label="Close email">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <form onsubmit="sendEmail(event)">
              <input type="text" placeholder="Your Name" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <input type="email" placeholder="Your Email" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <textarea placeholder="Your Message" required rows="4" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
              <button type="submit" style="width: 100%; padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 4px; cursor: pointer;">Send Email</button>
            </form>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyEmail() {
            const popup = document.getElementById('widgetify-email-popup');
            popup.classList.toggle('show');
          }
          
          function sendEmail(e) {
            e.preventDefault();
            window.location.href = 'mailto:${emailAddress || 'contact@example.com'}?subject=Contact from Website&body=' + encodeURIComponent(e.target.elements[2].value);
          }
        </script>`;

    case 'live-chat':
      return `${baseStyles}
        <div id="widgetify-livechat" class="widgetify-widget" onclick="toggleWidgetifyLiveChat()" aria-label="Live Chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h.01M12 10h.01M16 10h.01"/>
          </svg>
        </div>

        <div id="widgetify-livechat-popup" class="widgetify-popup" role="dialog" aria-labelledby="livechat-title">
          <div class="widgetify-header">
            <h3 id="livechat-title">Live Chat</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyLiveChat()" aria-label="Close chat">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px; height: 200px; overflow-y: auto;">
            <div style="background: #f0f0f0; padding: 10px; border-radius: 10px; margin-bottom: 10px;">
              <p style="margin: 0; font-size: 14px;">${welcomeMessage || 'Hello! How can I help you today?'}</p>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              <div style="display: inline-block; width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; margin-right: 5px;"></div>
              Agent online - Average response time: 2 minutes
            </div>
          </div>
          <div style="padding: 12px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
            <div style="display: flex; gap: 8px;">
              <input type="text" placeholder="Type your message..." style="flex-grow: 1; font-size: 12px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;">
              <button onclick="startLiveChat()" style="background-color: ${buttonColor}; color: white; padding: 8px; border: none; border-radius: 6px; cursor: pointer;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyLiveChat() {
            const popup = document.getElementById('widgetify-livechat-popup');
            popup.classList.toggle('show');
          }
          
          function startLiveChat() {
            alert('Live chat feature would connect to your preferred chat service (Intercom, Zendesk, etc.)');
          }
        </script>`;

    case 'booking-calendar':
      return `${baseStyles}
        <div id="widgetify-booking" class="widgetify-widget" onclick="toggleWidgetifyBooking()" aria-label="Book Appointment">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <div id="widgetify-booking-popup" class="widgetify-popup" role="dialog" aria-labelledby="booking-title">
          <div class="widgetify-header">
            <h3 id="booking-title">Book Appointment</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyBooking()" aria-label="Close booking">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Schedule a Meeting</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Choose your preferred date and time</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">Date</label>
                <input type="date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">Time</label>
                <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
            </div>
            <input type="text" placeholder="Your Name" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <input type="email" placeholder="Your Email" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;">
            <button onclick="bookAppointment()" style="width: 100%; padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 4px; cursor: pointer;">Book Appointment</button>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyBooking() {
            const popup = document.getElementById('widgetify-booking-popup');
            popup.classList.toggle('show');
          }
          
          function bookAppointment() {
            window.open('${bookingUrl || 'https://calendly.com/example'}', '_blank');
          }
        </script>`;

    case 'newsletter-signup':
      return `${baseStyles}
        <div id="widgetify-newsletter" class="widgetify-widget" onclick="toggleWidgetifyNewsletter()" aria-label="Subscribe Newsletter">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
            <circle cx="18" cy="8" r="3" fill="red"/>
          </svg>
        </div>

        <div id="widgetify-newsletter-popup" class="widgetify-popup" role="dialog" aria-labelledby="newsletter-title">
          <div class="widgetify-header">
            <h3 id="newsletter-title">Subscribe to Newsletter</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyNewsletter()" aria-label="Close newsletter">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Stay Updated!</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Get the latest news and updates delivered to your inbox</p>
            </div>
            <form onsubmit="subscribeNewsletter(event)">
              <input type="email" placeholder="Enter your email address" required style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <input type="checkbox" id="agree" required style="margin-right: 8px;">
                <label for="agree" style="font-size: 12px; color: #666;">I agree to receive marketing emails</label>
              </div>
              <button type="submit" style="width: 100%; padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 4px; cursor: pointer;">Subscribe Now</button>
            </form>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyNewsletter() {
            const popup = document.getElementById('widgetify-newsletter-popup');
            popup.classList.toggle('show');
          }
          
          function subscribeNewsletter(e) {
            e.preventDefault();
            alert('Thank you for subscribing! You will receive a confirmation email shortly.');
            toggleWidgetifyNewsletter();
          }
        </script>`;

    case 'feedback-form':
      return `${baseStyles}
        <div id="widgetify-feedback" class="widgetify-widget" onclick="toggleWidgetifyFeedback()" aria-label="Give Feedback">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 7v6M12 17h.01"/>
          </svg>
        </div>

        <div id="widgetify-feedback-popup" class="widgetify-popup" role="dialog" aria-labelledby="feedback-title">
          <div class="widgetify-header">
            <h3 id="feedback-title">Send Feedback</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyFeedback()" aria-label="Close feedback">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">We'd love your feedback!</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Help us improve our service</p>
            </div>
            <form onsubmit="submitFeedback(event)">
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">How would you rate us?</label>
                <div style="display: flex; gap: 5px; justify-content: center;">
                  <span onclick="setRating(1)" style="cursor: pointer; font-size: 20px; color: #ddd;">⭐</span>
                  <span onclick="setRating(2)" style="cursor: pointer; font-size: 20px; color: #ddd;">⭐</span>
                  <span onclick="setRating(3)" style="cursor: pointer; font-size: 20px; color: #ddd;">⭐</span>
                  <span onclick="setRating(4)" style="cursor: pointer; font-size: 20px; color: #ddd;">⭐</span>
                  <span onclick="setRating(5)" style="cursor: pointer; font-size: 20px; color: #ddd;">⭐</span>
                </div>
              </div>
              <textarea placeholder="Your feedback..." required rows="4" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
              <button type="submit" style="width: 100%; padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 4px; cursor: pointer;">Send Feedback</button>
            </form>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          var selectedRating = 0;
          
          function toggleWidgetifyFeedback() {
            const popup = document.getElementById('widgetify-feedback-popup');
            popup.classList.toggle('show');
          }
          
          function setRating(rating) {
            selectedRating = rating;
            const stars = document.querySelectorAll('#widgetify-feedback-popup span');
            stars.forEach((star, index) => {
              star.style.color = index < rating ? '#ffd700' : '#ddd';
            });
          }
          
          function submitFeedback(e) {
            e.preventDefault();
            if (selectedRating === 0) {
              alert('Please select a rating');
              return;
            }
            window.open('${feedbackUrl || 'mailto:feedback@example.com?subject=Feedback&body=Rating: '}' + selectedRating + '${feedbackUrl ? '' : '/5'}', '_blank');
            alert('Thank you for your feedback!');
            toggleWidgetifyFeedback();
          }
        </script>`;

    case 'download-app':
      return `${baseStyles}
        <div id="widgetify-app" class="widgetify-widget" onclick="toggleWidgetifyApp()" aria-label="Download App">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
            <path d="M8 10l4 4 4-4"/>
          </svg>
        </div>

        <div id="widgetify-app-popup" class="widgetify-popup" role="dialog" aria-labelledby="app-title">
          <div class="widgetify-header">
            <h3 id="app-title">Download Our App</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyApp()" aria-label="Close app download">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Get the Mobile App</h4>
              <p style="margin: 0; color: #666; font-size: 14px;">Download our app for the best experience</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button onclick="downloadIOS()" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 10px;">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for iOS
              </button>
              <button onclick="downloadAndroid()" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px; background: #34A853; color: white; border: none; border-radius: 8px; cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 10px;">
                  <path d="M17.523 15.3414c-.5665 0-1.0253-.4588-1.0253-1.0253s.4588-1.0253 1.0253-1.0253 1.0253.4588 1.0253 1.0253-.4588 1.0253-1.0253 1.0253zm-11.046 0c-.5665 0-1.0253-.4588-1.0253-1.0253s.4588-1.0253 1.0253-1.0253 1.0253.4588 1.0253 1.0253-.4588 1.0253-1.0253 1.0253zm13.618-15.3414l-1.431 2.3616c1.778 1.1519 2.976 3.2063 2.976 5.5545 0 3.5777-2.9029 6.4806-6.4806 6.4806s-6.4806-2.9029-6.4806-6.4806c0-2.348 1.1982-4.4024 2.976-5.5545l-1.431-2.3616c-2.4728 1.5104-4.1226 4.2468-4.1226 7.3362 0 4.8306 3.9158 8.7464 8.7464 8.7464s8.7464-3.9158 8.7464-8.7464c0-3.0894-1.6498-5.8258-4.1226-7.3362z"/>
                </svg>
                Download for Android
              </button>
            </div>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyApp() {
            const popup = document.getElementById('widgetify-app-popup');
            popup.classList.toggle('show');
          }
          
          function downloadIOS() {
            window.open('${appStoreUrl || 'https://apps.apple.com/'}', '_blank');
          }
          
          function downloadAndroid() {
            window.open('${playStoreUrl || 'https://play.google.com/store'}', '_blank');
          }
        </script>`;

    case 'review-now':
      return `${baseStyles}
        <div id="widgetify-review" class="widgetify-widget" onclick="window.open('${reviewUrl || 'https://google.com/search?q=reviews'}', '_blank')" aria-label="Leave a Review">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </div>`;

    case 'follow-us':
      const followUrl = (() => {
        const handle = config.handle?.replace('@', '') || 'example';
        const platform = followPlatform || 'linkedin';
        if (platform === 'instagram') return `https://instagram.com/${handle}`;
        if (platform === 'youtube') return `https://www.youtube.com/${handle}`;
        return `https://www.linkedin.com/in/${handle}`;
      })();

      return `${baseStyles}
        <div id="widgetify-follow" class="widgetify-widget" onclick="window.open('${followUrl}', '_blank')" aria-label="Follow Us">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85"/>
          </svg>
        </div>`;

    case 'telegram':
      return `${baseStyles}
        <div id="widgetify-telegram" class="widgetify-widget" onclick="toggleWidgetifyTelegram()" aria-label="Open Telegram Chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
          </svg>
        </div>

        <div id="widgetify-telegram-popup" class="widgetify-popup" role="dialog" aria-labelledby="telegram-title">
          <div class="widgetify-header">
            <h3 id="telegram-title">Telegram Chat</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyTelegram()" aria-label="Close chat">×</button>
          </div>
          <div class="widgetify-content">
            <div style="background-color: #f3f4f6; padding: 8px; border-radius: 8px; margin-bottom: 8px; max-width: 80%;">
              <p style="margin: 0; font-size: 12px; color: #374151;">${welcomeMessage || 'Hello! How can I help you today?'}</p>
            </div>
          </div>
          <div style="padding: 12px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
            <div style="display: flex; gap: 8px;">
              <input type="text" placeholder="Type a message..." style="flex-grow: 1; font-size: 12px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;">
              <button onclick="window.open('https://t.me/${(handle || '').replace(/[^a-zA-Z0-9_]/g, '')}', '_blank')" style="background-color: ${buttonColor}; color: white; padding: 8px; border: none; border-radius: 6px; cursor: pointer;" aria-label="Send message on Telegram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyTelegram() {
            const popup = document.getElementById('widgetify-telegram-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'google-translate':
      return `${baseStyles}
        <div id="widgetify-translate" class="widgetify-widget" onclick="toggleWidgetifyTranslate()" aria-label="Google Translate">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
          </svg>
        </div>

        <div id="widgetify-translate-popup" class="widgetify-popup" role="dialog" aria-labelledby="translate-title">
          <div class="widgetify-header">
            <h3 id="translate-title">Google Translate</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyTranslate()" aria-label="Close translate">×</button>
          </div>
          <div class="widgetify-content" style="padding: 20px;">
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 2px dashed #d1d5db; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">Google Translate Widget</p>
              <div id="google_translate_element" style="margin: 10px 0;"></div>
              <p style="margin: 10px 0 0 0; font-size: 10px; color: #9ca3af;">This widget integrates Google Translate for automatic page translation.</p>
            </div>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyTranslate() {
            const popup = document.getElementById('widgetify-translate-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    default:
      return `${baseStyles}
        <div id="widgetify-widget" class="widgetify-widget" onclick="toggleWidgetifyPopup()" aria-label="Open chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>

        <div id="widgetify-popup" class="widgetify-popup" role="dialog" aria-labelledby="widget-title">
          <div class="widgetify-header">
            <h3 id="widget-title">Chat</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyPopup()" aria-label="Close chat">×</button>
          </div>
          <div class="widgetify-content">
            <p>Start a conversation!</p>
          </div>
          <div class="widgetify-watermark">
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>
        </div>

        <script>
          function toggleWidgetifyPopup() {
            const popup = document.getElementById('widgetify-popup');
            popup.classList.toggle('show');
          }
        </script>`;
  }
};
