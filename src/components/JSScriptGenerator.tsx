import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Shield, Eye, EyeOff, Lock, MousePointer, Clock, Ban, Fingerprint, Code2 } from 'lucide-react';
import { toast } from 'sonner';

interface JSScript {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'security' | 'protection' | 'utility';
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
    }
  ];

  const categories = [
    { id: 'all', label: 'All Scripts', icon: Code2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'protection', label: 'Content Protection', icon: Lock },
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
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg flex-shrink-0">
                    <script.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {script.name}
                      {script.popular && (
                        <Badge variant="secondary" className="text-[10px]">Popular</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {script.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto max-h-48 scrollbar-hide">
                  <code>{script.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(script.code, script.id)}
                >
                  {copiedId === script.id ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
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
