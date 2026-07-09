import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { RequireAdminAuth } from "@/components/auth/RequireAdminAuth";
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
import RolesAdmins from "./pages/RolesAdmins";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import VendorEscrowSettings from "./pages/VendorEscrowSettings";

const GroupDetail = lazy(() => import("./pages/GroupDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAdminAuth />}>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-profile" element={<AdminProfile />} />
              <Route path="/members" element={<Members />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/events" element={<Events />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/groups" element={<Groups />} />
              <Route
                path="/groups/:groupId"
                element={
                  <Suspense fallback={null}>
                    <GroupDetail />
                  </Suspense>
                }
              />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/roles-admins" element={<RolesAdmins />} />
              <Route path="/vendor-escrow-settings" element={<VendorEscrowSettings />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
