"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import toast from "react-hot-toast";

export default function SecurityPage() {
  const { user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) { toast.error("Not authenticated."); return; }
    if (form.newPassword.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    if (form.newPassword !== form.confirmPassword) { toast.error("Passwords do not match."); return; }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, form.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, form.newPassword);
      toast.success("Password changed successfully! 🔐");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error("Failed to change password. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="px-3 pt-4">
        <Link href="/profile" className="flex items-center gap-2 text-slate-400 text-sm mb-5 hover:text-indigo-400 transition-colors">
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">🔐 Security</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Manage your password and account security.</p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={e => update("currentPassword", e.target.value)}
              className="input-glass pl-10 pr-10"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="New Password (min 6 chars)"
              value={form.newPassword}
              onChange={e => update("newPassword", e.target.value)}
              className="input-glass pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={e => update("confirmPassword", e.target.value)}
              className="input-glass pl-10"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "🔐 Change Password"}
          </motion.button>
        </form>

        {/* 2FA Info */}
        <div className="mt-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <h3 className="text-sm font-bold text-amber-400 mb-1">🔑 Two-Factor Authentication</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            2FA via SMS is coming soon. This will add an extra layer of security to your account.
          </p>
          <button className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300">
            Get notified when available →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
