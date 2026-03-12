import { Bell, Search, HelpCircle, LogOut, PanelLeft, PanelLeftClose } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/hooks/useT";
import { clearAdminSession, useAdminAuthStore } from "@/stores/adminAuthStore";
import { useAssociationAdminStore } from "@/stores/associationAdminStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title: string;
  subtitle?: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ title, subtitle, sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const t = useT();
  const admin = useAdminAuthStore((state) => state.admin);
  const association = useAssociationAdminStore((state) => state.association);

  const associationLabel = association?.name || (admin?.scopeId ? `Association ${admin.scopeId}` : "Association scope");
  const adminLabel = admin?.role?.name || admin?.userId || "Association admin";

  const handleLogout = () => {
    clearAdminSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side: Sidebar Toggle + Association Selector + Title */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          {onToggleSidebar && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleSidebar}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Association Scope */}
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <p className="caption-small uppercase tracking-wider text-muted-foreground">
              {associationLabel}
            </p>
            <p className="label-small text-foreground line-clamp-1 max-w-[220px]">
              {adminLabel}
            </p>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border hidden md:block" />

          {/* Title */}
          <div className="hidden md:block">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="body-small text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.search + "..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search w-64 pl-10"
            />
          </div>

          {/* Help */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive caption-small text-primary-foreground">
              3
            </span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
}