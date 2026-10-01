import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/hooks/useT";

/**
 * Event analytics for an association. No query returns registrations over
 * time, revenue or attendance across an association's events, so nothing is
 * charted — the static demo charts that used to be here invented every number.
 */
export function EventAnalyticsWidget() {
  const t = useT();
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">{t.analyticsUnavailableTitle}</p>
        <p className="text-sm mt-1">{t.analyticsUnavailableDesc}</p>
      </CardContent>
    </Card>
  );
}
