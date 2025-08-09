import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, MessageCircle, Twitter, Mail, Link as LinkIcon } from 'lucide-react';

const REFERRAL_URL = 'https://widgetify-two.vercel.app/';
const DEFAULT_MESSAGE = `Hey! I’ve been using Widgetify to add chat and utility widgets to my site — super easy and fast. Try it here: ${REFERRAL_URL}`;

const ReferAFriend: React.FC = () => {
  const { toast } = useToast();

  const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
  const shareTargets = {
    whatsapp: `https://wa.me/?text=${encodedMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
    email: `mailto:?subject=${encodeURIComponent('Check out Widgetify')}&body=${encodedMessage}`,
  } as const;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_MESSAGE);
      toast({ title: 'Copied!', description: 'Referral message copied to clipboard.' });
    } catch (e) {
      toast({ title: 'Copy failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Widgetify', text: DEFAULT_MESSAGE, url: REFERRAL_URL });
      } catch (_) {
        // user canceled or sharing failed; silently ignore
      }
    } else {
      // Fallback: copy to clipboard
      await handleCopy();
      window.open(shareTargets.twitter, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="button-touch" variant="secondary">
          <Share2 className="w-4 h-4 mr-2" />
          Refer a Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Refer a Friend</DialogTitle>
          <DialogDescription>
            Share Widgetify with your friends. Use the message below or send via your favorite app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="text-sm font-medium">Message</label>
          <Textarea value={DEFAULT_MESSAGE} readOnly className="min-h-[110px]" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Quick Share
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" /> Copy Message
            </Button>
            <a href={shareTargets.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" type="button">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </a>
            <a href={shareTargets.twitter} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" type="button">
                <Twitter className="w-4 h-4 mr-2" /> Twitter
              </Button>
            </a>
            <a href={shareTargets.email} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" type="button">
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
            </a>
            <a href={REFERRAL_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" type="button">
                <LinkIcon className="w-4 h-4 mr-2" /> Visit Link
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferAFriend;
