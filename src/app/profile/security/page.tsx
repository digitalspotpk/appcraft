"use client";

import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function SecurityPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <TopHeader title="Security 🛡️" showBack backHref="/profile" />
      <main className="page-content animate-fade-in px-5 pt-5">
        <h2 className="section-title mb-4">
          🛡️ <span>Security & Privacy</span>
        </h2>

        <div className="flex flex-col gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-1 text-sm">
              Account Email
            </h3>
            <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-1 text-sm">
              Sign-in Methods
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {user?.providerData?.map((p) => p.providerId).join(", ") ?? "Email/Password"}
            </p>
          </div>

          <button
            onClick={() => toast("Password reset email sent to your inbox!")}
            className="btn-secondary"
          >
            🔑 Change Password
          </button>

          <button
            onClick={() => toast("2FA setup coming soon!")}
            className="btn-secondary"
          >
            🛡️ Enable Two-Factor Auth
          </button>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mt-3">
            <h3 className="font-bold text-red-400 text-sm mb-1">
              Danger Zone
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Permanently delete your account and all associated data.
            </p>
            <button
              onClick={() => toast.error("Please contact support to delete your account.")}
              className="w-full py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/30 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
