"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import OrderStepper from "@/components/OrderStepper";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrder,
  addOrderComment,
  submitPayment,
  uploadReceipt,
} from "@/lib/firestore-helpers";
import toast from "react-hot-toast";
import type { Order } from "@/types";

const PAYMENT_METHODS = [
  { id: "bank_transfer", name: "Bank Transfer", icon: "🏦", color: "from-blue-700 to-blue-500", desc: "HBL · Account ending 4521" },
  { id: "easypaisa", name: "EasyPaisa", icon: "📱", color: "from-emerald-800 to-emerald-500", desc: "+92 300-1234567" },
  { id: "jazzcash", name: "JazzCash", icon: "💛", color: "from-amber-800 to-amber-500", desc: "+92 311-7654321" },
  { id: "crypto", name: "Crypto (USDT/TRC-20)", icon: "₿", color: "from-violet-700 to-cyan-500", desc: "TRC-20 Network" },
] as const;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, appUser, isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "comments" | "payment">("track");
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [txnId, setTxnId] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrder(id);
      if (!data) {
        toast.error("Order not found");
        router.replace("/orders");
        return;
      }
      setOrder(data);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleComment = async () => {
    if (!commentText.trim() || !user || !appUser || !order) return;
    setPosting(true);
    try {
      await addOrderComment(order.id, {
        orderId: order.id,
        authorId: user.uid,
        authorName: appUser.displayName,
        authorRole: isAdmin ? "admin" : "client",
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      });
      setCommentText("");
      await loadOrder();
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!user || !appUser || !order) return;
    if (!selectedMethod || !txnId || !amount) {
      toast.error("Please fill all payment fields");
      return;
    }
    setSubmittingPayment(true);
    try {
      let receiptUrl: string | undefined;
      if (receiptFile) {
        receiptUrl = await uploadReceipt(receiptFile);
      }
      const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
      await submitPayment({
        orderId: order.id,
        clientId: user.uid,
        clientName: appUser.displayName,
        method: selectedMethod as "bank_transfer" | "easypaisa" | "jazzcash" | "crypto" | "other",
        methodName: method?.name ?? selectedMethod,
        amount: parseFloat(amount),
        currency: "PKR",
        transactionId: txnId,
        receiptUrl,
        status: "pending",
        adminNote: undefined,
        verifiedAt: undefined,
      });
      toast.success("Payment submitted! Admin will verify shortly. ✅");
      setPaymentModal(false);
      setTxnId("");
      setAmount("");
      setReceiptFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit payment";
      toast.error(msg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <TopHeader title="Order Details" showBack backHref="/orders" />
        <div className="px-5 pt-5 flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!order) return null;

  const myComments = order.comments ?? [];

  return (
    <AppLayout>
      <TopHeader title="Order Details" showBack backHref="/orders" />

      <main className="page-content animate-fade-in">
        {/* Order Header */}
        <div className="mx-5 mt-5 bg-[var(--glass)] border border-[var(--border-accent)] rounded-2xl p-5">
          <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mb-1">
            #{order.id.slice(-10).toUpperCase()}
          </p>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">
            {order.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {(order.tags ?? []).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Budget</p>
              <p className="font-extrabold text-emerald-400 text-base">${order.budget.toLocaleString()}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Progress</p>
              <p className="font-extrabold text-violet-400 text-base">{order.progress}%</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Deadline</p>
              <p className="font-extrabold text-cyan-400 text-base">
                {order.deadline
                  ? new Date(order.deadline).toLocaleDateString("en", { month: "short", day: "numeric" })
                  : "TBD"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-5 mt-4 flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          {(["track", "comments", "payment"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab === "track" ? "📍 Track" : tab === "comments" ? "💬 Comments" : "💳 Payment"}
            </button>
          ))}
        </div>

        {/* Tab: Track */}
        {activeTab === "track" && (
          <div className="animate-fade-in">
            <div className="mx-5 mt-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-5">
                📦 Order Progress
              </h3>
              <OrderStepper currentStatus={order.status} />
            </div>

            {/* Progress bar */}
            <div className="mx-5 mt-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)] font-medium">Completion</span>
                <span className="font-bold text-violet-400">{order.progress}%</span>
              </div>
              <div className="h-3 bg-[var(--bg-input)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-1000 relative"
                  style={{ width: `${order.progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mx-5 mt-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                Project Description
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {order.description}
              </p>
            </div>
          </div>
        )}

        {/* Tab: Comments */}
        {activeTab === "comments" && (
          <div className="animate-fade-in">
            <div className="px-5 mt-4 flex flex-col gap-3">
              {myComments.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm">No comments yet. Start the conversation!</p>
                </div>
              ) : (
                myComments.map((comment) => {
                  const isMine = comment.authorId === user?.uid;
                  return (
                    <div
                      key={comment.id}
                      className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white ${
                          comment.authorRole === "admin"
                            ? "bg-gradient-to-br from-violet-600 to-cyan-500"
                            : "bg-gradient-to-br from-amber-500 to-red-500"
                        }`}
                      >
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`flex-1 rounded-2xl p-3.5 text-sm leading-relaxed ${
                          isMine
                            ? "bg-violet-500/15 border border-violet-500/30 rounded-tr-sm"
                            : "bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-sm"
                        }`}
                      >
                        <p className="font-bold text-[var(--text-primary)] text-xs mb-1">
                          {comment.authorRole === "admin" ? "👑 " : ""}
                          {comment.authorName}
                        </p>
                        <p className="text-[var(--text-secondary)]">{comment.text}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment input */}
            <div className="px-5 mt-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-3 flex gap-2">
                <textarea
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] resize-none outline-none placeholder:text-[var(--text-muted)]"
                  placeholder="Write a comment..."
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || posting}
                  className="self-end px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-all hover:shadow-[0_4px_12px_rgba(124,58,237,0.4)]"
                >
                  {posting ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Payment */}
        {activeTab === "payment" && (
          <div className="animate-fade-in px-5 mt-4 flex flex-col gap-3">
            <p className="text-sm text-[var(--text-muted)]">
              Choose a payment method to submit your payment proof.
            </p>
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setPaymentModal(true);
                }}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/40 hover:translate-x-1 transition-all text-left"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--text-primary)] text-sm">{method.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{method.desc}</p>
                </div>
                <span className="text-[var(--text-muted)] text-lg">›</span>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {paymentModal && (
        <div
          className="bottom-sheet-overlay open"
          onClick={() => setPaymentModal(false)}
        >
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-4">
              💳{" "}
              {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name ?? "Submit Payment"}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your transaction ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                  Amount (PKR) *
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                  Payment Receipt (Screenshot)
                </label>
                <div
                  className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center cursor-pointer hover:border-violet-500/50 transition-all"
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  />
                  {receiptFile ? (
                    <p className="text-sm text-emerald-400 font-semibold">
                      ✅ {receiptFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Upload screenshot
                      </p>
                    </>
                  )}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handlePaymentSubmit}
                disabled={submittingPayment}
              >
                {submittingPayment ? "Submitting..." : "✅ Submit Payment Proof"}
              </button>
              <button className="btn-secondary" onClick={() => setPaymentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
