import React, { useState, useEffect } from 'react';
import { Users, Eye } from 'lucide-react';

const VisitorCounter: React.FC = () => {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [activeVisitors, setActiveVisitors] = useState<number>(0);

  useEffect(() => {
    // Get or initialize total visitor count
    const storedTotal = localStorage.getItem('widgetify_total_visitors');
    let total = storedTotal ? parseInt(storedTotal, 10) : 12847; // Start with a base number
    
    // Check if this is a new session
    const sessionKey = 'widgetify_session_counted';
    const sessionCounted = sessionStorage.getItem(sessionKey);
    
    if (!sessionCounted) {
      total += 1;
      localStorage.setItem('widgetify_total_visitors', total.toString());
      sessionStorage.setItem(sessionKey, 'true');
    }
    
    setTotalVisitors(total);
    
    // Simulate active visitors (random between 3-15 for realism)
    const baseActive = Math.floor(Math.random() * 8) + 3;
    setActiveVisitors(baseActive);
    
    // Update active visitors periodically for live feel
    const interval = setInterval(() => {
      setActiveVisitors(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.max(2, Math.min(20, newValue)); // Keep between 2-20
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Users size={14} className="text-primary" />
        <span>{formatNumber(totalVisitors)} visitors</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <Eye size={14} className="text-green-500" />
        <span>{activeVisitors} online now</span>
      </div>
    </div>
  );
};

export default VisitorCounter;
