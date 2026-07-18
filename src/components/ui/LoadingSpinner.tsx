"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  const s = sizes[size];

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: s, height: s }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="rgba(99,102,241,0.2)"
            strokeWidth="3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="url(#spin-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      {text && (
        <p className="text-sm text-slate-400 dark:text-slate-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(15,15,26,0.9)" }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
