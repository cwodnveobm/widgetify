import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Instagram, ExternalLink, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface FollowToUnlockModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

type SocialAccount = {
  id: string;
  name: string;
  url: string;
  type: "instagram" | "whatsapp";
};

const SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "widgetifly",
    name: "@widget.ifly",
    url: "https://www.instagram.com/widget.ifly/",
    type: "instagram",
  },
  {
    id: "techcontractor",
    name: "@thetechcontractor.in",
    url: "https://www.instagram.com/thetechcontractor.in/",
    type: "instagram",
  },
  {
    id: "whatsapp_channel",
    name: "Widgetify Channel",
    url: "https://whatsapp.com/channel/0029VbC8Q1h7dmebx5VRlF1i",
    type: "whatsapp",
  },
];

export const FollowToUnlockModal = ({ open, onClose, onUnlock }: FollowToUnlockModalProps) => {
  const [followedAccounts, setFollowedAccounts] = useState<Record<string, boolean>>({});

  const allFollowed = SOCIAL_ACCOUNTS.every(account => followedAccounts[account.id]);

  const handleFollowClick = (account: SocialAccount) => {
    window.open(account.url, "_blank");
    
    // Mark as followed after clicking
    setTimeout(() => {
      setFollowedAccounts(prev => ({
        ...prev,
        [account.id]: true,
      }));
    }, 1000);
  };

  const handleUnlock = () => {
    if (!allFollowed) {
      toast.error("Please follow all accounts first");
      return;
    }

    // Store unlock status in localStorage
    localStorage.setItem("widgetify_branding_unlocked", "true");
    
    toast.success("Branding removal unlocked! 🎉");
    onUnlock();
    onClose();
  };

  const handleClose = () => {
    setFollowedAccounts({});
    onClose();
  };

  const getAccountIcon = (account: SocialAccount) => {
    if (account.type === "whatsapp") {
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    );
  };

  const getButtonText = (account: SocialAccount) => {
    if (account.type === "whatsapp") {
      return followedAccounts[account.id] ? "Joined" : "Join";
    }
    return followedAccounts[account.id] ? "Followed" : "Follow";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>🔓 Remove Branding for Free</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Follow our social channels to unlock branding removal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Support us by following all accounts below, then click "Unlock" to remove Widgetify branding from your widgets.
          </p>

          <div className="space-y-3">
            {SOCIAL_ACCOUNTS.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getAccountIcon(account)}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm sm:text-base truncate">{account.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{account.type}</span>
                  </div>
                </div>
                
                <Button
                  variant={followedAccounts[account.id] ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleFollowClick(account)}
                  disabled={followedAccounts[account.id]}
                  className="min-h-[40px] flex-shrink-0"
                >
                  {followedAccounts[account.id] ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">{getButtonText(account)}</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 sm:mr-1" />
                      <span className="hidden sm:inline">{getButtonText(account)}</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUnlock}
            className="w-full min-h-[48px] text-sm sm:text-base"
            size="lg"
            disabled={!allFollowed}
          >
            {allFollowed ? "Unlock Branding Removal" : "Follow All to Unlock"}
          </Button>

          <p className="text-xs text-center text-muted-foreground px-4">
            By unlocking, you confirm you've followed all accounts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
