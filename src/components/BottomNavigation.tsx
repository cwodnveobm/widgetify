import { Home, Sparkles, HeadphonesIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Sparkles, label: "Generate", path: "/generate" },
  { icon: HeadphonesIcon, label: "Support", path: "/support" },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (path === "/generate") {
      if (location.pathname === "/") {
        document.getElementById("widget-generator")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById("widget-generator")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === "/generate") {
      return location.pathname === "/" || location.pathname === "/generate";
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 min-h-[48px] min-w-[48px] rounded-lg active:scale-95",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
