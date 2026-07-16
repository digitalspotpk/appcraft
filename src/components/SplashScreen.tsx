"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2600);
    const hideTimer = setTimeout(() => setVisible(false), 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[var(--bg-base)] transition-opacity duration-600 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo ring */}
      <div className="relative flex items-center justify-center w-28 h-28">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_60px_rgba(124,58,237,0.5)] animate-[pulse_1.5s_ease-in-out_infinite]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        <span className="relative text-5xl z-10">⚡</span>
      </div>

      {/* Brand */}
      <div className="text-center">
        <h1 className="font-orbitron text-4xl font-black bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent tracking-widest">
          AppCraft
        </h1>
        <p className="text-[var(--text-muted)] text-sm tracking-[4px] uppercase mt-1">
          by DigitalSpot
        </p>
      </div>

      {/* Loading bars */}
      <div className="flex gap-1.5 items-center">
        {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-1.5 rounded bg-gradient-to-b from-violet-500 to-cyan-400"
            style={{
              animation: `splashBar 1s ease-in-out ${delay}s infinite`,
              height: "20px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
