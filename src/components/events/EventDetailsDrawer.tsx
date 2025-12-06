import { Event } from "@/types/events";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit, 
  ToggleLeft, 
  Users, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Video,
  Eye,
  TrendingUp,
  MessageSquare,
  DollarSign
} from "lucide-react";

interface EventDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onTogglePublish: (event: Event) => void;
  onManageRegistrations: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const statusVariants: Record<string, "active" | "warning" | "inactive" | "error" | "pending"> = {
  published: "active",
  unpublished: "inactive",
  draft: "pending",
  ongoing: "warning",
  completed: "inactive",
  cancelled: "error",
};

export function EventDetailsDrawer({
  open,
  onOpenChange,
  event,
  onEdit,
  onTogglePublish,
  onManageRegistrations,
  onDelete,
}: EventDetailsDrawerProps) {
  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Event Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Banner */}
          <div className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            {event.bannerImage ? (
              <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">{event.bannerEmoji || "📅"}</span>
            )}
          </div>

          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">{event.title}</h2>
              <StatusBadge variant={statusVariants[event.status]}>
                {event.status}
              </StatusBadge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {event.eventType === "virtual" ? (
                <>
                  <Video className="h-4 w-4" />
                  <span>{event.virtualLink || "Virtual Event"}</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {event.isPaid && event.ticketPrice ? (
                <span className="text-lg font-bold text-foreground">
                  {event.currency || "$"}{event.ticketPrice}
                </span>
              ) : (
                <span className="text-sm font-medium text-primary">Free Event</span>
              )}
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {event.registeredCount}
                {event.hasParticipantLimit && event.maxParticipants && ` / ${event.maxParticipants}`} registered
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onTogglePublish(event)}>
              <ToggleLeft className="h-4 w-4 mr-1.5" />
              {event.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onManageRegistrations(event)}>
              <Users className="h-4 w-4 mr-1.5" />
              Registrations
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(event)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="registrations">Registrations</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Insights */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Event Insights</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Total Views</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{event.views}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Registrations</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{event.registeredCount}</p>
                  </div>
                  {event.isPaid && (
                    <>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">Tickets Sold</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{event.ticketsSold}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-xs">Revenue</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {event.currency || "$"}{event.revenue}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="registrations" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click "Registrations" button above to manage attendees</p>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No comments yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
