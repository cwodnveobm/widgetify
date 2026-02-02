import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/hooks/useAuth';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ShieldCheck, ShieldX, Users, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthModal } from '@/components/AuthModal';

interface CreatorVerification {
  id: string;
  user_id: string;
  instagram_handle: string;
  follower_count: number | null;
  status: string;
  badge_type: string;
  earning_multiplier: number;
  application_note: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

const AdminPanel: React.FC = () => {
  const { isAdmin, isLoading: roleLoading } = useAdminRole();
  const { user } = useAuth();
  const [applications, setApplications] = useState<CreatorVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('creator_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (application: CreatorVerification) => {
    setProcessingId(application.id);
    
    // Determine badge type and multiplier based on follower count
    let badgeType = 'verified';
    let multiplier = 1.5;
    
    if (application.follower_count && application.follower_count >= 50000) {
      badgeType = 'elite';
      multiplier = 2.0;
    } else if (application.follower_count && application.follower_count >= 10000) {
      badgeType = 'premium';
      multiplier = 1.75;
    }

    try {
      const { error } = await supabase
        .from('creator_verifications')
        .update({
          status: 'approved',
          badge_type: badgeType,
          earning_multiplier: multiplier,
          verified_at: new Date().toISOString(),
          rejection_reason: null
        })
        .eq('id', application.id);

      if (error) throw error;
      
      toast.success(`Creator @${application.instagram_handle} approved with ${badgeType} badge!`);
      fetchApplications();
    } catch (err) {
      console.error('Error approving application:', err);
      toast.error('Failed to approve application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (application: CreatorVerification) => {
    const reason = rejectionReasons[application.id];
    if (!reason?.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingId(application.id);

    try {
      const { error } = await supabase
        .from('creator_verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          badge_type: 'none',
          earning_multiplier: 1.0
        })
        .eq('id', application.id);

      if (error) throw error;
      
      toast.success(`Application from @${application.instagram_handle} rejected`);
      setRejectionReasons(prev => ({ ...prev, [application.id]: '' }));
      fetchApplications();
    } catch (err) {
      console.error('Error rejecting application:', err);
      toast.error('Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'elite':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'premium':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'verified':
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <ShieldX className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filterApplications = (status: string) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>Please sign in to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <ShieldX className="w-12 h-12 mx-auto text-destructive mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access this page</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage creator verification applications</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{filterApplications('pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{filterApplications('approved').length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{filterApplications('rejected').length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterApplications('pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filterApplications('approved').length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({filterApplications('rejected').length})</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filterApplications(tab).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No {tab === 'all' ? '' : tab} applications found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filterApplications(tab).map(application => (
                    <Card key={application.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getBadgeIcon(application.badge_type)}
                              <h3 className="font-semibold text-lg">@{application.instagram_handle}</h3>
                              {getStatusBadge(application.status)}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <p className="text-muted-foreground">Followers</p>
                                <p className="font-medium">{application.follower_count?.toLocaleString() || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Badge Type</p>
                                <p className="font-medium capitalize">{application.badge_type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Multiplier</p>
                                <p className="font-medium">{application.earning_multiplier}x</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Applied</p>
                                <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {application.application_note && (
                              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Application Note:</p>
                                <p className="text-sm">{application.application_note}</p>
                              </div>
                            )}
                            {application.rejection_reason && (
                              <div className="bg-red-500/10 rounded-lg p-3">
                                <p className="text-sm text-red-600 mb-1">Rejection Reason:</p>
                                <p className="text-sm">{application.rejection_reason}</p>
                              </div>
                            )}
                          </div>
                          
                          {application.status === 'pending' && (
                            <div className="flex flex-col gap-3 lg:w-72">
                              <Textarea
                                placeholder="Rejection reason (required to reject)"
                                value={rejectionReasons[application.id] || ''}
                                onChange={(e) => setRejectionReasons(prev => ({
                                  ...prev,
                                  [application.id]: e.target.value
                                }))}
                                className="min-h-[80px]"
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 border-green-500 text-green-600 hover:bg-green-500/10"
                                  onClick={() => handleApprove(application)}
                                  disabled={processingId === application.id}
                                >
                                  {processingId === application.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 border-red-500 text-red-600 hover:bg-red-500/10"
                                  onClick={() => handleReject(application)}
                                  disabled={processingId === application.id}
                                >
                                  {processingId === application.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
