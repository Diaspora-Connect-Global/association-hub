import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useT } from "@/hooks/useT";
import { containsId } from "@/lib/graphqlErrors";
import {
  getMyAdminNotifications,
  markMyAdminNotificationsRead,
  markNotificationRead,
} from "@/services/graphql/notifications";

interface Props {
  /** The association this console manages. No id = nothing to show. */
  associationId: string | null;
}

/** Text the server wrote for the admin; anything that looks like an id gives way. */
const safeText = (text: string | null | undefined) => {
  const value = text?.trim();
  return value && !containsId(value) ? value : "";
};

export function AdminNotificationsBell({ associationId }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const key = ["admin-notifications", "ASSOCIATION", associationId];

  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: key,
    queryFn: () => getMyAdminNotifications("ASSOCIATION", associationId!),
    enabled: !!associationId,
    refetchInterval: 60_000,
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });
  const markAll = useMutation({
    mutationFn: () => markMyAdminNotificationsRead("ASSOCIATION", associationId!),
    onSuccess: invalidate,
  });
  const markOne = useMutation({ mutationFn: markNotificationRead, onSuccess: invalidate });

  const items = data?.notifications ?? [];
  const unread = data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.adminNotifTitle}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span
            data-testid="admin-notif-badge"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 caption-small text-primary-foreground"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="label-small text-foreground">
              {t.adminNotifTitle}
              {unread > 0 ? ` · ${unread} ${t.adminNotifUnread}` : ""}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => markAll.mutate()}
                disabled={unread === 0 || markAll.isPending}
                aria-label={t.adminNotifMarkAllRead}
                title={t.adminNotifMarkAllRead}
                className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                aria-label={t.adminNotifRefresh}
                title={t.adminNotifRefresh}
                className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isError ? (
              <p className="p-3 text-sm text-destructive">{t.adminNotifLoadError}</p>
            ) : items.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">{t.adminNotifEmpty}</p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => !n.isRead && markOne.mutate(n.id)}
                      className="w-full px-3 py-2 text-left hover:bg-muted"
                    >
                      <p className={`text-sm ${n.isRead ? "text-muted-foreground" : "font-semibold text-foreground"}`}>
                        {safeText(n.title)}
                      </p>
                      {safeText(n.message) && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{safeText(n.message)}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
