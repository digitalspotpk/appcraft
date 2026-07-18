"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type Order } from "@/lib/firestore";
import { Plus, Search, Filter } from "lucide-react";

const STATUS_CONFIG = {
  active:    { bg: "rgba(16,185,129,0.15)",  text: "#34d399",  label: "Active" },
  pending:   { bg: "rgba(245,158,11,0.15)",  text: "#fbbf24",  label: "Pending" },
  completed: { bg: "rgba(99,102,241,0.15)",  text: "#818cf8",  label: "Completed" },
  cancelled: { bg: "rgba(239,68,68,0.15)",   text: "#f87171",  label: "Cancelled" },
} as const;

const STAGE_CONFIG = {
  requirements: { label: "Requirements", icon: "📋", step: 1 },
  design:       { label: "Design",        icon: "🎨", step: 2 },
  development:  { label: "Development",   icon: "⚡", step: 3 },
  testing:      { label: "Testing",       icon: "🔬", step: 4 },
  delivery:     { label: "Delivery",      icon: "🚀", step: 5 },
} as const;

const DEMO_ORDERS: Order[] = [
  {
    id: "demo1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with Next.js and Stripe",
    budget: 2400,
    deadline: "Dec 30, 2024",
    status: "active",
    stage: "development",
    clientId: "demo",
    clientName: "Ahmed Hassan",
    clientEmail: "ahmed@demo.com",
    paymentStatus: "paid",
  },
  {
    id: "demo2",
    title: "Mobile App UI/UX",
    description: "Complete mobile app design for food delivery",
    budget: 1800,
    deadline: "Jan 5, 2025",
    status: "pending",
    stage: "design",
    clientId: "demo",
    clientName: "Ahmed Hassan",
    clientEmail: "ahmed@demo.com",
    paymentStatus: "unpaid",
  },
  {
    id: "demo3",
    title: "AI Chatbot Integration",
    description: "GPT-powered customer support chatbot",
    budget: 3200,
    deadline: "Jan 12, 2025",
    status: "active",
    stage: "testing",
    clientId: "demo",
    clientName: "Ahmed Hassan",
    clientEmail: "ahmed@demo.com",
    paymentStatus: "pending",
  },
];

function OrderCard({ order, index }: { order: Order; index: number }) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const stage = STAGE_CONFIG[order.stage] ?? STAGE_CONFIG.requirements;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={`/orders/${order.id}`}>
        <div className="p-4 rounded-2xl border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                {order.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {order.description}
              </p>
            </div>
            <span
              className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: status.bg, color: status.text }}
            >
              {status.label}
            </span>
          </div>

          {/* Stage progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">
                {stage.icon} {stage.label}
              </span>
              <span className="text-[10px] text-slate-400">
                Step {stage.step}/5
              </span>
            </div>
            <div className="h-1.5 bg-white/10 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.step / 5) * 100}%` }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.6 }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #ec4899)",
                }}
              />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                📅 {order.deadline}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : order.paymentStatus === "pending"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {order.paymentStatus === "paid"
                  ? "✓ Paid"
                  : order.paymentStatus === "pending"
                  ? "⏳ Processing"
                  : "💳 Unpaid"}
              </span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              ${order.budget.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function OrdersPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    getOrders(profile?.role === "admin" ? undefined : user.uid)
      .then((data) => setOrders(data.length > 0 ? data : DEMO_ORDERS))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false));
  }, [user, profile]);

  const filtered = orders.filter((o) => {
    const matchSearch = o.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || o.status === filter || o.paymentStatus === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AppShell>
      <div className="px-3 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              📋 My Orders
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {orders.length} total orders
            </p>
          </div>
          <Link href="/orders/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
            >
              <Plus size={14} /> New
            </motion.button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 py-2.5 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "pending", label: "Pending" },
            { key: "completed", label: "Completed" },
            { key: "unpaid", label: "Unpaid" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                filter === f.key
                  ? "text-white border-transparent"
                  : "text-slate-400 border-white/10 bg-white/5"
              }`}
              style={
                filter === f.key
                  ? { background: "linear-gradient(135deg, #6366f1, #ec4899)" }
                  : {}
              }
            >
              <Filter size={10} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl shimmer bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search ? "No orders match your search." : "No orders yet."}
            </p>
            <Link href="/orders/new">
              <button
                className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
              >
                + Place First Order
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
