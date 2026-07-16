"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/components/LandingPage";
import TopHeader from "@/components/TopHeader";
import AlertBanner from "@/components/AlertBanner";
import StatCard from "@/components/StatCard";
import OrderCard from "@/components/OrderCard";
import {
  getOrders,
  getDashboardStats,
  getSystemConfig,
} from "@/lib/firestore-helpers";
import type { Order, DashboardStats, SystemConfig } from "@/types";

const DEFAULT_CONFIG: SystemConfig = {
  appName: "AppCraft by DigitalSpot",
  maintenanceMode: false,
  maintenanceMessage: "We are upgrading.",
  maintenanceEta: "2 hours",
  alertBannerActive: true,
  alertBannerMessage: "🚀 Real-time order tracking is now live!",
  alertBannerType: "info",
  whatsappNumber: "923001234567",
  pushNotificationsEnabled: true,
  loyaltyPointsRate: 10,
  currency: "USD",
  updatedAt: new Date().toISOString(),
};

// Month labels for chart
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_VALS = [45, 70, 55, 85, 60, 95];

export default function HomePage() {
  const { user, appUser, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ordersData, configData] = await Promise.all([
        getOrders(isAdmin ? undefined : user.uid),
        getSystemConfig(),
      ]);
      setOrders(ordersData.slice(0, 3));
      setConfig(configData);

      if (isAdmin) {
        const statsData = await getDashboardStats();
        setStats(statsData);
      }
    } catch {
      // Firestore not configured — show demo data
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayName = appUser?.displayName ?? user?.displayName ?? "User";
  const firstName = displayName.split(" ")[0];

  // Logged-out visitors get the public marketing landing page instead of
  // being bounced straight to /login.
  if (!authLoading && !user) {
    return <LandingPage />;
  }

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl animate-pulse">
          ⚡
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <TopHeader />

      <main className="page-content animate-fade-in">
        {/* Welcome */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[var(--text-muted)] text-sm">
            Welcome back 👋
          </p>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mt-0.5">
            {firstName}
            {isAdmin && (
              <span className="ml-2 text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full align-middle">
                Admin
              </span>
            )}
          </h2>
        </div>

        {/* Alert Banner */}
        {config.alertBannerActive && <AlertBanner config={config} />}

        {/* Stats */}
        <div className="flex items-center justify-between px-5 mt-5 mb-3">
          <h3 className="section-title">
            Dashboard <span>Overview</span>
          </h3>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs text-cyan-400 font-semibold uppercase tracking-wide"
            >
              Admin →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : isAdmin && stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5">
            <StatCard
              icon="📦"
              label="Total Orders"
              value={stats.totalOrders.toString()}
              change={`${stats.activeOrders} active`}
              variant="brand"
            />
            <StatCard
              icon="💰"
              label="Revenue"
              value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
              change={`$${(stats.monthlyRevenue / 1000).toFixed(1)}k this month`}
              variant="gold"
            />
            <StatCard
              icon="✅"
              label="Completed"
              value={stats.completedOrders.toString()}
              change="All on time"
              variant="green"
            />
            <StatCard
              icon="🎫"
              label="Open Tickets"
              value={stats.openTickets.toString()}
              change={`${stats.pendingPayments} pending payments`}
              variant="red"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5">
            <StatCard
              icon="📦"
              label="My Orders"
              value={orders.length.toString()}
              change="Track below"
              variant="brand"
            />
            <StatCard
              icon="⭐"
              label="Loyalty Pts"
              value={(appUser?.loyaltyPoints ?? 0).toLocaleString()}
              change="Earn with orders"
              variant="gold"
            />
            <StatCard
              icon="✅"
              label="Completed"
              value={orders
                .filter((o) => o.status === "completed")
                .length.toString()}
              variant="green"
            />
            <StatCard
              icon="🔄"
              label="In Progress"
              value={orders
                .filter((o) => !["completed", "cancelled", "pending"].includes(o.status))
                .length.toString()}
              variant="cyan"
            />
          </div>
        )}

        {/* Revenue Chart (admin only) */}
        {isAdmin && (
          <>
            <div className="flex items-center justify-between px-5 mt-5 mb-3">
              <h3 className="section-title">
                Monthly <span>Revenue</span>
              </h3>
            </div>
            <div className="mx-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden h-44">
              <p className="text-xs text-[var(--text-muted)] font-semibold mb-3">
                Revenue (USD) — Last 6 Months
              </p>
              <div className="absolute bottom-4 left-5 right-5 flex items-end gap-2 h-28">
                {CHART_VALS.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="chart-bar-item w-full"
                      style={{
                        height: `${val}%`,
                        background:
                          i === CHART_VALS.length - 1
                            ? "var(--gradient-brand)"
                            : i % 3 === 1
                            ? "var(--gradient-gold)"
                            : "var(--gradient-green)",
                      }}
                      title={`${MONTHS[i]}: $${Math.round(val * 200)}`}
                    />
                    <span className="text-[9px] text-[var(--text-muted)]">
                      {MONTHS[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent Orders */}
        <div className="flex items-center justify-between px-5 mt-5 mb-3">
          <h3 className="section-title">
            Recent <span>Orders</span>
          </h3>
          <Link
            href="/orders"
            className="text-xs text-cyan-400 font-semibold uppercase tracking-wide"
          >
            See All →
          </Link>
        </div>

        {loading ? (
          <div className="px-5 flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              No orders yet
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Place your first order to get started
            </p>
            <Link href="/orders/new">
              <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
                + New Order
              </button>
            </Link>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3">
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <OrderCard order={order} showClient={isAdmin} />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-5 mt-5 mb-2">
          <h3 className="section-title mb-3">
            Quick <span>Actions</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/orders/new">
              <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5">
                <span>➕</span> New Order
              </button>
            </Link>
            <Link href="/portfolio">
              <button className="w-full py-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-[var(--text-primary)] font-bold text-sm flex items-center justify-center gap-2 hover:border-violet-500/50 transition-all hover:-translate-y-0.5">
                <span>🎨</span> Portfolio
              </button>
            </Link>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
