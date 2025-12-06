import { useState } from "react";
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
  Store,
  ChevronDown,
  ChevronRight,
  Shield,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import diaspoPlugLogo from "@/assets/diaspo-plug-logo.svg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();

  // Check if any vendor path is active
  const vendorPaths = ["/marketplace", "/orders", "/vendor-escrow-settings"];
  const isVendorActive = vendorPaths.some((path) => location.pathname === path);
  
  const [vendorOpen, setVendorOpen] = useState(isVendorActive);

  const mainNavItems: NavItem[] = [
    { id: "dashboard", label: t.dashboard, icon: Home, path: "/" },
    { id: "profile", label: t.associationProfile, icon: FileText, path: "/profile" },
    { id: "members", label: t.members, icon: Users, path: "/members" },
    { id: "posts", label: t.posts, icon: MessageSquare, path: "/posts" },
    { id: "opportunities", label: t.opportunities, icon: Briefcase, path: "/opportunities" },
    { id: "events", label: t.events, icon: Calendar, path: "/events" },
  ];

  const vendorNavItem: NavItem = {
    id: "vendor",
    label: t.vendor || "Vendor",
    icon: Store,
    children: [
      { id: "marketplace", label: t.marketplace, icon: ShoppingCart, path: "/marketplace" },
      { id: "orders", label: t.orders, icon: Package, path: "/orders" },
      { id: "escrow", label: t.escrowSettings || "Escrow Settings", icon: Shield, path: "/vendor-escrow-settings" },
    ],
  };

  const bottomNavItems: NavItem[] = [
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

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.path && location.pathname === item.path;

    const navContent = (
      <NavLink
        to={item.path!}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 body-small font-medium transition-all duration-200",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        {isActive && (
          <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
        )}
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && item.label}
      </NavLink>
    );

    if (collapsed) {
      return (
        <li key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              {navContent}
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </li>
      );
    }

    return <li key={item.id}>{navContent}</li>;
  };

  const renderVendorSubmenu = () => {
    const Icon = vendorNavItem.icon;

    if (collapsed) {
      // When collapsed, show vendor items directly with tooltips
      return (
        <>
          {vendorNavItem.children?.map((child) => {
            const ChildIcon = child.icon;
            const isChildActive = child.path && location.pathname === child.path;

            return (
              <li key={child.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={child.path!}
                      className={cn(
                        "relative flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 body-small font-medium transition-all duration-200",
                        isChildActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      {isChildActive && (
                        <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                      )}
                      <ChildIcon className="h-4 w-4 flex-shrink-0" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {child.label}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </>
      );
    }

    return (
      <li>
        <Collapsible open={vendorOpen} onOpenChange={setVendorOpen}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 body-small font-medium transition-all duration-200",
                isVendorActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {isVendorActive && (
                <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
              )}
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{vendorNavItem.label}</span>
              {vendorOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {vendorNavItem.children?.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = child.path && location.pathname === child.path;

              return (
                <NavLink
                  key={child.id}
                  to={child.path!}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 caption-small font-medium transition-all duration-200",
                    isChildActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <ChildIcon className="h-3.5 w-3.5" />
                  {child.label}
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* App Logo */}
        <div className="border-b border-sidebar-border p-4">
          <div className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "px-2"
          )}>
            <img 
              src={diaspoPlugLogo} 
              alt="DiaspoPlug" 
              className="h-10 w-10 object-contain flex-shrink-0"
            />
            {!collapsed && (
              <div>
                <h1 className="label-small font-bold text-sidebar-foreground">DiaspoPlug</h1>
                <p className="caption-small text-muted-foreground">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!collapsed && (
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
        )}

        {/* Collapsed Quick Action */}
        {collapsed && (
          <div className="border-b border-sidebar-border p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => handleQuickAction("post")}
                  className="flex w-full items-center justify-center rounded-lg bg-primary p-2.5 text-primary-foreground transition-all hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t.quickActions}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {mainNavItems.map(renderNavItem)}
            {renderVendorSubmenu()}
            {bottomNavItems.map(renderNavItem)}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "flex-col"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/admin-profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground label-small hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  AK
                </NavLink>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Akua Mensah
                </TooltipContent>
              )}
            </Tooltip>
            {!collapsed && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 body-small font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                {collapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}