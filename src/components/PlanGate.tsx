import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription, PlanType } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface PlanGateProps {
  requiredPlan: PlanType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PlanGate: React.FC<PlanGateProps> = ({ requiredPlan, children, fallback }) => {
  const { hasAccess, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) return <>{children}</>;

  if (hasAccess(requiredPlan)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-muted/30 gap-3 text-center">
      <Lock className="w-8 h-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        This feature requires the <span className="font-semibold text-foreground capitalize">{requiredPlan}</span> plan or higher.
      </p>
      <Button size="sm" onClick={() => navigate('/pricing')}>
        Upgrade Now
      </Button>
    </div>
  );
};

export default PlanGate;
