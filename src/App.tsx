import { Suspense, lazy } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Case studies carry the screenshot payloads — keep them out of the landing bundle.
const CaseStudy = lazy(() => import("./pages/work/CaseStudy"));
const SystemPage = lazy(() => import("./pages/systems/SystemPage"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    {/* Honour prefers-reduced-motion for JS-driven animation (CSS alone can't reach framer-motion). */}
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/systems/:slug" element={<SystemPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </MotionConfig>
  </ThemeProvider>
);

export default App;
