
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
  whatsappNumber?: string;
  businessName?: string;
  targetDate?: string;
  title?: string;
  countdownStyle?: 'circular' | 'digital' | 'minimal' | 'bold';
  showLabels?: boolean;
  // New widget properties
  scrollOffset?: string;
  smoothScroll?: boolean;
  qrText?: string;
  qrSize?: string;
  toggleStyle?: string;
  savePreference?: boolean;
  weatherCity?: string;
  weatherUnits?: string;
  cryptoCoins?: string;
  cryptoCurrency?: string;
  copyText?: string;
  copyButtonText?: string;
  spotifyUrl?: string;
  height?: string;
  compact?: boolean;
  // Added for new widgets
  pdfUrl?: string;
  videoUrl?: string;
  consentMessage?: string;
  ageMinimum?: number;
  // AI-SEO widget properties
  seoKeywords?: string;
  seoDescription?: string;
  businessType?: 'local' | 'online' | 'ecommerce';
  targetLocation?: string;
  businessUrl?: string;
  // WhatsApp Form properties
  formTitle?: string;
  formFields?: string[];
  formMessage?: string;
  // Lead Capture Popup properties
  popupDelay?: number;
  leadCaptureTitle?: string;
  leadCaptureSubtitle?: string;
  adminWhatsApp?: string;
  // Exit Intent Popup properties
  exitTitle?: string;
  exitSubtitle?: string;
  exitOffer?: string;
  exitButtonText?: string;
  exitActionUrl?: string;
  // Sticky Banner properties
  bannerText?: string;
  bannerPosition?: 'top' | 'bottom';
  bannerStyle?: 'info' | 'warning' | 'success' | 'promo';
  bannerActionText?: string;
  bannerActionUrl?: string;
  bannerDismissible?: boolean;
  // AI Chatbot properties
  chatbotName?: string;
  chatbotWelcome?: string;
  chatbotPlaceholder?: string;
  perplexityApiKey?: string;
  chatbotModel?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online' | 'llama-3.1-sonar-huge-128k-online';
  // Trust Badge properties
  trustBadges?: string[];
  badgeStyle?: 'minimal' | 'detailed' | 'colorful';
  // Email Signature properties
  fullName?: string;
  jobTitle?: string;
  companyName?: string;
  companyWebsite?: string;
  socialLinks?: { platform: string; url: string; }[];
  signatureStyle?: 'professional' | 'modern' | 'creative';
  // Holiday Countdown properties
  holidayName?: string;
  holidayDate?: string;
  holidayMessage?: string;
  // Flash Sale Banner properties
  saleTitle?: string;
  saleDiscount?: string;
  saleEndTime?: string;
  saleCtaText?: string;
  saleCtaUrl?: string;
  // Seasonal Greeting properties
  greetingType?: 'christmas' | 'new-year' | 'halloween' | 'easter' | 'thanksgiving' | 'valentine';
  customGreeting?: string;
  // Black Friday properties
  blackFridayTitle?: string;
  blackFridayEndDate?: string;
  blackFridayOffer?: string;
  // Multi-Step Survey properties
  surveyQuestions?: { question: string; type: 'text' | 'rating' | 'choice'; options?: string[]; }[];
  surveyTitle?: string;
  surveySubmitUrl?: string;
  // Loyalty Points properties
  pointsBalance?: number;
  loyaltyTier?: string;
  pointsToNextTier?: number;
  rewardsUrl?: string;
  // Live Visitor Counter properties
  initialVisitors?: number;
  visitorVariation?: number;
  updateInterval?: number;
  // Smart FAQ Chatbot properties
  faqKnowledgeBase?: { question: string; answer: string; }[];
  faqFallbackMessage?: string;
  // Price Drop Alert properties
  productName?: string;
  originalPrice?: number;
  currentPrice?: number;
  alertEmail?: string;
  productUrl?: string;
  // Product Tour properties
  tourSteps?: { title: string; description: string; target?: string; }[];
  tourAutoStart?: boolean;
  // Referral Tracking properties
  referralCode?: string;
  referralReward?: string;
  referralUrl?: string;
  referralCount?: number;
  // Lead Magnet properties
  resourceTitle?: string;
  resourceDescription?: string;
  resourceUrl?: string;
  // Smart Query properties
  queryTitle?: string;
  // Service Estimator properties
  estimatorTitle?: string;
  services?: { name: string; basePrice: number; unit: string; }[];
  // Branding options
  removeBranding?: boolean;
}

export const generateWidgetCode = (config: WidgetConfig): string => {
  const { type, handle, welcomeMessage, position, primaryColor, size, networks, shareText, shareUrl, phoneNumber, reviewUrl, followPlatform, amount, currency, paymentDescription, upiId, payeeName, emailAddress, bookingUrl, appStoreUrl, playStoreUrl, feedbackUrl, whatsappNumber, businessName, targetDate, title, countdownStyle, showLabels, removeBranding } = config;
  
  // Helper function to generate watermark HTML
  const generateWatermark = (customStyle = '') => {
    if (removeBranding) return '';
    return `
          <div class="widgetify-watermark"${customStyle ? ` style="${customStyle}"` : ''}>
            <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
          </div>`;
  };
  
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
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyPopup() {
            const popup = document.getElementById('widgetify-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'whatsapp-form':
      const waFormTitle = config.formTitle || 'Contact Us';
      const waFormFields = config.formFields || ['name', 'email', 'message'];
      const waFormMessage = config.formMessage || 'Hello! I would like to get in touch about...';
      const waNumber = (config.handle || '').replace(/[^0-9]/g, '');
      
      return `${baseStyles}
        <style>
          .whatsapp-form-field {
            width: 100%;
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
          }
          
          .whatsapp-form-field:focus {
            border-color: ${buttonColor};
            box-shadow: 0 0 0 2px ${buttonColor}20;
          }
          
          .whatsapp-form-button {
            width: 100%;
            padding: 14px 0;
            background: ${buttonColor};
            color: white;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .whatsapp-form-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${buttonColor}40;
          }
          
          .whatsapp-form-subtitle {
            margin: 16px 0 20px 0;
            color: #6b7280;
            font-size: 14px;
            text-align: center;
            line-height: 1.5;
          }
        </style>
        
        <div id="widgetify-whatsapp-form" class="widgetify-widget" onclick="toggleWidgetifyWhatsAppForm()" aria-label="Open WhatsApp form">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32zm-5.6 12.2c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.47.65.66-2.41-.16-.25a6.63 6.63 0 0 1-1.02-3.52 6.57 6.57 0 0 1 11.29-4.57 6.45 6.45 0 0 1 2 4.55 6.57 6.57 0 0 1-6.57 6.57l-.16.04zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.06-.31-.1-.44.1-.13.2-.5.64-.61.77-.11.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.59-.52-.99-1.17-1.1-1.37-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33-.11 0-.24-.02-.37-.02-.13 0-.34.05-.52.25-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2 .1.14 1.4 2.16 3.42 3.02.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.18-.12-.37-.21z" fill="white"/>
            <rect x="6" y="11" width="12" height="8" rx="1" stroke="white" stroke-width="1.5" fill="none"/>
            <path d="M9 14h6M9 16h4" stroke="white" stroke-width="1" stroke-linecap="round"/>
          </svg>
        </div>

        <div id="widgetify-whatsapp-form-popup" class="widgetify-popup" role="dialog" aria-labelledby="whatsapp-form-title">
          <div class="widgetify-header">
            <h3 id="whatsapp-form-title">${waFormTitle}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyWhatsAppForm()" aria-label="Close WhatsApp form">×</button>
          </div>
          
          <p class="whatsapp-form-subtitle">Fill out the form below and we'll get back to you on WhatsApp!</p>
          
          <form id="whatsapp-form" onsubmit="submitWhatsAppForm(event)">
            ${waFormFields.includes('name') ? `
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                required 
                class="whatsapp-form-field"
              >` : ''}
            
            ${waFormFields.includes('email') ? `
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                required 
                class="whatsapp-form-field"
              >` : ''}
            
            ${waFormFields.includes('phone') ? `
              <input 
                type="tel" 
                name="phone" 
                placeholder="Your Phone Number" 
                class="whatsapp-form-field"
              >` : ''}
            
            ${waFormFields.includes('message') ? `
              <textarea 
                name="message" 
                placeholder="Your Message" 
                required 
                rows="4" 
                class="whatsapp-form-field"
                style="resize: vertical; min-height: 80px;"
              ></textarea>` : ''}
            
            <button type="submit" class="whatsapp-form-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32z"/>
              </svg>
              Send via WhatsApp
            </button>
          </form>
          
          ${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyWhatsAppForm() {
            const popup = document.getElementById('widgetify-whatsapp-form-popup');
            popup.classList.toggle('show');
          }
          
          function submitWhatsAppForm(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            let message = '${waFormMessage}\\n\\n';
            
            ${waFormFields.includes('name') && `
              const name = formData.get('name');
              if (name) message += 'Name: ' + name + '\\n';
            `}
            
            ${waFormFields.includes('email') && `
              const email = formData.get('email');
              if (email) message += 'Email: ' + email + '\\n';
            `}
            
            ${waFormFields.includes('phone') && `
              const phone = formData.get('phone');
              if (phone) message += 'Phone: ' + phone + '\\n';
            `}
            
            ${waFormFields.includes('message') && `
              const userMessage = formData.get('message');
              if (userMessage) message += '\\nMessage: ' + userMessage;
            `}
            
            const whatsappUrl = 'https://wa.me/${waNumber}?text=' + encodeURIComponent(message);
            window.open(whatsappUrl, '_blank');
            
            // Reset form and close popup
            event.target.reset();
            toggleWidgetifyWhatsAppForm();
          }
        </script>`;

    case 'lead-capture-popup':
      const leadTitle = config.leadCaptureTitle || 'Get In Touch With Us!';
      const leadSubtitle = config.leadCaptureSubtitle || 'Leave your details and we\'ll contact you soon';
      const adminWhatsApp = (config.adminWhatsApp || '').replace(/[^0-9]/g, '');
      const popupDelay = (config.popupDelay || 5) * 1000; // Convert to milliseconds
      
      return `${baseStyles}
        <style>
          /* Lead Capture Popup Styles */
          .lead-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
          }
          
          .lead-popup-overlay.show {
            display: flex;
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .lead-popup-container {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 420px;
            width: 90%;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            position: relative;
            animation: slideUp 0.3s ease;
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .lead-popup-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            color: #9ca3af;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          
          .lead-popup-close:hover {
            background: #f3f4f6;
            color: #374151;
          }
          
          .lead-popup-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            margin-bottom: 8px;
            line-height: 1.2;
          }
          
          .lead-popup-subtitle {
            font-size: 16px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 24px;
            line-height: 1.4;
          }
          
          .lead-form-field {
            width: 100%;
            padding: 16px;
            margin-bottom: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            outline: none;
            transition: all 0.2s ease;
            font-family: inherit;
          }
          
          .lead-form-field:focus {
            border-color: ${buttonColor};
            box-shadow: 0 0 0 3px ${buttonColor}20;
          }
          
          .lead-form-button {
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, ${buttonColor} 0%, ${buttonColor}dd 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
          }
          
          .lead-form-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px ${buttonColor}40;
          }
          
          .lead-form-button:active {
            transform: translateY(0);
          }
          
          .lead-popup-footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          
          .lead-popup-footer a {
            color: #6b7280;
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
          }
          
          .lead-popup-footer a:hover {
            color: #374151;
          }
          
          /* Mobile Responsive */
          @media (max-width: 480px) {
            .lead-popup-container {
              padding: 24px;
              margin: 10px;
              border-radius: 12px;
            }
            
            .lead-popup-title {
              font-size: 20px;
            }
            
            .lead-popup-subtitle {
              font-size: 14px;
            }
            
            .lead-form-field {
              padding: 14px;
              font-size: 16px;
            }
            
            .lead-form-button {
              padding: 14px 20px;
            }
          }
        </style>

        <div id="lead-capture-overlay" class="lead-popup-overlay" onclick="closeLeadPopup(event)">
          <div class="lead-popup-container" onclick="event.stopPropagation()">
            <button class="lead-popup-close" onclick="closeLeadPopup()" aria-label="Close popup">×</button>
            
            <h2 class="lead-popup-title">${leadTitle}</h2>
            <p class="lead-popup-subtitle">${leadSubtitle}</p>
            
            <form id="lead-capture-form" onsubmit="submitLeadForm(event)">
              <input
                type="text"
                name="name"
                placeholder="Your Full Name *"
                required
                class="lead-form-field"
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number *"
                required
                class="lead-form-field"
              />
              
              <input
                type="text"
                name="address"
                placeholder="Your Address"
                class="lead-form-field"
              />
              
              <textarea
                name="message"
                placeholder="Your Message"
                rows="3"
                class="lead-form-field"
                style="resize: vertical; min-height: 80px;"
              ></textarea>
              
              <button type="submit" class="lead-form-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.95 7.95 0 0 0-6.9 12.07L4 20.02l4.05-1.06A8.02 8.02 0 0 0 12 20.02a7.98 7.98 0 0 0 8-7.93c0-2.12-.83-4.12-2.4-5.62V6.32z"/>
                </svg>
                Send My Details
              </button>
            </form>
            ${!removeBranding ? `
            <div class="lead-popup-footer">
              <a href="https://widgetify-two.vercel.app" target="_blank">Powered by Widgetify</a>
            </div>` : ''}
          </div>
        </div>

        <script>
          // Auto-show popup after delay
          setTimeout(function() {
            const popup = document.getElementById('lead-capture-overlay');
            if (popup && !localStorage.getItem('leadPopupShown')) {
              popup.classList.add('show');
            }
          }, ${popupDelay});

          function closeLeadPopup(event) {
            if (event && event.target !== event.currentTarget) return;
            const popup = document.getElementById('lead-capture-overlay');
            popup.classList.remove('show');
            localStorage.setItem('leadPopupShown', 'true');
          }

          function submitLeadForm(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const message = formData.get('message');
            
            let leadMessage = '🎯 *New Lead Captured!*\\n\\n';
            leadMessage += '👤 *Name:* ' + name + '\\n';
            leadMessage += '📱 *Phone:* ' + phone + '\\n';
            
            if (address) {
              leadMessage += '🏠 *Address:* ' + address + '\\n';
            }
            
            if (message) {
              leadMessage += '💬 *Message:* ' + message + '\\n';
            }
            
            leadMessage += '\\n⏰ *Time:* ' + new Date().toLocaleString();
            leadMessage += '\\n\\n_Generated via Widgetify Lead Capture_';
            
            const whatsappUrl = 'https://wa.me/${adminWhatsApp}?text=' + encodeURIComponent(leadMessage);
            window.open(whatsappUrl, '_blank');
            
            // Show success message and close popup
            alert('✅ Thank you! Your details have been sent successfully. We will contact you soon!');
            closeLeadPopup();
            
            // Reset form
            event.target.reset();
          }
          
          // Prevent showing popup if already shown in this session
          if (localStorage.getItem('leadPopupShown')) {
            // Optional: Clear after 24 hours
            const lastShown = localStorage.getItem('leadPopupShownTime');
            const now = new Date().getTime();
            if (!lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000) {
              localStorage.removeItem('leadPopupShown');
            }
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
          
          ${generateWatermark()}
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
  
  ${generateWatermark()}
  </div>

<script>
  function toggleWidgetifyPayment() {
    const popup = document.getElementById('widgetify-payment-popup');
    popup.classList.toggle('show');
  }
</script>`;

    case 'contact-form':
      const contactWhatsappNumber = whatsappNumber || '+1234567890';
      const contactBusinessName = businessName || 'Business';
      
      return `${baseStyles}
      <style>
        /* Contact Form Specific Styles */
        .contact-form-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        
        .contact-form-field:focus {
          border-color: ${buttonColor};
          box-shadow: 0 0 0 2px ${buttonColor}20;
        }
        
        .contact-form-button {
          width: 100%;
          padding: 14px 0;
          background: ${buttonColor};
          color: white;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .contact-form-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${buttonColor}40;
        }
        
        .contact-form-subtitle {
          margin: 16px 0 20px 0;
          color: #6b7280;
          font-size: 14px;
          text-align: center;
          line-height: 1.5;
        }
      </style>
      
        <div id="widgetify-contact" class="widgetify-widget" onclick="toggleWidgetifyContact()" aria-label="Contact us">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 7v6M12 17h.01"/>
          </svg>
        </div>

        <div id="widgetify-contact-popup" class="widgetify-popup" role="dialog" aria-labelledby="contact-title">
          <div class="widgetify-header">
            <h3 id="contact-title">Contact Us</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyContact()" aria-label="Close contact form">×</button>
          </div>
          
          <p class="contact-form-subtitle">Send us a message and we'll get back to you soon!</p>
          
          <form id="contact-form" onsubmit="submitContactForm(event)">
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
              class="contact-form-field"
            >
            
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
              class="contact-form-field"
            >
            
            <textarea 
              name="message" 
              placeholder="Your Message" 
              required 
              rows="4" 
              class="contact-form-field"
              style="resize: vertical; min-height: 80px;"
            ></textarea>
            
            <button type="submit" class="contact-form-button">
              📱 Send via WhatsApp
            </button>
          </form>

          <p class="upi-gateway-note">Your message will be sent directly to our WhatsApp<br>We typically respond within a few minutes</p>
          
          ${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyContact() {
            const popup = document.getElementById('widgetify-contact-popup');
            popup.classList.toggle('show');
          }
          
          function submitContactForm(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            const whatsappMessage = \`Hello ${contactBusinessName}!

👤 Name: \${name}
📧 Email: \${email}

💬 Message:
\${message}

---
Sent via ${contactBusinessName} Contact Form\`;
            
            const whatsappUrl = \`https://wa.me/${contactWhatsappNumber.replace(/[^0-9]/g, '')}?text=\${encodeURIComponent(whatsappMessage)}\`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form and close popup
            e.target.reset();
            toggleWidgetifyContact();
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
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
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyTranslate() {
            const popup = document.getElementById('widgetify-translate-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'countdown-timer':
        const targetDateTime = targetDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
        const timerTitle = title || 'Countdown Timer';
        const style = countdownStyle || 'digital';
        const showTimeLabels = showLabels !== false;

        const getStyleClasses = () => {
          switch (style) {
            case 'circular':
              return {
                container: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 30px;',
                title: 'color: white; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 30px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);',
                timeUnit: 'position: relative; margin: 0 10px;',
                circle: 'width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.3);',
                number: 'font-size: 20px; font-weight: 700; color: white; line-height: 1;',
                label: 'font-size: 10px; color: rgba(255,255,255,0.8); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;'
              };
            case 'minimal':
              return {
                container: 'background: #fafafa; border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px;',
                title: 'color: #333; font-size: 20px; font-weight: 500; text-align: center; margin-bottom: 25px; letter-spacing: -0.5px;',
                timeUnit: 'margin: 0 8px;',
                circle: 'background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px 8px; text-align: center; min-width: 60px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
                number: 'font-size: 18px; font-weight: 600; color: #333; line-height: 1;',
                label: 'font-size: 10px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.3px;'
              };
            case 'bold':
              return {
                container: 'background: linear-gradient(45deg, #ff6b6b, #ee5a24, #feca57); border-radius: 15px; padding: 25px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);',
                title: 'color: white; font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 25px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); text-transform: uppercase;',
                timeUnit: 'margin: 0 8px;',
                circle: 'background: rgba(255,255,255,0.95); border-radius: 12px; padding: 15px 10px; text-align: center; min-width: 70px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);',
                number: 'font-size: 22px; font-weight: 900; background: linear-gradient(45deg, #ff6b6b, #ee5a24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;',
                label: 'font-size: 10px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;'
              };
            default: // digital
              return {
                container: 'background: #000; border-radius: 10px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);',
                title: 'color: #00ff00; font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 25px; font-family: "Courier New", monospace; text-shadow: 0 0 10px #00ff00;',
                timeUnit: 'margin: 0 10px;',
                circle: 'background: #111; border: 2px solid #00ff00; border-radius: 8px; padding: 12px 8px; text-align: center; min-width: 65px; box-shadow: inset 0 0 10px rgba(0,255,0,0.2);',
                number: 'font-size: 20px; font-weight: 700; color: #00ff00; font-family: "Courier New", monospace; line-height: 1; text-shadow: 0 0 5px #00ff00;',
                label: 'font-size: 9px; color: #00aa00; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-family: "Courier New", monospace;'
              };
          }
        };

        const styles = getStyleClasses();

        return `
          <style>
            .widgetify-countdown {
              position: fixed;
              bottom: 20px;
              ${positionStyle}
              ${styles.container}
              z-index: 1000;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 400px;
              box-sizing: border-box;
            }

            .widgetify-countdown-title {
              ${styles.title}
            }

            .widgetify-countdown-timer {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              gap: 5px;
            }

            .widgetify-time-unit {
              ${styles.timeUnit}
            }

            .widgetify-time-circle {
              ${styles.circle}
            }

            .widgetify-time-number {
              ${styles.number}
            }

            .widgetify-time-label {
              ${styles.label}
              ${!showTimeLabels ? 'display: none;' : ''}
            }

            .widgetify-countdown.expired .widgetify-countdown-title {
              ${style === 'digital' ? 'color: #ff0000; text-shadow: 0 0 10px #ff0000;' : 'color: #ff4757;'}
            }

            @media (max-width: 480px) {
              .widgetify-countdown {
                bottom: 15px;
                ${position === 'left' ? 'left: 15px;' : 'right: 15px;'}
                max-width: calc(100vw - 30px);
                padding: 20px;
              }
              
              .widgetify-countdown-title {
                font-size: 18px !important;
                margin-bottom: 20px !important;
              }
              
              .widgetify-time-circle {
                ${style === 'circular' ? 'width: 60px !important; height: 60px !important;' : ''}
                min-width: 50px !important;
                padding: 10px 6px !important;
              }
              
              .widgetify-time-number {
                font-size: 16px !important;
              }
              
              .widgetify-time-unit {
                margin: 0 4px !important;
              }
            }
          </style>

          <div id="widgetify-countdown" class="widgetify-countdown">
            <div class="widgetify-countdown-title">${timerTitle}</div>
            <div class="widgetify-countdown-timer">
              <div class="widgetify-time-unit">
                <div class="widgetify-time-circle">
                  <div class="widgetify-time-number" id="days">00</div>
                  <div class="widgetify-time-label">Days</div>
                </div>
              </div>
              <div class="widgetify-time-unit">
                <div class="widgetify-time-circle">
                  <div class="widgetify-time-number" id="hours">00</div>
                  <div class="widgetify-time-label">Hours</div>
                </div>
              </div>
              <div class="widgetify-time-unit">
                <div class="widgetify-time-circle">
                  <div class="widgetify-time-number" id="minutes">00</div>
                  <div class="widgetify-time-label">Minutes</div>
                </div>
              </div>
              <div class="widgetify-time-unit">
                <div class="widgetify-time-circle">
                  <div class="widgetify-time-number" id="seconds">00</div>
                  <div class="widgetify-time-label">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          <script>
            (function() {
              const targetDate = new Date('${targetDateTime}').getTime();
              
              function updateCountdown() {
                const now = new Date().getTime();
                const timeLeft = targetDate - now;
                
                if (timeLeft < 0) {
                  document.getElementById('days').textContent = '00';
                  document.getElementById('hours').textContent = '00';
                  document.getElementById('minutes').textContent = '00';
                  document.getElementById('seconds').textContent = '00';
                  document.getElementById('widgetify-countdown').classList.add('expired');
                  document.querySelector('.widgetify-countdown-title').textContent = '${timerTitle.replace('Timer', 'Expired').replace('In', 'Now').replace('Ends', 'Ended')}';
                  return;
                }
                
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
              }
              
              updateCountdown();
              setInterval(updateCountdown, 1000);
            })();
          </script>
        `;

    case 'exit-intent-popup':
      return `
        <style>
          .exit-intent-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .exit-intent-overlay.show {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
          }

          .exit-intent-popup {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
            position: relative;
          }

          .exit-intent-overlay.show .exit-intent-popup {
            transform: scale(1);
          }

          .exit-intent-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .exit-intent-close:hover {
            color: #333;
          }

          .exit-intent-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
          }

          .exit-intent-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
          }

          .exit-intent-offer {
            background: ${buttonColor};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            display: inline-block;
          }

          .exit-intent-button {
            background: ${buttonColor};
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
          }

          .exit-intent-button:hover {
            transform: translateY(-2px);
          }

          @media (max-width: 640px) {
            .exit-intent-popup {
              padding: 25px;
              margin: 20px;
            }
            
            .exit-intent-title {
              font-size: 24px;
            }
          }
        </style>

        <div id="exit-intent-overlay" class="exit-intent-overlay" onclick="closeExitIntent(event)">
          <div class="exit-intent-popup">
            <button class="exit-intent-close" onclick="closeExitIntent()" aria-label="Close popup">×</button>
            <h2 class="exit-intent-title">${config.exitTitle || 'Wait! Don\'t Leave Yet!'}</h2>
            <p class="exit-intent-subtitle">${config.exitSubtitle || 'Get an exclusive offer before you go'}</p>
            <div class="exit-intent-offer">${config.exitOffer || '🎉 20% OFF Your First Order!'}</div>
            <a href="${config.exitActionUrl || '#'}" class="exit-intent-button" onclick="closeExitIntent()">${config.exitButtonText || 'Claim Offer Now'}</a>
          </div>
        </div>

        ${generateWatermark('position: fixed; bottom: 10px; left: 10px; z-index: 10001; font-size: 10px; opacity: 0.7;')}

        <script>
          (function() {
            let exitIntentTriggered = false;
            let mouseLeaveTimer;

            // Track mouse movement
            document.addEventListener('mouseleave', function(e) {
              // Only trigger if mouse leaves from the top of the page
              if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                showExitIntent();
              }
            });

            // Mobile: trigger on rapid scroll up
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', function() {
              const currentScrollY = window.scrollY;
              if (currentScrollY < lastScrollY - 100 && currentScrollY < 300 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                showExitIntent();
              }
              lastScrollY = currentScrollY;
            });

            function showExitIntent() {
              const overlay = document.getElementById('exit-intent-overlay');
              overlay.classList.add('show');
              document.body.style.overflow = 'hidden';
            }

            window.closeExitIntent = function(event) {
              if (event && event.target === event.currentTarget) return;
              const overlay = document.getElementById('exit-intent-overlay');
              overlay.classList.remove('show');
              document.body.style.overflow = '';
            };

            // Close with Escape key
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                closeExitIntent();
              }
            });
          })();
        </script>
      `;

    case 'sticky-banner':
      const bannerPosition = config.bannerPosition === 'bottom' ? 'bottom: 0;' : 'top: 0;';
      const bannerColors = {
        info: { bg: '#3b82f6', text: 'white' },
        warning: { bg: '#f59e0b', text: 'white' },
        success: { bg: '#10b981', text: 'white' },
        promo: { bg: buttonColor, text: 'white' }
      };
      const bannerStyle = bannerColors[config.bannerStyle || 'promo'];

      return `
        <style>
          .sticky-banner {
            position: fixed;
            ${bannerPosition}
            left: 0;
            right: 0;
            background: ${bannerStyle.bg};
            color: ${bannerStyle.text};
            padding: 12px 20px;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: translateY(0);
            transition: transform 0.3s ease;
          }

          .sticky-banner.hidden {
            transform: translateY(${config.bannerPosition === 'bottom' ? '100%' : '-100%'});
          }

          .banner-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .banner-text {
            font-size: 14px;
            font-weight: 500;
          }

          .banner-action {
            background: rgba(255, 255, 255, 0.2);
            color: ${bannerStyle.text};
            padding: 6px 12px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s;
          }

          .banner-action:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .banner-close {
            background: none;
            border: none;
            color: ${bannerStyle.text};
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
          }

          .banner-close:hover {
            opacity: 1;
          }

          @media (max-width: 640px) {
            .sticky-banner {
              padding: 10px 15px;
            }
            
            .banner-content {
              gap: 10px;
            }
            
            .banner-text {
              font-size: 13px;
            }
            
            .banner-action {
              font-size: 13px;
              padding: 5px 10px;
            }
          }

          /* Adjust body padding to prevent content overlap */
          body {
            ${config.bannerPosition === 'bottom' ? 'padding-bottom' : 'padding-top'}: 50px;
          }
        </style>

        <div id="sticky-banner" class="sticky-banner">
          <div class="banner-content">
            <span class="banner-text">${config.bannerText || '🎉 Special Offer: Get 20% OFF on all products!'}</span>
            ${config.bannerActionUrl && config.bannerActionText ? `
              <a href="${config.bannerActionUrl}" class="banner-action">${config.bannerActionText}</a>
            ` : ''}
            ${config.bannerDismissible !== false ? `
              <button class="banner-close" onclick="closeBanner()" aria-label="Close banner">×</button>
            ` : ''}
          </div>
        </div>

        ${generateWatermark(`position: fixed; ${config.bannerPosition === 'bottom' ? 'bottom: 60px;' : 'top: 60px;'} right: 10px; z-index: 10000; font-size: 10px; opacity: 0.7;`)}

        <script>
          window.closeBanner = function() {
            const banner = document.getElementById('sticky-banner');
            banner.classList.add('hidden');
            
            // Adjust body padding
            setTimeout(() => {
              document.body.style.${config.bannerPosition === 'bottom' ? 'paddingBottom' : 'paddingTop'} = '0';
            }, 300);
            
            // Store dismissed state
            localStorage.setItem('widgetify-banner-dismissed', 'true');
          };

          // Check if banner was previously dismissed
          if (localStorage.getItem('widgetify-banner-dismissed') === 'true') {
            document.getElementById('sticky-banner').classList.add('hidden');
            document.body.style.${config.bannerPosition === 'bottom' ? 'paddingBottom' : 'paddingTop'} = '0';
          }
        </script>
      `;

    case 'ai-chatbot':
      return `
        <style>
          .ai-chatbot-widget {
            position: fixed;
            bottom: 20px;
            ${positionStyle}
            width: ${widgetSize};
            height: ${widgetSize};
            background: ${buttonColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            z-index: 1000;
            border: none;
          }

          .ai-chatbot-widget:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }

          .ai-chatbot-popup {
            position: fixed;
            bottom: ${parseInt(widgetSize) + 30}px;
            ${positionStyle}
            width: 350px;
            max-width: 90vw;
            height: 500px;
            max-height: 70vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            z-index: 999;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .ai-chatbot-popup.show {
            display: flex;
          }

          .ai-chatbot-header {
            background: ${buttonColor};
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .ai-chatbot-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .ai-chatbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ai-chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .ai-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
          }

          .ai-message.bot {
            background: #f3f4f6;
            color: #374151;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
          }

          .ai-message.user {
            background: ${buttonColor};
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
          }

          .ai-message.typing {
            background: #f3f4f6;
            color: #6b7280;
            align-self: flex-start;
          }

          .ai-chatbot-input-area {
            padding: 15px 20px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
            align-items: flex-end;
          }

          .ai-chatbot-input {
            flex: 1;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 14px;
            resize: none;
            max-height: 100px;
            min-height: 40px;
            outline: none;
          }

          .ai-chatbot-input:focus {
            border-color: ${buttonColor};
          }

          .ai-chatbot-send {
            background: ${buttonColor};
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .ai-chatbot-send:hover {
            transform: scale(1.05);
          }

          .ai-chatbot-send:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }

          @media (max-width: 640px) {
            .ai-chatbot-popup {
              width: 95vw;
              height: 80vh;
              bottom: 20px;
              left: 50% !important;
              right: auto !important;
              transform: translateX(-50%);
            }
          }
        </style>

        <div class="ai-chatbot-widget" onclick="toggleAiChatbot()" aria-label="Open AI Chat">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15L12 15l7.35-6.15c.42.97.65 2.03.65 3.15 0 4.41-3.59 8-8 8z"/>
          </svg>
        </div>

        <div id="ai-chatbot-popup" class="ai-chatbot-popup">
          <div class="ai-chatbot-header">
            <h3>${config.chatbotName || 'AI Assistant'}</h3>
            <button class="ai-chatbot-close" onclick="toggleAiChatbot()" aria-label="Close chat">×</button>
          </div>
          
          <div id="ai-chatbot-messages" class="ai-chatbot-messages">
            <div class="ai-message bot">
              ${config.chatbotWelcome || 'Hello! I\'m your AI assistant. How can I help you today?'}
            </div>
          </div>
          
          <div class="ai-chatbot-input-area">
            <textarea 
              id="ai-chatbot-input" 
              class="ai-chatbot-input" 
              placeholder="${config.chatbotPlaceholder || 'Type your message...'}"
              rows="1"
            ></textarea>
            <button id="ai-chatbot-send" class="ai-chatbot-send" onclick="sendAiMessage()" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>

        ${generateWatermark(`position: fixed; bottom: 10px; ${position === 'left' ? 'right' : 'left'}: 10px; z-index: 998; font-size: 10px; opacity: 0.7;`)}

        <script>
          const PERPLEXITY_API_KEY = '${config.perplexityApiKey || ''}';
          const CHATBOT_MODEL = '${config.chatbotModel || 'llama-3.1-sonar-small-128k-online'}';
          
          window.toggleAiChatbot = function() {
            const popup = document.getElementById('ai-chatbot-popup');
            popup.classList.toggle('show');
            if (popup.classList.contains('show')) {
              document.getElementById('ai-chatbot-input').focus();
            }
          };

          window.sendAiMessage = async function() {
            const input = document.getElementById('ai-chatbot-input');
            const sendBtn = document.getElementById('ai-chatbot-send');
            const message = input.value.trim();
            
            if (!message) return;

            if (!PERPLEXITY_API_KEY) {
              addAiMessage('bot', 'Sorry, the AI chatbot requires an API key to function. Please configure your Perplexity API key.');
              return;
            }

            // Add user message
            addAiMessage('user', message);
            input.value = '';
            sendBtn.disabled = true;
            
            // Add typing indicator
            const typingId = addAiMessage('bot', 'AI is thinking...', 'typing');
            
            try {
              const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': \`Bearer \${PERPLEXITY_API_KEY}\`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: CHATBOT_MODEL,
                  messages: [
                    {
                      role: 'system',
                      content: 'You are a helpful AI assistant. Be concise and helpful in your responses.'
                    },
                    {
                      role: 'user',
                      content: message
                    }
                  ],
                  temperature: 0.2,
                  top_p: 0.9,
                  max_tokens: 1000,
                  return_images: false,
                  return_related_questions: false,
                  frequency_penalty: 1,
                  presence_penalty: 0
                }),
              });
              
              if (!response.ok) {
                throw new Error('Failed to get AI response');
              }
              
              const data = await response.json();
              const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
              
              // Remove typing indicator and add response
              removeAiMessage(typingId);
              addAiMessage('bot', aiResponse);
              
            } catch (error) {
              console.error('AI Chat Error:', error);
              removeAiMessage(typingId);
              addAiMessage('bot', 'Sorry, I encountered an error. Please try again later.');
            } finally {
              sendBtn.disabled = false;
            }
          };

          function addAiMessage(sender, text, className = '') {
            const messages = document.getElementById('ai-chatbot-messages');
            const messageDiv = document.createElement('div');
            const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            messageDiv.id = messageId;
            messageDiv.className = \`ai-message \${sender} \${className}\`;
            messageDiv.textContent = text;
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
            return messageId;
          }

          function removeAiMessage(messageId) {
            const message = document.getElementById(messageId);
            if (message) {
              message.remove();
            }
          }

          // Handle Enter key
          document.getElementById('ai-chatbot-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendAiMessage();
            }
          });

          // Auto-resize textarea
          document.getElementById('ai-chatbot-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
          });
        </script>
      `;

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
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyPopup() {
            const popup = document.getElementById('widgetify-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'print-page':
      return `${baseStyles}
        <div id="widgetify-print" class="widgetify-widget" onclick="window.print()" aria-label="Print this page">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3h10v4H7V3zm13 5h-3V7H7v1H4a2 2 0 00-2 2v6h4v4h12v-4h4v-6a2 2 0 00-2-2zm-5 10H9v-4h6v4z"/>
          </svg>
        </div>`;

    case 'scroll-progress':
      return `${baseStyles}
        <style>
          #widgetify-scroll-progress{position:fixed;top:0;left:0;height:4px;background:${buttonColor};width:0%;z-index:99999}
        </style>
        <div id="widgetify-scroll-progress" role="progressbar" aria-label="Scroll progress"></div>
        <div id="widgetify-progress-btn" class="widgetify-widget" aria-label="Scroll progress">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20a8 8 0 108-8 8.009 8.009 0 00-8 8zm1-13h-2v7h6v-2h-4z"/>
          </svg>
        </div>
        <script>
          function widgetifyUpdateProgress(){
            const doc=document.documentElement; const body=document.body;
            const winScroll=doc.scrollTop||body.scrollTop; const height=doc.scrollHeight-doc.clientHeight;
            const scrolled=height? (winScroll/height)*100 : 0; const bar=document.getElementById('widgetify-scroll-progress');
            if(bar) bar.style.width=scrolled+'%';
          }
          window.addEventListener('scroll', widgetifyUpdateProgress, { passive: true });
          window.addEventListener('load', widgetifyUpdateProgress);
        </script>`;

    case 'cookie-consent':
      return `${baseStyles}
        <div id="widgetify-consent" style="position:fixed;left:20px;right:20px;bottom:20px;max-width:760px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);display:none;z-index:10000">
          <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
            <div style="font-size:14px;color:#374151;line-height:1.5;flex:1 1 auto;min-width:200px;">${config.consentMessage || 'We use cookies to personalize content and analyze traffic.'}</div>
            <div style="display:flex;gap:8px;flex-shrink:0">
              <button onclick="widgetifyAcceptCookies()" style="background:${buttonColor};color:#fff;padding:8px 12px;border:none;border-radius:8px;cursor:pointer;font-weight:600">Accept</button>
              <button onclick="document.getElementById('widgetify-consent').style.display='none'" style="background:#f3f4f6;color:#374151;padding:8px 12px;border:none;border-radius:8px;cursor:pointer;font-weight:500">Later</button>
            </div>
          </div>
        </div>
        <div id="widgetify-consent-btn" class="widgetify-widget" onclick="document.getElementById('widgetify-consent').style.display='block'" aria-label="Cookie settings">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 109.95 8.89 3 3 0 01-3.4-3.4A10 10 0 0012 2zm-3 9a1 1 0 11-1-1 1 1 0 011 1zm3 4a1 1 0 11-1-1 1 1 0 011 1zm4-3a1 1 0 11-1-1 1 1 0 011 1z"/></svg>
        </div>
        <script>
          function widgetifyAcceptCookies(){
            try{localStorage.setItem('widgetify_cookie_consent','true');}catch(e){}
            const el=document.getElementById('widgetify-consent'); if(el) el.style.display='none';
          }
          (function(){
            let accepted=false; try{accepted=localStorage.getItem('widgetify_cookie_consent')==='true';}catch(e){}
            if(!accepted){ const el=document.getElementById('widgetify-consent'); if(el) el.style.display='block'; }
          })();
        </script>`;

    case 'age-verification':
      return `${baseStyles}
        <div id="widgetify-age-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:10000">
          <div style="background:#fff;border-radius:12px;padding:20px;width:90%;max-width:420px;text-align:center;border:1px solid #e5e7eb">
            <h3 style="margin:0 0 8px 0;font-size:18px;color:#111827;font-weight:700">Age Verification</h3>
            <p style="margin:0 0 12px 0;font-size:14px;color:#374151">You must be ${config.ageMinimum || 18}+ to enter this site.</p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:8px;flex-wrap:wrap">
              <button onclick="widgetifyConfirmAge(true)" style="background:${buttonColor};color:#fff;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;font-weight:600">I am ${config.ageMinimum || 18}+</button>
              <button onclick="widgetifyConfirmAge(false)" style="background:#ef4444;color:#fff;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;font-weight:600">Exit</button>
            </div>
          </div>
        </div>
        <div id="widgetify-age-btn" class="widgetify-widget" onclick="document.getElementById('widgetify-age-overlay').style.display='flex'" aria-label="Age verification">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4zm0 6a2 2 0 102 2 2 2 0 00-2-2zm0 10a7 7 0 004-6H8a7 7 0 004 6z"/></svg>
        </div>
        <script>
          function widgetifyConfirmAge(ok){
            if(ok){ try{localStorage.setItem('widgetify_age_verified','true');}catch(e){}; const el=document.getElementById('widgetify-age-overlay'); if(el) el.style.display='none'; }
            else { try{history.back();}catch(e){} }
          }
          (function(){
            let verified=false; try{verified=localStorage.getItem('widgetify_age_verified')==='true';}catch(e){}
            if(!verified){ const el=document.getElementById('widgetify-age-overlay'); if(el) el.style.display='flex'; }
          })();
        </script>`;

    case 'pdf-viewer':
      return `${baseStyles}
        <div id="widgetify-pdf" class="widgetify-widget" onclick="toggleWidgetifyPdf()" aria-label="Open PDF viewer">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm1 7V3.5L19.5 9H15z"/></svg>
        </div>
        <div id="widgetify-pdf-popup" class="widgetify-popup" role="dialog" aria-labelledby="pdf-title" style="width: 480px; max-width: 95vw; height: auto;">
          <div class="widgetify-header">
            <h3 id="pdf-title">PDF Viewer</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyPdf()" aria-label="Close PDF">×</button>
          </div>
          <div class="widgetify-content" style="padding:0;">
            <iframe src="${config.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}" title="PDF Document" style="width:100%;height:480px;border:0;"></iframe>
          </div>${generateWatermark()}
        </div>
        <script>
          function toggleWidgetifyPdf(){ const p=document.getElementById('widgetify-pdf-popup'); if(p) p.classList.toggle('show'); }
        </script>`;

    case 'floating-video': {
      const url = config.videoUrl || '';
      const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      const embedUrl = ytMatch ? `https://www.youtube.com/embed/${'${ytMatch[1]}'}` : '';
      const isMp4 = /\.mp4($|\?)/.test(url);
      const inner = embedUrl
        ? `<iframe width="100%" height="240" src="${'${embedUrl}'}" title="Video" frameborder="0" allowfullscreen style="border:0"></iframe>`
        : (isMp4 ? `<video src="${'${url}'}" controls style="width:100%;height:auto;border-radius:8px"></video>` : `<div style="padding:20px;text-align:center;color:#6b7280">Provide a YouTube or MP4 URL.</div>`);
      return `${baseStyles}
        <div id="widgetify-video" class="widgetify-widget" onclick="toggleWidgetifyVideo()" aria-label="Open video">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5L22 18V6l-5 4.5z"/></svg>
        </div>
        <div id="widgetify-video-popup" class="widgetify-popup" role="dialog" aria-labelledby="video-title" style="width: 420px; max-width: 95vw; height: auto;">
          <div class="widgetify-header">
            <h3 id="video-title">Floating Video</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyVideo()" aria-label="Close video">×</button>
          </div>
          <div class="widgetify-content" style="padding:0;">${'${inner}'}</div>${generateWatermark()}
        </div>
        <script>
          function toggleWidgetifyVideo(){ const p=document.getElementById('widgetify-video-popup'); if(p) p.classList.toggle('show'); }
        </script>`;
    }

    case 'spotify-embed': {
      const getSpotifyEmbedUrl = (url: string) => {
        if (!url) return '';
        const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
        if (spotifyMatch) {
          const [, type, id] = spotifyMatch;
          return `https://open.spotify.com/embed/${type}/${id}`;
        }
        return '';
      };

      const embedUrl = getSpotifyEmbedUrl(config.spotifyUrl || '');
      const innerContent = embedUrl
        ? '<iframe src="' + embedUrl + '" width="100%" height="' + (config.height || '352') + '" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius: 0 0 10px 10px;"></iframe>'
        : '<div style="padding: 40px; text-align: center; background: #191414; color: white; border-radius: 0 0 10px 10px;"><div style="width: 60px; height: 60px; background: #1db954; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;"><svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.871 7.077-.496 9.713 1.115.293.18.386.563.206.857zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.518-.125-.413.106-.849.518-.973 3.632-1.102 8.147-.568 11.238 1.327.366.226.481.706.255 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.166-.62-.149-.493.129-1.016.621-1.166 3.532-1.073 9.404-.865 13.115 1.338.445.264.590.837.326 1.282-.264.444-.838.590-1.282.325z"/></svg></div><h3 style="margin: 0 0 10px 0; color: white;">No Music Selected</h3><p style="margin: 0; color: #b3b3b3; font-size: 14px;">Add a Spotify URL to display music here</p></div>';

      return `${baseStyles}
        <div id="widgetify-spotify" class="widgetify-widget" onclick="toggleWidgetifySpotify()" aria-label="Open Spotify Player">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.871 7.077-.496 9.713 1.115.293.18.386.563.206.857zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.518-.125-.413.106-.849.518-.973 3.632-1.102 8.147-.568 11.238 1.327.366.226.481.706.255 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.166-.62-.149-.493.129-1.016.621-1.166 3.532-1.073 9.404-.865 13.115 1.338.445.264.590.837.326 1.282-.264.444-.838.590-1.282.325z"/>
          </svg>
        </div>

        <div id="widgetify-spotify-popup" class="widgetify-popup" role="dialog" aria-labelledby="spotify-title" style="width: 400px; height: auto;">
          <div class="widgetify-header">
            <h3 id="spotify-title">Spotify Music Player</h3>
            <button class="widgetify-close" onclick="toggleWidgetifySpotify()" aria-label="Close player">×</button>
          </div>
          <div class="widgetify-content" style="padding: 0;">
            ${innerContent}
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifySpotify() {
            const popup = document.getElementById('widgetify-spotify-popup');
            popup.classList.toggle('show');
          }
        </script>`;
    }

    case 'ai-seo-listing': {
      const { seoKeywords = '', seoDescription = '', businessType = 'local', targetLocation = '', businessUrl = '' } = config;
      
      return `
        <div class="widgetify-widget" id="widgetify-seo-widget" onclick="toggleWidgetifySeo()">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        <div class="widgetify-popup" id="widgetify-seo-popup">
          <div class="widgetify-popup-header">
            <h3>🚀 AI SEO Listing Generator</h3>
            <span class="widgetify-close" onclick="toggleWidgetifySeo()">&times;</span>
          </div>
          <div class="widgetify-popup-content">
            <div class="seo-section">
              <h4>🎯 SEO Analysis</h4>
              <div class="seo-item">
                <strong>Target Keywords:</strong> ${seoKeywords || 'Not specified'}
              </div>
              <div class="seo-item">
                <strong>Business Type:</strong> ${businessType.charAt(0).toUpperCase() + businessType.slice(1)}
              </div>
              <div class="seo-item">
                <strong>Location:</strong> ${targetLocation || 'Global'}
              </div>
            </div>
            
            <div class="seo-section">
              <h4>📝 Generated SEO Content</h4>
              <div class="seo-content">
                <div class="seo-title">
                  <strong>Title:</strong> ${seoKeywords ? `${seoKeywords} - Best ${businessType} Services` : 'Professional Services'} ${targetLocation ? `in ${targetLocation}` : ''}
                </div>
                <div class="seo-description">
                  <strong>Description:</strong> ${seoDescription || `Expert ${businessType} services ${targetLocation ? `in ${targetLocation}` : 'worldwide'}. ${seoKeywords ? `Specializing in ${seoKeywords.toLowerCase()}.` : ''} Contact us for professional solutions and exceptional results.`}
                </div>
              </div>
            </div>

            <div class="seo-section">
              <h4>🔗 Quick Actions</h4>
              <div class="seo-actions">
                <button onclick="copySeoContent()" class="seo-button">📋 Copy SEO Content</button>
                ${businessUrl ? `<a href="${businessUrl}" target="_blank" class="seo-button">🌐 Visit Website</a>` : ''}
                <button onclick="generateNewSeo()" class="seo-button">🔄 Regenerate</button>
              </div>
            </div>
          </div>
          
          ${generateWatermark()}
        </div>

        <style>
          .seo-section {
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .seo-section h4 {
            margin: 0 0 10px 0;
            color: #4CAF50;
            font-size: 14px;
          }
          
          .seo-item, .seo-title, .seo-description {
            margin: 8px 0;
            padding: 8px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            font-size: 12px;
            line-height: 1.4;
          }
          
          .seo-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .seo-button {
            padding: 8px 12px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
          }
          
          .seo-button:hover {
            transform: translateY(-1px);
            background: linear-gradient(135deg, #45a049, #4CAF50);
          }
        </style>

        <script>
          function toggleWidgetifySeo() {
            const popup = document.getElementById('widgetify-seo-popup');
            popup.classList.toggle('show');
          }
          
          function copySeoContent() {
            const title = document.querySelector('.seo-title').textContent;
            const description = document.querySelector('.seo-description').textContent;
            const content = title + '\\n\\n' + description;
            
            navigator.clipboard.writeText(content).then(() => {
              alert('✅ SEO content copied to clipboard!');
            }).catch(() => {
              alert('❌ Failed to copy content');
            });
          }
          
          function generateNewSeo() {
            // Simple regeneration simulation
            const keywords = ['${seoKeywords}', 'professional', 'expert', 'quality', 'reliable'];
            const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
            const titleEl = document.querySelector('.seo-title');
            if (titleEl) {
              titleEl.innerHTML = '<strong>Title:</strong> ' + randomKeyword.charAt(0).toUpperCase() + randomKeyword.slice(1) + ' ${businessType} Services ${targetLocation ? `in ${targetLocation}` : ''}';
            }
            alert('🔄 New SEO content generated!');
          }
          }
        </script>`;
    }

    case 'trust-badge':
      const badges = config.trustBadges || ['ssl', 'payment', 'privacy'];
      const badgeStyle = config.badgeStyle || 'minimal';
      const badgeIcons = {
        ssl: '<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/>',
        payment: '<path d="M2 3h20v4H2V3zm0 6v10a1 1 0 001 1h18a1 1 0 001-1V9H2zm3 5h3v2H5v-2z"/>',
        privacy: '<path d="M12 1l9 4v7c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V5l9-4z"/>',
        security: '<path d="M12 2a10 10 0 110 20 10 10 0 010-20zm-1 7v4h2V9h-2zm0-3v1h2V6h-2z"/>',
        guarantee: '<path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z"/>'
      };

      return `${baseStyles}
        <div id="widgetify-trust" class="widgetify-widget" onclick="toggleWidgetifyTrust()" aria-label="Trust badges">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            ${badgeIcons.ssl}
          </svg>
        </div>

        <div id="widgetify-trust-popup" class="widgetify-popup" role="dialog" aria-labelledby="trust-title" style="width: 350px; max-width: 95vw;">
          <div class="widgetify-header">
            <h3 id="trust-title">🔐 Trust & Security</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyTrust()" aria-label="Close trust badges">×</button>
          </div>
          <div class="widgetify-content">
            <div class="trust-badges">
              ${badges.map(badge => `
                <div class="trust-badge ${badgeStyle}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="${primaryColor}">
                    ${badgeIcons[badge as keyof typeof badgeIcons] || badgeIcons.ssl}
                  </svg>
                  <div class="trust-text">
                    <strong>${badge.charAt(0).toUpperCase() + badge.slice(1)} Protected</strong>
                    ${badgeStyle === 'detailed' ? '<small>Your data is secure with us</small>' : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>${generateWatermark()}
        </div>

        <style>
          .trust-badges { display: grid; gap: 12px; }
          .trust-badge { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 8px; border: 1px solid #e5e7eb; }
          .trust-badge.minimal { padding: 8px; }
          .trust-badge.colorful { background: linear-gradient(135deg, ${primaryColor}20, transparent); }
          .trust-text { flex: 1; }
          .trust-text strong { display: block; font-weight: 600; color: #1f2937; }
          .trust-text small { font-size: 12px; color: #6b7280; }
        </style>

        <script>
          function toggleWidgetifyTrust() {
            const popup = document.getElementById('widgetify-trust-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'email-signature-generator':
      return `${baseStyles}
        <div id="widgetify-signature" class="widgetify-widget" onclick="toggleWidgetifySignature()" aria-label="Generate email signature">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.7l-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
          </svg>
        </div>

        <div id="widgetify-signature-popup" class="widgetify-popup" role="dialog" aria-labelledby="signature-title" style="width: 450px; max-width: 95vw;">
          <div class="widgetify-header">
            <h3 id="signature-title">✉️ Email Signature Generator</h3>
            <button class="widgetify-close" onclick="toggleWidgetifySignature()" aria-label="Close signature generator">×</button>
          </div>
          <div class="widgetify-content">
            <div class="signature-preview ${config.signatureStyle || 'professional'}">
              <div class="signature-name">${config.fullName || 'Your Name'}</div>
              <div class="signature-title">${config.jobTitle || 'Your Job Title'}</div>
              <div class="signature-company">${config.companyName || 'Company Name'}</div>
              ${config.companyWebsite ? `<div class="signature-website"><a href="${config.companyWebsite}" style="color: ${primaryColor}">${config.companyWebsite}</a></div>` : ''}
              ${config.socialLinks?.length ? `
                <div class="signature-social">
                  ${config.socialLinks.map(link => `<a href="${link.url}" style="color: ${primaryColor}; margin-right: 10px;">${link.platform}</a>`).join('')}
                </div>
              ` : ''}
            </div>
            <button onclick="copySignature()" style="width: 100%; padding: 12px; background: ${primaryColor}; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 15px;">📋 Copy Signature</button>
          </div>${generateWatermark()}
        </div>

        <style>
          .signature-preview { padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-family: Arial, sans-serif; }
          .signature-preview.professional .signature-name { font-size: 18px; font-weight: 600; color: #1f2937; }
          .signature-preview.modern { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
          .signature-preview.creative { background: linear-gradient(135deg, ${primaryColor}10, transparent); }
          .signature-title { font-size: 14px; color: #6b7280; margin-top: 2px; }
          .signature-company { font-size: 14px; font-weight: 500; color: #374151; margin-top: 4px; }
          .signature-website { font-size: 13px; margin-top: 6px; }
          .signature-social { margin-top: 8px; font-size: 12px; }
        </style>

        <script>
          function toggleWidgetifySignature() {
            const popup = document.getElementById('widgetify-signature-popup');
            popup.classList.toggle('show');
          }

          function copySignature() {
            const preview = document.querySelector('.signature-preview');
            const range = document.createRange();
            range.selectNode(preview);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            try {
              document.execCommand('copy');
              alert('📧 Email signature copied to clipboard!');
            } catch (err) {
              alert('❌ Failed to copy signature');
            }
            window.getSelection().removeAllRanges();
          }
        </script>`;

    case 'holiday-countdown':
      const holidayName = config.holidayName || 'Christmas';
      const holidayDate = config.holidayDate || '2024-12-25';
      return `${baseStyles}
        <div id="widgetify-holiday" class="widgetify-widget" onclick="toggleWidgetifyHoliday()" aria-label="Holiday countdown">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.77 5.82 22 7 13.87 2 9l6.91-.74L12 2z"/>
          </svg>
        </div>

        <div id="widgetify-holiday-popup" class="widgetify-popup" role="dialog" aria-labelledby="holiday-title" style="width: 380px; max-width: 95vw;">
          <div class="widgetify-header">
            <h3 id="holiday-title">🎄 ${holidayName} Countdown</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyHoliday()" aria-label="Close countdown">×</button>
          </div>
          <div class="widgetify-content">
            <div id="holiday-timer" class="holiday-timer">
              <div class="time-unit"><span id="days">00</span><label>Days</label></div>
              <div class="time-unit"><span id="hours">00</span><label>Hours</label></div>
              <div class="time-unit"><span id="minutes">00</span><label>Minutes</label></div>
              <div class="time-unit"><span id="seconds">00</span><label>Seconds</label></div>
            </div>
            <p style="text-align: center; margin-top: 15px; color: #6b7280;">${config.holidayMessage || `Time until ${holidayName}!`}</p>
          </div>${generateWatermark()}
        </div>

        <style>
          .holiday-timer { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center; }
          .time-unit span { display: block; font-size: 24px; font-weight: 700; color: ${primaryColor}; background: rgba(0,0,0,0.05); padding: 15px 10px; border-radius: 8px; }
          .time-unit label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        </style>

        <script>
          function toggleWidgetifyHoliday() {
            const popup = document.getElementById('widgetify-holiday-popup');
            popup.classList.toggle('show');
          }

          function updateHolidayCountdown() {
            const target = new Date('${holidayDate}').getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);

              document.getElementById('days').textContent = days.toString().padStart(2, '0');
              document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
              document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
              document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }
          }

          setInterval(updateHolidayCountdown, 1000);
          updateHolidayCountdown();
        </script>`;

    case 'flash-sale-banner':
      return `${baseStyles}
        <div id="widgetify-flash-banner" style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #ff4757, #ff3742); color: white; padding: 12px; text-align: center; z-index: 10000; box-shadow: 0 2px 10px rgba(255,71,87,0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
            <div style="flex: 1;">
              <span style="font-weight: 700; font-size: 16px;">⚡ ${config.saleTitle || 'FLASH SALE'}</span>
              <span style="margin-left: 15px; font-size: 14px;">${config.saleDiscount || '50% OFF'} - Limited Time!</span>
            </div>
            <div id="flash-countdown" style="display: flex; gap: 10px; align-items: center; margin: 0 20px;">
              <span style="font-size: 14px; opacity: 0.9;">Ends in:</span>
              <span id="flash-timer" style="font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">00:00:00</span>
            </div>
            <div>
              <a href="${config.saleCtaUrl || '#'}" style="background: white; color: #ff4757; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 14px;">${config.saleCtaText || 'Shop Now'}</a>
              <button onclick="document.getElementById('widgetify-flash-banner').style.display='none'" style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer; font-size: 18px;">×</button>
            </div>
          </div>
        </div>

        <script>
          function updateFlashTimer() {
            const end = new Date('${config.saleEndTime || new Date(Date.now() + 24*60*60*1000).toISOString()}').getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff > 0) {
              const hours = Math.floor(diff / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);
              document.getElementById('flash-timer').textContent = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            } else {
              document.getElementById('widgetify-flash-banner').style.display = 'none';
            }
          }
          setInterval(updateFlashTimer, 1000);
          updateFlashTimer();
        </script>`;

    case 'seasonal-greeting':
      const greetingType = config.greetingType || 'christmas';
      const greetings = {
        christmas: { emoji: '🎄', text: 'Merry Christmas!', bg: 'linear-gradient(135deg, #d73527, #e74c3c)' },
        'new-year': { emoji: '🎆', text: 'Happy New Year!', bg: 'linear-gradient(135deg, #f39c12, #e67e22)' },
        halloween: { emoji: '🎃', text: 'Happy Halloween!', bg: 'linear-gradient(135deg, #e67e22, #d35400)' },
        easter: { emoji: '🐰', text: 'Happy Easter!', bg: 'linear-gradient(135deg, #9b59b6, #8e44ad)' },
        thanksgiving: { emoji: '🦃', text: 'Happy Thanksgiving!', bg: 'linear-gradient(135deg, #e67e22, #d35400)' },
        valentine: { emoji: '💝', text: 'Happy Valentine\'s Day!', bg: 'linear-gradient(135deg, #e91e63, #ad1457)' }
      };
      const greeting = greetings[greetingType as keyof typeof greetings] || greetings.christmas;

      return `${baseStyles}
        <div id="widgetify-greeting" class="widgetify-widget" onclick="toggleWidgetifyGreeting()" aria-label="Seasonal greeting">
          <span style="font-size: 24px;">${greeting.emoji}</span>
        </div>

        <div id="widgetify-greeting-popup" class="widgetify-popup" role="dialog" aria-labelledby="greeting-title" style="width: 320px; max-width: 95vw; background: ${greeting.bg}; color: white; border: none;">
          <div class="widgetify-header" style="border-bottom: 1px solid rgba(255,255,255,0.2); color: white;">
            <h3 id="greeting-title">${greeting.text}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyGreeting()" aria-label="Close greeting" style="color: white;">×</button>
          </div>
          <div class="widgetify-content">
            <div style="text-align: center; padding: 20px 0;">
              <div style="font-size: 60px; margin-bottom: 15px;">${greeting.emoji}</div>
              <h2 style="margin: 0 0 10px 0; color: white;">${greeting.text}</h2>
              <p style="margin: 0; opacity: 0.9; font-size: 14px;">${config.customGreeting || 'Wishing you joy and happiness!'}</p>
            </div>
          </div>${generateWatermark('border-top: 1px solid rgba(255,255,255,0.2);')}
        </div>

        <script>
          function toggleWidgetifyGreeting() {
            const popup = document.getElementById('widgetify-greeting-popup');
            popup.classList.toggle('show');
          }
        </script>`;

    case 'black-friday-timer':
      return `${baseStyles}
        <div id="widgetify-blackfriday" class="widgetify-widget" onclick="toggleWidgetifyBlackFriday()" aria-label="Black Friday timer" style="background: linear-gradient(135deg, #000, #333);">
          <span style="font-size: 16px; font-weight: bold; color: #ff6b6b;">BF</span>
        </div>

        <div id="widgetify-blackfriday-popup" class="widgetify-popup" role="dialog" aria-labelledby="bf-title" style="width: 400px; max-width: 95vw; background: linear-gradient(135deg, #000, #1a1a1a); color: white; border: 2px solid #ff6b6b;">
          <div class="widgetify-header" style="background: #ff6b6b; color: white;">
            <h3 id="bf-title">🖤 ${config.blackFridayTitle || 'BLACK FRIDAY DEALS'}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyBlackFriday()" aria-label="Close Black Friday timer" style="color: white;">×</button>
          </div>
          <div class="widgetify-content">
            <div style="text-align: center; padding: 20px 0;">
              <div style="font-size: 48px; margin-bottom: 15px;">🛍️</div>
              <h2 style="margin: 0 0 10px 0; color: #ff6b6b;">${config.blackFridayOffer || 'UP TO 70% OFF!'}</h2>
              <p style="margin: 0 0 20px 0; opacity: 0.9;">Don't miss out on our biggest sale of the year!</p>
              
              <div id="bf-timer" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;">
                <div class="bf-time-unit">
                  <span id="bf-days" style="display: block; font-size: 24px; font-weight: 700; color: #ff6b6b;">00</span>
                  <label style="font-size: 12px; opacity: 0.8;">DAYS</label>
                </div>
                <div class="bf-time-unit">
                  <span id="bf-hours" style="display: block; font-size: 24px; font-weight: 700; color: #ff6b6b;">00</span>
                  <label style="font-size: 12px; opacity: 0.8;">HOURS</label>
                </div>
                <div class="bf-time-unit">
                  <span id="bf-minutes" style="display: block; font-size: 24px; font-weight: 700; color: #ff6b6b;">00</span>
                  <label style="font-size: 12px; opacity: 0.8;">MINS</label>
                </div>
                <div class="bf-time-unit">
                  <span id="bf-seconds" style="display: block; font-size: 24px; font-weight: 700; color: #ff6b6b;">00</span>
                  <label style="font-size: 12px; opacity: 0.8;">SECS</label>
                </div>
              </div>
              
              <button onclick="window.open('#', '_blank')" style="background: #ff6b6b; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-weight: 700; cursor: pointer; font-size: 16px; margin-top: 10px;">🛒 SHOP NOW</button>
            </div>
          </div>${generateWatermark('background: #ff6b6b;')}
        </div>

        <style>
          .bf-time-unit { text-align: center; background: rgba(255,107,107,0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,107,107,0.3); }
        </style>

        <script>
          function toggleWidgetifyBlackFriday() {
            const popup = document.getElementById('widgetify-blackfriday-popup');
            popup.classList.toggle('show');
          }

          function updateBlackFridayTimer() {
            const target = new Date('${config.blackFridayEndDate || '2024-11-29'}').getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);

              document.getElementById('bf-days').textContent = days.toString().padStart(2, '0');
              document.getElementById('bf-hours').textContent = hours.toString().padStart(2, '0');
              document.getElementById('bf-minutes').textContent = minutes.toString().padStart(2, '0');
              document.getElementById('bf-seconds').textContent = seconds.toString().padStart(2, '0');
            }
          }

          setInterval(updateBlackFridayTimer, 1000);
          updateBlackFridayTimer();
        </script>`;

    case 'multi-step-survey':
      const questions = config.surveyQuestions || [
        { question: 'How satisfied are you with our service?', type: 'rating' as const },
        { question: 'What could we improve?', type: 'text' as const },
        { question: 'Would you recommend us?', type: 'choice' as const, options: ['Yes', 'No', 'Maybe'] }
      ];
      
      return `${baseStyles}
        <style>
          .survey-step { display: none; }
          .survey-step.active { display: block; animation: fadeIn 0.3s; }
          @keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .survey-progress { height: 4px; background: #e5e7eb; border-radius: 2px; margin-bottom: 20px; overflow: hidden; }
          .survey-progress-bar { height: 100%; background: ${buttonColor}; transition: width 0.3s; }
          .survey-rating { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
          .survey-rating button { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #e5e7eb; background: white; cursor: pointer; transition: all 0.2s; }
          .survey-rating button:hover, .survey-rating button.selected { background: ${buttonColor}; color: white; border-color: ${buttonColor}; transform: scale(1.1); }
        </style>
        
        <div id="widgetify-survey" class="widgetify-widget" onclick="toggleWidgetifySurvey()" aria-label="Open survey">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </div>

        <div id="widgetify-survey-popup" class="widgetify-popup" role="dialog" style="height: auto; max-height: 500px;">
          <div class="widgetify-header">
            <h3>${config.surveyTitle || 'Quick Survey'}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifySurvey()">×</button>
          </div>
          <div class="widgetify-content" style="flex: 1; overflow-y: auto;">
            <div class="survey-progress">
              <div id="survey-progress-bar" class="survey-progress-bar" style="width: 0%"></div>
            </div>
            ${questions.map((q, idx) => `
              <div class="survey-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">
                <h4 style="margin: 0 0 20px 0; font-size: 16px;">${q.question}</h4>
                ${q.type === 'rating' ? `
                  <div class="survey-rating">
                    ${[1,2,3,4,5].map(n => `<button type="button" onclick="selectRating(${idx}, ${n})" data-rating="${n}">${n}</button>`).join('')}
                  </div>
                ` : q.type === 'choice' ? `
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${(q.options || []).map((opt, i) => `
                      <button type="button" onclick="selectChoice(${idx}, '${opt}')" style="padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; text-align: left; transition: all 0.2s;" class="survey-choice">
                        ${opt}
                      </button>
                    `).join('')}
                  </div>
                ` : `
                  <textarea id="survey-text-${idx}" rows="4" style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
                `}
              </div>
            `).join('')}
            <div class="survey-step" data-step="complete" style="text-align: center; padding: 30px 0;">
              <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
              <h4 style="margin: 0 0 10px 0;">Thank You!</h4>
              <p style="margin: 0; color: #6b7280;">Your feedback helps us improve.</p>
            </div>
          </div>
          <div style="padding: 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 10px;">
            <button id="survey-back" onclick="surveyBack()" style="padding: 10px 20px; border: 1px solid #e5e7eb; background: white; border-radius: 6px; cursor: pointer; display: none;">Back</button>
            <button id="survey-next" onclick="surveyNext()" style="flex: 1; padding: 10px; background: ${buttonColor}; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Next</button>
          </div>${generateWatermark()}
        </div>

        <script>
          let currentSurveyStep = 0;
          const surveyAnswers = [];
          const totalSteps = ${questions.length};

          function toggleWidgetifySurvey() {
            document.getElementById('widgetify-survey-popup').classList.toggle('show');
          }

          function updateSurveyProgress() {
            const progress = (currentSurveyStep / totalSteps) * 100;
            document.getElementById('survey-progress-bar').style.width = progress + '%';
            document.getElementById('survey-back').style.display = currentSurveyStep > 0 ? 'block' : 'none';
            document.getElementById('survey-next').textContent = currentSurveyStep === totalSteps - 1 ? 'Submit' : 'Next';
          }

          function selectRating(step, rating) {
            document.querySelectorAll(\`[data-step="\${step}"] .survey-rating button\`).forEach(b => b.classList.remove('selected'));
            event.target.classList.add('selected');
            surveyAnswers[step] = rating;
          }

          function selectChoice(step, choice) {
            document.querySelectorAll(\`[data-step="\${step}"] .survey-choice\`).forEach(b => {
              b.style.background = 'white';
              b.style.borderColor = '#e5e7eb';
            });
            event.target.style.background = '${buttonColor}20';
            event.target.style.borderColor = '${buttonColor}';
            surveyAnswers[step] = choice;
          }

          function surveyNext() {
            const textArea = document.getElementById('survey-text-' + currentSurveyStep);
            if (textArea) surveyAnswers[currentSurveyStep] = textArea.value;
            
            if (currentSurveyStep === totalSteps - 1) {
              document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
              document.querySelector('[data-step="complete"]').classList.add('active');
              document.getElementById('survey-next').style.display = 'none';
              document.getElementById('survey-back').style.display = 'none';
              console.log('Survey submitted:', surveyAnswers);
              return;
            }

            document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
            currentSurveyStep++;
            document.querySelector(\`[data-step="\${currentSurveyStep}"]\`).classList.add('active');
            updateSurveyProgress();
          }

          function surveyBack() {
            if (currentSurveyStep > 0) {
              document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
              currentSurveyStep--;
              document.querySelector(\`[data-step="\${currentSurveyStep}"]\`).classList.add('active');
              updateSurveyProgress();
            }
          }

          updateSurveyProgress();
        </script>`;

    case 'lead-magnet':
      return `
        ${baseStyles}
        <style>
          .lead-magnet-form { display: flex; flex-direction: column; gap: 12px; }
          .lead-magnet-input { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
          .lead-magnet-checkbox { display: flex; align-items: start; gap: 8px; font-size: 12px; color: #6b7280; }
        </style>

        <div class="widgetify-button" onclick="toggleWidgetifyLeadMagnet()" style="background: ${buttonColor};">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
        </div>

        <div id="widgetify-lead-magnet-popup" class="widgetify-popup" role="dialog">
          <div class="widgetify-header">
            <h3>${config.resourceTitle || 'Free Resource'}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyLeadMagnet()">×</button>
          </div>
          <div class="widgetify-content">
            <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">${config.resourceDescription || 'Enter your details to download this free resource.'}</p>
            <form class="lead-magnet-form" onsubmit="submitLeadMagnet(event)">
              <input type="text" id="lead-name" class="lead-magnet-input" placeholder="Your Name" required />
              <input type="email" id="lead-email" class="lead-magnet-input" placeholder="Your Email" required />
              <label class="lead-magnet-checkbox">
                <input type="checkbox" required />
                <span>I agree to receive emails and updates</span>
              </label>
              <button type="submit" style="padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 8px;">
                Download Now
              </button>
            </form>
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyLeadMagnet() {
            document.getElementById('widgetify-lead-magnet-popup').classList.toggle('show');
          }

          function submitLeadMagnet(e) {
            e.preventDefault();
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            
            console.log('Lead captured:', { name, email });
            alert('Thank you! Your download will start shortly.');
            
            ${config.resourceUrl ? `window.open('${config.resourceUrl}', '_blank');` : ''}
            toggleWidgetifyLeadMagnet();
            e.target.reset();
          }
        </script>`;

    case 'smart-query':
      return `
        ${baseStyles}
        <style>
          .query-form { display: flex; flex-direction: column; gap: 12px; }
          .query-input, .query-select, .query-textarea { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
          .query-textarea { resize: vertical; min-height: 100px; }
          .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .priority-low { background: #d1fae5; color: #065f46; }
          .priority-medium { background: #fed7aa; color: #92400e; }
          .priority-high { background: #fecaca; color: #991b1b; }
        </style>

        <div class="widgetify-button" onclick="toggleWidgetifyQuery()" style="background: ${buttonColor};">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
          </svg>
        </div>

        <div id="widgetify-query-popup" class="widgetify-popup" role="dialog" style="height: auto; max-height: 550px;">
          <div class="widgetify-header">
            <h3>${config.queryTitle || 'Submit Your Query'}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyQuery()">×</button>
          </div>
          <div class="widgetify-content" style="flex: 1; overflow-y: auto;">
            <form class="query-form" onsubmit="submitQuery(event)">
              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Query Type</label>
                <select id="query-type" class="query-select" required>
                  <option value="">Select type...</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Priority</label>
                <select id="query-priority" class="query-select" required>
                  <option value="low">Low - Can wait</option>
                  <option value="medium" selected>Medium - Normal</option>
                  <option value="high">High - Urgent</option>
                </select>
              </div>

              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Your Name</label>
                <input type="text" id="query-name" class="query-input" placeholder="John Doe" required />
              </div>

              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Email</label>
                <input type="email" id="query-email" class="query-input" placeholder="you@example.com" required />
              </div>

              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Phone (Optional)</label>
                <input type="tel" id="query-phone" class="query-input" placeholder="+1 234 567 8900" />
              </div>

              <div>
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600;">Your Message</label>
                <textarea id="query-message" class="query-textarea" placeholder="Describe your query in detail..." required></textarea>
              </div>

              <button type="submit" style="padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 8px;">
                Submit Query
              </button>
            </form>
          </div>${generateWatermark()}
        </div>

        <script>
          function toggleWidgetifyQuery() {
            document.getElementById('widgetify-query-popup').classList.toggle('show');
          }

          function submitQuery(e) {
            e.preventDefault();
            const formData = {
              type: document.getElementById('query-type').value,
              priority: document.getElementById('query-priority').value,
              name: document.getElementById('query-name').value,
              email: document.getElementById('query-email').value,
              phone: document.getElementById('query-phone').value,
              message: document.getElementById('query-message').value,
              timestamp: new Date().toISOString()
            };
            
            console.log('Query submitted:', formData);
            alert('Thank you! Your query has been submitted. We will get back to you soon.');
            toggleWidgetifyQuery();
            e.target.reset();
          }
        </script>`;

    case 'service-estimator':
      const services = config.services || [
        { name: 'Web Design', basePrice: 500, unit: 'page' },
        { name: 'SEO Optimization', basePrice: 300, unit: 'month' },
        { name: 'Content Writing', basePrice: 50, unit: 'article' }
      ];

      return `
        ${baseStyles}
        <style>
          .estimator-form { display: flex; flex-direction: column; gap: 16px; }
          .service-item { padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; transition: all 0.2s; }
          .service-item:hover { border-color: ${buttonColor}; }
          .service-item.selected { border-color: ${buttonColor}; background: ${buttonColor}15; }
          .service-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
          .service-checkbox { width: 20px; height: 20px; cursor: pointer; }
          .service-details { display: flex; align-items: center; gap: 12px; }
          .quantity-input { width: 80px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; text-align: center; }
          .estimate-total { background: ${buttonColor}15; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
          .estimate-price { font-size: 32px; font-weight: bold; color: ${buttonColor}; }
        </style>

        <div class="widgetify-button" onclick="toggleWidgetifyEstimator()" style="background: ${buttonColor};">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>

        <div id="widgetify-estimator-popup" class="widgetify-popup" role="dialog" style="height: auto; max-height: 600px;">
          <div class="widgetify-header">
            <h3>${config.estimatorTitle || 'Service Cost Estimator'}</h3>
            <button class="widgetify-close" onclick="toggleWidgetifyEstimator()">×</button>
          </div>
          <div class="widgetify-content" style="flex: 1; overflow-y: auto;">
            <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">Select services and quantities to get an instant estimate:</p>
            
            <div class="estimator-form">
              ${services.map((service, idx) => `
                <div class="service-item" id="service-${idx}">
                  <div class="service-header">
                    <input type="checkbox" class="service-checkbox" id="checkbox-${idx}" onchange="updateEstimate()" />
                    <label for="checkbox-${idx}" style="flex: 1; cursor: pointer; font-weight: 600;">
                      ${service.name}
                    </label>
                    <span style="color: #6b7280; font-size: 14px;">$${service.basePrice}/${service.unit}</span>
                  </div>
                  <div class="service-details">
                    <label style="font-size: 13px; color: #6b7280;">Quantity:</label>
                    <input 
                      type="number" 
                      class="quantity-input" 
                      id="quantity-${idx}" 
                      min="1" 
                      value="1" 
                      onchange="updateEstimate()"
                      disabled
                    />
                    <span style="font-size: 13px; color: #6b7280;">${service.unit}(s)</span>
                  </div>
                </div>
              `).join('')}

              <div class="estimate-total">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Estimated Total</div>
                <div class="estimate-price" id="total-estimate">$0</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Final price may vary</div>
              </div>

              <button onclick="requestQuote()" style="width: 100%; padding: 12px; background: ${buttonColor}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 12px;">
                Request Detailed Quote
              </button>
            </div>
          </div>${generateWatermark()}
        </div>

        <script>
          const services = ${JSON.stringify(services)};

          function toggleWidgetifyEstimator() {
            document.getElementById('widgetify-estimator-popup').classList.toggle('show');
          }

          function updateEstimate() {
            let total = 0;
            services.forEach((service, idx) => {
              const checkbox = document.getElementById('checkbox-' + idx);
              const quantity = document.getElementById('quantity-' + idx);
              const serviceItem = document.getElementById('service-' + idx);
              
              if (checkbox.checked) {
                quantity.disabled = false;
                serviceItem.classList.add('selected');
                total += service.basePrice * parseInt(quantity.value);
              } else {
                quantity.disabled = true;
                serviceItem.classList.remove('selected');
              }
            });
            
            document.getElementById('total-estimate').textContent = '$' + total.toLocaleString();
          }

          function requestQuote() {
            const selectedServices = [];
            services.forEach((service, idx) => {
              const checkbox = document.getElementById('checkbox-' + idx);
              if (checkbox.checked) {
                const quantity = document.getElementById('quantity-' + idx).value;
                selectedServices.push({
                  service: service.name,
                  quantity: quantity,
                  subtotal: service.basePrice * quantity
                });
              }
            });

            if (selectedServices.length === 0) {
              alert('Please select at least one service');
              return;
            }

            console.log('Quote requested:', selectedServices);
            alert('Thank you! We will send you a detailed quote shortly.');
            toggleWidgetifyEstimator();
          }

          updateEstimate();
        </script>`;
  }
};

export const WIDGET_NAMES: Record<WidgetType, string> = {
  'whatsapp': 'WhatsApp Chat',
  'facebook': 'Facebook Messenger',
  'instagram': 'Instagram',
  'twitter': 'Twitter',
  'telegram': 'Telegram',
  'linkedin': 'LinkedIn',
  'social-share': 'Social Share',
  'google-translate': 'Google Translate',
  'youtube': 'YouTube',
  'github': 'GitHub',
  'twitch': 'Twitch',
  'slack': 'Slack',
  'discord': 'Discord',
  'call-now': 'Call Now',
  'review-now': 'Review Now',
  'follow-us': 'Follow Us',
  'dodo-payment': 'Dodo Payment',
  'payment': 'Payment Gateway',
  'contact-form': 'Contact Form',
  'whatsapp-form': 'WhatsApp Form',
  'lead-capture-popup': 'Lead Capture Popup',
  'email-contact': 'Email Contact',
  'live-chat': 'Live Chat',
  'booking-calendar': 'Booking Calendar',
  'newsletter-signup': 'Newsletter Signup',
  'feedback-form': 'Feedback Form',
  'download-app': 'Download App',
  'countdown-timer': 'Countdown Timer',
  'back-to-top': 'Back to Top',
  'scroll-progress': 'Scroll Progress',
  'print-page': 'Print Page',
  'qr-generator': 'QR Generator',
  'weather-widget': 'Weather Widget',
  'calculator': 'Calculator',
  'crypto-prices': 'Crypto Prices',
  'stock-ticker': 'Stock Ticker',
  'rss-feed': 'RSS Feed',
  'cookie-consent': 'Cookie Consent',
  'age-verification': 'Age Verification',
  'popup-announcement': 'Popup Announcement',
  'floating-video': 'Floating Video',
  'music-player': 'Music Player',
  'image-gallery': 'Image Gallery',
  'pdf-viewer': 'PDF Viewer',
  'click-to-copy': 'Click to Copy',
  'share-page': 'Share Page',
  'dark-mode-toggle': 'Dark Mode Toggle',
  'spotify-embed': 'Spotify Music Player',
  'ai-seo-listing': 'AI SEO Listing Generator',
  'exit-intent-popup': 'Exit Intent Popup',
  'sticky-banner': 'Sticky Promotional Banner',
  'ai-chatbot': 'AI Chatbot',
  'trust-badge': 'Trust Badge Widget',
  'email-signature-generator': 'Email Signature Generator',
  'holiday-countdown': 'Holiday Countdown',
  'flash-sale-banner': 'Flash Sale Banner',
  'seasonal-greeting': 'Seasonal Greeting Widget',
  'black-friday-timer': 'Black Friday Timer',
  'multi-step-survey': 'Multi-Step Survey',
  'loyalty-points': 'Loyalty Points Display',
  'live-visitor-counter': 'Live Visitor Counter',
  'smart-faq-chatbot': 'Smart FAQ Chatbot',
  'price-drop-alert': 'Price Drop Alert',
  'product-tour': 'Interactive Product Tour',
  'referral-tracking': 'Referral Tracking',
  'lead-magnet': 'Lead Magnet & Resource Access',
  'smart-query': 'Smart Query / Request Widget',
  'service-estimator': 'Interactive Service Estimator',
  'google-maps': 'Google Maps Embed',
  'google-reviews': 'Google Reviews Testimonials'
};
