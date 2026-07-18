"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  gradient?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  animate = true,
  gradient = false,
}: GlassCardProps) {
  const base = `rounded-2xl border border-white/10 dark:border-white/10 ${
    gradient
      ? "bg-gradient-to-br from-indigo-500/10 to-pink-500/10"
      : "bg-white/60 dark:bg-white/5"
  } backdrop-blur-sm ${onClick ? "cursor-pointer" : ""} ${className}`;

  if (!animate) {
    return (
      <div className={base} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={base}
      onClick={onClick}
      whileHover={onClick ? { y: -2, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
