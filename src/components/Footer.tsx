import React from 'react';
import ReferAFriend from '@/components/ReferAFriend';
import VisitorCounter from '@/components/VisitorCounter';
import { Linkedin, Instagram, Sparkles, Users, Zap } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { 
  AdaptiveSection, 
  AdaptiveButton, 
  AdaptiveGrid,
  SocialProofBadge 
} from '@/components/adaptive';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';

const Footer: React.FC = () => {
  const { config, classes, shouldShowElement } = useAdaptiveUI();
  const shouldAnimate = config.content.animationLevel !== 'none';
  const animationDuration = config.content.animationLevel === 'full' ? 0.5 : 0.3;

  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '#widget-generator', label: 'Generate Widget' },
    { href: '#features', label: 'Features' },
    { href: '/faq', label: 'FAQ' },
  ];

  const referralLinks = [
    { href: '/creators', label: 'Creator Portal' },
    { href: '/referrals', label: 'Referral Dashboard' },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/muhammedadnanvv/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/adnanvv.ad/', icon: Instagram, label: 'Instagram' },
    { href: 'https://x.com/MuhammadAd93421', icon: FaXTwitter, label: 'X (Twitter)' },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/10 text-muted-foreground border-t border-border/50 w-full">
      <div className="container mx-auto container-padding py-8 sm:py-12 md:py-16">
        <AdaptiveGrid columns={3} gap="lg" stagger={shouldAnimate}>
          {/* Brand Section */}
          <motion.div 
            className="col-span-3 sm:col-span-1"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animationDuration }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl brand-logo brand-gradient-vibrant">Widgetify</h3>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className={`mb-4 sm:mb-5 text-sm sm:text-base ${classes.muted} max-w-md leading-relaxed`}>
              The most powerful widget platform for modern websites. Connect with your visitors through their preferred channels and boost conversions instantly.
            </p>
            
            {/* Social Proof - Adaptive */}
            {shouldShowElement('socialProof') && (
              <div className="flex flex-wrap gap-2 mb-4">
                <SocialProofBadge 
                  message="10K+ widgets created" 
                  icon={<Zap className="w-3 h-3" />}
                />
                <SocialProofBadge 
                  message="2,500+ users" 
                  icon={<Users className="w-3 h-3" />}
                />
              </div>
            )}
            
            <div className="mt-4 flex flex-col gap-3 items-center md:items-start">
              <a href="https://widgetify-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=961430&theme=light&t=1746523667957" 
                  alt="Widgetify - Chat widgets | Product Hunt" 
                  style={{ width: "250px", height: "54px" }} 
                  width="250" 
                  height="54" 
                  className="max-w-full h-auto"
                  loading="lazy"
                />
              </a>
              
              <AdaptiveButton 
                adaptiveVariant="secondary"
                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-border"
              >
                <a 
                  href="https://www.producthunt.com/products/widgetify-2/reviews/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  ⭐ Leave a Review
                </a>
              </AdaptiveButton>
            </div>
          </motion.div>
          
          {/* Links Section */}
          <motion.div 
            className="col-span-3 sm:col-span-1"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animationDuration, delay: 0.1 }}
          >
            <h4 className="text-sm sm:text-base text-foreground font-medium mb-3 sm:mb-4">Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <a 
                    href={link.href} 
                    className={`hover:text-primary ${classes.animation} min-h-[44px] flex items-center text-xs sm:text-sm md:text-base`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Referral & Earn Section */}
          <motion.div 
            className="col-span-3 sm:col-span-1"
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: animationDuration, delay: 0.15 }}
          >
            <h4 className="text-sm sm:text-base text-foreground font-medium mb-3 sm:mb-4">Referral & Earn</h4>
            <ul className="space-y-1 sm:space-y-2">
              {referralLinks.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <a 
                    href={link.href} 
                    className={`hover:text-primary ${classes.animation} min-h-[44px] flex items-center text-xs sm:text-sm md:text-base`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AdaptiveGrid>
        
        {/* Bottom Section */}
        <motion.div 
          className="border-t border-border mt-6 sm:mt-10 md:mt-12 pt-4 sm:pt-6 md:pt-8 flex flex-col gap-4"
          initial={shouldAnimate ? { opacity: 0 } : false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: animationDuration, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-center md:text-left text-muted-foreground">
              © 2025 Widgetify. All rights reserved | Powered by Muhammed Adnan
            </p>
            <div className="flex gap-3 sm:gap-4 items-center flex-wrap justify-center">
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={social.label}
                    href={social.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-muted-foreground hover:text-primary ${classes.animation}`}
                    aria-label={social.label}
                    whileHover={config.interactions.hoverEffects ? { scale: 1.1 } : undefined}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
              <ReferAFriend />
            </div>
          </div>
          
          <div className="border-t border-border pt-4 flex justify-center">
            <VisitorCounter />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
