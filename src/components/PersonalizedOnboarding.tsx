import React, { useState, useEffect } from 'react';
import { useHyperPersonalization } from '@/hooks/useHyperPersonalization';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  ArrowRight, 
  User, 
  Briefcase, 
  Code, 
  Building2, 
  Palette,
  Target,
  ShoppingCart,
  Globe,
  MessageSquare,
  TrendingUp,
  X,
  CheckCircle
} from 'lucide-react';

interface PersonalizedOnboardingProps {
  onComplete: () => void;
  onSelectWidget?: (widgetType: string) => void;
}

type OnboardingStep = 'welcome' | 'role' | 'goal' | 'first_widget';

const ROLES = [
  { id: 'founder', label: 'Founder / Business Owner', icon: Building2, description: 'Growing my own business' },
  { id: 'marketer', label: 'Marketer', icon: TrendingUp, description: 'Optimizing conversions & growth' },
  { id: 'developer', label: 'Developer', icon: Code, description: 'Building for clients or projects' },
  { id: 'agency_owner', label: 'Agency Owner', icon: Briefcase, description: 'Creating widgets for clients' },
  { id: 'designer', label: 'Designer', icon: Palette, description: 'Crafting beautiful experiences' },
  { id: 'beginner', label: 'Just Exploring', icon: User, description: 'Seeing what\'s possible' },
];

const GOALS = [
  { id: 'lead_generation', label: 'Capture Leads', icon: MessageSquare, description: 'Get more sign-ups & contacts' },
  { id: 'sales', label: 'Increase Sales', icon: ShoppingCart, description: 'Boost revenue & conversions' },
  { id: 'engagement', label: 'Boost Engagement', icon: Target, description: 'Keep visitors on your site' },
  { id: 'support', label: 'Customer Support', icon: MessageSquare, description: 'Help visitors get answers' },
  { id: 'awareness', label: 'Build Awareness', icon: Globe, description: 'Grow your social following' },
];

export const PersonalizedOnboarding: React.FC<PersonalizedOnboardingProps> = ({
  onComplete,
  onSelectWidget,
}) => {
  const { uiPersonalization, extendedProfile, getPrioritizedWidgets, getPersonalizedCopy } = useHyperPersonalization();
  const { trackClick, behavior } = usePersonalization();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  const copy = getPersonalizedCopy();
  const prioritizedWidgets = getPrioritizedWidgets();

  // Skip if onboarding is complete or user has generated widgets
  useEffect(() => {
    if (!uiPersonalization.showOnboarding || behavior.widgetsGenerated > 0) {
      setIsVisible(false);
    }
  }, [uiPersonalization.showOnboarding, behavior.widgetsGenerated]);

  // Determine starting step based on detected context
  useEffect(() => {
    if (extendedProfile.role !== 'unknown' && extendedProfile.roleConfidence > 0.6) {
      setSelectedRole(extendedProfile.role);
      if (extendedProfile.primaryGoal !== 'unknown') {
        setSelectedGoal(extendedProfile.primaryGoal);
        setStep('first_widget');
      } else {
        setStep('goal');
      }
    }
  }, [extendedProfile]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    trackClick(`onboarding-role-${roleId}`);
    setStep('goal');
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    trackClick(`onboarding-goal-${goalId}`);
    setStep('first_widget');
  };

  const handleWidgetSelect = (widgetType: string) => {
    trackClick(`onboarding-widget-${widgetType}`);
    onSelectWidget?.(widgetType);
    handleComplete();
  };

  const handleComplete = () => {
    trackClick('onboarding-complete');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    trackClick('onboarding-skip');
    setIsVisible(false);
    onComplete();
  };

  const getProgress = () => {
    switch (step) {
      case 'welcome': return 10;
      case 'role': return 35;
      case 'goal': return 65;
      case 'first_widget': return 90;
      default: return 0;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto animate-in fade-in-0 zoom-in-95">
        <CardContent className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Getting started</span>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="h-6 px-2">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={getProgress()} className="h-1" />
          </div>

          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">{copy.heroTitle}</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {copy.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => setStep('role')}>
                  {copy.primaryCTA}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
              </div>
            </div>
          )}

          {/* Role Selection Step */}
          {step === 'role' && (
            <div>
              <h2 className="text-xl font-bold mb-2">What best describes you?</h2>
              <p className="text-muted-foreground mb-6">This helps us personalize your experience</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`p-4 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                        isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{role.label}</p>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goal Selection Step */}
          {step === 'goal' && (
            <div>
              <h2 className="text-xl font-bold mb-2">What's your main goal?</h2>
              <p className="text-muted-foreground mb-6">We'll recommend the best widgets for your needs</p>
              
              <div className="grid grid-cols-1 gap-3">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`p-4 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                        isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{goal.label}</p>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep('role')}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* First Widget Step */}
          {step === 'first_widget' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Perfect! Here's your top pick</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Based on your profile, we recommend starting with these widgets
              </p>
              
              <div className="space-y-3">
                {prioritizedWidgets.slice(0, 3).map((widgetType, index) => {
                  const widgetName = widgetType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  const isTopPick = index === 0;
                  
                  return (
                    <button
                      key={widgetType}
                      onClick={() => handleWidgetSelect(widgetType)}
                      className={`w-full p-4 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                        isTopPick ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{widgetName}</p>
                            {isTopPick && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isTopPick 
                              ? 'Most effective for your goals' 
                              : 'Great complementary widget'}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant={isTopPick ? 'default' : 'outline'}
                        >
                          Create
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep('goal')}>
                  Back
                </Button>
                <Button variant="outline" onClick={handleComplete}>
                  Browse All Widgets
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
