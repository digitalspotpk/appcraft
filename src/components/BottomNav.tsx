"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/portfolio", icon: "🎨", label: "Portfolio" },
  { href: "/orders", icon: "📦", label: "Track" },
  { href: "/notifications", icon: "🔔", label: "Alerts" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

interface BottomNavProps {
  unreadCount?: number;
}

export default function BottomNav({ unreadCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[200] bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--border)]">
      <div className="grid grid-cols-5 pb-safe">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 py-2 px-1 transition-all duration-200 relative",
                isActive ? "text-violet-500" : "text-[var(--text-muted)]"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b bg-gradient-to-r from-violet-500 to-cyan-400" />
              )}

              {/* Notification badge */}
              <span
                className={clsx(
                  "text-xl relative transition-transform duration-200",
                  isActive && "scale-110"
                )}
              >
                {item.icon}
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>

              <span
                className={clsx(
                  "text-[10px] font-semibold uppercase tracking-wide",
                  isActive
                    ? "text-violet-500"
                    : "text-[var(--text-muted)]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
