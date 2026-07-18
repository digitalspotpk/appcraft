"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show splash once per session
    const seen = sessionStorage.getItem("appcraft-splash");
    if (seen) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("appcraft-splash", "1");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 40%, #0d1b4b 100%)",
          }}
        >
          {/* Fine grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />

          {/* Ambient floating orbs */}
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute -top-16 -left-10 w-64 h-64 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
          />
          <motion.div
            animate={{ x: [0, -18, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 -right-14 w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }}
          />

          {/* Logo Icon with pulsing ring */}
          <div className="relative mb-6">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
              style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #ec4899)",
                boxShadow:
                  "0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(236,72,153,0.3)",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none">
                <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.95)" />
                <polygon points="50,26 30,66 70,66" fill="#6366f1" />
                <rect x="41" y="58" width="18" height="7" fill="#0f0f1a" />
              </svg>
            </motion.div>
          </div>

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center relative z-10"
          >
            <h1
              className="text-3xl font-black tracking-tight"
              style={{
                background: "linear-gradient(90deg, #a5b4fc, #f9a8d4, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AppCraft
            </h1>
            <p className="text-white/50 text-sm font-semibold tracking-[0.3em] uppercase mt-1">
              by DigitalSpot
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/30 text-xs mt-4 font-medium relative z-10"
          >
            Agency Portal v2.0
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 w-48 h-1 bg-white/10 rounded-full overflow-hidden relative z-10"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 2.3, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #ec4899)",
              }}
            />
          </motion.div>

          {/* Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-2 mt-4 relative z-10"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full"
                style={{
                  background: i === 1 ? "#818cf8" : i === 2 ? "#ec4899" : "#6366f1",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
