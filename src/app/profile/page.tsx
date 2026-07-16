"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import toast from "react-hot-toast";

const MENU_ITEMS = [
  { icon: "📦", label: "My Orders", desc: "View and track all orders", href: "/orders" },
  { icon: "💳", label: "Payment History", desc: "Invoices & transactions", href: "/orders" },
  { icon: "🎫", label: "Support Tickets", desc: "Get help from our team", href: "/orders" },
  { icon: "🔔", label: "Notifications", desc: "Manage alerts & preferences", href: "/notifications" },
  { icon: "🛡️", label: "Security", desc: "Password & account settings", href: "/profile/security" },
];

export default function ProfilePage() {
  const { user, appUser, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = appUser?.displayName ?? user?.displayName ?? "User";
  const email = appUser?.email ?? user?.email ?? "";
  const loyaltyPoints = appUser?.loyaltyPoints ?? 0;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      toast.error("Sign out failed");
      setSigningOut(false);
    }
  };

  return (
    <AppLayout>
      <TopHeader title="Profile 👤" />

      <main className="page-content animate-fade-in">
        {/* Hero */}
        <div className="bg-gradient-to-br from-violet-600 to-cyan-500 px-5 pt-8 pb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full border-2 border-white" />
            <div className="absolute bottom-4 right-8 w-14 h-14 rounded-full border-2 border-white" />
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 border-3 border-white/50 mx-auto flex items-center justify-center text-3xl font-bold text-white relative mb-3">
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
          <h2 className="text-xl font-extrabold text-white">{displayName}</h2>
          <p className="text-white/80 text-sm mt-0.5">{email}</p>
          {isAdmin && (
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30">
              👑 Super Admin
            </span>
          )}
        </div>

        {/* Loyalty points card */}
        <div className="mx-5 -mt-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 shadow-[var(--shadow)] relative z-10">
          <span className="text-3xl">⭐</span>
          <div className="flex-1">
            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">
              Loyalty Points
            </p>
            <p className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              {loyaltyPoints.toLocaleString()} pts
            </p>
          </div>
          <button
            onClick={() => toast("Redemption coming soon! 🎁")}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold rounded-xl hover:shadow-[0_4px_12px_rgba(245,158,11,0.4)] transition-all"
          >
            Redeem
          </button>
        </div>

        {/* Theme toggle */}
        <div className="mx-5 mt-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{theme === "dark" ? "🌙" : "☀️"}</span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Toggle app theme</p>
            </div>
          </div>
          <button
            className={`toggle-switch ${theme === "dark" ? "on" : ""}`}
            onClick={toggleTheme}
          />
        </div>

        {/* Admin panel shortcut */}
        {isAdmin && (
          <div className="mx-5 mt-3">
            <Link href="/admin">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-500/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
                  ⚙️
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-400 text-sm">Admin Panel</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Full system control & management
                  </p>
                </div>
                <span className="text-red-400">›</span>
              </div>
            </Link>
          </div>
        )}

        {/* Menu */}
        <div className="mx-5 mt-3 flex flex-col gap-2.5">
          {MENU_ITEMS.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/40 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[var(--glass)] border border-[var(--border-accent)] flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[var(--text-muted)]">›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="mx-5 mt-3 mb-4">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-500/20 transition-all text-left disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xl flex-shrink-0">
              🚪
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-400 text-sm">
                {signingOut ? "Signing out..." : "Sign Out"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Log out of your account
              </p>
            </div>
          </button>
        </div>

        {/* App version */}
        <div className="text-center py-3 pb-6">
          <p className="text-[10px] text-[var(--text-muted)]">
            AppCraft by DigitalSpot · v1.0.0
          </p>
        </div>
      </main>
    </AppLayout>
  );
}
