import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { useEventsOnly } from "@/hooks/useEventsOnly";
import { useCanManageRoles } from "@/hooks/useCanManageRoles";
import { useConsoleAccess } from "@/hooks/useConsoleAccess";
import { canOpenPath } from "@/lib/rolePermissions";
import { isPathAllowed } from "@/lib/eventNetworking";
import { EVENTS_ONLY_ALLOWED_PATHS } from "@/components/events/networking/EventsOnlyGate";
import { activeTabPath, visibleTabs, type SectionId } from "@/lib/navSections";
import type { TranslationKeys } from "@/lib/translations";

interface SectionTabsProps {
  section: SectionId;
  /** Translation key naming the section, read out by screen readers. */
  labelKey: keyof TranslationKeys;
}

/**
 * Tab bar shared by the pages of one merged section. Each tab is a link to its
 * own route, so the browser's back button and old bookmarks keep working.
 * Tabs the admin may not open (no role permission, events-only) are hidden;
 * a custom-role admin only sees the tabs its role covers.
 */
export function SectionTabs({ section, labelKey }: SectionTabsProps) {
  const { pathname } = useLocation();
  const t = useT();
  const { eventsOnly } = useEventsOnly();
  const access = useConsoleAccess();
  const canManageRoles = useCanManageRoles();

  const tabs = visibleTabs(section, {
    hiddenPaths: canManageRoles ? [] : ["/roles-admins"],
    eventsOnly,
    isAllowed: (path) => isPathAllowed(path, EVENTS_ONLY_ALLOWED_PATHS),
  }).filter((tab) => canOpenPath(access, tab.path));
  if (tabs.length < 2) return null;

  const active = activeTabPath(tabs, pathname);

  return (
    <div className="mb-6 border-b border-border overflow-x-auto">
      <nav className="flex gap-1 -mb-px" aria-label={String(t[labelKey])}>
        {tabs.map((tab) => {
          const isActive = tab.path === active;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap px-4 py-2.5 body-small font-medium border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {String(t[tab.labelKey])}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
