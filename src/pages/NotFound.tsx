
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { WifiOff, AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [location.pathname]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await fetch(window.location.href, { method: 'HEAD' });
      window.location.reload();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-primary/10 p-4">
      <Card className="w-full max-w-md mx-auto text-center shadow-elegant">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {!isOnline ? (
              <WifiOff className="w-16 h-16 text-destructive" />
            ) : (
              <AlertCircle className="w-16 h-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {!isOnline ? "Connection Lost" : "Page Not Found"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isOnline ? (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                You appear to be offline. Please check your internet connection.
              </p>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">
                  • Check your WiFi connection
                  <br />
                  • Try moving to a better signal area
                  <br />
                  • Restart your router if needed
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-4xl font-bold text-muted-foreground">404</p>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-primary">
                  Route attempted: <code className="bg-primary/10 px-1 rounded">{location.pathname}</code>
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              variant="outline"
              className="flex-1 min-h-[44px]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
            
            <Button asChild className="flex-1 min-h-[44px]">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Need help? <Link to="/support" className="text-primary hover:underline">Contact Support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
