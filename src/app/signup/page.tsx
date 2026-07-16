"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { signUp, signInWithGoogle, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Account created! Welcome aboard 🚀");
      router.replace("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      toast.error(msg.replace("Firebase: ", "").replace(/\s\(.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("Account created with Google! 🎉");
      router.replace("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg.replace("Firebase: ", "").replace(/\s\(.*\)/, ""));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "var(--bg-base)" }}
    >
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 icon-btn z-50"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-3 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
          ⚡
        </div>
        <h1 className="font-orbitron text-xl font-black gradient-text tracking-widest">
          AppCraft
        </h1>
        <p className="text-[var(--text-muted)] text-xs tracking-[3px] uppercase">
          by DigitalSpot
        </p>
      </div>

      <div
        className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-7"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">
          Create account 🚀
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Join the AppCraft client portal
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Repeat password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">OR</span>
          <span className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3.5 bg-[var(--bg-input)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
        >
          <span className="text-xl">🔵</span>
          Continue with Google
        </button>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 font-semibold hover:text-violet-300">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
