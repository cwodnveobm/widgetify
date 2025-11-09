import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Play, Pause, Trash2, BarChart3, Edit } from 'lucide-react';
import { useABTests } from '@/hooks/useABTests';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ABTestDialog } from '@/components/ABTestDialog';
import { ABTestAnalytics } from '@/components/ABTestAnalytics';

const ABTesting: React.FC = () => {
  const { user } = useAuth();
  const { tests, loading, updateTest, deleteTest } = useABTests();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateTest = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedTest(null);
    setShowTestDialog(true);
  };

  const handleEditTest = (test: any) => {
    setSelectedTest(test);
    setShowTestDialog(true);
  };

  const handleToggleStatus = async (test: any) => {
    const newStatus = test.status === 'active' ? 'paused' : 'active';
    await updateTest(test.id, { status: newStatus });
  };

  const handleDeleteTest = async (testId: string) => {
    await deleteTest(testId);
    setDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'outline',
      active: 'default',
      paused: 'secondary',
      completed: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    );
  };

  if (showAnalytics) {
    return (
      <>
        <Navigation onAuthModalOpen={() => setShowAuthModal(true)} />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-8 px-4">
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(null)}
              className="mb-6"
            >
              ← Back to Tests
            </Button>
            <ABTestAnalytics testId={showAnalytics} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation onAuthModalOpen={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">A/B Testing</h1>
              <p className="text-muted-foreground">
                Test widget variations and optimize for better performance
              </p>
            </div>
            <Button onClick={handleCreateTest} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No A/B Tests Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Create your first A/B test to compare widget variations and find what works best for your audience.
                </p>
                <Button onClick={handleCreateTest}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Test
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      {getStatusBadge(test.status)}
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div>
                        Created: {new Date(test.created_at).toLocaleDateString()}
                      </div>
                      {test.start_date && (
                        <div>
                          Started: {new Date(test.start_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAnalytics(test.id)}
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTest(test)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(test)}
                        disabled={test.status === 'draft' || test.status === 'completed'}
                      >
                        {test.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(test.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="signup"
      />

      <ABTestDialog
        isOpen={showTestDialog}
        onClose={() => {
          setShowTestDialog(false);
          setSelectedTest(null);
        }}
        test={selectedTest}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete A/B Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test? This will also delete all variations and metrics data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteTest(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ABTesting;