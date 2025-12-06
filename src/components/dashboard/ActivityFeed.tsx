import { User, MessageSquare, Package, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "member" | "post" | "order" | "event" | "join";
  title: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "join",
    title: "New member joined",
    description: "Kofi Asante joined the association",
    time: "2 minutes ago",
  },
  {
    id: "2",
    type: "post",
    title: "New post published",
    description: "Weekly Newsletter - December Edition",
    time: "15 minutes ago",
  },
  {
    id: "3",
    type: "order",
    title: "New order received",
    description: "Ghana Tech T-Shirt (x2) - $45.00",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "event",
    title: "Event registration",
    description: "5 new registrations for Annual Meetup",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "member",
    title: "Membership pending",
    description: "Ama Serwaa requested to join",
    time: "3 hours ago",
  },
];

const iconMap = {
  member: User,
  post: MessageSquare,
  order: Package,
  event: Calendar,
  join: UserPlus,
};

const colorMap = {
  member: "surface-info text-info",
  post: "bg-muted text-foreground",
  order: "surface-success text-success",
  event: "surface-warning text-warning",
  join: "surface-brand-light text-brand",
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="section-header">Recent Activity</h3>
        <button className="label-small text-brand hover:opacity-80">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colorClass = colorMap[activity.type];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                  colorClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="label-small text-foreground">
                  {activity.title}
                </p>
                <p className="truncate body-small text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="flex-shrink-0 caption-small text-muted-foreground">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
