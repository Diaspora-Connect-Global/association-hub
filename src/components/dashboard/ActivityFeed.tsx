import { User, MessageSquare, Package, Calendar, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "member" | "post" | "order" | "event" | "join";
  titleKey: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "join",
    titleKey: "activity.newMemberJoined",
    description: "Kofi Asante joined the association",
    time: "2 minutes ago",
  },
  {
    id: "2",
    type: "post",
    titleKey: "activity.newPostPublished",
    description: "Weekly Newsletter - December Edition",
    time: "15 minutes ago",
  },
  {
    id: "3",
    type: "order",
    titleKey: "activity.newOrderReceived",
    description: "Ghana Tech T-Shirt (x2) - $45.00",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "event",
    titleKey: "activity.eventRegistration",
    description: "5 new registrations for Annual Meetup",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "member",
    titleKey: "activity.membershipPending",
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
  member: "bg-chart-4/10 text-chart-4",
  post: "bg-primary/10 text-primary",
  order: "bg-chart-2/10 text-chart-2",
  event: "bg-chart-1/10 text-chart-1",
  join: "bg-chart-3/10 text-chart-3",
};

export function ActivityFeed() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="label-medium text-foreground">{t("dashboard.recentActivity")}</h3>
        <button className="body-small font-medium text-primary hover:text-primary/80">
          {t("dashboard.viewAll")}
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colorClass = colorMap[activity.type];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-in fade-in slide-in-from-left-2"
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
                <p className="body-small font-medium text-foreground">
                  {t(activity.titleKey)}
                </p>
                <p className="truncate caption-small text-muted-foreground">
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
