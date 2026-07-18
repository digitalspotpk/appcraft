"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  CreditCard,
  Image as ImageIcon,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  Bell,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Package,
    title: "Live order tracking",
    desc: "Every project moves through clear stages — you always know exactly where it stands.",
    color: "#6366f1",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    desc: "Pay by card, JazzCash or EasyPaisa, and see your full payment history in one place.",
    color: "#ec4899",
  },
  {
    icon: ImageIcon,
    title: "Portfolio gallery",
    desc: "Browse real, finished work before you commit to a project.",
    color: "#22c55e",
  },
  {
    icon: LifeBuoy,
    title: "Direct support",
    desc: "Reach the team on WhatsApp in one tap — no ticket queues.",
    color: "#f59e0b",
  },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Sign up in under a minute — just an email and a password." },
  { n: "02", title: "Submit your project", desc: "Tell us the scope, budget and deadline. We'll scope it with you." },
  { n: "03", title: "Track it to delivery", desc: "Follow every stage, pay securely, and message us anytime." },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden relative"
      style={{ background: "#0f0f1a", color: "#f1f5f9" }}
    >
      {/* Ambient mesh glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-32 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }}
        />
      </div>

      {/* ── TOP BAR ── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            A
          </div>
          <span className="font-bold text-[15px] tracking-tight">AppCraft</span>
        </div>
        <Link
          href="/auth/signin"
          className="text-xs font-semibold px-4 py-2 rounded-full glass hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 pt-8 pb-12 md:pt-16 md:pb-20 md:grid md:grid-cols-2 md:gap-10 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <Sparkles size={12} />
            AGENCY PORTAL
          </div>

          <h1 className="text-[34px] leading-[1.12] md:text-5xl font-extrabold tracking-tight mb-4">
            Your projects,{" "}
            <span className="gradient-text">payments &amp; progress</span> —
            in one app.
          </h1>

          <p className="text-slate-400 text-[15px] leading-relaxed mb-7 max-w-md">
            AppCraft is the client portal for DigitalSpot — request work,
            track every stage in real time, pay securely, and talk to the
            team without leaving the app.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/auth/signup"
              className="btn-primary inline-flex items-center gap-2 !px-6 !py-3.5 text-[15px]"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/signin"
              className="text-[14px] font-semibold px-6 py-3.5 rounded-xl glass"
            >
              I have an account
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-8 text-[12px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              No setup fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </motion.div>

        {/* ── PHONE MOCKUP ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:flex justify-center mt-12 md:mt-0"
        >
          <div
            className="relative w-[260px] h-[540px] rounded-[2.5rem] p-3 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #1a1a2e, #0f0f1a)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black/60 z-10" />
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-[#0f0f1a] relative border border-white/5 pt-8 px-3">
              <p className="text-[10px] text-slate-500 mb-3">
                Welcome back, Ahmed 👋
              </p>
              {[
                { label: "Active projects", value: "3", color: "#6366f1" },
                { label: "Total invested", value: "$4,200", color: "#ec4899" },
                { label: "Completed", value: "12", color: "#22c55e" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  className="glass rounded-xl p-3 mb-2.5 flex items-center justify-between"
                >
                  <span className="text-[10px] text-slate-400">{s.label}</span>
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="absolute -right-2 top-24 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
                style={{ borderColor: "rgba(236,72,153,0.4)" }}
              >
                <Bell size={12} className="text-pink-400" />
                <span className="text-[9px] font-medium">Order updated</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-xl font-bold mb-1">Everything in one portal</h2>
        <p className="text-slate-500 text-[13px] mb-6">
          No spreadsheets, no scattered chats — just your projects.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass rounded-2xl p-4"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${f.color}22` }}
              >
                <f.icon size={17} style={{ color: f.color }} />
              </div>
              <h3 className="text-[13px] font-semibold mb-1">{f.title}</h3>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-xl font-bold mb-6">How it works</h2>
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex md:flex-col gap-4 md:gap-2 items-start"
            >
              <span className="gradient-text text-2xl font-black shrink-0">
                {s.n}
              </span>
              <div>
                <h3 className="text-[14px] font-semibold mb-1">{s.title}</h3>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          <TrendingUp size={22} className="mx-auto mb-3 text-white/90" />
          <h2 className="text-xl font-bold text-white mb-2">
            Ready to start your project?
          </h2>
          <p className="text-white/80 text-[13px] mb-6 max-w-sm mx-auto">
            Create your free account and submit your first request today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-[#4338ca] font-bold text-[14px] px-6 py-3 rounded-xl"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 max-w-6xl mx-auto px-5 pt-4 pb-28 md:pb-10 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <Shield size={12} />
          Secured &amp; encrypted
        </span>
        <span>© {new Date().getFullYear()} AppCraft by DigitalSpot</span>
      </footer>

      {/* ── STICKY MOBILE CTA (native-app style) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-3 md:hidden pb-safe"
        style={{
          background:
            "linear-gradient(180deg, transparent, #0f0f1a 30%)",
        }}
      >
        <Link
          href="/auth/signup"
          className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 text-[15px]"
        >
          Get started
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
