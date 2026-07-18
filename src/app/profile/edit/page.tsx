"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Building } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { setDocument } from "@/lib/firestore";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: profile?.displayName ?? user?.displayName ?? "",
    phone: profile?.phone ?? "",
    company: profile?.company ?? "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.displayName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await setDocument("users", user.uid, {
        displayName: form.displayName,
        phone: form.phone,
        company: form.company,
      });
      await refreshProfile();
      toast.success("Profile updated! ✅");
      router.push("/profile");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="px-3 pt-4">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-slate-400 text-sm mb-5 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Profile
        </Link>

        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">
          ✏️ Edit Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Update your personal information.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center py-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
            >
              {form.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Avatar auto-generated from name
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User size={12} /> Full Name *
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              className="input-glass"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              value={profile?.email ?? user?.email ?? ""}
              className="input-glass opacity-60 cursor-not-allowed"
              readOnly
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Email cannot be changed here. Contact support to update.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Phone size={12} /> Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input-glass"
              placeholder="+92 300 1234567"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Building size={12} /> Company / Organization
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="input-glass"
              placeholder="Your company name"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            style={{
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "💾 Save Changes"
            )}
          </motion.button>
        </form>
      </div>
    </AppShell>
  );
}
