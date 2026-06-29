import React, { useEffect, useRef, useState } from 'react';
import { LifeBuoy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { SEOHead } from '@/components/SEOHead';
import { StructuredData } from '@/components/StructuredData';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Support: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { trackPageView, trackClick } = usePersonalization();
  const { user } = useAuth();
  const hasTrackedPageView = useRef(false);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!hasTrackedPageView.current) { trackPageView('/support'); hasTrackedPageView.current = true; }
  }, [trackPageView]);

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email! }));
  }, [user]);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode); setShowAuthModal(true); trackClick('support-auth-modal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields'); return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('support-contact', { body: form });
      if (error) throw error;
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: '', email: user?.email ?? '', subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16 md:pb-0">
      <SEOHead
        title="Support & Help Center"
        description="Get help with Widgetify chat widgets. Contact our team — messages reach us instantly."
        keywords="Widgetify support, contact, help"
      />
      <StructuredData type="breadcrumb" data={{ items: [
        { name: 'Home', url: 'https://widgetify.app/' },
        { name: 'Support', url: 'https://widgetify.app/support' },
      ]}} />
      <Navigation onAuthModalOpen={openAuthModal} />

      <main className="flex-grow container mx-auto container-padding py-6 sm:py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <LifeBuoy className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">Support</h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact us</CardTitle>
              <p className="text-sm text-muted-foreground">
                Messages are forwarded to our admin team in real-time. Typical response: within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" disabled={sending} className="gap-2 w-full sm:w-auto">
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-4">
              {[
                ['How do I install the widget?', 'Generate your widget code, then paste it before the closing </body> tag.'],
                ['Can I customize the appearance?', 'Yes — colors, position, and which platforms to include are all configurable.'],
                ['Does it work on mobile?', 'Yes, fully responsive across all devices.'],
                ['Is there a cost?', 'Free tier available; Premium is ₹199/month with full access.'],
              ].map(([q, a]) => (
                <div key={q} className="border-b border-border pb-4">
                  <h3 className="font-medium mb-1">{q}</h3>
                  <p className="text-muted-foreground text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} />
    </div>
  );
};
export default Support;
