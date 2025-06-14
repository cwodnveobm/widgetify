
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            {!isOnline ? (
              <WifiOff className="w-16 h-16 text-orange-500" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {!isOnline ? "Connection Lost" : "Page Not Found"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isOnline ? (
            <div className="space-y-3">
              <p className="text-gray-600">
                You appear to be offline. Please check your internet connection.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
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
              <p className="text-4xl font-bold text-gray-400">404</p>
              <p className="text-gray-600">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Route attempted: <code className="bg-blue-100 px-1 rounded">{location.pathname}</code>
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

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? <Link to="/support" className="text-purple-600 hover:underline">Contact Support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
