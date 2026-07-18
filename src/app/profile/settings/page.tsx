"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useTheme } from "@/context/ThemeContext";

export default function PreferencesPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell>
      <div className="px-3 pt-4">
        <Link href="/profile" className="flex items-center gap-2 text-slate-400 text-sm mb-5 hover:text-indigo-400 transition-colors">
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">🌐 Language & Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Customize your app experience.</p>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Language</p>
            <p className="text-xs text-slate-500 mb-3">Select your preferred language</p>
            <select className="input-glass text-sm">
              <option>🇺🇸 English (US)</option>
              <option>🇵🇰 Urdu (Pakistan)</option>
              <option>🇸🇦 Arabic</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Timezone</p>
            <p className="text-xs text-slate-500 mb-3">For accurate deadline display</p>
            <select className="input-glass text-sm">
              <option>PKT — Asia/Karachi (UTC+5)</option>
              <option>EST — America/New_York (UTC-5)</option>
              <option>GMT — Europe/London (UTC+0)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-slate-500">{theme === "dark" ? "Currently: Dark" : "Currently: Light"}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-all ${theme === "dark" ? "bg-indigo-500" : "bg-slate-300"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${theme === "dark" ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Push Notifications</p>
              <p className="text-xs text-slate-500">Order updates and alerts</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-indigo-500">
              <div className="absolute top-0.5 left-6 w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
