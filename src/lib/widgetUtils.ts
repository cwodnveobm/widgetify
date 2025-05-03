
export type WidgetType = 'whatsapp' | 'facebook' | 'instagram' | 'twitter';

export interface WidgetConfig {
  type: WidgetType;
  handle: string;
  welcomeMessage?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
  size?: 'small' | 'medium' | 'large';
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
<!-- WhatsApp Widget by ChatSpark -->
<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .chat-button {
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
  
  .chat-button:hover {
    transform: scale(1.05);
  }
</style>

<div class="chat-widget">
  <a href="https://wa.me/${formattedPhone}?text=${encodeURIComponent(welcomeMessage)}" target="_blank" rel="noopener noreferrer">
    <div class="chat-button">
      <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
        <path d="M17.6 6.32A8.78 8.78 0 0 0 12.14 4C7.82 4 4.3 7.53 4.3 11.86a7.8 7.8 0 0 0 1.04 3.9L4 20l4.33-1.13a7.78 7.78 0 0 0 3.8.98h.01c4.32 0 7.84-3.53 7.84-7.86 0-2.1-.82-4.07-2.3-5.55l-.08-.09ZM12.14 18.56h-.01c-1.18 0-2.33-.32-3.33-.92l-.24-.14-2.46.64.66-2.4-.16-.25a6.53 6.53 0 0 1-1-3.47c0-4 3.25-7.25 7.26-7.25a7.24 7.24 0 0 1 7.26 7.22c0 4-3.26 7.25-7.26 7.25ZM15.59 13.5c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.1-.14.22-.55.71-.67.86-.13.14-.25.16-.47.05a5.87 5.87 0 0 1-1.74-1.07 6.58 6.58 0 0 1-1.2-1.5c-.12-.22-.01-.34.1-.45.1-.1.21-.25.32-.38.1-.13.14-.22.21-.37.07-.14.04-.27-.02-.38-.06-.1-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27c-.2.22-.77.76-.77 1.85 0 1.1.8 2.15.91 2.3.11.15 1.55 2.37 3.76 3.32.53.23.94.36 1.26.47.53.16 1 .14 1.38.08.42-.06 1.3-.53 1.48-1.04.19-.5.19-.94.13-1.03-.06-.08-.21-.14-.43-.25Z"/>
      </svg>
    </div>
  </a>
</div>
<!-- End WhatsApp Widget -->
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
<!-- Facebook Messenger Widget by ChatSpark -->
<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .chat-button {
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
  
  .chat-button:hover {
    transform: scale(1.05);
  }
</style>

<div class="chat-widget">
  <a href="https://m.me/${handle}" target="_blank" rel="noopener noreferrer">
    <div class="chat-button">
      <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.39.27.62l.05 1.94c.02.61.45 1.03.99.91l2.17-.49c.21-.05.44-.01.62.1 1.07.44 2.25.69 3.49.69 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.73-1.47.92-2.17.37l-2.34-1.73a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.33-.97-.17-.68-.62l2.93-4.67c.47-.73 1.47-.92 2.17-.37l2.34 1.73a.6.6 0 0 0 .72 0l3.16-2.4c.42-.33.97.17.68.62z"/>
      </svg>
    </div>
  </a>
</div>
<!-- End Facebook Messenger Widget -->
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
<!-- Instagram Widget by ChatSpark -->
<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .chat-button {
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
  
  .chat-button:hover {
    transform: scale(1.05);
  }
</style>

<div class="chat-widget">
  <a href="https://instagram.com/${handle.replace('@', '')}" target="_blank" rel="noopener noreferrer">
    <div class="chat-button">
      <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.058 1.37-.058 4.04 0 2.67.01 2.988.058 4.04.045.977.207 1.505.344 1.858.182.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.987-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
      </svg>
    </div>
  </a>
</div>
<!-- End Instagram Widget -->
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
<!-- Twitter Widget by ChatSpark -->
<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    ${positionStyle}
    z-index: 1000;
  }
  
  .chat-button {
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
  
  .chat-button:hover {
    transform: scale(1.05);
  }
</style>

<div class="chat-widget">
  <a href="https://twitter.com/messages/compose?recipient_id=${formattedHandle}" target="_blank" rel="noopener noreferrer">
    <div class="chat-button">
      <svg width="${buttonSize * 0.5}" height="${buttonSize * 0.5}" viewBox="0 0 24 24" fill="white">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
      </svg>
    </div>
  </a>
</div>
<!-- End Twitter Widget -->
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
    default:
      return '<!-- Invalid widget type -->';
  }
};

