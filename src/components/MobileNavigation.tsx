import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  handleMenuItemClick: () => void;
  scrollToSection: (sectionId: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  menuOpen,
  toggleMenu,
  handleMenuItemClick,
  scrollToSection,
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden button-touch"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleMenuItemClick}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="button-touch"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left button-touch h-12 text-base"
                  onClick={() => {
                    scrollToSection('home');
                    handleMenuItemClick();
                  }}
                >
                  Home
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left button-touch h-12 text-base"
                  onClick={() => {
                    scrollToSection('widget-generator');
                    handleMenuItemClick();
                  }}
                >
                  Generate Widget
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left button-touch h-12 text-base"
                  onClick={() => {
                    scrollToSection('features');
                    handleMenuItemClick();
                  }}
                >
                  Features
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left button-touch h-12 text-base"
                  onClick={() => {
                    scrollToSection('founder');
                    handleMenuItemClick();
                  }}
                >
                  About Founder
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;