import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useReferrals } from '@/hooks/useReferrals';
import { useCreatorVerification } from '@/hooks/useCreatorVerification';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import CreatorVerificationCard from '@/components/CreatorVerificationCard';
import { 
  Instagram, 
  Download, 
  Copy, 
  Share2, 
  Video, 
  Image, 
  FileText,
  TrendingUp,
  Users,
  IndianRupee,
  ExternalLink,
  CheckCircle,
  Star,
  Zap,
  Gift,
  Camera,
  Play,
  Shield
} from 'lucide-react';

const CreatorPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { referralLink, credits, referrals, currentTier, creditsToRupees } = useReferrals();
  const { isVerified, verification, getBadgeConfig } = useCreatorVerification();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  const instagramHandle = '@widget.ifly';
  const instagramUrl = 'https://www.instagram.com/widget.ifly';

  const contentGuidelines = [
    {
      type: 'Reels',
      icon: Video,
      description: 'Create engaging 15-60 second reels showcasing Widgetify widgets',
      tips: [
        'Show widget creation process',
        'Highlight unique features',
        'Use trending audio',
        'Include before/after website transformations'
      ],
      reward: '50-200 credits per reel'
    },
    {
      type: 'Posts',
      icon: Image,
      description: 'Share carousel posts or single images featuring Widgetify',
      tips: [
        'Use high-quality screenshots',
        'Create informative carousels',
        'Write engaging captions',
        'Include your referral link in bio'
      ],
      reward: '25-100 credits per post'
    },
    {
      type: 'Stories',
      icon: Camera,
      description: 'Share stories with widget demos and swipe-up links',
      tips: [
        'Use interactive stickers',
        'Show quick widget demos',
        'Add "Link" sticker with referral',
        'Create story highlights'
      ],
      reward: '10-50 credits per story'
    }
  ];

  const earningTiers = [
    { referrals: '0-49', rate: '5 credits/referral', badge: 'Starter', color: 'bg-gray-500' },
    { referrals: '50-199', rate: '7 credits/referral', badge: 'Bronze', color: 'bg-amber-600' },
    { referrals: '200-499', rate: '10 credits/referral', badge: 'Silver', color: 'bg-gray-400' },
    { referrals: '500-999', rate: '15 credits/referral', badge: 'Gold', color: 'bg-yellow-500' },
    { referrals: '1000+', rate: '20 credits/referral', badge: 'Diamond', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
            <Instagram className="w-3 h-3 mr-1" />
            Creator Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Earn by Creating Content
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join the Widgetify Creator Program. Share your creativity on Instagram, 
            help others discover amazing widgets, and earn real money!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              Follow {instagramHandle}
              <ExternalLink className="w-4 h-4" />
            </a>
            {!user ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
                onClick={() => setShowAuthModal(true)}
              >
                <Zap className="w-5 h-5 mr-2" />
                Join as Creator
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
                onClick={() => navigate('/referrals')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats for logged-in creators */}
      {user && credits && (
        <section className="py-8 px-4 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{credits.total_referrals}</p>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{credits.total_credits}</p>
                  <p className="text-sm text-muted-foreground">Credits Earned</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <IndianRupee className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">₹{creditsToRupees(credits.total_credits).toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Earnings Value</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Badge className={`${currentTier?.badge_color || 'bg-gray-500'} text-white mb-2`}>
                    {currentTier?.tier_name || 'Starter'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Current Tier</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="guidelines" className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="verification" className="relative">
                Verification
                {isVerified && (
                  <Shield className="w-3 h-3 text-blue-500 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            {/* Content Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Content Guidelines</h2>
                <p className="text-muted-foreground">Create engaging content and earn credits for every referral</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {contentGuidelines.map((content) => (
                  <Card key={content.type} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-bl-full" />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <content.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{content.type}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {content.reward}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
                      <ul className="space-y-2">
                        {content.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Collaboration Steps */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    How to Collaborate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: 1, title: 'Create Content', desc: 'Make reels, posts, or stories featuring Widgetify' },
                      { step: 2, title: 'Tag Us', desc: `Tag ${instagramHandle} and use #Widgetify` },
                      { step: 3, title: 'Share Link', desc: 'Include your referral link in bio or stories' },
                      { step: 4, title: 'Earn Credits', desc: 'Get credited for every successful referral' },
                    ].map((item) => (
                      <div key={item.step} className="text-center p-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">
                          {item.step}
                        </div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Promotional Assets</h2>
                <p className="text-muted-foreground">Download official logos and get your referral link</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Referral Link Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Your Referral Link
                    </CardTitle>
                    <CardDescription>
                      Share this link in your bio and stories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input 
                            value={referralLink} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button 
                            variant="outline"
                            onClick={() => copyToClipboard(referralLink, 'Referral link')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You earn credits for every user who signs up through your link!
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">Sign in to get your unique referral link</p>
                        <Button onClick={() => setShowAuthModal(true)}>
                          Get Your Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Logo Downloads */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Official Logos
                    </CardTitle>
                    <CardDescription>
                      Use these in your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <a 
                        href="/favicon.png" 
                        download="widgetify-logo.png"
                        className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img src="/favicon.png" alt="Widgetify Logo" className="w-16 h-16 mb-2" />
                        <span className="text-sm font-medium">Square Logo</span>
                        <span className="text-xs text-muted-foreground">PNG</span>
                      </a>
                      <a 
                        href="/icon-512.png" 
                        download="widgetify-logo-512.png"
                        className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img src="/icon-512.png" alt="Widgetify Logo HD" className="w-16 h-16 mb-2" />
                        <span className="text-sm font-medium">HD Logo</span>
                        <span className="text-xs text-muted-foreground">512x512 PNG</span>
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Please use our logos responsibly and follow brand guidelines
                    </p>
                  </CardContent>
                </Card>

                {/* Instagram Handle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      Tag Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Input value={instagramHandle} readOnly className="font-mono" />
                      <Button 
                        variant="outline"
                        onClick={() => copyToClipboard(instagramHandle, 'Instagram handle')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['#Widgetify', '#WidgetGenerator', '#WebWidgets', '#NoCode'].map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => copyToClipboard(tag, 'Hashtag')}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Caption Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Caption Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      '🚀 Just discovered @widget.ifly - create stunning widgets for your website in seconds! No coding needed. Link in bio! #Widgetify',
                      '✨ Transform your website with beautiful widgets from @widget.ifly! Visitor counters, social proof, and more. Check it out! 👆',
                      '💡 Pro tip: Add professional widgets to your site without any code using @widget.ifly. Game changer! #NoCode #WebDesign'
                    ].map((caption, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-muted/50 rounded-lg text-sm cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => copyToClipboard(caption, 'Caption')}
                      >
                        <p className="line-clamp-2">{caption}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to copy</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Creator Verification</h2>
                <p className="text-muted-foreground">Get verified to unlock higher earning rates and exclusive benefits</p>
              </div>

              <div className="max-w-xl mx-auto">
                <CreatorVerificationCard onAuthRequired={() => setShowAuthModal(true)} />
              </div>

              {/* Verification Tiers Info */}
              <Card className="max-w-xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">Verification Tiers</CardTitle>
                  <CardDescription>Higher tiers unlock better earning multipliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { badge: 'Verified', color: 'bg-blue-500', multiplier: '1.5x', requirement: '1K+ followers' },
                      { badge: 'Premium', color: 'bg-purple-500', multiplier: '1.75x', requirement: '10K+ followers' },
                      { badge: 'Elite', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', multiplier: '2x', requirement: '50K+ followers' },
                    ].map((tier) => (
                      <div key={tier.badge} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={`${tier.color} text-white`}>{tier.badge}</Badge>
                          <span className="text-sm text-muted-foreground">{tier.requirement}</span>
                        </div>
                        <span className="font-medium text-green-600">{tier.multiplier}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Earning Structure</h2>
                <p className="text-muted-foreground">The more you refer, the more you earn per referral</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Tier</th>
                          <th className="text-left py-3 px-4">Referrals</th>
                          <th className="text-left py-3 px-4">Earning Rate</th>
                          <th className="text-left py-3 px-4">Badge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earningTiers.map((tier, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="py-3 px-4 font-medium">{tier.badge}</td>
                            <td className="py-3 px-4 text-muted-foreground">{tier.referrals}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary">{tier.rate}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className={`w-6 h-6 rounded-full ${tier.color}`} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-500" />
                    Redeem Your Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-4">
                      <p className="text-3xl font-bold text-green-600">2000</p>
                      <p className="text-sm text-muted-foreground">Minimum Credits</p>
                    </div>
                    <div className="p-4">
                      <p className="text-3xl font-bold text-green-600">= ₹100</p>
                      <p className="text-sm text-muted-foreground">Payout Value</p>
                    </div>
                    <div className="p-4">
                      <p className="text-3xl font-bold text-green-600">UPI/Bank</p>
                      <p className="text-sm text-muted-foreground">Payment Methods</p>
                    </div>
                  </div>
                  {user && (
                    <div className="text-center mt-4">
                      <Button onClick={() => navigate('/referrals')} className="bg-green-600 hover:bg-green-700">
                        <IndianRupee className="w-4 h-4 mr-2" />
                        Redeem Credits
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      
      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default CreatorPortal;
