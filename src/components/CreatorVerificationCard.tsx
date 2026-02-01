import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useCreatorVerification } from '@/hooks/useCreatorVerification';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Instagram, 
  Users, 
  Sparkles,
  Crown,
  Shield,
  Star,
  Loader2
} from 'lucide-react';

interface CreatorVerificationCardProps {
  onAuthRequired: () => void;
}

const CreatorVerificationCard: React.FC<CreatorVerificationCardProps> = ({ onAuthRequired }) => {
  const { user } = useAuth();
  const { 
    verification, 
    loading, 
    applying,
    isVerified, 
    isPending, 
    isRejected,
    applyForVerification,
    updateApplication,
    getBadgeConfig,
    getMultiplierDisplay
  } = useCreatorVerification();

  const [instagramHandle, setInstagramHandle] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [applicationNote, setApplicationNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onAuthRequired();
      return;
    }

    const count = parseInt(followerCount) || 0;
    
    if (verification && isPending) {
      await updateApplication({
        instagramHandle,
        followerCount: count,
        applicationNote
      });
    } else {
      await applyForVerification({
        instagramHandle,
        followerCount: count,
        applicationNote
      });
    }
  };

  // Initialize form with existing data
  React.useEffect(() => {
    if (verification) {
      setInstagramHandle(verification.instagram_handle || '');
      setFollowerCount(verification.follower_count?.toString() || '');
      setApplicationNote(verification.application_note || '');
    }
  }, [verification]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Verified Creator View
  if (isVerified && verification) {
    const badgeConfig = getBadgeConfig(verification.badge_type);
    
    return (
      <Card className="border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Verified Creator
            </CardTitle>
            <Badge className={`${badgeConfig.color} text-white`}>
              {badgeConfig.icon && <span className="mr-1">{badgeConfig.icon}</span>}
              {badgeConfig.label}
            </Badge>
          </div>
          <CardDescription>
            You're a verified Widgetify creator with enhanced benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground">Instagram</p>
              <p className="font-medium">@{verification.instagram_handle}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <p className="text-sm text-muted-foreground">Earning Rate</p>
              <p className="font-medium text-green-600">
                {getMultiplierDisplay(verification.earning_multiplier)}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Creator Benefits</span>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• {verification.earning_multiplier}x credits per referral</li>
              <li>• Priority support</li>
              <li>• Exclusive creator badge</li>
              <li>• Early access to new features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pending Application View
  if (isPending && verification) {
    return (
      <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Application Pending
            </CardTitle>
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              Under Review
            </Badge>
          </div>
          <CardDescription>
            Your verification application is being reviewed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-muted-foreground mb-2">Application Details</p>
            <div className="space-y-2">
              <p><strong>Instagram:</strong> @{verification.instagram_handle}</p>
              <p><strong>Followers:</strong> {verification.follower_count?.toLocaleString()}</p>
              <p><strong>Applied:</strong> {new Date(verification.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            We typically review applications within 24-48 hours. You'll be notified once approved!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Rejected Application View
  if (isRejected && verification) {
    return (
      <Card className="border-2 border-red-500/50 bg-gradient-to-br from-red-500/5 to-pink-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Application Not Approved
            </CardTitle>
            <Badge variant="destructive">Rejected</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {verification.rejection_reason && (
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm font-medium text-red-600 mb-1">Reason:</p>
              <p className="text-sm text-muted-foreground">{verification.rejection_reason}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            You can reach out to support if you believe this was a mistake, or try again after growing your Instagram presence.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Application Form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-500" />
          Get Verified
        </CardTitle>
        <CardDescription>
          Apply to become a verified creator and unlock higher earning rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Handle *</Label>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              <Input
                id="instagram"
                placeholder="@your_handle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="followers">Follower Count *</Label>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <Input
                id="followers"
                type="number"
                placeholder="e.g., 5000"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                required
                min="0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 1,000 followers recommended for verification
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Why should we verify you? (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Tell us about your content, engagement rate, or previous collaborations..."
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Benefits Preview */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Verified Creator Benefits:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Up to 2x earning rate on referrals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Verified badge on your profile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Priority support access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Featured in creator spotlight</span>
              </li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={applying || !instagramHandle || !followerCount}
          >
            {applying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Apply for Verification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatorVerificationCard;
