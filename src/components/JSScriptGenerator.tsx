import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Shield, Eye, EyeOff, Lock, MousePointer, Clock, Ban, Fingerprint, Code2, Camera, Image, KeyRound, Layers, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface JSScript {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'security' | 'protection' | 'utility' | 'advanced';
  code: string;
  popular?: boolean;
}

export const JSScriptGenerator = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scripts: JSScript[] = [
    {
      id: 'disable-inspect',
      name: 'Disable Inspect Element',
      description: 'Blocks right-click context menu and common keyboard shortcuts for developer tools',
      icon: Shield,
      category: 'security',
      popular: true,
      code: `<!-- Disable Inspect Element & DevTools -->
<script>
(function() {
  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable keyboard shortcuts for DevTools
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
      return false;
    }
  });

  console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
  console.log('%cThis browser feature is for developers only.', 'font-size: 16px;');
})();
</script>`
    },
    {
      id: 'devtools-detect',
      name: 'DevTools Detection',
      description: 'Detects when browser developer tools are opened and redirects or alerts',
      icon: Eye,
      category: 'security',
      popular: true,
      code: `<!-- DevTools Detection Script -->
<script>
(function() {
  const devtools = { open: false, orientation: null };
  const threshold = 160;

  const emitEvent = (state, orientation) => {
    if (state) {
      // DevTools opened - customize action here
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>Developer tools detected. Please close them to continue.</h1></div>';
      // Or redirect: window.location.href = '/access-denied';
    }
  };

  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (!(heightThreshold && widthThreshold) &&
        ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
         widthThreshold || heightThreshold)) {
      if (!devtools.open || devtools.orientation !== orientation) {
        emitEvent(true, orientation);
      }
      devtools.open = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.open) {
        emitEvent(false, null);
      }
      devtools.open = false;
      devtools.orientation = null;
    }
  }, 500);
})();
</script>`
    },
    {
      id: 'disable-text-select',
      name: 'Disable Text Selection',
      description: 'Prevents users from selecting and copying text content on your website',
      icon: Ban,
      category: 'protection',
      code: `<!-- Disable Text Selection -->
<style>
  body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  /* Allow selection in input fields */
  input, textarea {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
</style>
<script>
document.addEventListener('selectstart', function(e) {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    return false;
  }
});
</script>`
    },
    {
      id: 'disable-drag-drop',
      name: 'Disable Image Drag & Drop',
      description: 'Prevents users from dragging images to save them',
      icon: MousePointer,
      category: 'protection',
      code: `<!-- Disable Image Drag & Drop -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Disable dragging on all images
  const images = document.querySelectorAll('img');
  images.forEach(function(img) {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
  });

  // Also prevent drag on dynamically added images
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
});
</script>
<style>
  img {
    pointer-events: auto;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
</style>`
    },
    {
      id: 'console-clear',
      name: 'Console Auto-Clear',
      description: 'Continuously clears the browser console to prevent debugging',
      icon: EyeOff,
      category: 'security',
      code: `<!-- Console Auto-Clear -->
<script>
(function() {
  // Clear console on load
  console.clear();
  
  // Override console methods
  const noop = function() {};
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
  
  // Store original methods (optional - for your own debugging)
  const originalConsole = {};
  methods.forEach(function(method) {
    originalConsole[method] = console[method];
  });

  // Clear periodically
  setInterval(function() {
    console.clear();
  }, 1000);

  // Display warning message
  setTimeout(function() {
    console.log('%cWarning!', 'color: red; font-size: 40px; font-weight: bold;');
    console.log('%cThis console is monitored. Unauthorized access is prohibited.', 'font-size: 14px;');
  }, 100);
})();
</script>`
    },
    {
      id: 'hotkey-blocker',
      name: 'Keyboard Shortcut Blocker',
      description: 'Blocks common keyboard shortcuts used for copying, saving, and printing',
      icon: Lock,
      category: 'protection',
      popular: true,
      code: `<!-- Keyboard Shortcut Blocker -->
<script>
document.addEventListener('keydown', function(e) {
  // Block Ctrl+S (Save)
  if (e.ctrlKey && e.key.toUpperCase() === 'S') {
    e.preventDefault();
    return false;
  }
  // Block Ctrl+C (Copy) - optional, may affect UX
  if (e.ctrlKey && e.key.toUpperCase() === 'C') {
    e.preventDefault();
    return false;
  }
  // Block Ctrl+P (Print)
  if (e.ctrlKey && e.key.toUpperCase() === 'P') {
    e.preventDefault();
    return false;
  }
  // Block Ctrl+A (Select All)
  if (e.ctrlKey && e.key.toUpperCase() === 'A') {
    e.preventDefault();
    return false;
  }
  // Block PrintScreen
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
    return false;
  }
});
</script>`
    },
    {
      id: 'idle-timeout',
      name: 'Idle Session Timeout',
      description: 'Automatically logs out or redirects users after a period of inactivity',
      icon: Clock,
      category: 'utility',
      code: `<!-- Idle Session Timeout -->
<script>
(function() {
  let idleTime = 0;
  const maxIdleMinutes = 15; // Set your timeout duration
  const warningMinutes = 13; // Warning before timeout

  // Reset idle timer on user activity
  const resetTimer = function() {
    idleTime = 0;
  };

  // Track user activity
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keypress', resetTimer);
  document.addEventListener('scroll', resetTimer);
  document.addEventListener('click', resetTimer);
  document.addEventListener('touchstart', resetTimer);

  // Check idle time every minute
  setInterval(function() {
    idleTime++;
    
    if (idleTime >= warningMinutes && idleTime < maxIdleMinutes) {
      // Show warning (customize as needed)
      if (!document.getElementById('idle-warning')) {
        const warning = document.createElement('div');
        warning.id = 'idle-warning';
        warning.innerHTML = '<div style="position:fixed;top:20px;right:20px;background:#ff9800;color:white;padding:15px 20px;border-radius:8px;z-index:9999;font-family:sans-serif;">Session expires in ' + (maxIdleMinutes - idleTime) + ' minute(s). Move mouse to stay active.</div>';
        document.body.appendChild(warning);
      }
    }
    
    if (idleTime >= maxIdleMinutes) {
      // Timeout action - redirect to login or homepage
      window.location.href = '/session-expired';
      // Or: window.location.reload();
    }
  }, 60000); // Check every minute
})();
</script>`
    },
    {
      id: 'fingerprint-track',
      name: 'Browser Fingerprint',
      description: 'Generates a unique browser fingerprint for tracking and security purposes',
      icon: Fingerprint,
      category: 'utility',
      code: `<!-- Browser Fingerprint Generator -->
<script>
(function() {
  const getFingerprint = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Fingerprint', 4, 17);
    
    const canvasData = canvas.toDataURL();
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      screenResolution: screen.width + 'x' + screen.height,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasHash: hashCode(canvasData),
      webglVendor: getWebGLVendor(),
      plugins: getPlugins(),
      touchSupport: 'ontouchstart' in window
    };
    
    return hashCode(JSON.stringify(fingerprint));
  };
  
  const hashCode = function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };
  
  const getWebGLVendor = function() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    } catch(e) {
      return 'unknown';
    }
  };
  
  const getPlugins = function() {
    return Array.from(navigator.plugins).map(p => p.name).join(',');
  };
  
  // Get fingerprint and store/use it
  const fp = getFingerprint();
  console.log('Browser Fingerprint:', fp);
  
  // Store in localStorage or send to server
  localStorage.setItem('browser_fp', fp);
  
  // Expose globally if needed
  window.browserFingerprint = fp;
})();
</script>`
    },
    {
      id: 'anti-screenshot',
      name: 'Anti-Screenshot Protection',
      description: 'Detects and prevents screenshots using various techniques including blur on visibility change',
      icon: Camera,
      category: 'advanced',
      popular: true,
      code: `<!-- Anti-Screenshot Protection -->
<script>
(function() {
  // Blur content when page loses focus (potential screenshot)
  let blurOverlay = null;
  
  const createBlurOverlay = function() {
    if (blurOverlay) return;
    blurOverlay = document.createElement('div');
    blurOverlay.id = 'screenshot-protection';
    blurOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:white;font-size:24px;text-align:center;padding:20px;';
    blurOverlay.innerHTML = '<div><h2>Content Protected</h2><p style="font-size:16px;opacity:0.8;">Screenshots are not allowed on this page.</p></div>';
    document.body.appendChild(blurOverlay);
  };
  
  const removeBlurOverlay = function() {
    if (blurOverlay) {
      blurOverlay.remove();
      blurOverlay = null;
    }
  };
  
  // Detect visibility change (switching apps, screenshot tools)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      createBlurOverlay();
    } else {
      setTimeout(removeBlurOverlay, 500);
    }
  });
  
  // Detect window blur
  window.addEventListener('blur', function() {
    createBlurOverlay();
  });
  
  window.addEventListener('focus', function() {
    setTimeout(removeBlurOverlay, 300);
  });
  
  // Block PrintScreen key
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      createBlurOverlay();
      setTimeout(removeBlurOverlay, 1000);
      alert('Screenshots are disabled on this page.');
    }
  });
  
  // Detect screen capture API (modern browsers)
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
    navigator.mediaDevices.getDisplayMedia = function() {
      alert('Screen capture is not allowed on this page.');
      return Promise.reject(new Error('Screen capture blocked'));
    };
  }
})();
</script>
<style>
  /* Additional CSS protection */
  body {
    -webkit-touch-callout: none;
  }
  @media print {
    body { display: none !important; }
  }
</style>`
    },
    {
      id: 'watermark-overlay',
      name: 'Dynamic Watermark Overlay',
      description: 'Adds a customizable watermark across all content that is difficult to remove',
      icon: Layers,
      category: 'protection',
      popular: true,
      code: `<!-- Dynamic Watermark Overlay -->
<script>
(function() {
  // Configuration - customize these values
  const config = {
    text: 'CONFIDENTIAL', // Your watermark text
    color: 'rgba(128, 128, 128, 0.15)', // Watermark color with transparency
    fontSize: '20px',
    rotation: -30, // Rotation angle in degrees
    spacing: 200, // Space between watermarks
    includeTimestamp: true, // Add timestamp to watermark
    includeUserInfo: true // Add user info if available
  };
  
  const createWatermark = function() {
    // Remove existing watermark
    const existing = document.getElementById('watermark-overlay');
    if (existing) existing.remove();
    
    // Create canvas for watermark pattern
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = config.spacing;
    canvas.height = config.spacing;
    
    // Build watermark text
    let watermarkText = config.text;
    if (config.includeTimestamp) {
      const now = new Date();
      watermarkText += ' | ' + now.toLocaleDateString();
    }
    if (config.includeUserInfo && window.userEmail) {
      watermarkText += ' | ' + window.userEmail;
    }
    
    // Draw watermark on canvas
    ctx.font = config.fontSize + ' Arial';
    ctx.fillStyle = config.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((config.rotation * Math.PI) / 180);
    ctx.fillText(watermarkText, 0, 0);
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'watermark-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999998;background-repeat:repeat;';
    overlay.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    
    document.body.appendChild(overlay);
  };
  
  // Create watermark on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWatermark);
  } else {
    createWatermark();
  }
  
  // Prevent watermark removal
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.removedNodes) {
        mutation.removedNodes.forEach(function(node) {
          if (node.id === 'watermark-overlay') {
            setTimeout(createWatermark, 10);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true });
  
  // Expose function to update watermark (e.g., after user login)
  window.updateWatermark = createWatermark;
})();
</script>`
    },
    {
      id: 'content-encryption',
      name: 'Content Encryption Display',
      description: 'Encrypts sensitive content and decrypts it only when the page loads with proper authentication',
      icon: KeyRound,
      category: 'advanced',
      code: `<!-- Content Encryption/Decryption -->
<script>
(function() {
  // Simple encryption using XOR cipher (for demo - use AES for production)
  const encryptionKey = 'your-secret-key-here'; // Change this!
  
  const xorCipher = function(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };
  
  const btoa_safe = function(str) {
    return btoa(unescape(encodeURIComponent(str)));
  };
  
  const atob_safe = function(str) {
    return decodeURIComponent(escape(atob(str)));
  };
  
  // Encrypt content (use this to generate encrypted strings)
  window.encryptContent = function(plaintext) {
    const encrypted = xorCipher(plaintext, encryptionKey);
    return btoa_safe(encrypted);
  };
  
  // Decrypt content
  window.decryptContent = function(ciphertext) {
    try {
      const decoded = atob_safe(ciphertext);
      return xorCipher(decoded, encryptionKey);
    } catch(e) {
      return '[Decryption Failed]';
    }
  };
  
  // Auto-decrypt elements with data-encrypted attribute
  const decryptElements = function() {
    const elements = document.querySelectorAll('[data-encrypted]');
    elements.forEach(function(el) {
      const encrypted = el.getAttribute('data-encrypted');
      if (encrypted) {
        el.textContent = window.decryptContent(encrypted);
        el.removeAttribute('data-encrypted');
      }
    });
  };
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decryptElements);
  } else {
    decryptElements();
  }
  
  // Usage example:
  // <span data-encrypted="YOUR_ENCRYPTED_STRING_HERE">Loading...</span>
  // Generate encrypted string: console.log(encryptContent('Sensitive data here'));
})();
</script>`
    },
    {
      id: 'copy-protection-advanced',
      name: 'Advanced Copy Protection',
      description: 'Comprehensive protection against copying with custom messages and selective protection',
      icon: Ban,
      category: 'protection',
      code: `<!-- Advanced Copy Protection -->
<script>
(function() {
  const config = {
    message: 'Content is protected. Copying is not allowed.',
    allowInputs: true, // Allow copying from input fields
    protectedClass: 'protected', // Only protect elements with this class (leave empty for all)
    showNotification: true
  };
  
  const showNotification = function(msg) {
    if (!config.showNotification) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4444;color:white;padding:12px 24px;border-radius:8px;z-index:999999;font-family:sans-serif;font-size:14px;animation:fadeIn 0.3s ease;';
    notification.textContent = msg;
    document.body.appendChild(notification);
    
    setTimeout(function() {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(function() { notification.remove(); }, 300);
    }, 2000);
  };
  
  const isProtected = function(element) {
    if (!config.protectedClass) return true;
    return element.closest('.' + config.protectedClass) !== null;
  };
  
  // Disable copy event
  document.addEventListener('copy', function(e) {
    const selection = window.getSelection();
    const selectedElement = selection.anchorNode?.parentElement;
    
    if (config.allowInputs && selectedElement) {
      const tag = selectedElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    }
    
    if (isProtected(selectedElement)) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', '');
      showNotification(config.message);
    }
  });
  
  // Disable cut event
  document.addEventListener('cut', function(e) {
    const selection = window.getSelection();
    const selectedElement = selection.anchorNode?.parentElement;
    
    if (config.allowInputs && selectedElement) {
      const tag = selectedElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    }
    
    if (isProtected(selectedElement)) {
      e.preventDefault();
      showNotification(config.message);
    }
  });
  
  // Block Ctrl+C/Cmd+C outside inputs
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === 'C') {
      const activeElement = document.activeElement;
      const tag = activeElement?.tagName;
      
      if (config.allowInputs && (tag === 'INPUT' || tag === 'TEXTAREA')) return;
      
      const selection = window.getSelection();
      if (selection.toString() && isProtected(selection.anchorNode?.parentElement)) {
        e.preventDefault();
        showNotification(config.message);
      }
    }
  });
})();
</script>
<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>`
    },
    {
      id: 'bot-detection',
      name: 'Bot Detection Script',
      description: 'Detects automated bots and scrapers visiting your website',
      icon: AlertTriangle,
      category: 'security',
      code: `<!-- Bot Detection Script -->
<script>
(function() {
  const botIndicators = {
    isBot: false,
    reasons: []
  };
  
  // Check for common bot signatures
  const checkBot = function() {
    // 1. Check user agent
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = ['bot', 'crawl', 'spider', 'slurp', 'mediapartners', 'headless'];
    botPatterns.forEach(function(pattern) {
      if (ua.includes(pattern)) {
        botIndicators.isBot = true;
        botIndicators.reasons.push('Bot user agent detected: ' + pattern);
      }
    });
    
    // 2. Check for headless browser indicators
    if (navigator.webdriver) {
      botIndicators.isBot = true;
      botIndicators.reasons.push('WebDriver detected');
    }
    
    // 3. Check for missing browser features
    if (!window.chrome && ua.includes('chrome')) {
      botIndicators.isBot = true;
      botIndicators.reasons.push('Fake Chrome detected');
    }
    
    // 4. Check for automation tools
    if (window._phantom || window.__nightmare || window.callPhantom) {
      botIndicators.isBot = true;
      botIndicators.reasons.push('Automation tool detected');
    }
    
    // 5. Check plugins (most bots have none)
    if (navigator.plugins.length === 0 && !(/mobile|android/i.test(ua))) {
      botIndicators.isBot = true;
      botIndicators.reasons.push('No plugins detected (desktop)');
    }
    
    // 6. Check for consistent screen dimensions
    if (window.outerWidth === 0 || window.outerHeight === 0) {
      botIndicators.isBot = true;
      botIndicators.reasons.push('Invalid screen dimensions');
    }
    
    return botIndicators;
  };
  
  const result = checkBot();
  
  if (result.isBot) {
    console.warn('Bot detected:', result.reasons);
    // Take action - block, redirect, or track
    // document.body.innerHTML = '<h1>Access Denied</h1>';
    // Or send to analytics
    // fetch('/api/bot-detected', { method: 'POST', body: JSON.stringify(result) });
  }
  
  // Expose for external use
  window.botDetection = result;
})();
</script>`
    },
    {
      id: 'auto-refresh-protection',
      name: 'Auto-Refresh Content Protection',
      description: 'Periodically refreshes protected content to prevent static scraping',
      icon: RefreshCw,
      category: 'advanced',
      code: `<!-- Auto-Refresh Content Protection -->
<script>
(function() {
  const config = {
    refreshInterval: 30000, // 30 seconds
    tokenEndpoint: '/api/refresh-token', // Your token endpoint
    protectedSelector: '.protected-content',
    enableTokenRotation: true
  };
  
  let currentToken = null;
  let refreshTimer = null;
  
  // Generate client-side token (for demo)
  const generateToken = function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Refresh token periodically
  const refreshToken = async function() {
    const newToken = generateToken();
    
    // In production, fetch from server:
    // const response = await fetch(config.tokenEndpoint);
    // const data = await response.json();
    // newToken = data.token;
    
    currentToken = newToken;
    
    // Update all protected elements with new token
    const elements = document.querySelectorAll(config.protectedSelector);
    elements.forEach(function(el) {
      el.setAttribute('data-token', currentToken);
    });
    
    // Invalidate cached content
    if ('caches' in window) {
      caches.keys().then(function(names) {
        names.forEach(function(name) {
          caches.delete(name);
        });
      });
    }
    
    console.log('[Protection] Token refreshed:', currentToken.substr(0, 8) + '...');
  };
  
  // Start auto-refresh
  const startProtection = function() {
    refreshToken(); // Initial token
    refreshTimer = setInterval(refreshToken, config.refreshInterval);
  };
  
  // Stop auto-refresh
  const stopProtection = function() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };
  
  // Handle visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopProtection();
    } else {
      startProtection();
    }
  });
  
  // Start on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startProtection);
  } else {
    startProtection();
  }
  
  // Expose controls
  window.contentProtection = {
    refresh: refreshToken,
    start: startProtection,
    stop: stopProtection,
    getToken: function() { return currentToken; }
  };
})();
</script>`
    },
    {
      id: 'image-protection',
      name: 'Image Download Protection',
      description: 'Protects images from being downloaded or saved with multiple techniques',
      icon: Image,
      category: 'protection',
      code: `<!-- Image Download Protection -->
<script>
(function() {
  // Apply protection to all images
  const protectImages = function() {
    const images = document.querySelectorAll('img:not([data-protected])');
    
    images.forEach(function(img) {
      // Mark as protected
      img.setAttribute('data-protected', 'true');
      
      // Disable dragging
      img.setAttribute('draggable', 'false');
      
      // Create wrapper if not exists
      if (!img.parentElement.classList.contains('img-protection-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-protection-wrapper';
        wrapper.style.cssText = 'position:relative;display:inline-block;';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // Add invisible overlay
        const overlay = document.createElement('div');
        overlay.className = 'img-protection-overlay';
        overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;background:transparent;';
        wrapper.appendChild(overlay);
      }
      
      // Disable context menu on image
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Disable long press on mobile
      img.addEventListener('touchstart', function(e) {
        e.target.style.pointerEvents = 'none';
        setTimeout(function() {
          e.target.style.pointerEvents = 'auto';
        }, 500);
      });
    });
  };
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectImages);
  } else {
    protectImages();
  }
  
  // Watch for new images
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'IMG' || (node.querySelectorAll && node.querySelectorAll('img').length)) {
            protectImages();
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>
<style>
  .img-protection-wrapper img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none;
  }
  .img-protection-overlay {
    -webkit-touch-callout: none;
  }
</style>`
    }
  ];

  const categories = [
    { id: 'all', label: 'All Scripts', icon: Code2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'protection', label: 'Content Protection', icon: Lock },
    { id: 'advanced', label: 'Advanced', icon: KeyRound },
    { id: 'utility', label: 'Utility', icon: Clock },
  ];

  const filteredScripts = activeCategory === 'all' 
    ? scripts 
    : scripts.filter(s => s.category === activeCategory);

  return (
    <div className="py-8 sm:py-12">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <Code2 className="w-3 h-3 mr-1" />
          JS Script Generator
        </Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          Ready-to-Use JavaScript Scripts
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Protect your website with production-ready scripts. Copy and paste into your site to enable code inspection blocking, content protection, and more.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="text-xs sm:text-sm"
          >
            <category.icon className="w-3 h-3 mr-1" />
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredScripts.map((script) => (
          <Card key={script.id} className="overflow-hidden">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                    <script.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm sm:text-lg flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="truncate">{script.name}</span>
                      {script.popular && (
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px]">Popular</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-[11px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-2">
                      {script.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              <div className="relative">
                <pre className="bg-muted/50 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs overflow-x-auto max-h-36 sm:max-h-48 scrollbar-hide">
                  <code className="break-all sm:break-normal">{script.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 text-xs min-h-[32px] px-2 sm:px-3"
                  onClick={() => handleCopy(script.code, script.id)}
                >
                  {copiedId === script.id ? (
                    <>
                      <Check className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Instructions */}
      <Card className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <h3 className="text-lg sm:text-xl font-bold mb-3">How to Use These Scripts</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="font-medium text-primary">1.</span>
            <span>Copy the script code using the "Copy" button</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-primary">2.</span>
            <span>Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-primary">3.</span>
            <span>For platforms like Webflow or Wix, use their custom code embed features</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-primary">4.</span>
            <span>Test thoroughly to ensure it works with your existing functionality</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-muted-foreground/80">
          <strong>Note:</strong> These scripts provide basic protection. Determined users with technical knowledge may still find ways around them. Consider these as deterrents rather than absolute security measures.
        </p>
      </Card>
    </div>
  );
};
