"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  CreditCard,
  Bell,
  Lock,
  Globe,
  LogOut,
  ChevronRight,
  Settings,
  Star,
  Shield,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  badge?: string;
  delay: number;
}

function MenuItem({
  icon,
  title,
  subtitle,
  iconBg,
  href,
  onClick,
  danger,
  badge,
  delay,
}: MenuItemProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5 cursor-pointer hover:border-indigo-500/30 transition-all"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${
            danger
              ? "text-red-400"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      </div>
      {badge && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
        >
          {badge}
        </span>
      )}
      <ChevronRight
        size={16}
        className={danger ? "text-red-400" : "text-slate-400"}
      />
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function ProfilePage() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully.");
      router.push("/auth/signin");
    } catch {
      toast.error("Failed to sign out.");
    } finally {
      setLoggingOut(false);
    }
  };

  const displayName =
    profile?.displayName ?? user?.displayName ?? "User";
  const email = profile?.email ?? user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppShell>
      <div className="px-3 pt-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-6"
        >
          {/* Avatar */}
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                boxShadow: "0 0 30px rgba(99,102,241,0.4)",
              }}
            >
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {isAdmin && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
              >
                <Shield size={12} className="text-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {displayName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {email}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
            >
              {isAdmin ? "⚡ Admin" : "⭐ Premium Client"}
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-0.5 rounded-2xl overflow-hidden border border-white/10 mb-5"
        >
          {[
            { value: "12", label: "Orders", icon: "📦" },
            { value: "$8.4k", label: "Spent", icon: "💰" },
            { value: "4.9", label: "Rating", icon: "⭐" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/60 dark:bg-white/5 px-2 py-4 flex flex-col items-center gap-1"
            >
              <span className="text-base">{stat.icon}</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Menu */}
        <div className="space-y-2">
          {/* Admin Panel */}
          {isAdmin && (
            <MenuItem
              icon={<Settings size={18} className="text-indigo-400" />}
              title="Admin Panel"
              subtitle="Manage orders, users & settings"
              iconBg="rgba(99,102,241,0.15)"
              href="/admin"
              badge="Admin"
              delay={0.12}
            />
          )}

          <MenuItem
            icon={<User size={18} className="text-indigo-400" />}
            title="Edit Profile"
            subtitle="Update your personal information"
            iconBg="rgba(99,102,241,0.15)"
            href="/profile/edit"
            delay={0.15}
          />
          <MenuItem
            icon={<CreditCard size={18} className="text-pink-400" />}
            title="Payment History"
            subtitle="View all transactions"
            iconBg="rgba(236,72,153,0.15)"
            href="/orders"
            delay={0.2}
          />
          <MenuItem
            icon={<Bell size={18} className="text-emerald-400" />}
            title="Notifications"
            subtitle="Manage alerts and updates"
            iconBg="rgba(16,185,129,0.15)"
            href="/notifications"
            delay={0.25}
          />
          <MenuItem
            icon={<Lock size={18} className="text-amber-400" />}
            title="Security"
            subtitle="Password and 2FA settings"
            iconBg="rgba(245,158,11,0.15)"
            href="/profile/security"
            delay={0.3}
          />
          <MenuItem
            icon={<Globe size={18} className="text-indigo-400" />}
            title="Language & Region"
            subtitle="English (US) · PKT+5"
            iconBg="rgba(99,102,241,0.15)"
            href="/profile/settings"
            delay={0.35}
          />

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Appearance
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-all ${
                theme === "dark" ? "bg-indigo-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  theme === "dark" ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </motion.div>

          {/* Sign Out */}
          <MenuItem
            icon={<LogOut size={18} className="text-red-400" />}
            title={loggingOut ? "Signing Out..." : "Sign Out"}
            subtitle={email}
            iconBg="rgba(239,68,68,0.1)"
            onClick={handleLogout}
            danger
            delay={0.45}
          />
        </div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-lg">🚀</span>
            <span className="text-xs font-bold text-slate-400">
              AppCraft by DigitalSpot
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Version 2.0.0 · © 2024 DigitalSpot Agency</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <a href="#" className="text-[10px] text-indigo-400 hover:underline">Privacy</a>
            <span className="text-slate-600">·</span>
            <a href="#" className="text-[10px] text-indigo-400 hover:underline">Terms</a>
            <span className="text-slate-600">·</span>
            <a href="#" className="text-[10px] text-indigo-400 hover:underline">Support</a>
          </div>
        </motion.div>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
