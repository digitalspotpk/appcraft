"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDashboardStats,
  getOrders,
  getPayments,
  getSystemConfig,
  updateSystemConfig,
  verifyPayment,
  sendNotification,
} from "@/lib/firestore-helpers";
import toast from "react-hot-toast";
import type { DashboardStats, Order, Payment, SystemConfig } from "@/types";

const DEFAULT_CONFIG: SystemConfig = {
  appName: "AppCraft by DigitalSpot",
  maintenanceMode: false,
  maintenanceMessage: "We are upgrading our systems. Back shortly!",
  maintenanceEta: "2 hours",
  alertBannerActive: true,
  alertBannerMessage: "🚀 New Feature Live! Real-time order tracking is now available.",
  alertBannerType: "info",
  whatsappNumber: "923001234567",
  pushNotificationsEnabled: true,
  loyaltyPointsRate: 10,
  currency: "USD",
  updatedAt: new Date().toISOString(),
};

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"dashboard" | "orders" | "payments" | "config" | "broadcast">("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace("/");
    }
  }, [user, isAdmin, authLoading, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, paymentsData, configData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getPayments(),
        getSystemConfig(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setPayments(paymentsData);
      setConfig(configData);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) loadData();
  }, [authLoading, isAdmin, loadData]);

  const handleVerifyPayment = async (id: string, approved: boolean) => {
    try {
      await verifyPayment(id, approved);
      toast.success(approved ? "Payment approved! ✅" : "Payment rejected");
      setPayments((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: approved ? "verified" : "rejected" }
            : p
        )
      );
    } catch {
      toast.error("Failed to update payment");
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await updateSystemConfig(config);
      toast.success("Configuration saved! 💾");
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMsg) {
      toast.error("Please fill all fields");
      return;
    }
    setSendingBroadcast(true);
    try {
      await sendNotification({
        userId: "broadcast",
        title: broadcastTitle,
        message: broadcastMsg,
        type: "broadcast",
        isRead: false,
        isBroadcast: true,
        actionUrl: undefined,
      });
      toast.success("Broadcast sent to all users! 📢");
      setBroadcastTitle("");
      setBroadcastMsg("");
    } catch {
      toast.error("Failed to send broadcast");
    } finally {
      setSendingBroadcast(false);
    }
  };

  if (!isAdmin && !authLoading) return null;

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));

  return (
    <AppLayout>
      <TopHeader title="Admin Panel ⚙️" />

      <main className="page-content animate-fade-in">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="section-title">
              ⚙️ <span>Admin Panel</span>
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-full">
            Super Admin
          </span>
        </div>

        {/* Tab bar */}
        <div className="mx-5 mb-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-1.5 flex gap-1 overflow-x-auto">
          {([
            { key: "dashboard", label: "📊 Stats" },
            { key: "orders", label: "📦 Orders" },
            { key: "payments", label: "💰 Payments" },
            { key: "config", label: "⚙️ Config" },
            { key: "broadcast", label: "📢 Notify" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-shrink-0 flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === key
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="px-5 grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {tab === "dashboard" && stats && (
              <div className="px-5 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "📦", label: "Total Orders", value: stats.totalOrders.toString(), sub: `${stats.activeOrders} active` },
                    { icon: "💰", label: "Total Revenue", value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, sub: "Verified payments" },
                    { icon: "📈", label: "This Month", value: `$${(stats.monthlyRevenue / 1000).toFixed(1)}k`, sub: "Monthly revenue" },
                    { icon: "⏳", label: "Pending", value: `$${(stats.pendingRevenue / 1000).toFixed(1)}k`, sub: "Awaiting approval" },
                    { icon: "✅", label: "Completed", value: stats.completedOrders.toString(), sub: "Delivered" },
                    { icon: "👥", label: "Clients", value: stats.totalClients.toString(), sub: "Registered users" },
                    { icon: "🎫", label: "Open Tickets", value: stats.openTickets.toString(), sub: "Support queue" },
                    { icon: "💳", label: "Pending Pays", value: stats.pendingPayments.toString(), sub: "Need verification" },
                  ].map(({ icon, label, value, sub }) => (
                    <div
                      key={label}
                      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 hover:border-violet-500/30 transition-all"
                    >
                      <p className="text-2xl mb-1">{icon}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">
                        {label}
                      </p>
                      <p className="text-2xl font-extrabold gradient-text my-0.5">
                        {value}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/admin/users">
                    <button className="w-full py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 hover:border-violet-500/50 transition-all">
                      👥 Manage Users
                    </button>
                  </Link>
                  <Link href="/portfolio">
                    <button className="w-full py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 hover:border-violet-500/50 transition-all">
                      🎨 Portfolio
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div className="px-5 animate-fade-in">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-[var(--text-muted)]">
                    {activeOrders.length} active orders
                  </p>
                  <Link href="/orders/new">
                    <button className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold rounded-xl">
                      + New Order
                    </button>
                  </Link>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                      <p className="text-3xl mb-2">📭</p>
                      <p className="text-sm">No orders yet</p>
                    </div>
                  ) : (
                    orders.slice(0, 15).map((order, i) => (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <div
                          className={`p-4 flex items-center gap-3 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer ${
                            i < orders.length - 1
                              ? "border-b border-[var(--border)]"
                              : ""
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
                              {order.title}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {order.clientName} · {order.progress}%
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${
                              order.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : order.status === "development"
                                ? "bg-violet-500/20 text-violet-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-[var(--text-muted)] text-sm">›</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {tab === "payments" && (
              <div className="px-5 animate-fade-in">
                {pendingPayments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-amber-400 mb-2">
                      ⏳ {pendingPayments.length} Pending Verification
                    </p>
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                      {pendingPayments.map((payment, i) => (
                        <div
                          key={payment.id}
                          className={`p-4 ${i < pendingPayments.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-[var(--text-primary)] text-sm">
                                {payment.clientName}
                              </p>
                              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                {payment.methodName} · TXN: {payment.transactionId}
                              </p>
                            </div>
                            <p className="font-extrabold text-emerald-400 text-base">
                              {payment.currency} {payment.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerifyPayment(payment.id, true)}
                              className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500/30 transition-all"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleVerifyPayment(payment.id, false)}
                              className="flex-1 py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500/30 transition-all"
                            >
                              ✕ Reject
                            </button>
                            {payment.receiptUrl && (
                              <a
                                href={payment.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-muted)] text-xs font-bold rounded-xl hover:border-violet-500/50 transition-all"
                              >
                                📷
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm font-bold text-[var(--text-secondary)] mb-2">
                  All Payments
                </p>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                  {payments.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                      <p className="text-3xl mb-2">💳</p>
                      <p className="text-sm">No payments yet</p>
                    </div>
                  ) : (
                    payments.slice(0, 20).map((payment, i) => (
                      <div
                        key={payment.id}
                        className={`p-4 flex items-center gap-3 ${i < payments.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--text-primary)] text-sm">
                            {payment.clientName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {payment.methodName} · {new Date(payment.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-emerald-400">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            payment.status === "verified"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : payment.status === "rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CONFIG TAB */}
            {tab === "config" && (
              <div className="px-5 animate-fade-in flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    App Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.appName}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, appName: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.whatsappNumber}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, whatsappNumber: e.target.value }))
                    }
                    placeholder="923001234567"
                  />
                </div>

                {/* Toggles */}
                {[
                  { key: "maintenanceMode", label: "🔧 Maintenance Mode", desc: "Show upgrade screen to clients" },
                  { key: "alertBannerActive", label: "📢 Alert Banner", desc: "Show home page alert" },
                  { key: "pushNotificationsEnabled", label: "🔔 Push Notifications", desc: "Global notification system" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {label}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                    </div>
                    <button
                      className={`toggle-switch ${config[key as keyof SystemConfig] ? "on" : ""}`}
                      onClick={() =>
                        setConfig((c) => ({
                          ...c,
                          [key]: !c[key as keyof SystemConfig],
                        }))
                      }
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Maintenance Message
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={config.maintenanceMessage}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, maintenanceMessage: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Maintenance ETA
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={config.maintenanceEta}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, maintenanceEta: e.target.value }))
                    }
                    placeholder="e.g. 2 hours"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Alert Banner Message
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={config.alertBannerMessage}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, alertBannerMessage: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Alert Type
                  </label>
                  <select
                    className="form-select"
                    value={config.alertBannerType}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        alertBannerType: e.target.value as SystemConfig["alertBannerType"],
                      }))
                    }
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="danger">🚨 Danger</option>
                  </select>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                >
                  {savingConfig ? "Saving..." : "💾 Save Configuration"}
                </button>
              </div>
            )}

            {/* BROADCAST TAB */}
            {tab === "broadcast" && (
              <div className="px-5 animate-fade-in flex flex-col gap-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 text-sm text-violet-300">
                  📢 Send a notification to <strong>all users</strong> at once.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. System Maintenance"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    Message *
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Enter the broadcast message..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={handleBroadcast}
                  disabled={sendingBroadcast}
                >
                  {sendingBroadcast ? "Sending..." : "📢 Send Broadcast"}
                </button>

                <div className="mt-2">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
                    Quick Templates
                  </p>
                  {[
                    { title: "🔧 Maintenance Notice", msg: "We will be performing scheduled maintenance on our systems. Services may be temporarily unavailable." },
                    { title: "🎉 New Feature!", msg: "We have just launched an exciting new feature! Log in to check it out." },
                    { title: "⭐ Loyalty Bonus", msg: "Double loyalty points this week! Place an order and earn 2x points on your purchase." },
                  ].map((tpl) => (
                    <button
                      key={tpl.title}
                      onClick={() => {
                        setBroadcastTitle(tpl.title);
                        setBroadcastMsg(tpl.msg);
                      }}
                      className="w-full text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3.5 mb-2 hover:border-violet-500/40 transition-all"
                    >
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {tpl.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                        {tpl.msg}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
