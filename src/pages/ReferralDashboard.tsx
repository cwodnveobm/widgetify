import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useReferrals } from '@/hooks/useReferrals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Gift, 
  Link as LinkIcon, 
  Copy, 
  Share2, 
  TrendingUp, 
  Award,
  Coins,
  ArrowUpRight,
  MessageCircle,
  Twitter,
  Mail,
  IndianRupee
} from 'lucide-react';
import { format } from 'date-fns';
import { AuthModal } from '@/components/AuthModal';

const ReferralDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    referrals,
    credits,
    tiers,
    transactions,
    loading,
    referralCode,
    referralLink,
    currentTier,
    nextTier,
    progressToNextTier,
    creditsToRupees,
    copyReferralLink,
    trackReferralShare,
    CREDITS_PER_2000_REFERRALS,
    RS_PER_2000_CREDITS
  } = useReferrals();

  const [emailInput, setEmailInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleInvite = async () => {
    if (!emailInput.trim()) return;
    await trackReferralShare(emailInput.trim());
    setEmailInput('');
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(`🚀 I'm using Widgetify to supercharge my website! Join me and earn rewards: ${referralLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnTwitter = () => {
    const message = encodeURIComponent(`🚀 I'm using Widgetify to add amazing widgets to my site! Join using my link and we both earn rewards: ${referralLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join Widgetify - Free Widgets for Your Website');
    const body = encodeURIComponent(`Hey!\n\nI've been using Widgetify to add chat and utility widgets to my site — super easy and fast.\n\nJoin using my referral link and we'll both earn credits!\n\n${referralLink}\n\nCheers!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Gift className="w-20 h-20 mx-auto text-primary mb-6" />
            <h1 className="text-4xl font-bold mb-4">Referral Program</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Earn credits by inviting friends! For every 2,000 referrals, earn 10 credits.
              Redeem 2,000 credits for ₹100.
            </p>
            <Button size="lg" onClick={() => setShowAuthModal(true)}>
              Sign In to Start Earning
            </Button>
          </motion.div>
        </main>
        <Footer />
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Gift className="w-8 h-8 text-primary" />
                Referral Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Invite friends and earn rewards together
              </p>
            </div>
            {currentTier && (
              <Badge 
                className="text-lg px-4 py-2 self-start"
                style={{ backgroundColor: currentTier.badge_color }}
              >
                <Award className="w-5 h-5 mr-2" />
                {currentTier.tier_name} Tier
              </Badge>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {credits?.total_referrals || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((credits?.total_referrals || 0) / 2000 * 100).toFixed(1)}% to next credit milestone
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Total Credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {(credits?.total_credits || 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {creditsToRupees(credits?.total_credits || 0).toFixed(2)} value
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Conversion Rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {referrals.length > 0 
                    ? ((referrals.filter(r => r.status === 'credited').length / referrals.length) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {referrals.filter(r => r.status === 'credited').length} converted referrals
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Available to Redeem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-500">
                  ₹{creditsToRupees((credits?.total_credits || 0) - (credits?.redeemed_credits || 0)).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((credits?.total_credits || 0) - (credits?.redeemed_credits || 0)).toFixed(2)} credits available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress to {nextTier.tier_name} Tier</CardTitle>
                <CardDescription>
                  {nextTier.min_referrals - (credits?.total_referrals || 0)} more referrals needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progressToNextTier} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{credits?.total_referrals || 0} referrals</span>
                    <span>{nextTier.min_referrals} referrals</span>
                  </div>
                  <p className="text-sm mt-2">
                    🎁 Unlock <span className="font-semibold text-primary">{nextTier.bonus_credits} bonus credits</span> and 
                    earn <span className="font-semibold text-primary">{(nextTier.credits_per_referral * 1000).toFixed(1)} credits per 1000 referrals</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Referral Link Section */}
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link to earn credits for every signup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-background rounded-lg border px-4 py-3">
                  <code className="text-sm truncate flex-1">{referralLink}</code>
                  <Button variant="ghost" size="icon" onClick={copyReferralLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={copyReferralLink} className="shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={shareOnWhatsApp} className="flex-1 min-w-[140px]">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={shareOnTwitter} className="flex-1 min-w-[140px]">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" onClick={shareViaEmail} className="flex-1 min-w-[140px]">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Invite via Email</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInvite} disabled={!emailInput.trim()}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Referrals, Tiers, Transactions */}
          <Tabs defaultValue="referrals" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="referrals">My Referrals</TabsTrigger>
              <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>Track all your referrals and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No referrals yet. Share your link to get started!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Converted</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {referrals.map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell className="font-medium">{referral.referred_email}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  referral.status === 'credited' ? 'default' :
                                  referral.status === 'signed_up' ? 'secondary' : 'outline'
                                }>
                                  {referral.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{format(new Date(referral.created_at), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                {referral.converted_at 
                                  ? format(new Date(referral.converted_at), 'MMM d, yyyy')
                                  : '-'
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiers">
              <Card>
                <CardHeader>
                  <CardTitle>Reward Tiers</CardTitle>
                  <CardDescription>
                    Higher tiers earn more credits per referral plus bonus rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {tiers.map((tier, index) => (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                          currentTier?.id === tier.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tier.badge_color }}
                        >
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tier.tier_name}</h3>
                            {currentTier?.id === tier.id && (
                              <Badge variant="secondary">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tier.min_referrals}+ referrals
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {(tier.credits_per_referral * 1000).toFixed(1)} credits / 1000 refs
                          </p>
                          {tier.bonus_credits > 0 && (
                            <p className="text-sm text-green-500">
                              +{tier.bonus_credits} bonus credits
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Transactions</CardTitle>
                  <CardDescription>Your credit earning and redemption history</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions yet. Start referring to earn credits!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                <Badge variant={
                                  tx.transaction_type === 'earned' ? 'default' :
                                  tx.transaction_type === 'bonus' ? 'secondary' : 'outline'
                                }>
                                  {tx.transaction_type}
                                </Badge>
                              </TableCell>
                              <TableCell className={`font-semibold ${
                                tx.transaction_type === 'redeemed' ? 'text-red-500' : 'text-green-500'
                              }`}>
                                {tx.transaction_type === 'redeemed' ? '-' : '+'}
                                {tx.amount.toFixed(4)}
                              </TableCell>
                              <TableCell>{tx.description || '-'}</TableCell>
                              <TableCell>{format(new Date(tx.created_at), 'MMM d, yyyy')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">1. Share Your Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Share your unique referral link with friends via any channel
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">2. Friends Sign Up</h4>
                    <p className="text-sm text-muted-foreground">
                      When they sign up using your link, you earn credits
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">3. Redeem Rewards</h4>
                    <p className="text-sm text-muted-foreground">
                      {CREDITS_PER_2000_REFERRALS} credits per 2,000 referrals. 2,000 credits = ₹{RS_PER_2000_CREDITS}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferralDashboard;
