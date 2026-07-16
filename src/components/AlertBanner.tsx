"use client";

import { useState } from "react";
import type { SystemConfig } from "@/types";

interface AlertBannerProps {
  config: Pick<SystemConfig, "alertBannerMessage" | "alertBannerType">;
}

const TYPE_STYLES = {
  info: {
    bg: "from-violet-500/20 to-cyan-500/20",
    border: "border-violet-500/30",
    bar: "from-violet-500 to-cyan-400",
    icon: "🚀",
  },
  success: {
    bg: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    bar: "from-emerald-500 to-teal-400",
    icon: "✅",
  },
  warning: {
    bg: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    bar: "from-amber-500 to-orange-400",
    icon: "⚠️",
  },
  danger: {
    bg: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    bar: "from-red-500 to-rose-400",
    icon: "🚨",
  },
};

export default function AlertBanner({ config }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const style = TYPE_STYLES[config.alertBannerType] ?? TYPE_STYLES.info;

  if (dismissed) return null;

  return (
    <div
      className={`mx-4 mt-4 px-4 py-3.5 rounded-xl bg-gradient-to-r ${style.bg} border ${style.border} flex items-center gap-3 relative overflow-hidden`}
    >
      {/* Left accent bar */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.bar} rounded-l-xl`}
      />
      <span className="text-xl flex-shrink-0 ml-1">{style.icon}</span>
      <p className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
        {config.alertBannerMessage}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-[var(--text-muted)] hover:text-red-400 text-lg leading-none transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
