"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Upload,
  CheckCircle,
  Clock,
  Check,
  X,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import GlassCard from "@/components/ui/GlassCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import {
  getOrder,
  subscribeToComments,
  addComment,
  getPaymentMethods,
  type Order,
  type Comment,
  type PaymentMethod,
} from "@/lib/firestore";
import { uploadReceipt } from "@/lib/storage";
import toast from "react-hot-toast";

// ─── STAGES ────────────────────────────────────────────────────────────────
const STAGES = [
  {
    key: "requirements",
    label: "Requirements",
    desc: "Gathering project requirements",
    icon: "📋",
  },
  {
    key: "design",
    label: "UI/UX Design",
    desc: "Wireframes and design mockups",
    icon: "🎨",
  },
  {
    key: "development",
    label: "Development",
    desc: "Building frontend & backend",
    icon: "⚡",
  },
  {
    key: "testing",
    label: "Testing & QA",
    desc: "Unit tests and quality checks",
    icon: "🔬",
  },
  {
    key: "delivery",
    label: "Delivery",
    desc: "Final handover & deployment",
    icon: "🚀",
  },
];

const STAGE_INDEX: Record<string, number> = {
  requirements: 0,
  design: 1,
  development: 2,
  testing: 3,
  delivery: 4,
};

// ─── DEMO DATA ──────────────────────────────────────────────────────────────
const DEMO_ORDER: Order = {
  id: "demo1",
  title: "E-Commerce Platform",
  description:
    "Full-stack e-commerce platform with product catalog, cart, checkout, Stripe integration, and admin dashboard.",
  budget: 2400,
  deadline: "Dec 30, 2024",
  status: "active",
  stage: "development",
  clientId: "demo",
  clientName: "Ahmed Hassan",
  clientEmail: "ahmed@demo.com",
  paymentStatus: "paid",
  paymentMethod: "jazzcash",
};

const DEMO_COMMENTS: Comment[] = [
  {
    id: "c1",
    orderId: "demo1",
    authorId: "admin",
    authorName: "DigitalSpot Team",
    authorRole: "admin",
    message:
      "Homepage design is completed! Please review the Figma link shared via email and approve before we proceed.",
  },
  {
    id: "c2",
    orderId: "demo1",
    authorId: "demo",
    authorName: "Ahmed Hassan",
    authorRole: "client",
    message:
      "Looks amazing! Approved ✅ Please proceed with the development phase.",
  },
];

// ─── STEPPER ─────────────────────────────────────────────────────────────────
function OrderStepper({ currentStage }: { currentStage: string }) {
  const currentIndex = STAGE_INDEX[currentStage] ?? 0;

  return (
    <GlassCard className="p-4" animate={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          🔄 Progress Tracker
        </h3>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(99,102,241,0.15)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          Step {currentIndex + 1} of 5
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <div key={stage.key} className="flex gap-3 items-start">
              {/* Dot + Connector */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    isDone
                      ? "text-white"
                      : isActive
                      ? "border-2 border-indigo-500"
                      : "border-2 border-white/10"
                  }`}
                  style={
                    isDone
                      ? {
                          background:
                            "linear-gradient(135deg, #6366f1, #ec4899)",
                          boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                        }
                      : isActive
                      ? { background: "rgba(99,102,241,0.15)" }
                      : { background: "rgba(255,255,255,0.05)" }
                  }
                >
                  {isDone ? (
                    <Check size={14} />
                  ) : isActive ? (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-indigo-400 text-base"
                    >
                      ⚡
                    </motion.span>
                  ) : (
                    <span className="text-slate-500 text-sm">{stage.icon}</span>
                  )}
                </motion.div>
                {i < STAGES.length - 1 && (
                  <div
                    className="w-0.5 h-6 mt-0.5 rounded-full"
                    style={{
                      background: isDone
                        ? "linear-gradient(180deg, #6366f1, rgba(99,102,241,0.3))"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-5 flex-1 pt-1">
                <p
                  className={`text-sm font-semibold ${
                    isDone
                      ? "text-slate-900 dark:text-white"
                      : isActive
                      ? "text-indigo-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                  {stage.desc}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-indigo-400 mt-1 font-medium"
                  >
                    🔄 In Progress
                  </motion.p>
                )}
                {isDone && (
                  <p className="text-[10px] text-emerald-400 mt-1 font-medium">
                    ✅ Completed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── PAYMENT SECTION ─────────────────────────────────────────────────────────
function PaymentSection({
  order,
  onPaymentSubmit,
}: {
  order: Order;
  onPaymentSubmit: (
    method: string,
    txId: string,
    receiptUrl: string
  ) => Promise<void>;
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [txId, setTxId] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState("");

  useEffect(() => {
    getPaymentMethods()
      .then(setMethods)
      .catch(() =>
        setMethods([
          {
            id: "jc",
            name: "JazzCash",
            type: "jazzcash",
            accountNumber: "0300-1234567",
            accountTitle: "DigitalSpot",
            isActive: true,
            instructions: "Send to number and upload screenshot",
          },
          {
            id: "ep",
            name: "EasyPaisa",
            type: "easypaisa",
            accountNumber: "0333-7654321",
            accountTitle: "DigitalSpot",
            isActive: true,
            instructions: "Send via EasyPaisa and upload receipt",
          },
        ])
      );
  }, []);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be under 5MB.");
      return;
    }
    setReceipt(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedMethod || !txId) {
      toast.error("Select payment method and enter Transaction ID.");
      return;
    }
    if (!receipt) {
      toast.error("Please upload payment receipt screenshot.");
      return;
    }
    setLoading(true);
    try {
      const url = await uploadReceipt(receipt, order.id ?? "");
      await onPaymentSubmit(selectedMethod, txId, url);
      toast.success("Payment submitted! Admin will verify shortly. ✅");
    } catch {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (order.paymentStatus === "paid") {
    return (
      <GlassCard className="p-4" animate={false}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <CheckCircle size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Payment Approved ✅
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              ${order.budget.toLocaleString()} · {order.paymentMethod}
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (order.paymentStatus === "pending") {
    return (
      <GlassCard className="p-4" animate={false}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            <Clock size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Payment Under Review ⏳
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin will verify your payment receipt shortly.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4" animate={false}>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
        💳 Submit Payment
      </h3>

      {/* Method Selection */}
      <div className="space-y-2 mb-4">
        {methods.map((m) => (
          <label
            key={m.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              selectedMethod === m.id
                ? "border-indigo-500/50 bg-indigo-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <input
              type="radio"
              name="pm"
              value={m.id}
              checked={selectedMethod === m.id}
              onChange={() => setSelectedMethod(m.id ?? "")}
              className="sr-only"
            />
            <span className="text-xl">
              {m.type === "jazzcash"
                ? "📲"
                : m.type === "easypaisa"
                ? "💚"
                : "🏦"}
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {m.name}
              </p>
              <p className="text-[10px] text-slate-500">{m.accountNumber} · {m.accountTitle}</p>
            </div>
            {selectedMethod === m.id && (
              <div
                className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px]"
                style={{ background: "#6366f1" }}
              >
                ✓
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Transaction ID */}
      <input
        type="text"
        placeholder="Transaction ID / Reference Number"
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        className="input-glass mb-3 text-sm"
      />

      {/* Receipt Upload */}
      <label
        htmlFor="receipt-upload"
        className={`border border-dashed rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all mb-3 ${
          receipt
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-white/20 hover:border-indigo-500/50 hover:bg-indigo-500/5"
        }`}
      >
        {receiptPreview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={receiptPreview}
              alt="Receipt"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setReceipt(null);
                setReceiptPreview("");
              }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={20} className="text-slate-400" />
            <p className="text-xs text-slate-400">
              Upload receipt screenshot
            </p>
            <p className="text-[10px] text-slate-500">PNG, JPG · Max 5MB</p>
          </>
        )}
      </label>
      <input
        id="receipt-upload"
        type="file"
        accept="image/*"
        onChange={handleReceiptChange}
        className="hidden"
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Submit Payment"
        )}
      </motion.button>
    </GlassCard>
  );
}

// ─── COMMENT THREAD ─────────────────────────────────────────────────────────
function CommentThread({
  orderId,
  comments,
  onSend,
}: {
  orderId: string;
  comments: Comment[];
  onSend: (message: string) => Promise<void>;
}) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const msg = message.trim();
    setMessage("");
    try {
      await onSend(msg);
    } catch {
      toast.error("Failed to send message.");
      setMessage(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <GlassCard className="p-4" animate={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          💬 Comment Thread
        </h3>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(99,102,241,0.15)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          {comments.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
        {comments.map((comment) => {
          const isMe = comment.authorId === user?.uid;
          const isAdmin = comment.authorRole === "admin";
          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  isAdmin ? "bg-indigo-500/20" : "bg-emerald-500/20"
                }`}
              >
                {isAdmin ? "👨‍💼" : "👤"}
              </div>
              <div
                className={`flex-1 p-3 rounded-2xl ${
                  isMe
                    ? "rounded-tr-sm"
                    : "rounded-tl-sm"
                }`}
                style={{
                  background: isAdmin
                    ? "rgba(99,102,241,0.1)"
                    : "rgba(16,185,129,0.1)",
                  border: isAdmin
                    ? "1px solid rgba(99,102,241,0.2)"
                    : "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <p
                  className={`text-[10px] font-bold mb-1 ${
                    isAdmin ? "text-indigo-400" : "text-emerald-400"
                  }`}
                >
                  {isAdmin ? "👨‍💼 " : ""}
                  {comment.authorName}
                </p>
                <p className="text-xs text-slate-300 dark:text-slate-300 leading-relaxed">
                  {comment.message}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-glass flex-1 py-2.5 text-xs"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={sending || !message.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          {sending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={15} />
          )}
        </motion.button>
      </form>
    </GlassCard>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const params = useParams();
  const { user, profile } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId === "demo1") {
      setOrder(DEMO_ORDER);
      setLoading(false);
      return;
    }
    getOrder(orderId)
      .then((o) => {
        setOrder(o ?? DEMO_ORDER);
      })
      .catch(() => setOrder(DEMO_ORDER))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!orderId || orderId === "demo1") {
      setComments(DEMO_COMMENTS);
      return;
    }
    const unsub = subscribeToComments(orderId, (c) => setComments(c));
    return unsub;
  }, [orderId]);

  const handleSendComment = async (message: string) => {
    if (!user || !profile) return;
    await addComment(orderId, {
      orderId,
      authorId: user.uid,
      authorName: profile.displayName,
      authorRole: profile.role,
      message,
    });
  };

  const handlePaymentSubmit = async (
    method: string,
    txId: string,
    receiptUrl: string
  ) => {
    if (!order?.id) return;
    const { updateOrder } = await import("@/lib/firestore");
    await updateOrder(order.id, {
      paymentStatus: "pending",
      paymentMethod: method,
      transactionId: txId,
      receiptUrl,
    });
    setOrder((prev) => prev ? { ...prev, paymentStatus: "pending" } : null);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading order..." />
        </div>
      </AppShell>
    );
  }

  if (!order) {
    return (
      <AppShell>
        <div className="px-3 pt-4 text-center py-20">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-sm text-slate-400">Order not found.</p>
          <Link href="/orders">
            <button className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
              Back to Orders
            </button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "rgba(16,185,129,0.15)", text: "#34d399" },
    pending: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
    completed: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
    cancelled: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  };
  const sc = statusColors[order.status] ?? statusColors.pending;

  return (
    <AppShell>
      <div className="px-3 pt-4 space-y-3">
        {/* Back */}
        <Link
          href="/orders"
          className="flex items-center gap-2 text-slate-400 text-sm hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* Order Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1))",
            borderColor: "rgba(99,102,241,0.3)",
          }}
        >
          <p className="text-[10px] text-slate-400 font-mono">
            #{order.id?.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {order.title}
          </h1>
          <p
            className="text-2xl font-black mt-1"
            style={{
              background: "linear-gradient(90deg, #6366f1, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ${order.budget.toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              📅 {order.deadline}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              👤 {order.clientName}
            </span>
            <span
              className="text-[10px] px-2.5 py-1 rounded-full font-bold"
              style={{ background: sc.bg, color: sc.text }}
            >
              {order.status}
            </span>
          </div>
          {order.description && (
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {order.description}
            </p>
          )}
        </motion.div>

        {/* Progress Stepper */}
        <OrderStepper currentStage={order.stage} />

        {/* Payment */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            💳 Payment
          </h2>
          <PaymentSection order={order} onPaymentSubmit={handlePaymentSubmit} />
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            💬 Communication
          </h2>
          <CommentThread
            orderId={orderId}
            comments={comments}
            onSend={handleSendComment}
          />
        </div>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
