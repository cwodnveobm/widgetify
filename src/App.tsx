import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Preloader from "@/components/Preloader";
import { ThemeProvider } from "@/hooks/useTheme";
import { PersonalizationProvider } from "@/hooks/usePersonalization";
import { AdaptiveUIProvider } from "@/hooks/useAdaptiveUI";
import { usePlatformProtection } from "@/hooks/usePlatformProtection";
import Index from "./pages/Index";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Integrations from "./pages/Integrations";
import CustomBuilder from "./pages/CustomBuilder";
import ABTesting from "./pages/ABTesting";
import FAQ from "./pages/FAQ";
import Marketplace from "./pages/Marketplace";
import SupportersWall from "./pages/SupportersWall";
import ReferralDashboard from "./pages/ReferralDashboard";
import CreatorPortal from "./pages/CreatorPortal";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404s or network errors
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Enable platform-wide protection (Disable Inspect + Anti-Screenshot)
  usePlatformProtection();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('SW registered: ', registration);
            }
          })
          .catch((registrationError) => {
            if (process.env.NODE_ENV === 'development') {
              console.error('SW registration failed: ', registrationError);
            }
          });
      });
    }
  }, []);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PersonalizationProvider>
          <AdaptiveUIProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/generate" element={<Index />} />
                    <Route path="/features" element={<Index />} />
                    <Route path="/founder" element={<Index />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/custom-builder" element={<CustomBuilder />} />
                    <Route path="/ab-testing" element={<ABTesting />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/supporters" element={<SupportersWall />} />
                    <Route path="/referrals" element={<ReferralDashboard />} />
                    <Route path="/creators" element={<CreatorPortal />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </QueryClientProvider>
          </AdaptiveUIProvider>
        </PersonalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
