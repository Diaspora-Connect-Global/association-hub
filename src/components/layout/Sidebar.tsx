import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  MessageSquare,
  Briefcase,
  Calendar,
  ShoppingCart,
  Package,
  LifeBuoy,
  BarChart2,
  Settings,
  Plus,
  PlusCircle,
  CalendarPlus,
  Tag,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import diaspoPlugLogo from "@/assets/diaspo-plug-logo.svg";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();

  const navItems = [
    { id: "dashboard", label: t.dashboard, icon: Home, path: "/" },
    { id: "profile", label: t.associationProfile, icon: FileText, path: "/profile" },
    { id: "members", label: t.members, icon: Users, path: "/members" },
    { id: "posts", label: t.posts, icon: MessageSquare, path: "/posts" },
    { id: "opportunities", label: t.opportunities, icon: Briefcase, path: "/opportunities" },
    { id: "events", label: t.events, icon: Calendar, path: "/events" },
    { id: "marketplace", label: t.marketplace, icon: ShoppingCart, path: "/marketplace" },
    { id: "orders", label: t.orders, icon: Package, path: "/orders" },
    { id: "groups", label: t.groups, icon: Users, path: "/groups" },
    { id: "tickets", label: t.supportTickets, icon: LifeBuoy, path: "/tickets" },
    { id: "analytics", label: t.analytics, icon: BarChart2, path: "/analytics" },
    { id: "audit", label: t.auditLogs, icon: FileText, path: "/audit-logs" },
    { id: "settings", label: t.settings, icon: Settings, path: "/settings" },
  ];

  // Quick action handlers
  const handleQuickAction = (action: "post" | "event" | "opportunity" | "listing") => {
    switch (action) {
      case "post":
        navigate("/posts", { state: { openCreate: true } });
        break;
      case "event":
        navigate("/events", { state: { openCreate: true } });
        break;
      case "opportunity":
        navigate("/opportunities", { state: { openCreate: true } });
        break;
      case "listing":
        navigate("/marketplace", { state: { openCreate: true } });
        break;
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* App Logo */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2">
          <img 
            src={diaspoPlugLogo} 
            alt="DiaspoPlug" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="label-small font-bold text-sidebar-foreground">DiaspoPlug</h1>
            <p className="caption-small text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-sidebar-border p-4">
        <p className="mb-3 caption-small uppercase tracking-wider text-muted-foreground">
          {t.quickActions}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleQuickAction("post")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 caption-small text-primary-foreground transition-all hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            {t.newPost}
          </button>
          <button 
            onClick={() => handleQuickAction("event")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            {t.newEvent}
          </button>
          <button 
            onClick={() => handleQuickAction("opportunity")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {t.newOpportunity}
          </button>
          <button 
            onClick={() => handleQuickAction("listing")}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
          >
            <Tag className="h-3.5 w-3.5" />
            {t.newListing}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 body-small font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <NavLink
            to="/admin-profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground label-small hover:opacity-90 transition-opacity"
          >
            AK
          </NavLink>
          <div className="flex-1 min-w-0">
            <NavLink
              to="/admin-profile"
              className="label-small text-sidebar-foreground truncate block hover:text-primary transition-colors"
            >
              Akua Mensah
            </NavLink>
            <p className="caption-small text-muted-foreground">Admin</p>
          </div>
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
