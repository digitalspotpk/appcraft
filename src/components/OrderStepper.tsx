"use client";

import type { Order } from "@/types";

const STEPS: { status: Order["status"]; label: string; icon: string }[] = [
  { status: "requirements", label: "Requirements", icon: "📋" },
  { status: "design", label: "Design", icon: "🎨" },
  { status: "development", label: "Development", icon: "💻" },
  { status: "testing", label: "Testing", icon: "🧪" },
  { status: "delivery", label: "Delivery", icon: "🚀" },
];

const STATUS_ORDER: Order["status"][] = [
  "pending",
  "requirements",
  "design",
  "development",
  "testing",
  "delivery",
  "completed",
];

function getStepIndex(status: Order["status"]): number {
  return STATUS_ORDER.indexOf(status);
}

interface OrderStepperProps {
  currentStatus: Order["status"];
}

export default function OrderStepper({ currentStatus }: OrderStepperProps) {
  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="relative flex justify-between items-start">
      {/* Connector line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--border)] z-0" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-400 z-0 transition-all duration-1000"
        style={{
          width: `${Math.min(100, ((currentIdx - 1) / (STEPS.length - 1)) * 100)}%`,
        }}
      />

      {STEPS.map((step, idx) => {
        const stepIdx = getStepIndex(step.status);
        const isDone = currentIdx > stepIdx;
        const isActive = currentIdx === stepIdx;

        return (
          <div key={step.status} className="flex flex-col items-center gap-2 z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-500 ${
                isDone
                  ? "bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  : isActive
                  ? "bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_25px_rgba(124,58,237,0.6)] animate-pulse"
                  : "bg-[var(--bg-input)] border-2 border-[var(--border)]"
              }`}
            >
              {isDone ? (
                <span className="text-white font-bold text-lg">✓</span>
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <p
              className={`text-[9px] text-center font-semibold uppercase tracking-wide leading-tight max-w-[52px] transition-colors ${
                isDone || isActive
                  ? "text-violet-400"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
