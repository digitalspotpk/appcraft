"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import OrderCard from "@/components/OrderCard";
import { useAuth } from "@/contexts/AuthContext";
import { getOrders } from "@/lib/firestore-helpers";
import type { Order } from "@/types";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "development", label: "In Dev" },
  { value: "testing", label: "Testing" },
  { value: "completed", label: "Done" },
  { value: "pending", label: "Pending" },
];

export default function OrdersPage() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getOrders(isAdmin ? undefined : user.uid);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AppLayout>
      <TopHeader title="Orders 📦" />

      <main className="page-content animate-fade-in">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="section-title">
              {isAdmin ? "All" : "My"} <span>Orders</span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/orders/new">
            <button
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold rounded-xl hover:shadow-[0_4px_15px_rgba(124,58,237,0.4)] transition-all"
            >
              + New
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="px-5 mb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              🔍
            </span>
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 flex gap-2 overflow-x-auto pb-3 no-scrollbar">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filter === f.value
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-violet-500/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Order list */}
        {loading ? (
          <div className="px-5 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-10 text-center mt-2">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold text-[var(--text-primary)] mb-1">
              No orders found
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-5">
              {search
                ? "Try a different search term"
                : "Start by placing a new order"}
            </p>
            <Link href="/orders/new">
              <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
                + Place New Order
              </button>
            </Link>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3">
            {filtered.map((order, i) => (
              <div
                key={order.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <OrderCard order={order} showClient={isAdmin} />
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
