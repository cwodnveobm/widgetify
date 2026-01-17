import { useState, useEffect, useCallback, useRef } from 'react';
import { usePersonalization } from './usePersonalization';

interface DonationTrigger {
  type: 'achievement' | 'milestone' | 'appreciation' | 'expert' | 'supporter' | 'influencer';
  title: string;
  message: string;
  emoji: string;
  ctaText: string;
  priority: number;
}

const EGO_TRIGGERS: DonationTrigger[] = [
  {
    type: 'achievement',
    title: "You're a Widget Master! 🏆",
    message: "You've created multiple widgets like a pro. Your expertise helps small businesses connect with customers worldwide.",
    emoji: "🏆",
    ctaText: "Support the Mission",
    priority: 10
  },
  {
    type: 'milestone',
    title: "Power User Detected! ⚡",
    message: "You're in the top 5% of Widgetify users. Legends like you keep this free tool running for everyone.",
    emoji: "⚡",
    ctaText: "Join Elite Supporters",
    priority: 9
  },
  {
    type: 'appreciation',
    title: "You Make Widgetify Better! 💎",
    message: "Your continued use helps us improve. A small contribution keeps this tool free for thousands of small businesses.",
    emoji: "💎",
    ctaText: "Become a Hero",
    priority: 7
  },
  {
    type: 'expert',
    title: "Widget Genius Alert! 🧠",
    message: "You've mastered the art of customer engagement widgets. Your skills inspire us to build more features.",
    emoji: "🧠",
    ctaText: "Fuel Innovation",
    priority: 8
  },
  {
    type: 'supporter',
    title: "Valued Community Member! 🌟",
    message: "Widgetify exists because of supporters like you. Help us keep this tool free and accessible to all.",
    emoji: "🌟",
    ctaText: "Be a Champion",
    priority: 6
  },
  {
    type: 'influencer',
    title: "You're Making an Impact! 🚀",
    message: "Every widget you create helps a business grow. Your contribution multiplies that impact tenfold.",
    emoji: "🚀",
    ctaText: "Amplify Your Impact",
    priority: 9
  }
];

const APPRECIATION_MESSAGES = [
  "Your expertise is remarkable!",
  "You've got exceptional taste in widgets!",
  "You clearly know what works for your business!",
  "Your attention to detail is impressive!",
  "You're building something amazing!",
  "Your customers are lucky to have you!"
];

export const useDonationTrigger = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<DonationTrigger | null>(null);
  const [appreciationMessage, setAppreciationMessage] = useState('');
  const triggerCountRef = useRef(0);
  const lastTriggerTimeRef = useRef(0);
  const sessionWidgetsRef = useRef(0);
  
  const { behavior, session } = usePersonalization();

  // Smart trigger logic based on user behavior
  const shouldTrigger = useCallback((): boolean => {
    const now = Date.now();
    const minInterval = 5 * 60 * 1000; // 5 minutes minimum between triggers
    
    // Don't trigger too frequently
    if (now - lastTriggerTimeRef.current < minInterval) {
      return false;
    }
    
    // Max 2 triggers per session
    if (triggerCountRef.current >= 2) {
      return false;
    }
    
    // Check if user has already donated recently
    const lastDonateClick = localStorage.getItem('widgetify_last_donate_click');
    if (lastDonateClick) {
      const daysSinceClick = (now - parseInt(lastDonateClick)) / (1000 * 60 * 60 * 24);
      if (daysSinceClick < 7) {
        return false;
      }
    }
    
    // Don't show if user dismissed recently
    const lastDismiss = localStorage.getItem('widgetify_donate_dismissed');
    if (lastDismiss) {
      const hoursSinceDismiss = (now - parseInt(lastDismiss)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        return false;
      }
    }
    
    return true;
  }, []);

  // Select the best trigger based on user behavior
  const selectTrigger = useCallback((): DonationTrigger => {
    const widgetsCreated = behavior.widgetsGenerated + sessionWidgetsRef.current;
    const isReturning = session.isReturningUser;
    const timeOnSite = behavior.timeOnSite;
    
    // Filter triggers based on behavior
    let eligibleTriggers = [...EGO_TRIGGERS];
    
    if (widgetsCreated >= 3) {
      eligibleTriggers = eligibleTriggers.filter(t => 
        ['achievement', 'milestone', 'expert'].includes(t.type)
      );
    } else if (isReturning) {
      eligibleTriggers = eligibleTriggers.filter(t => 
        ['appreciation', 'supporter', 'influencer'].includes(t.type)
      );
    } else if (timeOnSite > 60) {
      eligibleTriggers = eligibleTriggers.filter(t => 
        ['expert', 'supporter'].includes(t.type)
      );
    }
    
    // Randomly select from eligible triggers with priority weighting
    const totalWeight = eligibleTriggers.reduce((sum, t) => sum + t.priority, 0);
    let random = Math.random() * totalWeight;
    
    for (const trigger of eligibleTriggers) {
      random -= trigger.priority;
      if (random <= 0) {
        return trigger;
      }
    }
    
    return eligibleTriggers[0] || EGO_TRIGGERS[0];
  }, [behavior.widgetsGenerated, behavior.timeOnSite, session.isReturningUser]);

  // Trigger on widget generation
  const onWidgetGenerated = useCallback(() => {
    sessionWidgetsRef.current += 1;
    
    // 30% chance after first widget, 50% after 2+
    const chance = sessionWidgetsRef.current === 1 ? 0.3 : 0.5;
    
    if (Math.random() < chance && shouldTrigger()) {
      setTimeout(() => {
        const trigger = selectTrigger();
        setCurrentTrigger(trigger);
        setAppreciationMessage(APPRECIATION_MESSAGES[Math.floor(Math.random() * APPRECIATION_MESSAGES.length)]);
        setShowDonationModal(true);
        triggerCountRef.current += 1;
        lastTriggerTimeRef.current = Date.now();
      }, 2000); // Delay for better UX
    }
  }, [shouldTrigger, selectTrigger]);

  // Trigger on significant scroll depth
  useEffect(() => {
    if (behavior.scrollDepth > 80 && session.isReturningUser && shouldTrigger()) {
      // 20% chance for returning users with high engagement
      if (Math.random() < 0.2) {
        const trigger = selectTrigger();
        setCurrentTrigger(trigger);
        setAppreciationMessage(APPRECIATION_MESSAGES[Math.floor(Math.random() * APPRECIATION_MESSAGES.length)]);
        setShowDonationModal(true);
        triggerCountRef.current += 1;
        lastTriggerTimeRef.current = Date.now();
      }
    }
  }, [behavior.scrollDepth, session.isReturningUser, shouldTrigger, selectTrigger]);

  // Trigger on extended time on site
  useEffect(() => {
    if (behavior.timeOnSite > 120 && shouldTrigger()) {
      // 15% chance after 2 minutes
      if (Math.random() < 0.15) {
        const trigger = selectTrigger();
        setCurrentTrigger(trigger);
        setAppreciationMessage(APPRECIATION_MESSAGES[Math.floor(Math.random() * APPRECIATION_MESSAGES.length)]);
        setShowDonationModal(true);
        triggerCountRef.current += 1;
        lastTriggerTimeRef.current = Date.now();
      }
    }
  }, [behavior.timeOnSite, shouldTrigger, selectTrigger]);

  const handleDonate = useCallback(() => {
    localStorage.setItem('widgetify_last_donate_click', Date.now().toString());
    window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer');
    setShowDonationModal(false);
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem('widgetify_donate_dismissed', Date.now().toString());
    setShowDonationModal(false);
  }, []);

  const handleMaybeLater = useCallback(() => {
    setShowDonationModal(false);
  }, []);

  return {
    showDonationModal,
    currentTrigger,
    appreciationMessage,
    onWidgetGenerated,
    handleDonate,
    handleDismiss,
    handleMaybeLater,
    setShowDonationModal
  };
};
