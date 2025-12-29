import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Copy, Check, Shield, Eye, EyeOff, Lock, MousePointer, Clock, Ban, Fingerprint, 
  Code2, Camera, Image, KeyRound, Layers, AlertTriangle, RefreshCw, Zap, BarChart3,
  Users, Globe, Bell, Share2, MessageSquare, Heart, Star, TrendingUp, Timer,
  Smartphone, Monitor, Search, FileText, Download, Upload, Play, Pause, Volume2,
  Moon, Sun, Cookie, MapPin, Wifi, Battery, Gauge, Activity, Target, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface JSScript {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'security' | 'protection' | 'analytics' | 'performance' | 'engagement' | 'utility';
  code: string;
  popular?: boolean;
}

export const JSScriptGenerator = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Scripts', count: 0 },
    { id: 'security', label: 'Security', count: 0 },
    { id: 'protection', label: 'Protection', count: 0 },
    { id: 'analytics', label: 'Analytics', count: 0 },
    { id: 'performance', label: 'Performance', count: 0 },
    { id: 'engagement', label: 'Engagement', count: 0 },
    { id: 'utility', label: 'Utility', count: 0 },
  ];

  const scripts: JSScript[] = [
    // ========== SECURITY SCRIPTS ==========
    {
      id: 'disable-inspect',
      name: 'Disable Inspect Element',
      description: 'Blocks right-click context menu and keyboard shortcuts for developer tools',
      icon: Shield,
      category: 'security',
      popular: true,
      code: `<!-- Disable Inspect Element & DevTools -->
<script>
(function() {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault(); return false;
    }
    if (e.ctrlKey && e.key.toUpperCase() === 'U') { e.preventDefault(); return false; }
  });
  console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
})();
</script>`
    },
    {
      id: 'devtools-detect',
      name: 'DevTools Detection',
      description: 'Detects when browser developer tools are opened and takes action',
      icon: Eye,
      category: 'security',
      popular: true,
      code: `<!-- DevTools Detection Script -->
<script>
(function() {
  const threshold = 160;
  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;padding:20px;"><h1>Developer tools detected. Please close them to continue.</h1></div>';
    }
  }, 500);
})();
</script>`
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
  console.clear();
  setInterval(function() { console.clear(); }, 1000);
  console.log('%cWarning!', 'color: red; font-size: 40px; font-weight: bold;');
  console.log('%cThis console is monitored.', 'font-size: 14px;');
})();
</script>`
    },
    {
      id: 'xss-protection',
      name: 'XSS Protection',
      description: 'Basic XSS attack prevention by sanitizing user inputs',
      icon: Shield,
      category: 'security',
      code: `<!-- XSS Protection Script -->
<script>
(function() {
  window.sanitizeHTML = function(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };
  
  // Auto-sanitize all form inputs on submit
  document.addEventListener('submit', function(e) {
    const inputs = e.target.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(function(input) {
      input.value = window.sanitizeHTML(input.value);
    });
  });
})();
</script>`
    },
    {
      id: 'sql-injection-prevent',
      name: 'SQL Injection Prevention',
      description: 'Client-side SQL injection pattern detection and blocking',
      icon: Shield,
      category: 'security',
      code: `<!-- SQL Injection Prevention -->
<script>
(function() {
  const sqlPatterns = /('|"|;|--|\/\*|\*\/|xp_|sp_|exec|execute|insert|select|delete|update|drop|create|alter|union|into|load_file|outfile)/gi;
  
  document.addEventListener('submit', function(e) {
    const inputs = e.target.querySelectorAll('input, textarea');
    for (let input of inputs) {
      if (sqlPatterns.test(input.value)) {
        e.preventDefault();
        alert('Invalid characters detected. Please remove special characters.');
        return false;
      }
    }
  });
})();
</script>`
    },
    {
      id: 'csrf-token',
      name: 'CSRF Token Generator',
      description: 'Generates and validates CSRF tokens for form submissions',
      icon: KeyRound,
      category: 'security',
      code: `<!-- CSRF Token Generator -->
<script>
(function() {
  function generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  
  document.querySelectorAll('form').forEach(function(form) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf_token';
    input.value = token;
    form.appendChild(input);
  });
})();
</script>`
    },
    {
      id: 'clickjacking-prevent',
      name: 'Clickjacking Prevention',
      description: 'Prevents your site from being loaded in iframes on other domains',
      icon: Shield,
      category: 'security',
      code: `<!-- Clickjacking Prevention -->
<script>
(function() {
  if (window.self !== window.top) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>This content cannot be displayed in an iframe.</h1></div>';
    window.top.location = window.self.location;
  }
})();
</script>`
    },
    {
      id: 'password-strength',
      name: 'Password Strength Checker',
      description: 'Real-time password strength validation with visual feedback',
      icon: Lock,
      category: 'security',
      code: `<!-- Password Strength Checker -->
<script>
(function() {
  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }
  
  document.querySelectorAll('input[type="password"]').forEach(function(input) {
    const indicator = document.createElement('div');
    indicator.style.cssText = 'height:4px;margin-top:4px;border-radius:2px;transition:all 0.3s;';
    input.parentNode.insertBefore(indicator, input.nextSibling);
    
    input.addEventListener('input', function() {
      const strength = checkPasswordStrength(this.value);
      const colors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#00cc44'];
      indicator.style.width = (strength * 20) + '%';
      indicator.style.backgroundColor = colors[strength] || '#ff4444';
    });
  });
})();
</script>`
    },
    {
      id: 'rate-limiter',
      name: 'Rate Limiter',
      description: 'Limits form submissions to prevent spam and abuse',
      icon: Clock,
      category: 'security',
      code: `<!-- Rate Limiter -->
<script>
(function() {
  const rateLimits = {};
  const maxAttempts = 5;
  const windowMs = 60000; // 1 minute
  
  document.addEventListener('submit', function(e) {
    const formId = e.target.id || 'default';
    const now = Date.now();
    
    if (!rateLimits[formId]) {
      rateLimits[formId] = { attempts: 0, resetTime: now + windowMs };
    }
    
    if (now > rateLimits[formId].resetTime) {
      rateLimits[formId] = { attempts: 0, resetTime: now + windowMs };
    }
    
    rateLimits[formId].attempts++;
    
    if (rateLimits[formId].attempts > maxAttempts) {
      e.preventDefault();
      alert('Too many attempts. Please try again later.');
      return false;
    }
  });
})();
</script>`
    },

    // ========== PROTECTION SCRIPTS ==========
    {
      id: 'anti-screenshot',
      name: 'Anti-Screenshot Protection',
      description: 'Detects and prevents screenshots using blur overlay technique',
      icon: Camera,
      category: 'protection',
      popular: true,
      code: `<!-- Anti-Screenshot Protection -->
<script>
(function() {
  let overlay = null;
  
  function showOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;color:white;font-family:sans-serif;text-align:center;padding:20px;';
    overlay.innerHTML = '<div><h2>Content Protected</h2><p>Screenshots are not allowed.</p></div>';
    document.body.appendChild(overlay);
  }
  
  function hideOverlay() {
    if (overlay) { overlay.remove(); overlay = null; }
  }
  
  document.addEventListener('visibilitychange', function() {
    document.hidden ? showOverlay() : setTimeout(hideOverlay, 500);
  });
  window.addEventListener('blur', showOverlay);
  window.addEventListener('focus', function() { setTimeout(hideOverlay, 300); });
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      showOverlay();
      setTimeout(hideOverlay, 1000);
    }
  });
})();
</script>`
    },
    {
      id: 'disable-text-select',
      name: 'Disable Text Selection',
      description: 'Prevents users from selecting and copying text content',
      icon: Ban,
      category: 'protection',
      code: `<!-- Disable Text Selection -->
<style>
body { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
input, textarea { -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; }
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
<style>
img { pointer-events: auto; -webkit-user-drag: none; }
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img').forEach(function(img) {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', function(e) { e.preventDefault(); });
  });
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); }
  });
});
</script>`
    },
    {
      id: 'hotkey-blocker',
      name: 'Keyboard Shortcut Blocker',
      description: 'Blocks common shortcuts for copying, saving, and printing',
      icon: Lock,
      category: 'protection',
      popular: true,
      code: `<!-- Keyboard Shortcut Blocker -->
<script>
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && ['S', 'C', 'P', 'A', 'U'].includes(e.key.toUpperCase())) {
    e.preventDefault();
    return false;
  }
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
    return false;
  }
});
</script>`
    },
    {
      id: 'watermark-overlay',
      name: 'Dynamic Watermark Overlay',
      description: 'Adds a customizable watermark across all content',
      icon: Layers,
      category: 'protection',
      popular: true,
      code: `<!-- Dynamic Watermark Overlay -->
<script>
(function() {
  const text = 'CONFIDENTIAL';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;
  
  ctx.rotate(-30 * Math.PI / 180);
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgba(128, 128, 128, 0.15)';
  ctx.fillText(text, 20, 100);
  
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;background-image:url(' + canvas.toDataURL() + ');background-repeat:repeat;';
  document.body.appendChild(overlay);
})();
</script>`
    },
    {
      id: 'disable-print',
      name: 'Disable Print',
      description: 'Prevents users from printing the page content',
      icon: FileText,
      category: 'protection',
      code: `<!-- Disable Print -->
<style>
@media print {
  body { display: none !important; }
  html::after { content: 'Printing is disabled on this page.'; display: block; text-align: center; padding: 50px; font-size: 24px; }
}
</style>
<script>
window.addEventListener('beforeprint', function(e) {
  e.preventDefault();
  alert('Printing is not allowed on this page.');
});
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toUpperCase() === 'P') {
    e.preventDefault();
    alert('Printing is disabled.');
  }
});
</script>`
    },
    {
      id: 'image-protection',
      name: 'Image Download Protection',
      description: 'Advanced protection to prevent image downloads',
      icon: Image,
      category: 'protection',
      code: `<!-- Image Download Protection -->
<style>
img { pointer-events: none; }
.protected-image { position: relative; display: inline-block; }
.protected-image::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: transparent; }
</style>
<script>
document.querySelectorAll('img').forEach(function(img) {
  const wrapper = document.createElement('div');
  wrapper.className = 'protected-image';
  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);
  img.setAttribute('oncontextmenu', 'return false;');
});
</script>`
    },
    {
      id: 'content-encryption',
      name: 'Content Encryption Display',
      description: 'Displays content that is harder to scrape programmatically',
      icon: KeyRound,
      category: 'protection',
      code: `<!-- Content Encryption Display -->
<script>
(function() {
  window.renderSecureText = function(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = getComputedStyle(element).font || '16px Arial';
    canvas.width = ctx.measureText(text).width + 20;
    canvas.height = 30;
    ctx.font = getComputedStyle(element).font || '16px Arial';
    ctx.fillStyle = getComputedStyle(element).color || '#000';
    ctx.fillText(text, 10, 22);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.style.display = 'inline-block';
    img.setAttribute('draggable', 'false');
    element.innerHTML = '';
    element.appendChild(img);
  };
})();
</script>`
    },
    {
      id: 'bot-detection',
      name: 'Bot Detection Script',
      description: 'Detects automated bots and crawlers visiting your site',
      icon: AlertTriangle,
      category: 'protection',
      code: `<!-- Bot Detection Script -->
<script>
(function() {
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i, /headless/i,
    /phantom/i, /selenium/i, /puppeteer/i, /playwright/i
  ];
  
  const isBot = botPatterns.some(function(pattern) {
    return pattern.test(navigator.userAgent);
  }) || !navigator.languages || navigator.languages.length === 0 || navigator.webdriver;
  
  if (isBot) {
    console.warn('Bot detected');
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>Access Denied</h1></div>';
  }
})();
</script>`
    },

    // ========== ANALYTICS SCRIPTS ==========
    {
      id: 'page-view-tracker',
      name: 'Page View Tracker',
      description: 'Tracks page views with session and visitor information',
      icon: BarChart3,
      category: 'analytics',
      popular: true,
      code: `<!-- Page View Tracker -->
<script>
(function() {
  const pageView = {
    url: window.location.href,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    sessionId: sessionStorage.getItem('session_id') || (sessionStorage.setItem('session_id', Math.random().toString(36).substring(2)), sessionStorage.getItem('session_id')),
    screenWidth: screen.width,
    screenHeight: screen.height,
    userAgent: navigator.userAgent
  };
  
  console.log('Page View:', pageView);
  // Send to your analytics endpoint:
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(pageView) });
})();
</script>`
    },
    {
      id: 'click-tracker',
      name: 'Click Event Tracker',
      description: 'Tracks all click events on the page with element details',
      icon: Target,
      category: 'analytics',
      code: `<!-- Click Event Tracker -->
<script>
(function() {
  document.addEventListener('click', function(e) {
    const clickData = {
      element: e.target.tagName,
      id: e.target.id,
      className: e.target.className,
      text: e.target.textContent?.substring(0, 50),
      x: e.clientX,
      y: e.clientY,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    console.log('Click:', clickData);
    // Send to analytics: fetch('/api/clicks', { method: 'POST', body: JSON.stringify(clickData) });
  });
})();
</script>`
    },
    {
      id: 'scroll-depth',
      name: 'Scroll Depth Tracker',
      description: 'Tracks how far users scroll down your pages',
      icon: Activity,
      category: 'analytics',
      popular: true,
      code: `<!-- Scroll Depth Tracker -->
<script>
(function() {
  const milestones = [25, 50, 75, 100];
  const reached = {};
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    milestones.forEach(function(milestone) {
      if (scrollPercent >= milestone && !reached[milestone]) {
        reached[milestone] = true;
        console.log('Scroll depth:', milestone + '%');
        // Track: fetch('/api/scroll', { method: 'POST', body: JSON.stringify({ depth: milestone }) });
      }
    });
  });
})();
</script>`
    },
    {
      id: 'time-on-page',
      name: 'Time on Page Tracker',
      description: 'Measures how long visitors spend on each page',
      icon: Clock,
      category: 'analytics',
      code: `<!-- Time on Page Tracker -->
<script>
(function() {
  const startTime = Date.now();
  let totalTime = 0;
  let isActive = true;
  
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      totalTime += Date.now() - startTime;
      isActive = false;
    } else {
      isActive = true;
    }
  });
  
  window.addEventListener('beforeunload', function() {
    if (isActive) totalTime += Date.now() - startTime;
    const seconds = Math.round(totalTime / 1000);
    navigator.sendBeacon('/api/time-on-page', JSON.stringify({
      url: window.location.href,
      seconds: seconds
    }));
  });
})();
</script>`
    },
    {
      id: 'browser-fingerprint',
      name: 'Browser Fingerprint',
      description: 'Generates a unique browser fingerprint for tracking',
      icon: Fingerprint,
      category: 'analytics',
      code: `<!-- Browser Fingerprint -->
<script>
(function() {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    screenRes: screen.width + 'x' + screen.height,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: 'ontouchstart' in window
  };
  
  let hash = 0;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  
  window.browserFingerprint = Math.abs(hash).toString(16);
  console.log('Fingerprint:', window.browserFingerprint);
})();
</script>`
    },
    {
      id: 'utm-tracker',
      name: 'UTM Parameter Tracker',
      description: 'Captures and stores UTM parameters for marketing attribution',
      icon: TrendingUp,
      category: 'analytics',
      code: `<!-- UTM Parameter Tracker -->
<script>
(function() {
  const params = new URLSearchParams(window.location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utm = {};
  
  utmParams.forEach(function(param) {
    const value = params.get(param);
    if (value) {
      utm[param] = value;
      localStorage.setItem(param, value);
    }
  });
  
  if (Object.keys(utm).length > 0) {
    console.log('UTM Parameters:', utm);
    // Track: fetch('/api/utm', { method: 'POST', body: JSON.stringify(utm) });
  }
})();
</script>`
    },
    {
      id: 'form-analytics',
      name: 'Form Analytics Tracker',
      description: 'Tracks form interactions, abandonment, and completion rates',
      icon: FileText,
      category: 'analytics',
      code: `<!-- Form Analytics Tracker -->
<script>
(function() {
  document.querySelectorAll('form').forEach(function(form, index) {
    const formId = form.id || 'form_' + index;
    let started = false;
    
    form.addEventListener('focusin', function() {
      if (!started) {
        started = true;
        console.log('Form started:', formId);
      }
    });
    
    form.addEventListener('submit', function() {
      console.log('Form completed:', formId);
    });
    
    window.addEventListener('beforeunload', function() {
      if (started && !form.dataset.submitted) {
        console.log('Form abandoned:', formId);
      }
    });
  });
})();
</script>`
    },
    {
      id: 'error-tracker',
      name: 'JavaScript Error Tracker',
      description: 'Captures and logs JavaScript errors for debugging',
      icon: AlertTriangle,
      category: 'analytics',
      code: `<!-- JavaScript Error Tracker -->
<script>
window.addEventListener('error', function(e) {
  const error = {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  console.error('JS Error:', error);
  // Send: fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) });
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise:', e.reason);
});
</script>`
    },
    {
      id: 'heatmap-data',
      name: 'Heatmap Data Collector',
      description: 'Collects click and movement data for heatmap visualization',
      icon: Activity,
      category: 'analytics',
      code: `<!-- Heatmap Data Collector -->
<script>
(function() {
  const clicks = [];
  const moves = [];
  
  document.addEventListener('click', function(e) {
    clicks.push({ x: e.pageX, y: e.pageY, t: Date.now() });
  });
  
  let moveThrottle = 0;
  document.addEventListener('mousemove', function(e) {
    if (Date.now() - moveThrottle > 100) {
      moves.push({ x: e.pageX, y: e.pageY });
      moveThrottle = Date.now();
      if (moves.length > 100) moves.shift();
    }
  });
  
  window.getHeatmapData = function() {
    return { clicks, moves, pageHeight: document.body.scrollHeight };
  };
})();
</script>`
    },

    // ========== PERFORMANCE SCRIPTS ==========
    {
      id: 'lazy-load-images',
      name: 'Lazy Load Images',
      description: 'Defers loading of images until they are in viewport',
      icon: Image,
      category: 'performance',
      popular: true,
      code: `<!-- Lazy Load Images -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });
  
  images.forEach(function(img) { observer.observe(img); });
});
</script>`
    },
    {
      id: 'script-defer',
      name: 'Script Defer Loader',
      description: 'Loads non-critical scripts after page load',
      icon: Download,
      category: 'performance',
      code: `<!-- Script Defer Loader -->
<script>
(function() {
  const deferredScripts = [
    // Add your script URLs here
    // 'https://example.com/analytics.js',
    // 'https://example.com/chat-widget.js'
  ];
  
  function loadScripts() {
    deferredScripts.forEach(function(src) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }
  
  if (document.readyState === 'complete') {
    loadScripts();
  } else {
    window.addEventListener('load', loadScripts);
  }
})();
</script>`
    },
    {
      id: 'resource-prefetch',
      name: 'Resource Prefetch',
      description: 'Prefetches resources for faster subsequent page loads',
      icon: Zap,
      category: 'performance',
      popular: true,
      code: `<!-- Resource Prefetch -->
<script>
(function() {
  const urlsToPrefetch = [
    // Add URLs to prefetch
    // '/about', '/products', '/contact'
  ];
  
  function prefetchUrl(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  
  // Prefetch on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
      urlsToPrefetch.forEach(prefetchUrl);
    });
  } else {
    setTimeout(function() {
      urlsToPrefetch.forEach(prefetchUrl);
    }, 2000);
  }
})();
</script>`
    },
    {
      id: 'debounce-throttle',
      name: 'Debounce & Throttle Utilities',
      description: 'Performance utilities for limiting function execution',
      icon: Gauge,
      category: 'performance',
      code: `<!-- Debounce & Throttle Utilities -->
<script>
(function() {
  window.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };
  
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // Example usage:
  // window.addEventListener('scroll', throttle(handleScroll, 100));
  // input.addEventListener('input', debounce(handleSearch, 300));
})();
</script>`
    },
    {
      id: 'local-storage-cache',
      name: 'Local Storage Cache',
      description: 'Caches API responses in localStorage for faster loading',
      icon: Download,
      category: 'performance',
      code: `<!-- Local Storage Cache -->
<script>
(function() {
  window.cachedFetch = async function(url, options = {}, ttl = 300000) {
    const cacheKey = 'cache_' + btoa(url);
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        return Promise.resolve(data);
      }
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      expiry: Date.now() + ttl
    }));
    
    return data;
  };
})();
</script>`
    },
    {
      id: 'perf-monitor',
      name: 'Performance Monitor',
      description: 'Monitors and logs Core Web Vitals and performance metrics',
      icon: Activity,
      category: 'performance',
      code: `<!-- Performance Monitor -->
<script>
(function() {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver(function(list) {
      const entries = list.getEntries();
      console.log('LCP:', entries[entries.length - 1].startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // First Input Delay
    new PerformanceObserver(function(list) {
      list.getEntries().forEach(function(entry) {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ type: 'first-input', buffered: true });
    
    // Cumulative Layout Shift
    let cls = 0;
    new PerformanceObserver(function(list) {
      list.getEntries().forEach(function(entry) {
        if (!entry.hadRecentInput) cls += entry.value;
      });
      console.log('CLS:', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  }
})();
</script>`
    },
    {
      id: 'image-compression',
      name: 'Client-Side Image Compression',
      description: 'Compresses images before upload to reduce bandwidth',
      icon: Image,
      category: 'performance',
      code: `<!-- Client-Side Image Compression -->
<script>
(function() {
  window.compressImage = function(file, maxWidth = 1200, quality = 0.8) {
    return new Promise(function(resolve) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
})();
</script>`
    },

    // ========== ENGAGEMENT SCRIPTS ==========
    {
      id: 'exit-intent',
      name: 'Exit Intent Popup',
      description: 'Shows a popup when user is about to leave the page',
      icon: AlertTriangle,
      category: 'engagement',
      popular: true,
      code: `<!-- Exit Intent Popup -->
<script>
(function() {
  let shown = false;
  
  document.addEventListener('mouseout', function(e) {
    if (!shown && e.clientY < 10 && e.relatedTarget === null) {
      shown = true;
      
      const popup = document.createElement('div');
      popup.innerHTML = \`
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;">
          <div style="background:white;padding:30px;border-radius:12px;max-width:400px;text-align:center;">
            <h2 style="margin:0 0 10px;">Wait! Don\\'t Leave Yet!</h2>
            <p style="color:#666;margin:0 0 20px;">Get 10% off your first order!</p>
            <button onclick="this.closest('div').parentElement.remove()" style="background:#007bff;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;">Get Offer</button>
            <button onclick="this.closest('div').parentElement.parentElement.remove()" style="background:none;border:none;color:#999;margin-top:10px;display:block;width:100%;cursor:pointer;">No thanks</button>
          </div>
        </div>
      \`;
      document.body.appendChild(popup);
    }
  });
})();
</script>`
    },
    {
      id: 'scroll-to-top',
      name: 'Scroll to Top Button',
      description: 'Floating button that scrolls the page to top smoothly',
      icon: Upload,
      category: 'engagement',
      code: `<!-- Scroll to Top Button -->
<script>
(function() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#007bff;color:white;border:none;font-size:20px;cursor:pointer;opacity:0;transition:opacity 0.3s;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.2);';
  document.body.appendChild(btn);
  
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  window.addEventListener('scroll', function() {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
  });
})();
</script>`
    },
    {
      id: 'social-share',
      name: 'Social Share Buttons',
      description: 'Floating social media share buttons',
      icon: Share2,
      category: 'engagement',
      popular: true,
      code: `<!-- Social Share Buttons -->
<script>
(function() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:8px;z-index:9999;';
  
  const platforms = [
    { name: 'Facebook', color: '#1877F2', url: 'https://www.facebook.com/sharer/sharer.php?u=' + url },
    { name: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title },
    { name: 'LinkedIn', color: '#0A66C2', url: 'https://www.linkedin.com/shareArticle?mini=true&url=' + url }
  ];
  
  platforms.forEach(function(p) {
    const btn = document.createElement('a');
    btn.href = p.url;
    btn.target = '_blank';
    btn.title = 'Share on ' + p.name;
    btn.style.cssText = 'width:40px;height:40px;border-radius:50%;background:' + p.color + ';display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.2);';
    btn.textContent = p.name[0];
    container.appendChild(btn);
  });
  
  document.body.appendChild(container);
})();
</script>`
    },
    {
      id: 'cookie-consent',
      name: 'Cookie Consent Banner',
      description: 'GDPR-compliant cookie consent popup',
      icon: Cookie,
      category: 'engagement',
      popular: true,
      code: `<!-- Cookie Consent Banner -->
<script>
(function() {
  if (localStorage.getItem('cookie_consent')) return;
  
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;color:white;padding:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;z-index:99999;';
  banner.innerHTML = \`
    <p style="margin:0;flex:1;min-width:200px;">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
    <div style="display:flex;gap:8px;">
      <button id="accept-cookies" style="background:#4CAF50;color:white;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;">Accept</button>
      <button id="decline-cookies" style="background:transparent;color:white;border:1px solid white;padding:10px 20px;border-radius:4px;cursor:pointer;">Decline</button>
    </div>
  \`;
  document.body.appendChild(banner);
  
  document.getElementById('accept-cookies').onclick = function() {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.remove();
  };
  document.getElementById('decline-cookies').onclick = function() {
    localStorage.setItem('cookie_consent', 'declined');
    banner.remove();
  };
})();
</script>`
    },
    {
      id: 'notification-bell',
      name: 'Notification Bell Widget',
      description: 'Notification center with unread count badge',
      icon: Bell,
      category: 'engagement',
      code: `<!-- Notification Bell Widget -->
<script>
(function() {
  const bell = document.createElement('div');
  bell.style.cssText = 'position:fixed;top:20px;right:20px;cursor:pointer;z-index:9999;';
  bell.innerHTML = \`
    <div style="position:relative;width:40px;height:40px;background:#f0f0f0;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
      🔔
      <span id="notif-count" style="position:absolute;top:-5px;right:-5px;background:#ff4444;color:white;font-size:12px;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;">3</span>
    </div>
    <div id="notif-panel" style="display:none;position:absolute;top:50px;right:0;width:280px;background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);overflow:hidden;">
      <div style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">Notifications</div>
      <div style="max-height:300px;overflow-y:auto;">
        <div style="padding:12px;border-bottom:1px solid #f0f0f0;">New message received</div>
        <div style="padding:12px;border-bottom:1px solid #f0f0f0;">Your order shipped</div>
        <div style="padding:12px;">Welcome to our site!</div>
      </div>
    </div>
  \`;
  document.body.appendChild(bell);
  
  bell.onclick = function() {
    const panel = document.getElementById('notif-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  };
})();
</script>`
    },
    {
      id: 'live-chat-trigger',
      name: 'Live Chat Trigger Button',
      description: 'Floating chat button that opens a chat window',
      icon: MessageSquare,
      category: 'engagement',
      code: `<!-- Live Chat Trigger Button -->
<script>
(function() {
  const btn = document.createElement('div');
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
  btn.innerHTML = \`
    <button id="chat-btn" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;font-size:24px;cursor:pointer;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:transform 0.3s;">💬</button>
    <div id="chat-window" style="display:none;position:absolute;bottom:70px;right:0;width:320px;height:400px;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);overflow:hidden;">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:16px;">
        <strong>Chat with us</strong>
        <button onclick="document.getElementById('chat-window').style.display='none'" style="float:right;background:none;border:none;color:white;cursor:pointer;">×</button>
      </div>
      <div style="padding:16px;height:calc(100% - 120px);overflow-y:auto;">
        <p style="color:#666;text-align:center;">How can we help you today?</p>
      </div>
      <div style="padding:12px;border-top:1px solid #eee;">
        <input type="text" placeholder="Type a message..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:20px;">
      </div>
    </div>
  \`;
  document.body.appendChild(btn);
  
  document.getElementById('chat-btn').onclick = function() {
    const win = document.getElementById('chat-window');
    win.style.display = win.style.display === 'none' ? 'block' : 'none';
  };
})();
</script>`
    },
    {
      id: 'countdown-timer',
      name: 'Countdown Timer',
      description: 'Displays a countdown timer for sales or events',
      icon: Timer,
      category: 'engagement',
      code: `<!-- Countdown Timer -->
<script>
(function() {
  // Set target date (change this)
  const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
  
  const container = document.createElement('div');
  container.id = 'countdown';
  container.style.cssText = 'position:fixed;top:0;left:0;right:0;background:linear-gradient(90deg,#ff416c,#ff4b2b);color:white;padding:12px;text-align:center;z-index:9999;font-family:sans-serif;';
  document.body.appendChild(container);
  
  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      container.innerHTML = '<strong>Offer Expired!</strong>';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    container.innerHTML = '<strong>🔥 Sale ends in: ' + days + 'd ' + hours + 'h ' + mins + 'm ' + secs + 's</strong>';
  }
  
  update();
  setInterval(update, 1000);
})();
</script>`
    },
    {
      id: 'newsletter-popup',
      name: 'Newsletter Signup Popup',
      description: 'Timed popup for newsletter subscription',
      icon: Globe,
      category: 'engagement',
      code: `<!-- Newsletter Signup Popup -->
<script>
(function() {
  if (localStorage.getItem('newsletter_shown')) return;
  
  setTimeout(function() {
    const popup = document.createElement('div');
    popup.innerHTML = \`
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;">
        <div style="background:white;padding:40px;border-radius:16px;max-width:400px;text-align:center;position:relative;">
          <button onclick="this.closest('div').parentElement.remove();localStorage.setItem('newsletter_shown','1')" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          <h2 style="margin:0 0 10px;">📬 Stay Updated!</h2>
          <p style="color:#666;margin:0 0 20px;">Subscribe to get exclusive offers and updates.</p>
          <input type="email" placeholder="Enter your email" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;margin-bottom:12px;box-sizing:border-box;">
          <button style="width:100%;background:#007bff;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;">Subscribe</button>
        </div>
      </div>
    \`;
    document.body.appendChild(popup);
    localStorage.setItem('newsletter_shown', '1');
  }, 5000);
})();
</script>`
    },

    // ========== UTILITY SCRIPTS ==========
    {
      id: 'idle-timeout',
      name: 'Idle Session Timeout',
      description: 'Logs out users after a period of inactivity',
      icon: Clock,
      category: 'utility',
      code: `<!-- Idle Session Timeout -->
<script>
(function() {
  let idleTime = 0;
  const maxIdleMinutes = 15;
  
  function resetTimer() { idleTime = 0; }
  
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keypress', resetTimer);
  document.addEventListener('scroll', resetTimer);
  document.addEventListener('click', resetTimer);
  
  setInterval(function() {
    idleTime++;
    if (idleTime >= maxIdleMinutes) {
      alert('Session expired due to inactivity.');
      window.location.href = '/logout';
    }
  }, 60000);
})();
</script>`
    },
    {
      id: 'dark-mode-toggle',
      name: 'Dark Mode Toggle',
      description: 'Adds a dark mode toggle with system preference detection',
      icon: Moon,
      category: 'utility',
      popular: true,
      code: `<!-- Dark Mode Toggle -->
<script>
(function() {
  const toggle = document.createElement('button');
  toggle.id = 'dark-mode-toggle';
  toggle.style.cssText = 'position:fixed;top:20px;right:20px;width:50px;height:50px;border-radius:50%;border:none;cursor:pointer;font-size:24px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.1);';
  document.body.appendChild(toggle);
  
  function setTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    toggle.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('dark-mode', dark);
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('dark-mode');
  setTheme(savedTheme !== null ? savedTheme === 'true' : prefersDark);
  
  toggle.onclick = function() {
    setTheme(!document.documentElement.classList.contains('dark'));
  };
})();
</script>
<style>
.dark { background: #1a1a2e; color: #eee; }
.dark * { border-color: #333 !important; }
</style>`
    },
    {
      id: 'copy-to-clipboard',
      name: 'Copy to Clipboard Button',
      description: 'Adds copy functionality to code blocks',
      icon: Copy,
      category: 'utility',
      code: `<!-- Copy to Clipboard Button -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('pre, code').forEach(function(block) {
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.style.cssText = 'position:absolute;top:5px;right:5px;padding:4px 8px;font-size:12px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;';
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(btn);
    
    btn.onclick = function() {
      navigator.clipboard.writeText(block.textContent);
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
    };
  });
});
</script>`
    },
    {
      id: 'reading-progress',
      name: 'Reading Progress Bar',
      description: 'Shows a progress bar indicating scroll position',
      icon: Activity,
      category: 'utility',
      code: `<!-- Reading Progress Bar -->
<script>
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:4px;background:linear-gradient(90deg,#007bff,#00d4ff);width:0;z-index:99999;transition:width 0.1s;';
  document.body.appendChild(bar);
  
  window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    bar.style.width = progress + '%';
  });
})();
</script>`
    },
    {
      id: 'smooth-scroll',
      name: 'Smooth Scroll Links',
      description: 'Enables smooth scrolling for anchor links',
      icon: MousePointer,
      category: 'utility',
      code: `<!-- Smooth Scroll Links -->
<script>
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
</script>`
    },
    {
      id: 'print-button',
      name: 'Print Page Button',
      description: 'Adds a floating print button to the page',
      icon: FileText,
      category: 'utility',
      code: `<!-- Print Page Button -->
<script>
(function() {
  const btn = document.createElement('button');
  btn.innerHTML = '🖨️ Print';
  btn.style.cssText = 'position:fixed;bottom:80px;right:20px;padding:12px 20px;background:#28a745;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.2);z-index:9999;';
  btn.onclick = function() { window.print(); };
  document.body.appendChild(btn);
})();
</script>`
    },
    {
      id: 'geolocation',
      name: 'Geolocation Detector',
      description: 'Detects and displays user location information',
      icon: MapPin,
      category: 'utility',
      code: `<!-- Geolocation Detector -->
<script>
(function() {
  window.getUserLocation = function(callback) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          callback(null, {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        function(err) { callback(err, null); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      callback(new Error('Geolocation not supported'), null);
    }
  };
  
  // Example: getUserLocation(function(err, loc) { console.log(loc); });
})();
</script>`
    },
    {
      id: 'network-status',
      name: 'Network Status Monitor',
      description: 'Monitors and displays network connection status',
      icon: Wifi,
      category: 'utility',
      code: `<!-- Network Status Monitor -->
<script>
(function() {
  const indicator = document.createElement('div');
  indicator.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);padding:8px 16px;border-radius:20px;font-size:14px;z-index:99999;display:none;';
  document.body.appendChild(indicator);
  
  function showStatus(online) {
    indicator.textContent = online ? '✓ Back online' : '✗ No connection';
    indicator.style.background = online ? '#4CAF50' : '#f44336';
    indicator.style.color = 'white';
    indicator.style.display = 'block';
    if (online) setTimeout(function() { indicator.style.display = 'none'; }, 3000);
  }
  
  window.addEventListener('online', function() { showStatus(true); });
  window.addEventListener('offline', function() { showStatus(false); });
})();
</script>`
    },
    {
      id: 'battery-status',
      name: 'Battery Status Display',
      description: 'Shows device battery level and charging status',
      icon: Battery,
      category: 'utility',
      code: `<!-- Battery Status Display -->
<script>
(function() {
  if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
      const display = document.createElement('div');
      display.style.cssText = 'position:fixed;top:10px;right:10px;background:#333;color:white;padding:8px 12px;border-radius:6px;font-size:12px;z-index:9999;';
      document.body.appendChild(display);
      
      function update() {
        const level = Math.round(battery.level * 100);
        const charging = battery.charging ? '⚡' : '';
        display.textContent = charging + '🔋 ' + level + '%';
        display.style.background = level < 20 ? '#f44336' : '#333';
      }
      
      update();
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
    });
  }
})();
</script>`
    },
    {
      id: 'device-detect',
      name: 'Device Detection',
      description: 'Detects device type and adds classes accordingly',
      icon: Smartphone,
      category: 'utility',
      code: `<!-- Device Detection -->
<script>
(function() {
  const ua = navigator.userAgent;
  const device = {
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
    isTablet: /iPad|Android/i.test(ua) && !/Mobile/i.test(ua),
    isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    isSafari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
    isChrome: /Chrome/i.test(ua)
  };
  
  Object.keys(device).forEach(function(key) {
    if (device[key]) document.documentElement.classList.add(key);
  });
  
  window.deviceInfo = device;
  console.log('Device:', device);
})();
</script>`
    },
    {
      id: 'text-highlighter',
      name: 'Text Highlighter',
      description: 'Highlights search terms on the page',
      icon: Search,
      category: 'utility',
      code: `<!-- Text Highlighter -->
<script>
(function() {
  window.highlightText = function(searchTerm) {
    if (!searchTerm) return;
    
    const escaped = searchTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');
    
    function highlight(node) {
      if (node.nodeType === 3) {
        const match = node.data.match(regex);
        if (match) {
          const span = document.createElement('span');
          span.innerHTML = node.data.replace(regex, '<mark style="background:#ffff00;">$1</mark>');
          node.parentNode.replaceChild(span, node);
        }
      } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        Array.from(node.childNodes).forEach(highlight);
      }
    }
    
    highlight(document.body);
  };
})();
</script>`
    },
    {
      id: 'auto-refresh',
      name: 'Auto Refresh Page',
      description: 'Automatically refreshes the page at set intervals',
      icon: RefreshCw,
      category: 'utility',
      code: `<!-- Auto Refresh Page -->
<script>
(function() {
  const refreshInterval = 300000; // 5 minutes in ms
  const showWarning = true;
  
  setTimeout(function refresh() {
    if (showWarning) {
      const confirmed = confirm('Page will refresh to show latest content. Continue?');
      if (confirmed) window.location.reload();
      else setTimeout(refresh, refreshInterval);
    } else {
      window.location.reload();
    }
  }, refreshInterval);
})();
</script>`
    },
    {
      id: 'fullscreen-toggle',
      name: 'Fullscreen Toggle',
      description: 'Button to toggle fullscreen mode',
      icon: Monitor,
      category: 'utility',
      code: `<!-- Fullscreen Toggle -->
<script>
(function() {
  const btn = document.createElement('button');
  btn.innerHTML = '⛶';
  btn.title = 'Toggle Fullscreen';
  btn.style.cssText = 'position:fixed;bottom:20px;left:20px;width:40px;height:40px;border-radius:8px;background:#333;color:white;border:none;font-size:20px;cursor:pointer;z-index:9999;';
  document.body.appendChild(btn);
  
  btn.onclick = function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  document.addEventListener('fullscreenchange', function() {
    btn.innerHTML = document.fullscreenElement ? '⛶' : '⛶';
    btn.style.background = document.fullscreenElement ? '#007bff' : '#333';
  });
})();
</script>`
    },
    {
      id: 'text-to-speech',
      name: 'Text to Speech',
      description: 'Reads selected text aloud using browser speech synthesis',
      icon: Volume2,
      category: 'utility',
      code: `<!-- Text to Speech -->
<script>
(function() {
  document.addEventListener('mouseup', function() {
    const selection = window.getSelection().toString().trim();
    if (selection && selection.length > 0) {
      const existing = document.getElementById('speak-btn');
      if (existing) existing.remove();
      
      const btn = document.createElement('button');
      btn.id = 'speak-btn';
      btn.innerHTML = '🔊 Read aloud';
      btn.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:#007bff;color:white;border:none;border-radius:20px;cursor:pointer;z-index:99999;';
      document.body.appendChild(btn);
      
      btn.onclick = function() {
        const utterance = new SpeechSynthesisUtterance(selection);
        speechSynthesis.speak(utterance);
        btn.remove();
      };
      
      setTimeout(function() { btn.remove(); }, 5000);
    }
  });
})();
</script>`
    }
  ];

  // Update category counts
  categories.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = scripts.length;
    } else {
      cat.count = scripts.filter(s => s.category === cat.id).length;
    }
  });

  const filteredScripts = scripts.filter(script => {
    const matchesCategory = activeCategory === 'all' || script.category === activeCategory;
    const matchesSearch = script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryColors: Record<string, string> = {
    security: 'bg-red-500/10 text-red-600 dark:text-red-400',
    protection: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    analytics: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    performance: 'bg-green-500/10 text-green-600 dark:text-green-400',
    engagement: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    utility: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8">
        <Badge className="mb-3 text-xs sm:text-sm" variant="secondary">
          <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          {scripts.length}+ Scripts Available
        </Badge>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">JavaScript Script Library</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Ready-to-use JavaScript scripts for security, analytics, performance, and user engagement. Copy and paste into your website.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
            {category.label}
            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filteredScripts.map((script) => {
          const IconComponent = script.icon;
          return (
            <Card key={script.id} className="p-4 sm:p-5 hover:shadow-lg transition-shadow relative group">
              {script.popular && (
                <Badge className="absolute top-2 right-2 text-[10px]" variant="default">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold leading-tight mb-1">{script.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${categoryColors[script.category]}`}
                  >
                    {script.category}
                  </Badge>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                {script.description}
              </p>

              <div className="bg-muted/50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                <pre className="text-[10px] sm:text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
                  <code>{script.code.substring(0, 200)}...</code>
                </pre>
              </div>

              <Button
                onClick={() => handleCopy(script.code, script.id)}
                className="w-full min-h-[44px]"
                variant={copiedId === script.id ? "secondary" : "default"}
              >
                {copiedId === script.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Script
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {filteredScripts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No scripts found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};
