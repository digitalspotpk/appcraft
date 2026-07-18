"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Image, MapPin, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/portfolio", label: "Portfolio", icon: Image },
  { href: "/orders", label: "Track Order", icon: MapPin },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-safe">
      <div
        className="relative w-full max-w-lg mb-3 rounded-[1.75rem] border border-white/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden"
        style={{
          background: "rgba(15,15,26,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Light mode override */}
        <div
          className="dark:hidden absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
          }}
        />
        {/* Top hairline accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-60"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }}
        />
        <div className="relative flex items-center justify-around px-3 py-2.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 flex-1 relative py-1.5 rounded-xl transition-all duration-200"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute -inset-2.5 rounded-xl"
                      style={{ background: "rgba(99,102,241,0.15)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={21}
                    className={`relative z-10 transition-all duration-200 ${
                      isActive
                        ? "text-indigo-500 scale-110"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pip"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
