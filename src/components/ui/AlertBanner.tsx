"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AlertBannerProps {
  text: string;
}

export default function AlertBanner({ text }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!text) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-3 mt-3"
        >
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm border"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1))",
              borderColor: "rgba(99,102,241,0.3)",
            }}
          >
            <span className="text-base flex-shrink-0">📢</span>
            <p className="flex-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {text}
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
