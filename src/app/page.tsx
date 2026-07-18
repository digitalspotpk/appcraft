"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import GlassCard from "@/components/ui/GlassCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LandingPage from "@/components/marketing/LandingPage";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type Order } from "@/lib/firestore";
import {
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  MapPin,
  CreditCard,
  LifeBuoy,
  FolderOpen,
  Image,
  ArrowRight,
} from "lucide-react";

// ─── STAT CARD ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  changeUp: boolean;
  color: string;
  bgColor: string;
  topColor: string;
  delay: number;
}
function StatCard({
  icon,
  value,
  label,
  change,
  changeUp,
  color,
  bgColor,
  topColor,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileTap={{ scale: 0.97 }}
      className="relative rounded-2xl border border-white/10 dark:border-white/10 p-4 overflow-hidden cursor-pointer bg-white/60 dark:bg-white/5"
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: topColor }}
      />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: bgColor }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="text-xl font-black text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {label}
      </div>
      <div
        className={`text-[10px] font-semibold mt-2 ${
          changeUp ? "text-emerald-500" : "text-red-400"
        }`}
      >
        {change}
      </div>
    </motion.div>
  );
}

// ─── QUICK ACTION ─────────────────────────────────────────────────────────────
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}
function QuickAction({ icon, label, href, color }: QuickActionProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 flex flex-col items-center gap-2 p-3.5 rounded-xl border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5 min-w-[70px] cursor-pointer"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

// ─── ORDER CARD ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(16,185,129,0.15)", text: "#34d399" },
  pending: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
  completed: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
};
const ORDER_ICONS: Record<string, string> = {
  active: "🛒", pending: "📱", completed: "✅", cancelled: "❌",
};

function OrderRow({ order }: { order: Order }) {
  const colors = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  return (
    <Link href={`/orders/${order.id}`}>
      <motion.div
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5 cursor-pointer"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          {ORDER_ICONS[order.status] ?? "📦"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {order.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Due {order.deadline}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            ${order.budget.toLocaleString()}
          </p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ background: colors.bg, color: colors.text }}
          >
            {order.status}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── MINI CHART ───────────────────────────────────────────────────────────────
const CHART_DATA = [
  { month: "Jul", val: 40 },
  { month: "Aug", val: 65 },
  { month: "Sep", val: 45 },
  { month: "Oct", val: 80 },
  { month: "Nov", val: 55 },
  { month: "Dec", val: 100 },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getOrders(
          profile?.role === "admin" ? undefined : user.uid
        );
        setOrders(data.slice(0, 3));
      } catch {
        // Demo fallback
        setOrders([
          {
            id: "demo1",
            title: "E-Commerce Platform",
            description: "Full e-commerce site",
            budget: 2400,
            deadline: "Dec 30, 2024",
            status: "active",
            stage: "development",
            clientId: user.uid,
            clientName: "Ahmed Hassan",
            clientEmail: user.email ?? "",
            paymentStatus: "paid",
          },
          {
            id: "demo2",
            title: "Mobile App UI/UX",
            description: "Mobile design",
            budget: 1800,
            deadline: "Jan 5, 2025",
            status: "pending",
            stage: "design",
            clientId: user.uid,
            clientName: "Ahmed Hassan",
            clientEmail: user.email ?? "",
            paymentStatus: "unpaid",
          },
        ]);
      } finally {
        setOrdersLoading(false);
      }
    };
    load();
  }, [user, profile]);

  const displayName =
    profile?.displayName ?? user?.displayName ?? user?.email?.split("@")[0] ?? "there";

  // Still resolving Firebase auth state — avoid flashing the landing page
  // for users who are actually signed in.
  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0f0f1a" }}
      >
        <LoadingSpinner size="lg" text="Loading AppCraft..." />
      </div>
    );
  }

  // Signed-out visitors get the public marketing landing page instead of
  // being silently bounced to /auth/signin with nothing to look at.
  if (!user) {
    return <LandingPage />;
  }

  return (
    <AppShell>
      <div className="px-0">
        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-3 p-5 rounded-2xl relative overflow-hidden border"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.12) 100%)",
            borderColor: "rgba(99,102,241,0.3)",
          }}
        >
          {/* Glow orbs */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.6), transparent)",
            }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.6), transparent)",
            }}
          />
          <p className="text-xs text-slate-400 dark:text-slate-400 relative z-10">
            👋 Good morning,
          </p>
          <h1 className="text-xl font-black text-slate-900 dark:text-white relative z-10 mt-1">
            Welcome back,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #6366f1, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {displayName}!
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 relative z-10 mt-2 leading-relaxed">
            You have{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {orders.filter((o) => o.status === "active").length} active orders
            </span>{" "}
            and{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {orders.filter((o) => o.paymentStatus === "unpaid").length} pending payments
            </span>
            .
          </p>
          <Link href="/orders/new">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              }}
            >
              <Plus size={15} /> New Order
            </motion.button>
          </Link>
        </motion.div>

        {/* ── STATS ── */}
        <div className="px-3 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              📊 Overview
            </h2>
            <span className="text-xs text-indigo-500 font-medium">This Month</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Package size={18} />}
              value={String(orders.length || 12)}
              label="Active Orders"
              change="↑ 25% this week"
              changeUp
              color="#6366f1"
              bgColor="rgba(99,102,241,0.15)"
              topColor="linear-gradient(90deg, #6366f1, #818cf8)"
              delay={0.1}
            />
            <StatCard
              icon={<DollarSign size={18} />}
              value="$8.4k"
              label="Total Revenue"
              change="↑ 12% vs last month"
              changeUp
              color="#ec4899"
              bgColor="rgba(236,72,153,0.15)"
              topColor="linear-gradient(90deg, #ec4899, #f472b6)"
              delay={0.15}
            />
            <StatCard
              icon={<CheckCircle size={18} />}
              value="47"
              label="Completed"
              change="↑ 8 this month"
              changeUp
              color="#10b981"
              bgColor="rgba(16,185,129,0.15)"
              topColor="linear-gradient(90deg, #10b981, #34d399)"
              delay={0.2}
            />
            <StatCard
              icon={<Clock size={18} />}
              value={String(orders.filter((o) => o.paymentStatus === "unpaid").length || 5)}
              label="Pending Pay"
              change="↓ 2 overdue"
              changeUp={false}
              color="#f59e0b"
              bgColor="rgba(245,158,11,0.15)"
              topColor="linear-gradient(90deg, #f59e0b, #fbbf24)"
              delay={0.25}
            />
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="px-3 mt-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            ⚡ Quick Actions
          </h2>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
            <QuickAction
              icon={<Plus size={18} />}
              label="New Order"
              href="/orders/new"
              color="#6366f1"
            />
            <QuickAction
              icon={<MapPin size={18} />}
              label="Track"
              href="/orders"
              color="#ec4899"
            />
            <QuickAction
              icon={<CreditCard size={18} />}
              label="Payment"
              href="/orders"
              color="#10b981"
            />
            <QuickAction
              icon={<LifeBuoy size={18} />}
              label="Support"
              href="/profile"
              color="#f59e0b"
            />
            <QuickAction
              icon={<FolderOpen size={18} />}
              label="Files"
              href="/orders"
              color="#8b5cf6"
            />
            <QuickAction
              icon={<Image size={18} />}
              label="Portfolio"
              href="/portfolio"
              color="#ec4899"
            />
          </div>
        </div>

        {/* ── REVENUE CHART ── */}
        <div className="px-3 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              <TrendingUp size={14} className="inline mr-1.5 text-indigo-500" />
              Revenue Chart
            </h2>
            <span className="text-xs text-indigo-500 font-medium">6 Months</span>
          </div>
          <GlassCard className="p-4" animate={false}>
            <div className="flex items-end gap-2 h-16">
              {CHART_DATA.map((d, i) => (
                <motion.div
                  key={d.month}
                  className="flex-1 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${d.val}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  style={{
                    background:
                      i === CHART_DATA.length - 1
                        ? "linear-gradient(180deg, #6366f1, #ec4899)"
                        : i % 2 === 0
                        ? "rgba(99,102,241,0.5)"
                        : "rgba(236,72,153,0.4)",
                    boxShadow:
                      i === CHART_DATA.length - 1
                        ? "0 0 10px rgba(99,102,241,0.5)"
                        : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {CHART_DATA.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 text-center text-[9px] text-slate-500 dark:text-slate-500"
                >
                  {d.month}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── RECENT ORDERS ── */}
        <div className="px-3 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              🗂 Recent Orders
            </h2>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-xs text-indigo-500 font-medium"
            >
              See all <ArrowRight size={12} />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl shimmer bg-white/5"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <GlassCard className="p-6 text-center" animate={false}>
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No orders yet.{" "}
                <Link href="/orders/new" className="text-indigo-400">
                  Place your first order
                </Link>
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-2.5">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
