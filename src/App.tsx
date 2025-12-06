import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Posts from "./pages/Posts";
import Events from "./pages/Events";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";
import Opportunities from "./pages/Opportunities";
import Tickets from "./pages/Tickets";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/members" element={<Members />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
