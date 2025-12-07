import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Instagram, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FollowToUnlockModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const INSTAGRAM_ACCOUNTS = [
  {
    id: "widgetifly",
    name: "@widget.ifly",
    url: "https://www.instagram.com/widget.ifly/",
  },
  {
    id: "techcontractor",
    name: "@thetechcontractor.in",
    url: "https://www.instagram.com/thetechcontractor.in/",
  },
];

export const FollowToUnlockModal = ({ open, onClose, onUnlock }: FollowToUnlockModalProps) => {
  const [followedAccounts, setFollowedAccounts] = useState<Record<string, boolean>>({});

  const allFollowed = INSTAGRAM_ACCOUNTS.every(account => followedAccounts[account.id]);

  const handleFollowClick = (account: typeof INSTAGRAM_ACCOUNTS[0]) => {
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
      toast.error("Please follow both Instagram accounts first");
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-500" />
            Remove Branding for Free
          </DialogTitle>
          <DialogDescription>
            Follow our Instagram accounts to unlock branding removal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Support us by following both Instagram accounts below, then click "Unlock" to remove Widgetify branding from your widgets.
          </p>

          <div className="space-y-3">
            {INSTAGRAM_ACCOUNTS.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{account.name}</span>
                </div>
                
                <Button
                  variant={followedAccounts[account.id] ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleFollowClick(account)}
                  disabled={followedAccounts[account.id]}
                >
                  {followedAccounts[account.id] ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Followed
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUnlock}
            className="w-full"
            size="lg"
            disabled={!allFollowed}
          >
            {allFollowed ? "Unlock Branding Removal" : "Follow Both Accounts to Unlock"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By unlocking, you confirm you've followed both accounts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
