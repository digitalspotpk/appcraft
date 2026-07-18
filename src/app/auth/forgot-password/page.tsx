"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email."); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Reset email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send reset email. Check the address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 40%, #0d1b4b 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 text-slate-400 text-sm mb-6 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div
          className="rounded-3xl p-6 border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
        >
          {sent ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-lg font-bold text-white mb-2">Email Sent!</h2>
              <p className="text-slate-400 text-sm">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>.
                Check your inbox.
              </p>
              <Link
                href="/auth/signin"
                className="mt-6 inline-block text-indigo-400 text-sm font-semibold"
              >
                Back to Sign In →
              </Link>
            </div>
          ) : (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                🔑
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Forgot Password?</h2>
              <p className="text-slate-400 text-sm mb-6">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleReset} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-10"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
