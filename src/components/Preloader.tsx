import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600); // Wait for fade-out animation
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className={`preloader ${!isVisible ? 'fade-out' : ''}`}>
      {/* Background gradient orbs */}
      <div className="preloader-bg-orb preloader-bg-orb-1" />
      <div className="preloader-bg-orb preloader-bg-orb-2" />
      <div className="preloader-bg-orb preloader-bg-orb-3" />
      
      {/* Logo container with glow */}
      <div className="preloader-logo-container">
        <div className="preloader-logo-glow" />
        <div className="preloader-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Widget icon with gradient */}
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                <stop offset="50%" stopColor="hsl(280 85% 65%)" />
                <stop offset="100%" stopColor="hsl(172 66% 50%)" />
              </linearGradient>
              <linearGradient id="brandGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(262 83% 68%)" />
                <stop offset="50%" stopColor="hsl(280 85% 72%)" />
                <stop offset="100%" stopColor="hsl(172 66% 55%)" />
              </linearGradient>
            </defs>
            {/* Main widget shape */}
            <rect x="6" y="6" width="36" height="36" rx="8" fill="url(#brandGradient)" className="preloader-icon-bg" />
            {/* Inner grid pattern */}
            <rect x="10" y="10" width="12" height="12" rx="3" fill="white" fillOpacity="0.9" />
            <rect x="26" y="10" width="12" height="12" rx="3" fill="white" fillOpacity="0.7" />
            <rect x="10" y="26" width="12" height="12" rx="3" fill="white" fillOpacity="0.7" />
            <rect x="26" y="26" width="12" height="12" rx="3" fill="white" fillOpacity="0.9" />
            {/* Accent dot */}
            <circle cx="38" cy="10" r="4" fill="hsl(172 66% 50%)" className="preloader-accent-dot" />
          </svg>
        </div>
      </div>
      
      {/* Brand name */}
      <h1 className="preloader-brand">
        <span className="preloader-brand-text">Widgetify</span>
      </h1>
      
      {/* Progress bar */}
      <div className="preloader-progress-container">
        <div className="preloader-progress-bar">
          <div 
            className="preloader-progress-fill" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Loading text */}
      <p className="preloader-text">
        <span className="preloader-text-content">Preparing your experience</span>
        <span className="preloader-dots">
          <span className="preloader-dot">.</span>
          <span className="preloader-dot">.</span>
          <span className="preloader-dot">.</span>
        </span>
      </p>
    </div>
  );
};

export default Preloader;
