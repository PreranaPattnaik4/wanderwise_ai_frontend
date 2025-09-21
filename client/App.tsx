import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ItineraryPage from "./pages/ItineraryPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Layout from "@/components/wanderwise/Layout";
import QuantumForge from "./pages/QuantumForge";
import Auth from "./pages/Auth";
import { AuthProvider } from "@/contexts/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="itinerary" element={<ItineraryPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/quantum-forge" element={<QuantumForge />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
