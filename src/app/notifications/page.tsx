"use client";

import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications, markNotificationRead } from "@/lib/firestore-helpers";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types";

const TYPE_ICONS: Record<string, string> = {
  payment: "💳",
  order: "📦",
  ticket: "🎫",
  loyalty: "⭐",
  broadcast: "📢",
  system: "🔔",
};

// Demo notifications for when Firestore isn't configured
const DEMO_NOTIFS: Notification[] = [
  { id: "1", userId: "demo", title: "Payment Verified! ✅", message: "Your EasyPaisa payment of Rs. 15,000 has been confirmed.", type: "payment", isRead: false, isBroadcast: false, createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: "2", userId: "demo", title: "Development Update 🚀", message: "Your E-Commerce app has reached 65% completion. Design phase approved!", type: "order", isRead: false, isBroadcast: false, createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: "3", userId: "demo", title: "Loyalty Points Earned! ⭐", message: "You earned 200 loyalty points for completing order #ORD-003.", type: "loyalty", isRead: true, isBroadcast: false, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "4", userId: "demo", title: "📢 Holiday Schedule", message: "Our team will be on reduced hours Dec 24–26. Urgent requests handled via WhatsApp.", type: "broadcast", isRead: true, isBroadcast: true, createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
  { id: "5", userId: "demo", title: "Ticket #TKT-089 Resolved ✓", message: "Your support ticket regarding login issues has been resolved.", type: "ticket", isRead: true, isBroadcast: false, createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNotifications(user.uid);
      setNotifs(data.length > 0 ? data : DEMO_NOTIFS);
    } catch {
      setNotifs(DEMO_NOTIFS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifs();
  }, [loadNotifs]);

  const markRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // demo mode
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const markAllRead = async () => {
    const unread = notifs.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await markNotificationRead(n.id);
      } catch {
        // ignore
      }
    }
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <AppLayout>
      <TopHeader title="Notifications 🔔" />

      <main className="page-content animate-fade-in">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="section-title">
              🔔 <span>Notifications</span>
            </h2>
            {unreadCount > 0 && (
              <p className="text-xs text-violet-400 font-semibold mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-cyan-400 font-semibold"
            >
              Mark all read ✓
            </button>
          )}
        </div>

        {loading ? (
          <div className="px-5 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div className="mx-5 text-center py-12">
            <p className="text-4xl mb-3">🔕</p>
            <p className="font-bold text-[var(--text-primary)] mb-1">
              No notifications yet
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-2.5">
            {notifs.map((notif, i) => {
              const timeAgo = (() => {
                try {
                  return formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                  });
                } catch {
                  return "recently";
                }
              })();

              return (
                <div
                  key={notif.id}
                  className={`animate-slide-up bg-[var(--bg-card)] rounded-2xl p-4 flex gap-3 items-start cursor-pointer hover:bg-[var(--bg-card-hover)] transition-all ${
                    !notif.isRead
                      ? "border-l-4 border-violet-500 border border-[var(--border)]"
                      : "border border-[var(--border)]"
                  }`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => markRead(notif.id)}
                >
                  <span className="text-2xl flex-shrink-0">
                    {TYPE_ICONS[notif.type] ?? "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text-primary)] text-sm">
                      {notif.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-medium">
                      {timeAgo}
                      {notif.isBroadcast && (
                        <span className="ml-2 px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded text-[9px] font-bold">
                          Broadcast
                        </span>
                      )}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
