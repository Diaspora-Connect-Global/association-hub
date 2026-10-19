import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useSettings } from "@/contexts/SettingsContext";
import { EventsDashboard } from "./EventsDashboard";

/** Landing page of an events-only association: the Events dashboard. */
export function EventsOnlyHome({ associationId, name }: { associationId: string; name?: string }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  return (
    <AdminLayout title="Events dashboard" subtitle={name}>
      <EventsDashboard
        ownerType="ASSOCIATION"
        ownerId={associationId}
        locale={settings.language}
        onOpenEvent={() => navigate("/events")}
      />
    </AdminLayout>
  );
}
