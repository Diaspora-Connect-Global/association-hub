import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Users,
  MessageSquare,
  Briefcase,
  Calendar,
  ShoppingCart,
  LifeBuoy,
  Settings,
  Plus,
  PlusCircle,
  CalendarPlus,
  Tag,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { signOutAdmin, useAdminAuthStore } from "@/stores/adminAuthStore";
import { useShallow } from "zustand/react/shallow";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import { getAssociation } from "@/services/graphql/association";
import { useEventsOnly } from "@/hooks/useEventsOnly";
import { filterNavForEventsOnly, isPathAllowed } from "@/lib/eventNetworking";
import { EVENTS_ONLY_ALLOWED_PATHS } from "@/components/events/networking/EventsOnlyGate";
import { pathMatches, sectionPaths, visibleTabs } from "@/lib/navSections";
import diaspoPlugLogo from "@/assets/diaspo-plug-logo.svg";
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
  path: string;
  /** Other routes that light this entry up (its section's tabs). */
  matchPaths?: readonly string[];
  badge?: number;
}

interface NavGroup {
  id: string;
  /** Group heading; the first and last groups have none. */
  heading?: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** Entries an events-only association keeps: events, members & join requests, settings (with admins and audit). */
const EVENTS_ONLY_NAV_IDS = ["dashboard", "events", "members", "settings"];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { eventsOnly } = useEventsOnly();
  const navigate = useNavigate();
  const t = useT();
  const admin = useAdminAuthStore((state) => state.admin);
  // zustand v5: object selectors need useShallow, otherwise each render returns a new
  // object and React re-renders forever (error #185) — every page renders this sidebar.
  const { pendingRequestsCount, pendingReportsCount, association } = useAssociationAdminStore(
    useShallow((state) => ({
      pendingRequestsCount: state.pendingRequestsCount,
      pendingReportsCount: state.pendingReportsCount,
      association: state.association,
    })),
  );

  // Fetch the association name directly so the sidebar always shows the entity
  // name (not the UUID) even before the dashboard/profile pages have mounted.
  const associationId = admin?.scopeType === "ASSOCIATION" ? admin.scopeId ?? null : null;
  const { data: associationQuery } = useQuery({
    queryKey: ["association", associationId],
    queryFn: () => getAssociation(associationId!),
    enabled: !!associationId && !association,
    staleTime: 5 * 60_000,
  });
  const associationName = association?.name ?? associationQuery?.name ?? "Admin Portal";
  const associationAvatarUrl = association?.avatarUrl ?? associationQuery?.avatarUrl ?? null;

  // The admin's user id is never displayed — the session carries no name.
  const adminName = "Association Admin";
  const adminRole = admin?.role?.name || "Admin";
  const adminInitials = adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AA";

  const handleLogout = () => {
    signOutAdmin();
    navigate("/login", { replace: true });
  };

  const settingsTabs = visibleTabs("settings", {
    eventsOnly,
    isAllowed: (path) => isPathAllowed(path, EVENTS_ONLY_ALLOWED_PATHS),
  });

  const navGroups: NavGroup[] = [
    {
      id: "home",
      items: [
        {
          id: "dashboard",
          label: eventsOnly ? "Events dashboard" : t.dashboard,
          icon: Home,
          path: "/",
          matchPaths: sectionPaths("dashboard"),
        },
      ],
    },
    {
      id: "content",
      heading: t.navContent,
      items: [
        { id: "posts", label: t.posts, icon: MessageSquare, path: "/posts" },
        { id: "events", label: t.events, icon: Calendar, path: "/events" },
        { id: "opportunities", label: t.opportunities, icon: Briefcase, path: "/opportunities" },
        // Listings · Analytics · Escrow (was the "Vendor" submenu)
        {
          id: "marketplace",
          label: t.marketplace,
          icon: ShoppingCart,
          path: "/marketplace",
          matchPaths: sectionPaths("marketplace"),
        },
        { id: "groups", label: t.groups, icon: Users, path: "/groups" },
      ],
    },
    {
      id: "people",
      heading: t.navPeople,
      items: [
        {
          id: "members",
          label: t.members,
          icon: Users,
          path: "/members",
          badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
        },
      ],
    },
    {
      id: "support",
      heading: t.navSupport,
      items: [
        {
          id: "tickets",
          label: t.supportTickets,
          icon: LifeBuoy,
          path: "/tickets",
          badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
        },
      ],
    },
    {
      id: "admin",
      items: [
        // Profile · Services · Roles & admins · Audit log. Opens the first tab
        // this admin may see (an events-only association cannot open Profile).
        {
          id: "settings",
          label: t.settings,
          icon: Settings,
          path: settingsTabs[0]?.path ?? "/settings",
          matchPaths: sectionPaths("settings"),
        },
      ],
    },
  ];

  const visibleNavGroups = navGroups
    .map((group) => ({ ...group, items: filterNavForEventsOnly(group.items, eventsOnly, EVENTS_ONLY_NAV_IDS) }))
    .filter((group) => group.items.length > 0);

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
    const isActive = [item.path, ...(item.matchPaths ?? [])].some((p) => pathMatches(location.pathname, p));

    const navContent = (
      <Link
        to={item.path}
        aria-current={isActive ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 body-small font-medium transition-all duration-200",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {typeof item.badge === "number" && item.badge > 0 && (
              <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-semibold text-primary-foreground">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </>
        )}
      </Link>
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
            {associationAvatarUrl ? (
              <img
                src={associationAvatarUrl}
                alt={associationName}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <img
                src={diaspoPlugLogo}
                alt="DiaspoPlug"
                className="h-10 w-10 object-contain flex-shrink-0"
              />
            )}
            {!collapsed && (
              <div>
                <h1 className="label-small font-bold text-sidebar-foreground">DiaspoPlug</h1>
                <p className="caption-small text-muted-foreground">{associationName}</p>
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
              {!eventsOnly && (
              <button 
                onClick={() => handleQuickAction("post")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 caption-small text-primary-foreground transition-all hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.newPost}
              </button>
              )}
              <button 
                onClick={() => handleQuickAction("event")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                {t.newEvent}
              </button>
              {!eventsOnly && (
              <button 
                onClick={() => handleQuickAction("opportunity")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                {t.newOpportunity}
              </button>
              )}
              {!eventsOnly && (
              <button 
                onClick={() => handleQuickAction("listing")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-sidebar-accent px-3 py-2 caption-small text-sidebar-foreground transition-all hover:bg-sidebar-accent/80"
              >
                <Tag className="h-3.5 w-3.5" />
                {t.newListing}
              </button>
              )}
            </div>
          </div>
        )}

        {/* Collapsed Quick Action */}
        {collapsed && (
          <div className="border-b border-sidebar-border p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => handleQuickAction(eventsOnly ? "event" : "post")}
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
        <nav className="scrollbar-thin flex-1 overflow-y-auto p-4" aria-label={t.navMenu}>
          {visibleNavGroups.map((group, groupIndex) => (
            <div key={group.id} className={cn(groupIndex > 0 && "mt-4")}>
              {group.heading &&
                (collapsed ? (
                  <div className="mx-2 mb-2 border-t border-sidebar-border" aria-hidden="true" />
                ) : (
                  <p className="mb-1 px-3 caption-small font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.heading}
                  </p>
                ))}
              <ul className="space-y-1">{group.items.map(renderNavItem)}</ul>
            </div>
          ))}
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
                  {adminInitials}
                </NavLink>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {adminName}
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
                    {adminName}
                  </NavLink>
                  <p className="caption-small text-muted-foreground">{adminRole}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

      </aside>
    </TooltipProvider>
  );
}