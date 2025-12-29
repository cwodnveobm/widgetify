import { Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === "/") {
      document.getElementById("widget-generator")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("widget-generator")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Hide on pages where we don't need the FAB
  if (location.pathname === "/support") return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 md:hidden",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-primary to-primary/80",
        "text-primary-foreground shadow-lg shadow-primary/30",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-xl hover:shadow-primary/40",
        "active:scale-95",
        "animate-fade-in"
      )}
      aria-label="Generate Widget"
    >
      <Sparkles className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
    </button>
  );
};

export default FloatingActionButton;
