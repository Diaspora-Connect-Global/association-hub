import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ordersOverTime = [
  { date: "Oct 1", orders: 12 },
  { date: "Oct 8", orders: 18 },
  { date: "Oct 15", orders: 24 },
  { date: "Oct 22", orders: 31 },
  { date: "Oct 29", orders: 28 },
  { date: "Nov 5", orders: 35 },
  { date: "Nov 12", orders: 42 },
  { date: "Nov 19", orders: 38 },
  { date: "Nov 26", orders: 45 },
  { date: "Dec 3", orders: 52 },
];

const ordersByProduct = [
  { name: "T-Shirt", orders: 42, fill: "hsl(var(--chart-1))" },
  { name: "Membership Pin", orders: 89, fill: "hsl(var(--chart-2))" },
  { name: "Consultation", orders: 18, fill: "hsl(var(--chart-3))" },
  { name: "Mentorship", orders: 12, fill: "hsl(var(--chart-4))" },
  { name: "Artifacts", orders: 35, fill: "hsl(var(--chart-5))" },
];

const statusDistribution = [
  { name: "Fulfilled", value: 145, fill: "hsl(var(--chart-1))" },
  { name: "Pending", value: 32, fill: "hsl(var(--chart-4))" },
  { name: "Cancelled", value: 12, fill: "hsl(var(--muted))" },
  { name: "Refunded", value: 7, fill: "hsl(var(--chart-5))" },
];

export function OrdersAnalyticsWidget() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Orders Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Orders Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders by Product */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Orders by Product/Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, "Orders"]}
                />
                <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
                  {ordersByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value, "Orders"]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
