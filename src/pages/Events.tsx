import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Search, Calendar, BarChart3 } from "lucide-react";
import { Event, EventFormData } from "@/types/events";
import { EventCard } from "@/components/events/EventCard";
import { CreateEditEventModal } from "@/components/events/CreateEditEventModal";
import { EventDetailsModal } from "@/components/events/EventDetailsModal";
import { RegistrationsDrawer } from "@/components/events/RegistrationsDrawer";
import { DeleteEventModal } from "@/components/events/DeleteEventModal";
import { EventAnalyticsWidget } from "@/components/events/EventAnalyticsWidget";
import { toast } from "@/hooks/use-toast";
import { getAdminAssociationId } from "@/stores/adminAuthStore";
import {
  getEventsByOwner,
  publishEvent,
  cancelEvent,
  deleteEvent,
  createEvent,
  updateEvent,
  type EventType as BackendEvent,
} from "@/services/graphql/events/operations";
import { uploadEventCoverImage } from "@/services/graphql/events/uploads";

/**
 * Resolve the value that should be sent as `coverImageUrl` on createEvent /
 * updateEvent.
 *
 * - If the form carries a freshly-picked `File` (the user just dropped/selected
 *   an image), upload it via the signed-URL flow and return the resulting
 *   public URL.
 * - Otherwise return undefined. We explicitly drop `data:` URLs to defensively
 *   guard against any caller that might still be sending base64 inline (which
 *   was the original bug: the GraphQL request body grew to multiple MB and
 *   timed out at the gateway / nginx body limit).
 */
async function resolveCoverImageUrl(
  bannerImage: unknown,
): Promise<string | undefined> {
  if (bannerImage instanceof File) {
    return uploadEventCoverImage(bannerImage);
  }
  if (typeof bannerImage === "string") {
    const trimmed = bannerImage.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith("data:")) return undefined;
    return trimmed;
  }
  return undefined;
}

// -------------------------------------------------------------------------
// Helpers: map backend EventType → UI Event type
// -------------------------------------------------------------------------

function formatBackendDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function formatBackendTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function mapBackendStatus(
  status: BackendEvent["status"],
): Event["status"] {
  switch (status) {
    case "PUBLISHED":
      return "published";
    case "CANCELLED":
      return "cancelled";
    case "COMPLETED":
      return "completed";
    case "ONGOING":
      return "ongoing";
    case "DRAFT":
    default:
      return "draft";
  }
}

function mapBackendToUiEvent(e: BackendEvent): Event {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    bannerImage: e.coverImageUrl ?? undefined,
    date: formatBackendDate(e.startAt),
    startTime: formatBackendTime(e.startAt),
    endTime: formatBackendTime(e.endAt),
    eventType: e.locationType?.toLowerCase() === "physical" ? "in-person" : "virtual",
    location: e.locationDetails ?? undefined,
    virtualLink: e.locationType?.toLowerCase() !== "physical" ? (e.locationDetails ?? undefined) : undefined,
    isPaid: e.isPaid,
    hasParticipantLimit: false,
    registeredCount: e.registrationCount ?? 0,
    status: mapBackendStatus(e.status),
    publishNow: e.status === "PUBLISHED",
    notifyMembers: true,
    allowComments: true,
    views: e.viewCount ?? 0,
    ticketsSold: e.registrationCount ?? 0,
    revenue: 0,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------

export default function Events() {
  const location = useLocation();
  const t = useT();
  const associationId = useMemo(() => getAdminAssociationId(), []);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [registrationsDrawerOpen, setRegistrationsDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const loadEvents = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);
    try {
      const response = await getEventsByOwner("ASSOCIATION", associationId, 1, 100);
      setEvents((response.events ?? []).map(mapBackendToUiEvent));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load events.";
      toast({ title: "Error loading events", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  // Handle quick action navigation
  useEffect(() => {
    if (location.state?.openCreate) {
      setCreateModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // -----------------------------------------------------------------------
  // Filter and sort
  // -----------------------------------------------------------------------

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "free" && !event.isPaid) ||
        (typeFilter === "paid" && event.isPaid);
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date-soonest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-latest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Stats
  const upcomingCount = events.filter((e) => e.status === "published" || e.status === "draft").length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);
  const avgAttendance =
    events.length > 0
      ? Math.round(
          (events
            .filter((e) => e.hasParticipantLimit && e.maxParticipants)
            .reduce((sum, e) => sum + (e.registeredCount / (e.maxParticipants || 1)) * 100, 0) /
            (events.filter((e) => e.hasParticipantLimit).length || 1)) || 0,
        )
      : 0;

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setCreateModalOpen(true);
  };

  const handleManageRegistrations = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationsDrawerOpen(true);
  };

  const handleTogglePublish = async (event: Event) => {
    if (!associationId) return;
    try {
      if (event.status === "published") {
        // Cancel as a lightweight "unpublish" proxy
        await cancelEvent(event.id);
        toast({ title: "Event Unpublished", description: "Event is now hidden from members." });
      } else {
        await publishEvent(event.id);
        toast({ title: "Event Published", description: "Your event is now live!" });
      }
      await loadEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Action failed.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      toast({ title: "Event Deleted", description: "The event has been permanently deleted." });
      setDeleteModalOpen(false);
      setEventToDelete(null);
      await loadEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed.";
      toast({ title: "Error deleting event", description: message, variant: "destructive" });
    }
  };

  const handleCreateSubmit = async (data: EventFormData) => {
    if (!associationId) return;
    try {
      // Resolve the cover image URL BEFORE issuing the create/update mutation.
      // If the user picked a file, this performs the signed-URL upload and
      // returns the resulting https URL, so the GraphQL request body stays
      // small (just a URL string) instead of a multi-MB base64 data URL.
      const coverImageUrl = await resolveCoverImageUrl(data.bannerImage);

      if (editingEvent) {
        // Update existing
        const input: Parameters<typeof updateEvent>[1] = {
          title: data.title,
          description: data.description,
          locationType: data.eventType === "in-person" ? "PHYSICAL" : "VIRTUAL",
          locationDetails: data.eventType === "in-person" ? data.location : data.virtualLink,
          isPaid: data.isPaid,
          ticketPrice: data.ticketPrice,
          currency: data.currency,
          maxParticipants: data.hasParticipantLimit ? data.maxParticipants : undefined,
          coverImageUrl,
        };
        if (data.date) {
          const [hours, minutes] = (data.startTime || "00:00").split(":").map(Number);
          const start = new Date(data.date);
          start.setHours(hours || 0, minutes || 0, 0, 0);
          input.startAt = start.toISOString();

          const [eHours, eMinutes] = (data.endTime || "00:00").split(":").map(Number);
          const end = new Date(data.date);
          end.setHours(eHours || 0, eMinutes || 0, 0, 0);
          input.endAt = end.toISOString();
        }
        await updateEvent(editingEvent.id, input);
        if (data.publishNow) {
          await publishEvent(editingEvent.id);
        }
        toast({ title: "Event Updated", description: "Your changes have been saved." });
      } else {
        // Create new
        const startDate = data.date ? new Date(data.date) : new Date();
        const [sHours, sMinutes] = (data.startTime || "00:00").split(":").map(Number);
        startDate.setHours(sHours || 0, sMinutes || 0, 0, 0);

        const endDate = data.date ? new Date(data.date) : new Date();
        const [eHours, eMinutes] = (data.endTime || "00:00").split(":").map(Number);
        endDate.setHours(eHours || 0, eMinutes || 0, 0, 0);

        const created = await createEvent({
          title: data.title,
          description: data.description,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          locationType: data.eventType === "in-person" ? "PHYSICAL" : "VIRTUAL",
          locationDetails: data.eventType === "in-person" ? data.location : data.virtualLink,
          isPaid: data.isPaid,
          ticketPrice: data.ticketPrice,
          currency: data.currency,
          maxParticipants: data.hasParticipantLimit ? data.maxParticipants : undefined,
          coverImageUrl,
          ownerType: "ASSOCIATION",
          ownerId: associationId,
        });

        if (data.publishNow) {
          await publishEvent(created.id);
        }

        toast({
          title: "Event Created",
          description: data.publishNow ? "Your event is now live!" : "Event saved as draft.",
        });
      }
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save event.";
      toast({ title: "Error saving event", description: message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout title={t.eventsTitle} subtitle={t.eventsSubtitle}>
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchEvents}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatus}</SelectItem>
              <SelectItem value="published">{t.published}</SelectItem>
              <SelectItem value="unpublished">{t.unpublished}</SelectItem>
              <SelectItem value="draft">{t.draft}</SelectItem>
              <SelectItem value="ongoing">{t.ongoing}</SelectItem>
              <SelectItem value="completed">{t.completed}</SelectItem>
              <SelectItem value="cancelled">{t.cancelled}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="free">{t.free}</SelectItem>
              <SelectItem value="paid">{t.paid}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t.sortPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t.newestFirst}</SelectItem>
              <SelectItem value="oldest">{t.oldestFirst}</SelectItem>
              <SelectItem value="date-soonest">{t.dateSoonest}</SelectItem>
              <SelectItem value="date-latest">{t.dateLatest}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          {t.createEvent}
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.upcomingEvents}</p>
          <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.totalRegistrations}</p>
          <p className="text-2xl font-bold text-primary">{totalRegistrations.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.ticketRevenue}</p>
          <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{t.avgAttendance}</p>
          <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
        </div>
      </div>

      {/* Tabs for Events & Analytics */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t.events}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.analytics}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading events…</div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EventCard
                    event={event}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onManageRegistrations={handleManageRegistrations}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Events Created</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first event for your association.
              </p>
              <Button onClick={() => setCreateModalOpen(true)}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <EventAnalyticsWidget />
        </TabsContent>
      </Tabs>

      {/* Modals & Drawers */}
      <CreateEditEventModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setEditingEvent(null);
        }}
        event={editingEvent}
        onSubmit={handleCreateSubmit}
      />

      <EventDetailsModal
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        event={selectedEvent}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onManageRegistrations={handleManageRegistrations}
        onDelete={handleDelete}
      />

      <RegistrationsDrawer
        open={registrationsDrawerOpen}
        onOpenChange={setRegistrationsDrawerOpen}
        event={selectedEvent}
      />

      <DeleteEventModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        event={eventToDelete}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
