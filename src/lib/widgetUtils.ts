export type WidgetType = 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'telegram' | 'linkedin' | 'social-share' | 'google-translate';

export interface WidgetConfig {
  type: WidgetType;
  handle: string;
  welcomeMessage?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
  size?: 'small' | 'medium' | 'large';
  networks?: string[]; // For social share buttons
  shareText?: string;  // For social share buttons
  shareUrl?: string;   // For social share buttons
  languages?: string[]; // For Google Translate widget
}

// Generate WhatsApp Widget Code
export const generateWhatsAppWidget = (config: WidgetConfig): string => {
  const { handle, welcomeMessage = "Hello! How can we help you?", position = "right", primaryColor = "#25D366", size = "medium" } = config;
  
  // Format phone number by removing non-digit characters
  const formattedPhone = handle.replace(/\D/g, '');
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- WhatsApp Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-whatsapp-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24">
      <g>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#006A8E"/>
        <circle cx="21" cy="3" r="3" fill="#FF4D4D"/>
        <path d="M12.01 4.5C7.96 4.5 4.5 7.96 4.5 12.01C4.5 16.06 7.96 19.5 12.01 19.5C16.06 19.5 19.5 16.06 19.5 12.01C19.5 7.96 16.06 4.5 12.01 4.5ZM12.01 18.2C8.68 18.2 5.8 15.32 5.8 12.01C5.8 8.7 8.68 5.8 12.01 5.8C15.33 5.8 18.2 8.7 18.2 12.01C18.2 15.32 15.32 18.2 12.01 18.2Z" fill="white"/>
        <path d="M17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="white"/>
      </g>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-whatsapp-popup">
    <div class="widgetify-chat-header">
      <div>WhatsApp Chat</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Continue to WhatsApp chat?</p>
      <a href="https://wa.me/${formattedPhone}?text=${encodeURIComponent(welcomeMessage)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Start Chat
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-whatsapp-btn').addEventListener('click', function() {
    document.getElementById('widgetify-whatsapp-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup').addEventListener('click', function() {
    document.getElementById('widgetify-whatsapp-popup').classList.remove('show');
  });
</script>
<!-- End WhatsApp Widget by Widgetify -->
  `.trim();
};

// Generate Facebook Messenger Widget Code
export const generateFacebookWidget = (config: WidgetConfig): string => {
  const { handle, position = "right", primaryColor = "#0084FF", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- Facebook Messenger Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-facebook-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.39.27.62l.05 1.94c.02.61.45 1.03.99.91l2.17-.49c.21-.05.44-.01.62.1 1.07.44 2.25.69 3.49.69 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.73-1.47.92-2.17.37l-2.34-1.73a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.33-.97-.17-.68-.62l2.93-4.67c.47-.73 1.47-.92 2.17-.37l2.34 1.73a.6.6 0 0 0 .72 0l3.16-2.4c.42-.33.97.17.68.62z"/>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-facebook-popup">
    <div class="widgetify-chat-header">
      <div>Facebook Messenger</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-fb">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Continue to Facebook Messenger?</p>
      <a href="https://m.me/${handle}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Start Chat
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-facebook-btn').addEventListener('click', function() {
    document.getElementById('widgetify-facebook-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-fb').addEventListener('click', function() {
    document.getElementById('widgetify-facebook-popup').classList.remove('show');
  });
</script>
<!-- End Facebook Messenger Widget by Widgetify -->
  `.trim();
};

// Generate Instagram Widget Code
export const generateInstagramWidget = (config: WidgetConfig): string => {
  const { handle, position = "right", primaryColor = "#E1306C", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- Instagram Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-instagram-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.058 1.37-.058 4.04 0 2.67.01 2.988.058 4.04.045.977.207 1.505.344 1.858.182.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-instagram-popup">
    <div class="widgetify-chat-header">
      <div>Instagram</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-ig">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Visit Instagram profile?</p>
      <a href="https://instagram.com/${handle.replace('@', '')}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Go to Profile
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-instagram-btn').addEventListener('click', function() {
    document.getElementById('widgetify-instagram-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-ig').addEventListener('click', function() {
    document.getElementById('widgetify-instagram-popup').classList.remove('show');
  });
</script>
<!-- End Instagram Widget by Widgetify -->
  `.trim();
};

// Generate Twitter Widget Code
export const generateTwitterWidget = (config: WidgetConfig): string => {
  const { handle, position = "right", primaryColor = "#1DA1F2", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  const formattedHandle = handle.startsWith('@') ? handle.substring(1) : handle;
  
  return `
<!-- Twitter Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-twitter-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-twitter-popup">
    <div class="widgetify-chat-header">
      <div>Twitter</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-tw">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Start a Twitter conversation?</p>
      <a href="https://twitter.com/messages/compose?recipient_id=${formattedHandle}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Message
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-twitter-btn').addEventListener('click', function() {
    document.getElementById('widgetify-twitter-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-tw').addEventListener('click', function() {
    document.getElementById('widgetify-twitter-popup').classList.remove('show');
  });
</script>
<!-- End Twitter Widget by Widgetify -->
  `.trim();
};

// Generate Telegram Widget Code
export const generateTelegramWidget = (config: WidgetConfig): string => {
  const { handle, position = "right", primaryColor = "#0088cc", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- Telegram Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-telegram-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.46 7.12l-1.68 7.9c-.12.59-.5.84-1.01.52l-2.8-2.07-1.35 1.3c-.15.15-.27.27-.56.27-.36 0-.3-.14-.42-.47l-.95-3.12-2.77-1c-.6-.2-.6-.6.13-.9l10.8-4.15c.5-.18.96.12.61 1.32z"/>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-telegram-popup">
    <div class="widgetify-chat-header">
      <div>Telegram</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-tg">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Continue to Telegram?</p>
      <a href="https://t.me/${handle.replace('@', '')}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Start Chat
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-telegram-btn').addEventListener('click', function() {
    document.getElementById('widgetify-telegram-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-tg').addEventListener('click', function() {
    document.getElementById('widgetify-telegram-popup').classList.remove('show');
  });
</script>
<!-- End Telegram Widget by Widgetify -->
  `.trim();
};

// Generate LinkedIn Widget Code
export const generateLinkedInWidget = (config: WidgetConfig): string => {
  const { handle, position = "right", primaryColor = "#0077b5", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- LinkedIn Widget by Widgetify -->
<style>
  .widgetify-chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-chat-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-chat-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-chat-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-chat-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-chat-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-chat-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-chat-widget">
  <div class="widgetify-chat-button" id="widgetify-linkedin-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  </div>
  
  <div class="widgetify-chat-popup" id="widgetify-linkedin-popup">
    <div class="widgetify-chat-header">
      <div>LinkedIn</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-li">×</button>
    </div>
    <div class="widgetify-chat-body">
      <p>Visit LinkedIn profile?</p>
      <a href="https://www.linkedin.com/in/${handle}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 15px; background-color: ${primaryColor}; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        View Profile
      </a>
      <div class="widgetify-branding" style="margin-top: 20px;">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-linkedin-btn').addEventListener('click', function() {
    document.getElementById('widgetify-linkedin-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-li').addEventListener('click', function() {
    document.getElementById('widgetify-linkedin-popup').classList.remove('show');
  });
</script>
<!-- End LinkedIn Widget by Widgetify -->
  `.trim();
};

// Generate Social Share Buttons Widget Code
export const generateSocialShareWidget = (config: WidgetConfig): string => {
  const { position = "right", primaryColor = "#6B7280", size = "medium", networks = ['facebook', 'twitter', 'linkedin'], shareText = '', shareUrl = window.location.href } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 40,
    medium: 50,
    large: 60
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  // Generate buttons for selected networks
  const generateSocialButtons = () => {
    let buttons = '';
    
    if (networks.includes('facebook')) {
      buttons += `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #1877F2;">
        <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.61v-6.97h-2.34V11.3h2.34V9.39c0-2.32 1.41-3.58 3.48-3.58.99 0 1.84.07 2.09.1v2.43h-1.43c-1.12 0-1.34.53-1.34 1.32v1.73h2.68l-.35 2.74h-2.33V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/>
        </svg>
      </a>
      `;
    }
    
    if (networks.includes('twitter')) {
      buttons += `
      <a href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #1DA1F2;">
        <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
        </svg>
      </a>
      `;
    }
    
    if (networks.includes('linkedin')) {
      buttons += `
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="widgetify-social-button" style="background-color: #0077B5;">
        <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      </a>
      `;
    }
    
    return buttons;
  };
  
  return `
<!-- Social Share Widget by Widgetify -->
<style>
  .widgetify-share-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  .widgetify-share-toggle {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-share-toggle:hover {
    transform: scale(1.05);
  }
  
  .widgetify-social-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s;
  }
  
  .widgetify-social-buttons.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .widgetify-social-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
  }
  
  .widgetify-social-button:hover {
    transform: scale(1.1);
  }
  
  .widgetify-branding {
    font-size: 10px;
    margin-top: 8px;
    opacity: 0.7;
    color: #888;
    text-align: center;
  }
</style>

<div class="widgetify-share-widget">
  <div class="widgetify-social-buttons" id="widgetify-social-buttons">
    ${generateSocialButtons()}
    <div class="widgetify-branding">
      <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
        Powered by Widgetify
      </a>
    </div>
  </div>
  <div class="widgetify-share-toggle" id="widgetify-share-toggle">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
    </svg>
  </div>
</div>

<script>
  document.getElementById('widgetify-share-toggle').addEventListener('click', function() {
    document.getElementById('widgetify-social-buttons').classList.toggle('show');
  });
</script>
<!-- End Social Share Widget by Widgetify -->
  `.trim();
};

// Generate Google Translate Widget Code
export const generateGoogleTranslateWidget = (config: WidgetConfig): string => {
  const { position = "right", primaryColor = "#4285F4", size = "medium" } = config;
  
  // Size in pixels
  const sizeMap = {
    small: 50,
    medium: 60,
    large: 70
  };
  
  const buttonSize = sizeMap[size];
  const positionStyle = position === "right" ? "right: 20px;" : "left: 20px;";
  
  return `
<!-- Google Translate Widget by Widgetify -->
<style>
  .widgetify-translate-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .widgetify-translate-button {
    width: ${buttonSize}px;
    height: ${buttonSize}px;
    border-radius: 50%;
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .widgetify-translate-button:hover {
    transform: scale(1.05);
  }
  
  .widgetify-translate-popup {
    position: fixed;
    bottom: 90px;
    ${positionStyle}
    width: 300px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    overflow: hidden;
  }
  
  .widgetify-translate-popup.show {
    display: flex;
    transform: translateY(0);
    opacity: 1;
  }
  
  .widgetify-translate-header {
    padding: 15px;
    background-color: ${primaryColor};
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widgetify-translate-body {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .widgetify-translate-languages {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .widgetify-translate-language {
    padding: 8px 0;
    background-color: #f5f5f5;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
  }
  
  .widgetify-translate-language:hover {
    background-color: #e0e0e0;
  }
  
  .widgetify-branding {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 10px;
  }
  
  .widgetify-close-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
  }
</style>

<div class="widgetify-translate-widget">
  <div class="widgetify-translate-button" id="widgetify-translate-btn">
    <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
      <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  </div>
  
  <div class="widgetify-translate-popup" id="widgetify-translate-popup">
    <div class="widgetify-translate-header">
      <div>Translate</div>
      <button class="widgetify-close-btn" id="widgetify-close-popup-translate">×</button>
    </div>
    <div class="widgetify-translate-body">
      <p>Select language:</p>
      <div class="widgetify-translate-languages">
        <div class="widgetify-translate-language" data-lang="en">English</div>
        <div class="widgetify-translate-language" data-lang="es">Spanish</div>
        <div class="widgetify-translate-language" data-lang="fr">French</div>
        <div class="widgetify-translate-language" data-lang="de">German</div>
        <div class="widgetify-translate-language" data-lang="it">Italian</div>
        <div class="widgetify-translate-language" data-lang="pt">Portuguese</div>
        <div class="widgetify-translate-language" data-lang="ru">Russian</div>
        <div class="widgetify-translate-language" data-lang="ja">Japanese</div>
        <div class="widgetify-translate-language" data-lang="zh-CN">Chinese</div>
      </div>
      <div class="widgetify-branding">
        <a href="https://widgetify.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          Powered by Widgetify
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  document.getElementById('widgetify-translate-btn').addEventListener('click', function() {
    document.getElementById('widgetify-translate-popup').classList.add('show');
  });
  
  document.getElementById('widgetify-close-popup-translate').addEventListener('click', function() {
    document.getElementById('widgetify-translate-popup').classList.remove('show');
  });
  
  // Add Google Translate script
  function loadGoogleTranslate() {
    var googleTranslateScript = document.createElement('script');
    googleTranslateScript.type = 'text/javascript';
    googleTranslateScript.async = true;
    googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(googleTranslateScript);
    
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'auto',
        autoDisplay: false
      });
    };
  }
  
  // Initialize Google Translate when page loads
  loadGoogleTranslate();
  
  // Add click handlers for language selection
  document.querySelectorAll('.widgetify-translate-language').forEach(function(el) {
    el.addEventListener('click', function() {
      var langCode = this.getAttribute('data-lang');
      var translateCombo = document.querySelector('.goog-te-combo');
      
      if (translateCombo) {
        translateCombo.value = langCode;
        translateCombo.dispatchEvent(new Event('change'));
      } else {
        // If Google Translate hasn't loaded yet
        setTimeout(function() {
          var translateCombo = document.querySelector('.goog-te-combo');
          if (translateCombo) {
            translateCombo.value = langCode;
            translateCombo.dispatchEvent(new Event('change'));
          }
        }, 1000);
      }
    });
  });
</script>
<!-- End Google Translate Widget by Widgetify -->
  `.trim();
};

// Main function to generate widget code based on type
export const generateWidgetCode = (config: WidgetConfig): string => {
  switch (config.type) {
    case 'whatsapp':
      return generateWhatsAppWidget(config);
    case 'facebook':
      return generateFacebookWidget(config);
    case 'instagram':
      return generateInstagramWidget(config);
    case 'twitter':
      return generateTwitterWidget(config);
    case 'telegram':
      return generateTelegramWidget(config);
    case 'linkedin':
      return generateLinkedInWidget(config);
    case 'social-share':
      return generateSocialShareWidget(config);
    case 'google-translate':
      return generateGoogleTranslateWidget(config);
    default:
      return '<!-- Invalid widget type -->';
  }
};
