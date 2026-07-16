"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

const PIPELINE = [
  { label: "Requirements", icon: "📋" },
  { label: "Design", icon: "🎨" },
  { label: "Development", icon: "💻" },
  { label: "Testing", icon: "🧪" },
  { label: "Delivery", icon: "🚀" },
];

const FEATURES = [
  {
    icon: "📦",
    title: "Live Order Tracking",
    desc: "Every project moves through a visible pipeline — no more \"any update?\" messages.",
    gradient: "var(--gradient-brand)",
  },
  {
    icon: "💳",
    title: "Local Payment Methods",
    desc: "Pay by bank transfer, EasyPaisa, JazzCash or crypto — submit a receipt, get verified.",
    gradient: "var(--gradient-gold)",
  },
  {
    icon: "🔔",
    title: "Real-Time Notifications",
    desc: "Status changes, comments and payment updates land instantly, not in an inbox.",
    gradient: "var(--gradient-green)",
  },
  {
    icon: "🎨",
    title: "Portfolio Showcase",
    desc: "Browse live, working demos of past builds before you commission your own.",
    gradient: "var(--gradient-brand)",
  },
  {
    icon: "⭐",
    title: "Loyalty Points",
    desc: "Every completed order earns points redeemable against future work.",
    gradient: "var(--gradient-gold)",
  },
  {
    icon: "🎫",
    title: "Direct Support Tickets",
    desc: "Raise an issue, tag it by priority, and thread it with the team until it's closed.",
    gradient: "var(--gradient-green)",
  },
];

const PAYMENT_BADGES = [
  { icon: "🏦", label: "Bank Transfer" },
  { icon: "📱", label: "EasyPaisa" },
  { icon: "💛", label: "JazzCash" },
  { icon: "₿", label: "Crypto" },
];

const STATS = [
  { value: "5+", label: "Products shipped" },
  { value: "100%", label: "Orders trackable live" },
  { value: "24/7", label: "WhatsApp support" },
  { value: "0 Rs", label: "Cost to run this portal" },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (PIPELINE.length + 1));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* ================= NAV ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--border)]" style={{ background: "var(--nav-bg)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              ⚡
            </div>
            <span className="font-orbitron text-lg font-black gradient-text tracking-wide">
              AppCraft
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--border)] text-[var(--text-primary)] hover:border-violet-500/50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-6 border border-[var(--border-accent)]" style={{ background: "var(--glass)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Client portal · live now
          </div>

          <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            Stop asking
            <br />
            <span className="gradient-text">&ldquo;any update?&rdquo;</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
            AppCraft by DigitalSpot gives every client a live window into
            their project — requirements to delivery, payments to support,
            tracked in one place, updated in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link href="/signup">
              <button className="px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5">
                Create Free Account →
              </button>
            </Link>
            <Link href="/login">
              <button className="px-7 py-3.5 rounded-2xl font-bold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-violet-500/50 transition-all hover:-translate-y-0.5">
                I already have an account
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-orbitron text-xl sm:text-2xl font-black gradient-text">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signature element: live pipeline mockup */}
        <div className="relative">
          <div
            className="absolute -inset-6 rounded-[2rem] opacity-30 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden
          />
          <div
            className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 sm:p-7"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-semibold">Order #A102</p>
                <p className="font-bold text-[var(--text-primary)]">E-Commerce Mobile App</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                {mounted && step < PIPELINE.length ? "In Progress" : "Delivered ✅"}
              </span>
            </div>

            <div className="relative flex justify-between items-start mb-2">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--border)] z-0" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-400 z-0 transition-all duration-[1200ms] ease-out"
                style={{ width: `${(Math.min(step, PIPELINE.length) / (PIPELINE.length - 1)) * 100}%` }}
              />
              {PIPELINE.map((p, i) => {
                const done = mounted && step > i;
                const active = mounted && step === i;
                return (
                  <div key={p.label} className="flex flex-col items-center gap-2 z-10 flex-1">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                        done
                          ? "bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                          : active
                          ? "bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_25px_rgba(124,58,237,0.6)] animate-pulse"
                          : "bg-[var(--bg-input)] border-2 border-[var(--border)]"
                      }`}
                    >
                      {done ? "✓" : p.icon}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] text-center leading-tight">
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-500 flex items-center justify-center text-xs shrink-0">
                💬
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">DigitalSpot:</span> Testing build now, delivery on track for Friday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-orbitron text-2xl sm:text-3xl font-black mb-3">
            Built for <span className="gradient-text">clients who ask questions</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Everything that used to live in scattered chats now lives in one dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 hover:-translate-y-1 hover:border-violet-500/30 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: f.gradient }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PAYMENTS STRIP ================= */}
      <section className="border-y border-[var(--border)]" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg text-[var(--text-primary)]">Pay however works for you</h3>
            <p className="text-sm text-[var(--text-muted)]">Upload a receipt, and we verify it — no card required.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {PAYMENT_BADGES.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)]"
              >
                <span>{p.icon}</span> {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="relative z-10">
            <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white mb-3">
              Ready to see your project live?
            </h2>
            <p className="text-white/85 max-w-md mx-auto mb-8">
              Create your free client account and track your first order today.
            </p>
            <Link href="/signup">
              <button className="px-8 py-3.5 rounded-2xl font-bold text-violet-700 bg-white hover:-translate-y-0.5 transition-transform">
                Create Free Account →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-sm">
              ⚡
            </div>
            <span className="font-orbitron text-sm font-bold gradient-text">AppCraft</span>
            <span className="text-xs text-[var(--text-muted)]">by DigitalSpot</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} DigitalSpot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
