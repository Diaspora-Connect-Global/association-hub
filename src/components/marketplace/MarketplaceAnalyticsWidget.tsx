import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/hooks/useT";

/**
 * Marketplace analytics for an association. There is no query an association
 * console can call for orders, sales or revenue (see the listing dialog's
 * Orders tab), so nothing is charted — the static demo charts that used to be
 * here invented every number.
 */
export function MarketplaceAnalyticsWidget() {
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
