import { useEffect } from 'react';

export const usePlatformProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
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
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        showProtectionOverlay();
        return false;
      }
    };

    // Anti-screenshot protection
    let blurOverlay: HTMLDivElement | null = null;

    const showProtectionOverlay = () => {
      if (blurOverlay) return;
      blurOverlay = document.createElement('div');
      blurOverlay.id = 'screenshot-protection-overlay';
      blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
        color: white;
        font-size: 24px;
        text-align: center;
        padding: 20px;
      `;
      blurOverlay.innerHTML = `
        <div>
          <h2 style="margin-bottom: 16px;">Content Protected</h2>
          <p style="font-size: 16px; opacity: 0.8;">Screenshots are not allowed on this page.</p>
        </div>
      `;
      document.body.appendChild(blurOverlay);
    };

    const removeProtectionOverlay = () => {
      if (blurOverlay) {
        blurOverlay.remove();
        blurOverlay = null;
      }
    };

    // Detect visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showProtectionOverlay();
      } else {
        setTimeout(removeProtectionOverlay, 500);
      }
    };

    // Detect window blur/focus
    const handleBlur = () => {
      showProtectionOverlay();
    };

    const handleFocus = () => {
      setTimeout(removeProtectionOverlay, 300);
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Console warning
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis browser feature is for developers only.', 'font-size: 16px;');

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      removeProtectionOverlay();
    };
  }, []);
};
