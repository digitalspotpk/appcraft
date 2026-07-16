"use client";

import { useAuth } from "@/contexts/AuthContext";
import type { SystemConfig } from "@/types";

interface MaintenanceScreenProps {
  config: Pick<SystemConfig, "maintenanceMessage" | "maintenanceEta" | "appName">;
}

export default function MaintenanceScreen({ config }: MaintenanceScreenProps) {
  const { isAdmin } = useAuth();

  return (
    <div className="fixed inset-0 z-[5000] bg-[var(--bg-base)] flex flex-col items-center justify-center text-center px-8">
      {/* Animated gear */}
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-5xl mb-8 shadow-[0_0_60px_rgba(124,58,237,0.4)] animate-[pulse_2s_ease-in-out_infinite]">
        🔧
      </div>

      <h1 className="font-orbitron text-3xl font-black text-[var(--text-primary)] mb-3">
        We Are Upgrading
      </h1>
      <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xs mb-6">
        {config.maintenanceMessage}
      </p>

      <div className="bg-[var(--glass)] border border-[var(--border-accent)] rounded-xl px-6 py-3 text-sm text-[var(--text-secondary)]">
        Estimated back in:{" "}
        <strong className="text-cyan-400">{config.maintenanceEta}</strong>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex gap-2">
        {[0, 0.2, 0.4, 0.6, 0.8].map((d, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 animate-bounce"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>

      {/* Admin bypass */}
      {isAdmin && (
        <div className="mt-8 px-5 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-muted)]">
          👑 Admin Mode — You can still access the app
          <br />
          <a href="/admin" className="text-violet-400 font-semibold mt-1 block">
            Go to Admin Panel →
          </a>
        </div>
      )}
    </div>
  );
}
