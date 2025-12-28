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
  },

  // AI Chat & Chatbot
  {
    id: "ai-chat-assistant",
    name: "AI Chat Assistant",
    category: "AI Chat",
    description: "AI-powered chat widget for instant support",
    preview: {
      title: "🤖 Ask Our AI Assistant",
      description: "Get instant answers 24/7 with our smart AI chatbot.",
      buttonText: "Chat with AI",
      buttonColor: "#6366f1",
      textColor: "#ffffff",
      backgroundColor: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      borderRadius: "20px",
      shadow: "0 12px 40px rgba(99, 102, 241, 0.35)"
    },
    icon: "Bot"
  },
  {
    id: "ai-chat-minimal",
    name: "Minimal AI Helper",
    category: "AI Chat",
    description: "Clean AI chat for quick questions",
    preview: {
      title: "AI Help Desk",
      description: "Type your question and get instant AI-powered help.",
      buttonText: "Ask AI",
      buttonColor: "#1A1F2C",
      textColor: "#1A1F2C",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      shadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
    },
    icon: "Sparkles"
  },

  // Lead Capture
  {
    id: "lead-capture-pro",
    name: "Lead Capture Pro",
    category: "Lead Capture",
    description: "High-converting lead generation widget",
    preview: {
      title: "Get Your Free Quote",
      description: "Tell us about your project and receive a custom quote.",
      buttonText: "Get Quote",
      buttonColor: "#059669",
      textColor: "#ffffff",
      backgroundColor: "linear-gradient(180deg, #065f46 0%, #047857 100%)",
      borderRadius: "16px",
      shadow: "0 10px 32px rgba(5, 150, 105, 0.3)"
    },
    icon: "UserPlus"
  },
  {
    id: "lead-capture-demo",
    name: "Demo Request",
    category: "Lead Capture",
    description: "Schedule demo or consultation",
    preview: {
      title: "Book a Free Demo",
      description: "See our product in action with a personalized walkthrough.",
      buttonText: "Schedule Demo",
      buttonColor: "#3b82f6",
      textColor: "#1A1F2C",
      backgroundColor: "#eff6ff",
      borderRadius: "14px",
      shadow: "0 6px 24px rgba(59, 130, 246, 0.2)"
    },
    icon: "Video"
  },
  {
    id: "lead-capture-waitlist",
    name: "Waitlist Signup",
    category: "Lead Capture",
    description: "Build anticipation with a waitlist",
    preview: {
      title: "🚀 Join the Waitlist",
      description: "Be first to access our next big release!",
      buttonText: "Join Waitlist",
      buttonColor: "#8b5cf6",
      textColor: "#1A1F2C",
      backgroundColor: "#faf5ff",
      borderRadius: "18px",
      shadow: "0 8px 28px rgba(139, 92, 246, 0.2)"
    },
    icon: "Clock"
  },

  // WhatsApp & Messaging
  {
    id: "whatsapp-chat",
    name: "WhatsApp Chat",
    category: "WhatsApp",
    description: "Direct WhatsApp messaging widget",
    preview: {
      title: "Chat on WhatsApp",
      description: "Connect with us instantly via WhatsApp.",
      buttonText: "Open WhatsApp",
      buttonColor: "#25D366",
      textColor: "#ffffff",
      backgroundColor: "#dcfce7",
      borderRadius: "24px",
      shadow: "0 8px 32px rgba(37, 211, 102, 0.25)"
    },
    icon: "MessageCircle"
  },
  {
    id: "whatsapp-support",
    name: "WhatsApp Support",
    category: "WhatsApp",
    description: "WhatsApp-based customer support",
    preview: {
      title: "💬 Need Quick Help?",
      description: "Get real-time support through WhatsApp.",
      buttonText: "Message Us",
      buttonColor: "#128C7E",
      textColor: "#1A1F2C",
      backgroundColor: "#f0fdf4",
      borderRadius: "16px",
      shadow: "0 6px 20px rgba(18, 140, 126, 0.2)"
    },
    icon: "Phone"
  },

  // Reviews & Testimonials
  {
    id: "reviews-stars",
    name: "Star Rating Request",
    category: "Reviews",
    description: "Collect star ratings from users",
    preview: {
      title: "⭐⭐⭐⭐⭐ Rate Us!",
      description: "How would you rate your experience today?",
      buttonText: "Leave Rating",
      buttonColor: "#f59e0b",
      textColor: "#1A1F2C",
      backgroundColor: "#fffbeb",
      borderRadius: "14px",
      shadow: "0 6px 24px rgba(245, 158, 11, 0.2)"
    },
    icon: "Star"
  },
  {
    id: "reviews-testimonial",
    name: "Testimonial Request",
    category: "Reviews",
    description: "Collect detailed customer testimonials",
    preview: {
      title: "Share Your Story",
      description: "Tell others how we've helped you succeed.",
      buttonText: "Write Testimonial",
      buttonColor: "#ec4899",
      textColor: "#1A1F2C",
      backgroundColor: "#fdf2f8",
      borderRadius: "16px",
      shadow: "0 6px 20px rgba(236, 72, 153, 0.2)"
    },
    icon: "Quote"
  },
  {
    id: "reviews-nps",
    name: "NPS Survey",
    category: "Reviews",
    description: "Net Promoter Score feedback widget",
    preview: {
      title: "Quick Question",
      description: "How likely are you to recommend us to a friend?",
      buttonText: "Take Survey",
      buttonColor: "#14b8a6",
      textColor: "#1A1F2C",
      backgroundColor: "#f0fdfa",
      borderRadius: "12px",
      shadow: "0 4px 16px rgba(20, 184, 166, 0.15)"
    },
    icon: "BarChart3"
  },

  // Exit Intent & Popups
  {
    id: "exit-intent-offer",
    name: "Exit Intent Offer",
    category: "Exit Intent",
    description: "Last-chance offer before leaving",
    preview: {
      title: "Wait! Don't Leave Empty-Handed",
      description: "Get 20% off your first order with code EXIT20.",
      buttonText: "Claim Discount",
      buttonColor: "#ef4444",
      textColor: "#ffffff",
      backgroundColor: "#1A1F2C",
      borderRadius: "16px",
      shadow: "0 12px 40px rgba(239, 68, 68, 0.3)"
    },
    icon: "Gift"
  },
  {
    id: "exit-intent-newsletter",
    name: "Exit Newsletter",
    category: "Exit Intent",
    description: "Capture emails before visitors leave",
    preview: {
      title: "Before You Go...",
      description: "Subscribe and never miss our best content!",
      buttonText: "Stay Updated",
      buttonColor: "#9b87f5",
      textColor: "#1A1F2C",
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      shadow: "0 8px 32px rgba(155, 135, 245, 0.25)"
    },
    icon: "Mail"
  },

  // Booking & Appointments
  {
    id: "booking-calendar",
    name: "Book Appointment",
    category: "Booking",
    description: "Schedule appointments or meetings",
    preview: {
      title: "📅 Schedule a Call",
      description: "Pick a time that works best for you.",
      buttonText: "Book Now",
      buttonColor: "#0ea5e9",
      textColor: "#1A1F2C",
      backgroundColor: "#f0f9ff",
      borderRadius: "16px",
      shadow: "0 6px 24px rgba(14, 165, 233, 0.2)"
    },
    icon: "CalendarCheck"
  },
  {
    id: "booking-consultation",
    name: "Free Consultation",
    category: "Booking",
    description: "Offer free consultation sessions",
    preview: {
      title: "Free 30-Min Strategy Call",
      description: "Get expert advice tailored to your business.",
      buttonText: "Book Free Call",
      buttonColor: "#7c3aed",
      textColor: "#ffffff",
      backgroundColor: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      borderRadius: "18px",
      shadow: "0 10px 36px rgba(124, 58, 237, 0.3)"
    },
    icon: "Users"
  },

  // Discount & Offers
  {
    id: "discount-popup",
    name: "Discount Popup",
    category: "Discount",
    description: "First-time visitor discount offer",
    preview: {
      title: "🎁 Welcome Gift!",
      description: "Enjoy 15% off your first purchase today.",
      buttonText: "Get 15% Off",
      buttonColor: "#22c55e",
      textColor: "#1A1F2C",
      backgroundColor: "#f0fdf4",
      borderRadius: "20px",
      shadow: "0 8px 32px rgba(34, 197, 94, 0.25)"
    },
    icon: "Percent"
  },
  {
    id: "discount-limited",
    name: "Limited Time Offer",
    category: "Discount",
    description: "Urgency-driven discount widget",
    preview: {
      title: "⏰ Flash Sale Ends Soon!",
      description: "Only 2 hours left to save 40% on everything.",
      buttonText: "Shop Sale",
      buttonColor: "#dc2626",
      textColor: "#ffffff",
      backgroundColor: "#fef2f2",
      borderRadius: "12px",
      shadow: "0 6px 24px rgba(220, 38, 38, 0.2)"
    },
    icon: "Timer"
  },

  // Cookie Consent
  {
    id: "cookie-consent",
    name: "Cookie Consent",
    category: "Legal",
    description: "GDPR-compliant cookie notice",
    preview: {
      title: "🍪 Cookie Notice",
      description: "We use cookies to enhance your browsing experience.",
      buttonText: "Accept All",
      buttonColor: "#1A1F2C",
      textColor: "#1A1F2C",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      shadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
    },
    icon: "Cookie"
  },

  // Survey & Poll
  {
    id: "survey-quick",
    name: "Quick Survey",
    category: "Survey",
    description: "Short user feedback survey",
    preview: {
      title: "📊 Quick Survey",
      description: "Help us improve with a 30-second survey.",
      buttonText: "Take Survey",
      buttonColor: "#6366f1",
      textColor: "#1A1F2C",
      backgroundColor: "#eef2ff",
      borderRadius: "14px",
      shadow: "0 6px 20px rgba(99, 102, 241, 0.15)"
    },
    icon: "ClipboardList"
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
  "Download",
  "AI Chat",
  "Lead Capture",
  "WhatsApp",
  "Reviews",
  "Exit Intent",
  "Booking",
  "Discount",
  "Legal",
  "Survey"
];
