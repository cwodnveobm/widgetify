import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DonateButton } from '@/components/DonateButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveUI } from '@/hooks/useAdaptiveUI';
import { AdaptiveButton } from '@/components/adaptive';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onAuthModalOpen?: (mode: 'signin' | 'signup') => void;
}

export const Navigation = ({ onAuthModalOpen }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { config, classes } = useAdaptiveUI();

  const shouldAnimate = config.content.animationLevel !== 'none';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/integrations', label: 'Integrations' },
    { to: '/custom-builder', label: 'Custom Builder' },
    { to: '/ab-testing', label: 'A/B Testing' },
    { to: '/faq', label: 'FAQ' },
    { to: '/support', label: 'Support' },
  ];

  return (
    <header className={`bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 md:py-4 px-2 md:px-6 sticky top-0 z-40 shadow-soft ${classes.animation}`}>
      <div className="max-w-full md:container mx-auto flex justify-between items-center px-1 md:px-0">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <motion.div 
            className="text-xl md:text-2xl brand-logo brand-gradient-vibrant"
            whileHover={config.interactions.hoverEffects ? { scale: 1.02 } : undefined}
          >
            Widgetify
          </motion.div>
          <div className="relative">
            <Sparkles className={`w-5 h-5 text-primary group-hover:rotate-12 ${classes.animation}`} />
            <div className="absolute inset-0 w-5 h-5 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <DonateButton variant="outline" size="sm" className="hidden sm:flex" />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border border-border z-50">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isMobile && onAuthModalOpen && (
              <div className="flex gap-2">
                <AdaptiveButton 
                  adaptiveVariant="subtle" 
                  onClick={() => onAuthModalOpen('signin')}
                >
                  Sign In
                </AdaptiveButton>
                <AdaptiveButton 
                  adaptiveVariant="primary" 
                  onClick={() => onAuthModalOpen('signup')}
                >
                  Get Started
                </AdaptiveButton>
              </div>
            )
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobile ? (
          <>
            <motion.button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className={`md:hidden text-muted-foreground focus:outline-none p-3 rounded-xl hover:bg-muted min-h-[44px] min-w-[44px] ${classes.animation}`}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  className="fixed top-[73px] left-0 right-0 bg-background/95 backdrop-blur-md shadow-elegant py-4 px-6 flex flex-col gap-2 border-t border-border max-h-[calc(100vh-73px)] overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className={`py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium ${classes.animation} ${
                          isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  {!user && onAuthModalOpen && (
                    <>
                      <motion.button 
                        onClick={() => { onAuthModalOpen('signin'); setMenuOpen(false); }} 
                        className={`text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium ${classes.animation} text-left w-full`}
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: navLinks.length * 0.05 }}
                      >
                        Sign In
                      </motion.button>
                      <motion.button 
                        onClick={() => { onAuthModalOpen('signup'); setMenuOpen(false); }} 
                        className={`text-primary hover:text-primary/80 py-4 flex items-center justify-between min-h-[44px] font-medium ${classes.animation} text-left w-full`}
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: (navLinks.length + 1) * 0.05 }}
                      >
                        Get Started
                      </motion.button>
                    </>
                  )}
                  {user && (
                    <motion.button 
                      onClick={() => { handleSignOut(); setMenuOpen(false); }} 
                      className={`text-destructive hover:text-destructive/80 py-4 flex items-center gap-2 min-h-[44px] font-medium ${classes.animation} text-left w-full`}
                      initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: navLinks.length * 0.05 }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  to={link.to}
                  className={`font-medium ${classes.animation} relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                    isActive(link.to) ? 'text-primary after:w-full' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
