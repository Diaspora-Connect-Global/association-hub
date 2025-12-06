import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { name: "Week 1", posts: 12, comments: 45, likes: 120 },
  { name: "Week 2", posts: 19, comments: 62, likes: 180 },
  { name: "Week 3", posts: 15, comments: 48, likes: 140 },
  { name: "Week 4", posts: 22, comments: 78, likes: 220 },
  { name: "Week 5", posts: 28, comments: 95, likes: 280 },
  { name: "Week 6", posts: 25, comments: 88, likes: 260 },
];

export function EngagementChart() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="label-medium text-foreground">{t("dashboard.engagementTrend")}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="caption-small text-muted-foreground">Posts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="caption-small text-muted-foreground">Comments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="caption-small text-muted-foreground">Likes</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.205 0 0)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.205 0 0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0 0)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "oklch(0.556 0 0)" }}
              axisLine={{ stroke: "oklch(0.922 0 0)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "oklch(0.556 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0 0)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="likes"
              stroke="oklch(0.6 0.118 184.704)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLikes)"
            />
            <Area
              type="monotone"
              dataKey="posts"
              stroke="oklch(0.205 0 0)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPosts)"
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="oklch(0.646 0.222 41.116)"
              strokeWidth={2}
              dot={{ r: 4, fill: "oklch(0.646 0.222 41.116)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
