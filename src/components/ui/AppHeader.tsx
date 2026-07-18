"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10 dark:border-white/10"
      style={{
        background: "rgba(15,15,26,0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Light mode header bg */}
      <div
        className="dark:hidden absolute inset-0 -z-10"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
        }}
      />

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          🚀
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            AppCraft
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            by DigitalSpot
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Admin Link */}
        {isAdmin && (
          <Link
            href="/admin"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 dark:border-white/10 bg-white/5 hover:bg-indigo-500/20 transition-colors"
          >
            <Settings size={16} className="text-indigo-400" />
          </Link>
        )}

        {/* Notifications */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 dark:border-white/10 bg-white/5 hover:bg-white/10 transition-colors relative"
            >
              <Bell size={16} className="text-slate-400 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 border border-slate-900" />
            </button>

            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-11 w-72 rounded-2xl shadow-2xl border border-white/10 dark:border-white/10 overflow-hidden z-50"
                  style={{ background: "#1a1a2e" }}
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold text-sm text-white">Notifications</h3>
                  </div>
                  {[
                    { icon: "✅", title: "Order Updated", msg: "Your order moved to Development stage", time: "2m ago", color: "#34d399" },
                    { icon: "💰", title: "Payment Received", msg: "Payment of $2,400 approved", time: "1h ago", color: "#6366f1" },
                    { icon: "📢", title: "New Feature", msg: "JazzCash payments now available", time: "2h ago", color: "#ec4899" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `${n.color}20` }}
                      >
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 text-center">
                    <Link
                      href="/notifications"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                      onClick={() => setShowNotif(false)}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 dark:border-white/10 bg-white/5 hover:bg-white/10 transition-all"
        >
          {theme === "dark" ? (
            <Sun size={16} className="text-yellow-400" />
          ) : (
            <Moon size={16} className="text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
}
