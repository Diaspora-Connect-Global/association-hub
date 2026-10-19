import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEventsOnly } from "@/hooks/useEventsOnly";
import { isPathAllowed } from "@/lib/eventNetworking";

/** Pages an events-only association may open; anything else sends the admin to the Events dashboard. */
const EVENTS_ONLY_ALLOWED_PATHS = ["/", "/events", "/members", "/roles-admins", "/settings", "/audit-logs", "/admin-profile"];

export function EventsOnlyGate() {
  const { eventsOnly } = useEventsOnly();
  const { pathname } = useLocation();
  if (eventsOnly && !isPathAllowed(pathname, EVENTS_ONLY_ALLOWED_PATHS)) return <Navigate to="/" replace />;
  return <Outlet />;
}
