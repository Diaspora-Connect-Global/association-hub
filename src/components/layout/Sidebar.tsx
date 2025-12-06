import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronDown,
  Plus,
  PlusCircle,
  CalendarPlus,
  Tag,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "profile", label: "Association Profile", icon: FileText, path: "/profile" },
  { id: "members", label: "Members", icon: Users, path: "/members" },
  { id: "posts", label: "Posts", icon: MessageSquare, path: "/posts" },
  { id: "opportunities", label: "Opportunities", icon: Briefcase, path: "/opportunities" },
  { id: "events", label: "Events", icon: Calendar, path: "/events" },
  { id: "marketplace", label: "Marketplace", icon: ShoppingCart, path: "/marketplace" },
  { id: "orders", label: "Orders", icon: Package, path: "/orders" },
  { id: "groups", label: "Groups", icon: Users, path: "/groups" },
  { id: "tickets", label: "Support Tickets", icon: LifeBuoy, path: "/tickets" },
  { id: "analytics", label: "Analytics", icon: BarChart2, path: "/analytics" },
  { id: "audit", label: "Audit Logs", icon: FileText, path: "/audit-logs" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

const associations = [
  { id: "1", name: "Ghana Tech Community", logo: "🇬🇭" },
  { id: "2", name: "African Developers Network", logo: "🌍" },
  { id: "3", name: "Diaspora Business Hub", logo: "💼" },
];

export function Sidebar() {
  const location = useLocation();
  const [selectedAssociation, setSelectedAssociation] = useState(associations[0]);
  const [isAssociationOpen, setIsAssociationOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Association Selector */}
      <div className="border-b border-sidebar-border p-4">
        <button
          onClick={() => setIsAssociationOpen(!isAssociationOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-sidebar-accent p-3 transition-colors hover:bg-sidebar-accent/80"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedAssociation.logo}</span>
            <div className="text-left">
              <p className="label-small text-sidebar-foreground">
                {selectedAssociation.name}
              </p>
              <p className="caption-small text-muted-foreground">Association Admin</p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isAssociationOpen && "rotate-180"
            )}
          />
        </button>

        {isAssociationOpen && (
          <div className="mt-2 animate-fade-in rounded-lg border border-sidebar-border bg-sidebar-accent p-2">
            {associations.map((assoc) => (
              <button
                key={assoc.id}
                onClick={() => {
                  setSelectedAssociation(assoc);
                  setIsAssociationOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 body-small transition-colors",
                  selectedAssociation.id === assoc.id
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <span className="text-lg">{assoc.logo}</span>
                <span>{assoc.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-b border-sidebar-border p-4">
        <p className="mb-3 caption-small uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 caption-small text-primary-foreground transition-all hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            Post
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80">
            <CalendarPlus className="h-3.5 w-3.5" />
            Event
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80">
            <PlusCircle className="h-3.5 w-3.5" />
            Opportunity
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80">
            <Tag className="h-3.5 w-3.5" />
            Listing
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground label-small">
            AK
          </div>
          <div className="flex-1">
            <p className="label-small text-sidebar-foreground">Akua Mensah</p>
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
