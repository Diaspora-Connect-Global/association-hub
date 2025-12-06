import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import {
  Users,
  MessageSquare,
  Briefcase,
  Calendar,
  ShoppingCart,
  Package,
  DollarSign,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Akua">
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="365d">Last year</option>
          </select>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Members"
          value="1,284"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          label="Active Members (30d)"
          value="847"
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          label="Posts (30d)"
          value="156"
          icon={MessageSquare}
          trend={{ value: 24, isPositive: true }}
        />
        <MetricCard
          label="Active Opportunities"
          value="12"
          icon={Briefcase}
        />
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Upcoming Events"
          value="8"
          icon={Calendar}
        />
        <MetricCard
          label="Active Listings"
          value="34"
          icon={ShoppingCart}
        />
        <MetricCard
          label="Orders (30d)"
          value="89"
          icon={Package}
          trend={{ value: 18, isPositive: true }}
        />
        <MetricCard
          label="Revenue (30d)"
          value="$4,520"
          icon={DollarSign}
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EngagementChart />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </AdminLayout>
  );
}
