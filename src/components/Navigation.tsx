import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
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
  const { user, hasSubscription } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

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
    { to: '/support', label: 'Support' },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border py-3 md:py-4 px-2 md:px-6 sticky top-0 z-40 shadow-soft">
      <div className="max-w-full md:container mx-auto flex justify-between items-center px-1 md:px-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-xl md:text-2xl font-bold gradient-text">
            Widgetify
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.email}</span>
                    {hasSubscription && (
                      <span className="text-xs text-primary flex items-center gap-1 mt-1">
                        <Crown className="w-3 h-3" />
                        Premium Member
                      </span>
                    )}
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
                <Button variant="ghost" onClick={() => onAuthModalOpen('signin')}>
                  Sign In
                </Button>
                <Button onClick={() => onAuthModalOpen('signup')}>
                  Get Started
                </Button>
              </div>
            )
          )}
        </div>
        
        {isMobile ? (
          <>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden text-muted-foreground focus:outline-none p-3 rounded-xl hover:bg-muted min-h-[44px] min-w-[44px] transition-all duration-200" 
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            <div 
              className={`fixed top-[73px] left-0 right-0 bg-background/95 backdrop-blur-md shadow-elegant py-4 px-6 flex flex-col gap-2
                         border-t border-border transition-all duration-300 max-h-[calc(100vh-73px)] overflow-y-auto
                         ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 ${
                    isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && onAuthModalOpen && (
                <>
                  <button 
                    onClick={() => { onAuthModalOpen('signin'); setMenuOpen(false); }} 
                    className="text-muted-foreground hover:text-primary py-4 flex items-center justify-between border-b border-border pb-3 min-h-[44px] font-medium transition-colors duration-200 text-left w-full"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { onAuthModalOpen('signup'); setMenuOpen(false); }} 
                    className="text-primary hover:text-primary/80 py-4 flex items-center justify-between min-h-[44px] font-medium transition-colors duration-200 text-left w-full"
                  >
                    Get Started
                  </button>
                </>
              )}
              {user && (
                <button 
                  onClick={() => { handleSignOut(); setMenuOpen(false); }} 
                  className="text-destructive hover:text-destructive/80 py-4 flex items-center gap-2 min-h-[44px] font-medium transition-colors duration-200 text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </div>
          </>
        ) : (
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                  isActive(link.to) ? 'text-primary after:w-full' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
