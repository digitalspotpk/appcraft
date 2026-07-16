"use client";

import Link from "next/link";
import type { Order } from "@/types";
import { formatDistanceToNow } from "date-fns";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-gray-400", bg: "bg-gray-500/20 border-gray-500/30", bar: "from-gray-400 to-gray-500", left: "from-gray-400 to-gray-500" },
  requirements: { label: "Requirements", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30", bar: "from-blue-500 to-indigo-400", left: "from-blue-500 to-indigo-400" },
  design: { label: "Design", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30", bar: "from-purple-500 to-pink-400", left: "from-purple-500 to-pink-400" },
  development: { label: "Development", color: "text-violet-400", bg: "bg-violet-500/20 border-violet-500/30", bar: "from-violet-600 to-cyan-400", left: "from-violet-600 to-cyan-400" },
  testing: { label: "Testing", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30", bar: "from-amber-500 to-orange-400", left: "from-amber-500 to-orange-400" },
  delivery: { label: "Delivery", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", bar: "from-orange-500 to-red-400", left: "from-orange-500 to-red-400" },
  completed: { label: "Completed ✓", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30", bar: "from-emerald-500 to-teal-400", left: "from-emerald-500 to-teal-400" },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30", bar: "from-red-500 to-rose-400", left: "from-red-500 to-rose-400" },
};

interface OrderCardProps {
  order: Order;
  showClient?: boolean;
}

export default function OrderCard({ order, showClient = false }: OrderCardProps) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true });
    } catch {
      return "recently";
    }
  })();

  return (
    <Link href={`/orders/${order.id}`} className="block">
      <div className="order-card group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4.5 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-violet-500/30 cursor-pointer">
        {/* Left status bar */}
        <span
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.left} rounded-l-2xl`}
        />

        <div className="flex items-start justify-between mb-3 ml-2">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">
              #{order.id.slice(-8).toUpperCase()}
            </p>
            <h3 className="font-bold text-[var(--text-primary)] text-base mt-0.5 line-clamp-1">
              {order.title}
            </h3>
            {showClient && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {order.clientName}
              </p>
            )}
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${cfg.bg} ${cfg.color} flex-shrink-0 ml-2`}
          >
            {cfg.label}
          </span>
        </div>

        {/* Progress */}
        <div className="ml-2 mb-3">
          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-[var(--text-secondary)]">
              {order.progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-input)] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-1000`}
              style={{ width: `${order.progress}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex gap-4 ml-2">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            💰{" "}
            <strong className="text-[var(--text-secondary)]">
              ${order.budget.toLocaleString()}
            </strong>
          </span>
          {order.deadline && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              📅{" "}
              <strong className="text-[var(--text-secondary)]">
                {new Date(order.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </strong>
            </span>
          )}
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            🕐{" "}
            <strong className="text-[var(--text-secondary)]">{timeAgo}</strong>
          </span>
        </div>
      </div>
    </Link>
  );
}
