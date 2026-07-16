"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back! 🎉");
      router.replace("/");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid email or password";
      toast.error(msg.replace("Firebase: ", "").replace(/\s\(.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google! 🎉");
      router.replace("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg.replace("Firebase: ", "").replace(/\s\(.*\)/, ""));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 icon-btn z-50"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-4xl mx-auto mb-4 shadow-[0_0_40px_rgba(124,58,237,0.5)] animate-pulse">
          ⚡
        </div>
        <h1 className="font-orbitron text-2xl font-black gradient-text tracking-widest">
          AppCraft
        </h1>
        <p className="text-[var(--text-muted)] text-xs tracking-[3px] uppercase mt-1">
          by DigitalSpot
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-7"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">
          Welcome back 👋
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Sign in to your client portal
        </p>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="form-input pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">OR</span>
          <span className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-3.5 bg-[var(--bg-input)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all disabled:opacity-60 cursor-pointer"
        >
          <span className="text-xl">🔵</span>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          New client?{" "}
          <Link
            href="/signup"
            className="text-violet-400 font-semibold hover:text-violet-300"
          >
            Create account →
          </Link>
        </p>
      </div>
    </div>
  );
}
