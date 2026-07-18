"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import {
  getUserNotifications,
  markNotificationRead,
  type Notification,
} from "@/lib/firestore";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const TYPE_CONFIG = {
  info:    { icon: "ℹ️", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)", text: "#818cf8" },
  success: { icon: "✅", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)",  text: "#34d399" },
  warning: { icon: "⚠️", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  text: "#fbbf24" },
  error:   { icon: "❌", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)",   text: "#f87171" },
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Order Updated",
    message: "Your order #ORD001 (E-Commerce Platform) has been moved to the Development stage.",
    target: "all",
    isRead: false,
    type: "success",
  },
  {
    id: "n2",
    title: "Payment Approved",
    message: "Your payment of $2,400 via JazzCash has been approved. Work continues!",
    target: "all",
    isRead: false,
    type: "success",
  },
  {
    id: "n3",
    title: "New Feature Available",
    message: "🎉 JazzCash & EasyPaisa payment gateways are now available for all clients.",
    target: "all",
    isRead: true,
    type: "info",
  },
  {
    id: "n4",
    title: "Deadline Reminder",
    message: "Your order 'Mobile App UI/UX' has a deadline in 5 days. Please provide feedback.",
    target: "all",
    isRead: true,
    type: "warning",
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserNotifications(user.uid)
      .then((data) => setNotifications(data.length > 0 ? data : DEMO_NOTIFICATIONS))
      .catch(() => setNotifications(DEMO_NOTIFICATIONS))
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // Ignore demo mode errors
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppShell>
      <div className="px-3 pt-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={20} className="text-indigo-500" /> Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold hover:text-indigo-300"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl shimmer bg-white/5" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🔔</p>
            <p className="text-sm text-slate-400">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notif, i) => {
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => !notif.isRead && handleMarkRead(notif.id ?? "")}
                  className={`flex gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    !notif.isRead ? "opacity-100" : "opacity-60"
                  }`}
                  style={{ background: cfg.bg, borderColor: cfg.border }}
                >
                  <div className="text-xl flex-shrink-0 mt-0.5">{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: cfg.text }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <p className="text-[10px] mt-1.5 font-semibold" style={{ color: cfg.text }}>
                        Tap to mark as read
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <div className="h-4" />
      </div>
    </AppShell>
  );
}
