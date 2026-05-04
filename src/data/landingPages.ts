export interface LandingPageData {
  slug: string;
  industry: string;
  title: string; // SEO title (<60)
  description: string; // SEO meta (<160)
  keywords: string;
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    cta: string;
  };
  problems: string[];
  features: { title: string; description: string; icon: string }[];
  useCases: string[];
  faq: { q: string; a: string }[];
  testimonial: { quote: string; author: string; role: string };
  recommendedWidgets: string[];
}

export const LANDING_PAGES: LandingPageData[] = [
  {
    slug: "saas",
    industry: "SaaS",
    title: "Chat Widgets for SaaS — Onboard, Convert, Retain",
    description: "Embed AI chat, lead capture, and onboarding popups on your SaaS site. Reduce churn, qualify trials, and increase activation in minutes.",
    keywords: "saas chat widget, saas lead capture, in-app onboarding popup, ai chat saas, trial conversion widget",
    hero: {
      eyebrow: "For SaaS Companies",
      headline: "Convert trials into paying customers with AI-powered widgets",
      subheadline: "Drop one async script on your marketing site or app. Trigger smart popups, qualify leads, and answer product questions 24/7.",
      cta: "Build your SaaS widget",
    },
    problems: [
      "Trial users churn before activation",
      "Marketing site bounces under 30s",
      "Support tickets pile up after launches",
    ],
    features: [
      { title: "AI product expert", description: "Trained on your docs to answer setup, billing and feature questions instantly.", icon: "Sparkles" },
      { title: "Activation popups", description: "Exit-intent and scroll triggers nudge trial users toward the aha moment.", icon: "Zap" },
      { title: "Lead qualification", description: "Capture company size, role and use case before routing to sales.", icon: "Target" },
    ],
    useCases: ["Trial-to-paid conversion", "Self-serve onboarding", "Pricing page assistance", "Demo booking"],
    faq: [
      { q: "Will it slow my React/Next.js app?", a: "Loads async with requestIdleCallback. Under 50KB, zero render-blocking calls." },
      { q: "Can the AI cite my docs?", a: "Yes — point the system prompt at your knowledge base or paste FAQ content directly." },
    ],
    testimonial: { quote: "Our trial-to-paid jumped 18% in three weeks.", author: "Priya R.", role: "Growth, B2B SaaS" },
    recommendedWidgets: ["ai-chat", "popup", "lead-form"],
  },
  {
    slug: "ecommerce",
    industry: "E-commerce",
    title: "E-commerce Chat Widgets — Recover Carts, Boost AOV",
    description: "WhatsApp, AI chat and exit-intent popups for Shopify, WooCommerce and custom stores. Recover abandoned carts and grow average order value.",
    keywords: "ecommerce chat widget, shopify chat, woocommerce widget, abandoned cart popup, whatsapp shop",
    hero: {
      eyebrow: "For E-commerce Brands",
      headline: "Turn browsers into buyers with conversion widgets",
      subheadline: "Add WhatsApp ordering, exit-intent discounts, and AI shopping assistants to any store with one script.",
      cta: "Boost my store conversions",
    },
    problems: [
      "70% of carts get abandoned",
      "Shoppers leave without asking questions",
      "Discount codes go unredeemed",
    ],
    features: [
      { title: "Exit-intent offers", description: "Show a 10% code the moment a shopper moves to leave the page.", icon: "Gift" },
      { title: "WhatsApp checkout", description: "One-tap to chat — perfect for high-ticket and India/MENA markets.", icon: "MessageCircle" },
      { title: "AI shopping assistant", description: "Answers sizing, shipping and stock questions in your brand voice.", icon: "ShoppingBag" },
    ],
    useCases: ["Cart recovery", "Pre-order qualification", "Sizing & fit help", "VIP support"],
    faq: [
      { q: "Does it work on Shopify?", a: "Paste the script in theme.liquid before </body>. No app install required." },
      { q: "Will popups hurt SEO?", a: "No — widgets render client-side after idle and never block content for crawlers." },
    ],
    testimonial: { quote: "Cart recovery alone paid for the year in week one.", author: "Marco D.", role: "Founder, DTC apparel" },
    recommendedWidgets: ["popup", "ai-chat", "lead-form"],
  },
  {
    slug: "agency",
    industry: "Agencies",
    title: "Widgets for Agencies — White-Label, Multi-Client",
    description: "Manage chat, lead and popup widgets across all client sites from one dashboard. White-label ready with private share links and analytics.",
    keywords: "agency widget tool, white label chat widget, multi client widgets, marketing agency lead capture",
    hero: {
      eyebrow: "For Marketing & Web Agencies",
      headline: "One dashboard. Every client. Every widget.",
      subheadline: "Spin up branded popups, lead forms and AI chat for each client. Share private previews before going live.",
      cta: "Manage client widgets",
    },
    problems: [
      "Juggling 20+ client widget tools",
      "Clients want preview before approval",
      "Reporting takes hours each month",
    ],
    features: [
      { title: "Private share links", description: "Send a /w/ link with a revocable token — clients preview without going public.", icon: "Link2" },
      { title: "Per-client analytics", description: "Filter the interaction dashboard by client, day and event type.", icon: "BarChart3" },
      { title: "White-label embed", description: "Custom CSS and shadow DOM keep your client's brand intact.", icon: "Palette" },
    ],
    useCases: ["Client approvals", "Multi-site rollouts", "Monthly reporting", "Lead handoff"],
    faq: [
      { q: "Can I revoke a client preview?", a: "Yes — share tokens can be expired or deleted instantly from the dashboard." },
      { q: "Do you offer reseller pricing?", a: "Yes, contact support for agency tier pricing with bulk widgets." },
    ],
    testimonial: { quote: "Replaced three tools and saved 12 hours per client per month.", author: "Aisha K.", role: "Director, growth agency" },
    recommendedWidgets: ["lead-form", "popup", "ai-chat"],
  },
  {
    slug: "restaurants",
    industry: "Restaurants & Cafes",
    title: "Restaurant Widgets — Bookings, Menus, WhatsApp Orders",
    description: "Add WhatsApp ordering, reservation popups and AI menu assistants to your restaurant website. No app, no commission, just one script.",
    keywords: "restaurant chat widget, table reservation popup, whatsapp ordering, menu chatbot, cafe website widget",
    hero: {
      eyebrow: "For Restaurants, Cafes & Cloud Kitchens",
      headline: "Take orders and bookings straight from your website",
      subheadline: "Skip Zomato/UberEats commissions on direct orders. Embed WhatsApp chat, reservation forms and AI menu help in minutes.",
      cta: "Set up restaurant widget",
    },
    problems: [
      "Aggregator commissions eat margins",
      "Phone reservations get lost",
      "Diners ask the same allergy questions",
    ],
    features: [
      { title: "WhatsApp ordering", description: "Tap to order — orders flow straight to your kitchen WhatsApp.", icon: "Utensils" },
      { title: "Booking popups", description: "Date and party-size form triggers on menu and contact pages.", icon: "Calendar" },
      { title: "Allergy & menu AI", description: "Trained on your menu to answer diet, ingredient and pairing questions.", icon: "Bot" },
    ],
    useCases: ["Direct ordering", "Table reservations", "Catering enquiries", "Loyalty signups"],
    faq: [
      { q: "Is it mobile-friendly?", a: "Built mobile-first with 44px touch targets — works perfectly on Instagram link-in-bio traffic." },
      { q: "Can I forward leads to WhatsApp?", a: "Yes — set the CTA URL to wa.me/yourNumber for one-tap chat." },
    ],
    testimonial: { quote: "We cut Zomato dependency by 40% with direct WhatsApp orders.", author: "Rohan P.", role: "Owner, multi-outlet cafe" },
    recommendedWidgets: ["lead-form", "popup", "ai-chat"],
  },
  {
    slug: "realestate",
    industry: "Real Estate",
    title: "Real Estate Widgets — Capture Buyer & Renter Leads",
    description: "Embed property enquiry forms, virtual tour popups and AI assistants on listing sites. Convert more visitors into qualified buyer leads.",
    keywords: "real estate lead widget, property enquiry form, realtor chatbot, virtual tour popup, broker website widget",
    hero: {
      eyebrow: "For Realtors, Brokers & Property Portals",
      headline: "Every listing visit becomes a qualified lead",
      subheadline: "AI chat answers neighbourhood, school and EMI questions instantly. Forms route hot leads to your phone.",
      cta: "Capture more property leads",
    },
    problems: [
      "Listings drive traffic but few enquiries",
      "Buyers ask the same financing questions",
      "Leads get cold before callback",
    ],
    features: [
      { title: "Listing enquiry forms", description: "Floating CTA on every property page captures budget and timeline.", icon: "Home" },
      { title: "Virtual tour popups", description: "Trigger video tour invites on long-scroll listing pages.", icon: "Video" },
      { title: "Mortgage AI", description: "Estimates EMI and answers loan eligibility questions on the spot.", icon: "Calculator" },
    ],
    useCases: ["Buyer enquiries", "Rental applications", "Site-visit booking", "Loan pre-qualification"],
    faq: [
      { q: "Can I route leads to multiple agents?", a: "Yes — use webhooks to dispatch by area or price band to specific agents." },
      { q: "Does it integrate with my CRM?", a: "Use the MCP webhook to push leads into HubSpot, Salesforce or Zoho." },
    ],
    testimonial: { quote: "Site-visit bookings doubled in the first month.", author: "Nikhil S.", role: "Broker, premium residential" },
    recommendedWidgets: ["lead-form", "ai-chat", "popup"],
  },
  {
    slug: "healthcare",
    industry: "Healthcare & Clinics",
    title: "Healthcare Widgets — Appointment Booking & Triage",
    description: "HIPAA-aware appointment forms, symptom triage AI and reminder popups for clinics, hospitals and telehealth sites.",
    keywords: "clinic appointment widget, healthcare chatbot, telehealth lead capture, dental booking popup, medical website widget",
    hero: {
      eyebrow: "For Clinics, Hospitals & Telehealth",
      headline: "Patients book appointments without picking up the phone",
      subheadline: "Embed booking forms, insurance pre-checks and AI triage on your clinic site. Reduce no-shows with reminder popups.",
      cta: "Set up patient widgets",
    },
    problems: [
      "Phone lines stay busy during peak hours",
      "Patients abandon booking flows",
      "No-show rates above 20%",
    ],
    features: [
      { title: "Appointment booking", description: "Capture name, contact and preferred slot — push to your scheduling tool.", icon: "Stethoscope" },
      { title: "Symptom triage AI", description: "Guides patients to the right specialist before they book.", icon: "Activity" },
      { title: "Reminder popups", description: "Returning visitors see appointment confirmation and prep instructions.", icon: "Bell" },
    ],
    useCases: ["Doctor appointments", "Dental consultations", "Insurance enquiries", "Telehealth signup"],
    faq: [
      { q: "Is patient data secure?", a: "Forms use TLS, fields are validated server-side and you control retention via your backend." },
      { q: "Can it integrate with EMR?", a: "Use webhooks to forward bookings into Practo, Cerner or your custom EMR." },
    ],
    testimonial: { quote: "Online bookings now make up 60% of new patients.", author: "Dr. Sneha M.", role: "Dental clinic chain" },
    recommendedWidgets: ["lead-form", "ai-chat", "popup"],
  },
  {
    slug: "education",
    industry: "Education & Coaching",
    title: "Education Widgets — Capture Student Leads & Demo Bookings",
    description: "Lead forms, course enquiry popups and AI counsellors for ed-tech, coaching and online courses. Book demos and trials in one click.",
    keywords: "edtech chat widget, course enquiry form, student lead capture, coaching website widget, demo booking popup",
    hero: {
      eyebrow: "For Ed-tech, Coaching & Online Courses",
      headline: "Turn course pages into demo bookings",
      subheadline: "AI counsellor answers fees, syllabus and placement questions. Lead forms route hot enquiries to admissions instantly.",
      cta: "Capture student leads",
    },
    problems: [
      "Students browse syllabus but don't enquire",
      "Demo no-shows drain counsellor time",
      "Parents have repeat fee questions",
    ],
    features: [
      { title: "Course AI counsellor", description: "Answers eligibility, batch timings and fees in your brand voice.", icon: "GraduationCap" },
      { title: "Demo booking forms", description: "One-click forms with class/grade, subject and slot — synced to your CRM.", icon: "BookOpen" },
      { title: "Scholarship popups", description: "Exit-intent offers for limited-seat batches keep visitors engaged.", icon: "Award" },
    ],
    useCases: ["Course enquiries", "Free trial booking", "Scholarship leads", "Parent outreach"],
    faq: [
      { q: "Can I add to a Wix or WordPress site?", a: "Yes — paste the script tag in any HTML embed block. Works everywhere." },
      { q: "Multi-language support?", a: "Set widget content per language and use the language attribute on your page." },
    ],
    testimonial: { quote: "Demo bookings went from 30 to 110 a week.", author: "Karthik V.", role: "Founder, JEE coaching" },
    recommendedWidgets: ["ai-chat", "lead-form", "popup"],
  },
  {
    slug: "creators",
    industry: "Creators & Coaches",
    title: "Creator Widgets — Email Capture, Bookings, Link-in-Bio",
    description: "AI chat, email capture and booking forms for creators, coaches and consultants. Pair with LastSet link-in-bio for the perfect funnel.",
    keywords: "creator email capture, coach booking widget, consultant lead form, link in bio chat, personal brand widget",
    hero: {
      eyebrow: "For Creators, Coaches & Consultants",
      headline: "Grow your list and book sessions on autopilot",
      subheadline: "AI assistant answers FAQs in your voice. Lead and email forms feed your newsletter and calendar.",
      cta: "Build my creator widget",
    },
    problems: [
      "DMs get lost across platforms",
      "Email list grows too slowly",
      "Booking back-and-forth wastes hours",
    ],
    features: [
      { title: "AI in your voice", description: "Trained on your About, FAQ and content to answer the way you would.", icon: "Mic" },
      { title: "Email capture", description: "Floating opt-ins with exit-intent and scroll triggers grow your list daily.", icon: "Mail" },
      { title: "Session booking", description: "Lead form with tier and timezone — drops into your scheduler.", icon: "CalendarCheck" },
    ],
    useCases: ["Newsletter growth", "Coaching enquiries", "Consultation booking", "Course pre-orders"],
    faq: [
      { q: "Works with my LastSet bio page?", a: "Yes — embed any widget directly into LastSet themes for a seamless funnel." },
      { q: "Do I need code?", a: "No code. Pick a widget, copy the snippet, paste it on your site." },
    ],
    testimonial: { quote: "5x newsletter growth in 60 days.", author: "Lena T.", role: "Solo creator & coach" },
    recommendedWidgets: ["ai-chat", "lead-form", "popup"],
  },
];

export function findLandingPage(slug: string) {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
