"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function TopHeader({
  title,
  showBack = false,
  backHref = "/",
}: TopHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { appUser } = useAuth();

  const initials = appUser?.displayName
    ? appUser.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-[100] bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] px-5 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link href={backHref} className="icon-btn">
            ←
          </Link>
        ) : null}
        {title ? (
          <h1 className="text-base font-bold text-[var(--text-primary)]">
            {title}
          </h1>
        ) : (
          <span className="font-orbitron text-base font-black bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
            AppCraft ⚡
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title="Toggle theme"
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <Link href="/notifications" className="icon-btn relative">
          🔔
        </Link>

        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-sm text-white border-2 border-violet-500">
            {initials}
          </div>
        </Link>
      </div>
    </header>
  );
}
