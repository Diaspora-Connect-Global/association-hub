import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { registrationStatusLabel, registrationStatusTone, type RegistrationTone } from "@/lib/eventNetworking";

/** Colour per tone, written in this console's own design tokens. */
const TONE_CLASSES: Record<RegistrationTone, string> = {
  success: "bg-surface-success text-text-success",
  warning: "bg-surface-warning text-text-warning",
  danger: "bg-surface-danger text-text-danger",
  info: "bg-surface-info text-text-info",
  muted: "bg-surface-subtle text-text-primary",
};

/** A registration status as the organiser reads it (Awaiting approval, Waitlisted, Declined…). */
export function RegistrationStatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", TONE_CLASSES[registrationStatusTone(status)], className)}>
      {registrationStatusLabel(status)}
    </Badge>
  );
}
