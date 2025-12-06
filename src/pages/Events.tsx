import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MapPin, Video, Users, Clock, MoreHorizontal, Edit, X, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "online" | "physical";
  venue: string;
  capacity: number;
  registered: number;
  price: number | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  banner: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Annual General Meeting 2024",
    description: "Join us for our yearly gathering to discuss association matters and elect new leaders.",
    date: "Dec 15, 2024",
    time: "2:00 PM GMT",
    type: "online",
    venue: "Zoom Meeting",
    capacity: 500,
    registered: 342,
    price: null,
    status: "upcoming",
    banner: "🎤",
  },
  {
    id: "2",
    title: "Tech Career Workshop",
    description: "Learn about career opportunities in the tech industry from industry experts.",
    date: "Dec 20, 2024",
    time: "10:00 AM GMT",
    type: "physical",
    venue: "Accra Innovation Hub",
    capacity: 100,
    registered: 87,
    price: 25,
    status: "upcoming",
    banner: "💼",
  },
  {
    id: "3",
    title: "Networking Dinner",
    description: "An evening of networking and celebration with fellow diaspora members.",
    date: "Dec 28, 2024",
    time: "6:00 PM GMT",
    type: "physical",
    venue: "Marriott Hotel, Accra",
    capacity: 150,
    registered: 150,
    price: 75,
    status: "upcoming",
    banner: "🍽️",
  },
  {
    id: "4",
    title: "Webinar: Investment in Ghana",
    description: "Explore investment opportunities in Ghana's growing economy.",
    date: "Nov 30, 2024",
    time: "3:00 PM GMT",
    type: "online",
    venue: "Google Meet",
    capacity: 300,
    registered: 256,
    price: null,
    status: "completed",
    banner: "📈",
  },
];

const statusColors = {
  upcoming: "active" as const,
  ongoing: "warning" as const,
  completed: "inactive" as const,
  cancelled: "error" as const,
};

export default function Events() {
  return (
    <AdminLayout title="Events" subtitle="Create and manage association events">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search events..."
            className="input-search w-64"
          />
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        <Button className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Upcoming Events</p>
          <p className="text-2xl font-bold text-foreground">8</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Registrations</p>
          <p className="text-2xl font-bold text-primary">1,542</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Ticket Revenue</p>
          <p className="text-2xl font-bold text-success">$12,450</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Attendance</p>
          <p className="text-2xl font-bold text-accent">82%</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Banner */}
            <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-5xl">{event.banner}</span>
              <div className="absolute right-3 top-3">
                <StatusBadge variant={statusColors[event.status]}>
                  {event.status}
                </StatusBadge>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">
                {event.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>

              {/* Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {event.type === "online" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {event.registered} / {event.capacity} registered
                  </span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      event.registered >= event.capacity
                        ? "bg-destructive"
                        : event.registered >= event.capacity * 0.8
                        ? "bg-warning"
                        : "bg-success"
                    )}
                    style={{
                      width: `${Math.min(
                        (event.registered / event.capacity) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  {event.price ? (
                    <span className="text-lg font-bold text-foreground">
                      ${event.price}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-success">
                      Free
                    </span>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Attendees
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <X className="mr-2 h-4 w-4" />
                      Cancel Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
