import React, { useState } from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye, EyeOff, Activity } from 'lucide-react';

export const PersonalizationDebug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { behavior, session, intent, segment, content, device, location } = usePersonalization();

  // Only show in development
  if (import.meta.env.PROD) return null;

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-50 opacity-50 hover:opacity-100"
      >
        <Activity className="w-4 h-4 mr-1" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-50 w-80 max-h-[60vh] overflow-hidden shadow-elegant">
      <CardHeader className="py-2 px-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Personalization Debug
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
            >
              <EyeOff className="w-3 h-3" />
            </Button>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-4 pt-0 overflow-y-auto max-h-[50vh] text-xs space-y-4">
          {/* Segment & Intent */}
          <div>
            <h4 className="font-semibold mb-2">User Classification</h4>
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="default">{segment}</Badge>
              <Badge variant="secondary">{intent.type}</Badge>
            </div>
            <p className="text-muted-foreground">
              Confidence: {Math.round(intent.confidence * 100)}%
            </p>
            {intent.interests.length > 0 && (
              <p className="text-muted-foreground">
                Interests: {intent.interests.join(', ')}
              </p>
            )}
          </div>

          {/* Behavior */}
          <div>
            <h4 className="font-semibold mb-2">Behavior</h4>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <span>Page Views: {behavior.pageViews}</span>
              <span>Time: {behavior.timeOnSite}s</span>
              <span>Scroll: {behavior.scrollDepth}%</span>
              <span>Widgets: {behavior.widgetsGenerated}</span>
            </div>
            {behavior.clickedElements.length > 0 && (
              <p className="mt-1 text-muted-foreground truncate">
                Clicks: {behavior.clickedElements.slice(-3).join(', ')}
              </p>
            )}
          </div>

          {/* Session */}
          <div>
            <h4 className="font-semibold mb-2">Session</h4>
            <div className="space-y-1 text-muted-foreground">
              <p>Visit #{session.visitCount}</p>
              <p>Returning: {session.isReturningUser ? 'Yes' : 'No'}</p>
              {session.utmSource && <p>UTM Source: {session.utmSource}</p>}
              {session.utmCampaign && <p>UTM Campaign: {session.utmCampaign}</p>}
              {session.referrer && <p className="truncate">Referrer: {session.referrer || 'Direct'}</p>}
            </div>
          </div>

          {/* Device */}
          <div>
            <h4 className="font-semibold mb-2">Device</h4>
            <div className="space-y-1 text-muted-foreground">
              <p>{device.isMobile ? 'Mobile' : device.isTablet ? 'Tablet' : 'Desktop'}</p>
              <p>{device.browser} on {device.os}</p>
              <p>{device.screenWidth}px width</p>
            </div>
          </div>

          {/* Personalized Content */}
          <div>
            <h4 className="font-semibold mb-2">Content Personalization</h4>
            <div className="space-y-1 text-muted-foreground">
              <p className="truncate">CTA: {content.ctaText}</p>
              <p>Social Proof: {content.showSocialProof ? 'Yes' : 'No'}</p>
              <p>Urgency: {content.showUrgency ? 'Yes' : 'No'}</p>
              <p>Pricing Focus: {content.pricingEmphasis}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
