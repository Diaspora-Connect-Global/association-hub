import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { RequireAdminAuth } from "@/components/auth/RequireAdminAuth";
import { PageLoadingFallback, RouteErrorBoundary } from "@/components/routing/RouteFallbacks";
import { lazyRoute } from "@/lib/lazyRoute";
// Eager: small, and the first thing a signed-out visitor needs.
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Every signed-in page is its own chunk, loaded on first visit.
const Index = lazyRoute(() => import("./pages/Index"));
const Members = lazyRoute(() => import("./pages/Members"));
const Posts = lazyRoute(() => import("./pages/Posts"));
const Events = lazyRoute(() => import("./pages/Events"));
const Marketplace = lazyRoute(() => import("./pages/Marketplace"));
const Groups = lazyRoute(() => import("./pages/Groups"));
const GroupDetail = lazyRoute(() => import("./pages/GroupDetail"));
const Profile = lazyRoute(() => import("./pages/Profile"));
const AdminProfile = lazyRoute(() => import("./pages/AdminProfile"));
const Opportunities = lazyRoute(() => import("./pages/Opportunities"));
const Tickets = lazyRoute(() => import("./pages/Tickets"));
const AuditLogs = lazyRoute(() => import("./pages/AuditLogs"));
const Settings = lazyRoute(() => import("./pages/Settings"));
const RolesAdmins = lazyRoute(() => import("./pages/RolesAdmins"));
const Analytics = lazyRoute(() => import("./pages/Analytics"));
const VendorEscrowSettings = lazyRoute(() => import("./pages/VendorEscrowSettings"));

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  return (
    <RouteErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<PageLoadingFallback />}>
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
            {/* No order source exists for an association (the listing dialog says so);
                old links land on the marketplace instead of an always-empty page. */}
            <Route path="/orders" element={<Navigate to="/marketplace" replace />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
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
      </Suspense>
    </RouteErrorBoundary>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
