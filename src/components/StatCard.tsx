"use client";

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  change?: string;
  variant?: "brand" | "gold" | "green" | "cyan" | "red";
}

const VARIANT_STYLES = {
  brand: {
    value: "bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent",
    glow: "after:bg-gradient-to-br after:from-violet-600 after:to-cyan-500",
  },
  gold: {
    value: "bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent",
    glow: "after:bg-gradient-to-br after:from-amber-500 after:to-red-500",
  },
  green: {
    value: "bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent",
    glow: "after:bg-gradient-to-br after:from-emerald-500 after:to-teal-500",
  },
  cyan: {
    value: "text-cyan-400",
    glow: "after:bg-gradient-to-br after:from-cyan-500 after:to-blue-500",
  },
  red: {
    value: "text-red-400",
    glow: "after:bg-gradient-to-br after:from-red-500 after:to-rose-500",
  },
};

export default function StatCard({
  icon,
  label,
  value,
  change,
  variant = "brand",
}: StatCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-[18px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] hover:border-violet-500/30 cursor-default
        after:content-[''] after:absolute after:top-[-20px] after:right-[-20px] after:w-20 after:h-20 after:rounded-full after:opacity-10 ${styles.glow}`}
    >
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-2xl font-extrabold my-1 ${styles.value}`}>{value}</p>
      {change && (
        <p className="text-[11px] text-emerald-400 font-semibold">{change}</p>
      )}
    </div>
  );
}
