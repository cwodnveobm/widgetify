export interface WidgetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: {
    title: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    textColor: string;
    backgroundColor: string;
    borderRadius: string;
    shadow: string;
  };
  icon: string;
}

export const widgetTemplates: WidgetTemplate[] = [
  // CTA & Conversion
  {
    id: "cta-primary",
    name: "Primary CTA",
    category: "CTA",
    description: "Bold call-to-action with brand colors",
    preview: {
      title: "Get Started Today",
      description: "Join thousands of happy users and transform your workflow.",
      buttonText: "Start Free Trial",
      buttonColor: "#9b87f5",
      textColor: "#1A1F2C",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      shadow: "0 8px 32px rgba(155, 135, 245, 0.25)"
    },
    icon: "Zap"
  },
  {
    id: "cta-gradient",
    name: "Gradient CTA",
    category: "CTA",
    description: "Eye-catching gradient style widget",
    preview: {
      title: "Unlock Premium Features",
      description: "Upgrade now and access exclusive tools and templates.",
      buttonText: "Upgrade Now",
      buttonColor: "#7c3aed",
      textColor: "#ffffff",
      backgroundColor: "linear-gradient(135deg, #9b87f5 0%, #7c3aed 100%)",
      borderRadius: "20px",
      shadow: "0 12px 40px rgba(124, 58, 237, 0.35)"
    },
    icon: "Sparkles"
  },
  {
    id: "cta-minimal",
    name: "Minimal CTA",
    category: "CTA",
    description: "Clean and simple conversion widget",
    preview: {
      title: "Subscribe to Updates",
      description: "Get the latest news delivered to your inbox.",
      buttonText: "Subscribe",
      buttonColor: "#1A1F2C",
      textColor: "#1A1F2C",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      shadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
    },
    icon: "Mail"
  },
  
  // Announcements
  {
    id: "announcement-new",
    name: "New Feature Alert",
    category: "Announcement",
    description: "Highlight new features or updates",
    preview: {
      title: "✨ New Feature Available",
      description: "We just launched an amazing new feature you'll love!",
      buttonText: "Learn More",
      buttonColor: "#22c55e",
      textColor: "#1A1F2C",
      backgroundColor: "#f0fdf4",
      borderRadius: "12px",
      shadow: "0 4px 16px rgba(34, 197, 94, 0.15)"
    },
    icon: "Bell"
  },
  {
    id: "announcement-sale",
    name: "Sale Banner",
    category: "Announcement",
    description: "Promote sales and special offers",
    preview: {
      title: "🎉 Flash Sale - 50% Off!",
      description: "Limited time offer. Don't miss out on huge savings!",
      buttonText: "Shop Now",
      buttonColor: "#ef4444",
      textColor: "#ffffff",
      backgroundColor: "#1A1F2C",
      borderRadius: "12px",
      shadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
    },
    icon: "Tag"
  },
  {
    id: "announcement-event",
    name: "Event Promo",
    category: "Announcement",
    description: "Promote upcoming events or webinars",
    preview: {
      title: "📅 Live Webinar Tomorrow",
      description: "Join industry experts for an exclusive session.",
      buttonText: "Reserve Spot",
      buttonColor: "#3b82f6",
      textColor: "#1A1F2C",
      backgroundColor: "#eff6ff",
      borderRadius: "14px",
      shadow: "0 6px 20px rgba(59, 130, 246, 0.2)"
    },
    icon: "Calendar"
  },
  
  // Support & Help
  {
    id: "support-chat",
    name: "Live Chat",
    category: "Support",
    description: "Invite users to start a chat",
    preview: {
      title: "Need Help?",
      description: "Our team is online and ready to assist you.",
      buttonText: "Start Chat",
      buttonColor: "#9b87f5",
      textColor: "#1A1F2C",
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      shadow: "0 8px 32px rgba(155, 135, 245, 0.2)"
    },
    icon: "MessageCircle"
  },
  {
    id: "support-faq",
    name: "FAQ Helper",
    category: "Support",
    description: "Direct users to help resources",
    preview: {
      title: "Got Questions?",
      description: "Find answers in our comprehensive FAQ section.",
      buttonText: "View FAQ",
      buttonColor: "#6366f1",
      textColor: "#1A1F2C",
      backgroundColor: "#eef2ff",
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(99, 102, 241, 0.15)"
    },
    icon: "HelpCircle"
  },
  
  // Social & Engagement
  {
    id: "social-follow",
    name: "Follow Us",
    category: "Social",
    description: "Encourage social media follows",
    preview: {
      title: "Stay Connected",
      description: "Follow us for daily tips, updates, and inspiration.",
      buttonText: "Follow @widgetify",
      buttonColor: "#e1306c",
      textColor: "#1A1F2C",
      backgroundColor: "#fdf2f8",
      borderRadius: "16px",
      shadow: "0 4px 16px rgba(225, 48, 108, 0.15)"
    },
    icon: "Heart"
  },
  {
    id: "social-share",
    name: "Share Widget",
    category: "Social",
    description: "Encourage content sharing",
    preview: {
      title: "Enjoying This?",
      description: "Share this with your friends and colleagues!",
      buttonText: "Share Now",
      buttonColor: "#1da1f2",
      textColor: "#1A1F2C",
      backgroundColor: "#f0f9ff",
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(29, 161, 242, 0.2)"
    },
    icon: "Share2"
  },
  
  // Newsletter & Email
  {
    id: "newsletter-modern",
    name: "Modern Newsletter",
    category: "Newsletter",
    description: "Stylish newsletter signup",
    preview: {
      title: "Join Our Newsletter",
      description: "Weekly insights, tips, and exclusive content.",
      buttonText: "Sign Up Free",
      buttonColor: "#9b87f5",
      textColor: "#ffffff",
      backgroundColor: "#1A1F2C",
      borderRadius: "16px",
      shadow: "0 12px 40px rgba(0, 0, 0, 0.25)"
    },
    icon: "Inbox"
  },
  {
    id: "newsletter-playful",
    name: "Playful Newsletter",
    category: "Newsletter",
    description: "Fun and engaging signup widget",
    preview: {
      title: "🚀 Level Up Weekly",
      description: "Get the best tips delivered every Monday!",
      buttonText: "Count Me In!",
      buttonColor: "#f59e0b",
      textColor: "#1A1F2C",
      backgroundColor: "#fffbeb",
      borderRadius: "20px",
      shadow: "0 6px 24px rgba(245, 158, 11, 0.2)"
    },
    icon: "Rocket"
  },
  
  // Feedback & Reviews
  {
    id: "feedback-request",
    name: "Feedback Request",
    category: "Feedback",
    description: "Collect user feedback",
    preview: {
      title: "How Are We Doing?",
      description: "Your feedback helps us improve our service.",
      buttonText: "Give Feedback",
      buttonColor: "#8b5cf6",
      textColor: "#1A1F2C",
      backgroundColor: "#faf5ff",
      borderRadius: "14px",
      shadow: "0 4px 16px rgba(139, 92, 246, 0.15)"
    },
    icon: "MessageSquare"
  },
  {
    id: "review-request",
    name: "Review Request",
    category: "Feedback",
    description: "Ask for product reviews",
    preview: {
      title: "⭐ Love Our Product?",
      description: "Leave a review and help others discover us!",
      buttonText: "Write Review",
      buttonColor: "#eab308",
      textColor: "#1A1F2C",
      backgroundColor: "#fefce8",
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(234, 179, 8, 0.2)"
    },
    icon: "Star"
  },
  
  // Download & Install
  {
    id: "download-app",
    name: "App Download",
    category: "Download",
    description: "Promote mobile app downloads",
    preview: {
      title: "Get Our Mobile App",
      description: "Experience the full power on your phone.",
      buttonText: "Download Free",
      buttonColor: "#059669",
      textColor: "#1A1F2C",
      backgroundColor: "#ecfdf5",
      borderRadius: "16px",
      shadow: "0 6px 20px rgba(5, 150, 105, 0.2)"
    },
    icon: "Download"
  },
  {
    id: "download-resource",
    name: "Free Resource",
    category: "Download",
    description: "Offer free downloadable content",
    preview: {
      title: "Free E-Book Download",
      description: "Get our comprehensive guide - 100% free!",
      buttonText: "Download Now",
      buttonColor: "#0891b2",
      textColor: "#1A1F2C",
      backgroundColor: "#ecfeff",
      borderRadius: "12px",
      shadow: "0 4px 16px rgba(8, 145, 178, 0.15)"
    },
    icon: "FileDown"
  }
];

export const templateCategories = [
  "All",
  "CTA",
  "Announcement",
  "Support",
  "Social",
  "Newsletter",
  "Feedback",
  "Download"
];
