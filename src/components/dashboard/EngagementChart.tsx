import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useT } from "@/hooks/useT";
import type { AssociationAnalyticsDataPoint } from "@/services/graphql/association/types";

interface EngagementChartProps {
  /** The real member-growth series (`memberGrowthData`). */
  points?: AssociationAnalyticsDataPoint[];
  loading?: boolean;
}

function formatTick(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Member growth from analytics. This chart used to plot a hard-coded table of
 * posts/comments/likes that no backend ever produced; those series have no real
 * source, so the legend says "not available" for them instead of drawing them.
 */
export function EngagementChart({ points, loading }: EngagementChartProps) {
  const t = useT();
  const data = points ?? [];
  const unavailable = [t.posts, t.comments, t.likes];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="section-header">{t.userGrowthOverTime}</h3>
        <ul className="flex flex-wrap items-center gap-4" aria-label={t.chartLegend}>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-chart-1" aria-hidden="true" />
            <span className="body-small text-muted-foreground">{t.trendMembers}</span>
          </li>
          {unavailable.map((label) => (
            <li key={label} className="flex items-center gap-2 opacity-70">
              <span className="h-3 w-3 rounded-full border border-dashed border-muted-foreground" aria-hidden="true" />
              <span className="body-small text-muted-foreground">
                {t.seriesNotAvailable.replace("{series}", () => label)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-80">
        {data.length === 0 ? (
          <div role="status" className="flex h-full items-center justify-center body-small text-muted-foreground">
            {loading ? t.loading : t.memberTrendNoData}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                labelFormatter={(label) => formatTick(String(label))}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={t.trendMembers}
                stroke="var(--chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMembers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
