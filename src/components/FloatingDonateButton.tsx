import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingDonateButton = () => {
  const handleDonate = () => {
    window.open('https://razorpay.me/@adnan4402', '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleDonate}
      className={cn(
        "fixed left-4 bottom-20 z-40 md:hidden",
        "w-12 h-12 rounded-full",
        "bg-gradient-to-br from-destructive to-destructive/80",
        "text-destructive-foreground shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-xl",
        "active:scale-95",
        "animate-fade-in"
      )}
      aria-label="Donate"
    >
      <Heart className="w-5 h-5" fill="currentColor" />
    </button>
  );
};

export default FloatingDonateButton;
