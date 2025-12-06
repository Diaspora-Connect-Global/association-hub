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
import { useT } from "@/hooks/useT";

export default function Dashboard() {
  const t = useT();
  const [dateRange, setDateRange] = useState("30d");

  return (
    <AdminLayout title={t.dashboard} subtitle={`${t.welcomeBack}, Akua`}>
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="7d">{t.last7Days}</option>
            <option value="30d">{t.last30Days}</option>
            <option value="90d">{t.last90Days}</option>
            <option value="365d">{t.lastYear}</option>
          </select>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
          <RefreshCw className="h-4 w-4" />
          {t.refresh}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t.totalMembers}
          value="1,284"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          label={t.activeMembers}
          value="847"
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          label={t.activePosts}
          value="156"
          icon={MessageSquare}
          trend={{ value: 24, isPositive: true }}
        />
        <MetricCard
          label={t.activeOpportunities}
          value="12"
          icon={Briefcase}
        />
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t.upcomingEvents}
          value="8"
          icon={Calendar}
        />
        <MetricCard
          label={t.activeListings}
          value="34"
          icon={ShoppingCart}
        />
        <MetricCard
          label={t.totalOrders}
          value="89"
          icon={Package}
          trend={{ value: 18, isPositive: true }}
        />
        <MetricCard
          label={t.revenue}
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
