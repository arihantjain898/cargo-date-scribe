
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NotificationScheduler from "./services/notificationScheduler";
import FirebaseAuthWrapper from "./components/FirebaseAuthWrapper";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
  // Initialize notification scheduler
  useEffect(() => {
    const scheduler = NotificationScheduler.getInstance();
    scheduler.start();
    
    return () => {
      scheduler.stop();
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FirebaseAuthWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FirebaseAuthWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
