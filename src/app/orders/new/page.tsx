"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, DollarSign, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import {
  createOrder,
  getPaymentMethods,
  type PaymentMethod,
} from "@/lib/firestore";
import { uploadOrderAttachment } from "@/lib/storage";
import toast from "react-hot-toast";

export default function NewOrderPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    paymentMethod: "",
  });

  useEffect(() => {
    getPaymentMethods()
      .then((methods) => {
        setPaymentMethods(
          methods.length > 0
            ? methods
            : [
                {
                  id: "jc",
                  name: "JazzCash",
                  type: "jazzcash",
                  accountNumber: "0300-1234567",
                  accountTitle: "DigitalSpot Agency",
                  isActive: true,
                  instructions: "Send to JazzCash number and upload screenshot",
                },
                {
                  id: "ep",
                  name: "EasyPaisa",
                  type: "easypaisa",
                  accountNumber: "0333-1234567",
                  accountTitle: "DigitalSpot Agency",
                  isActive: true,
                  instructions: "Send to EasyPaisa and upload receipt",
                },
                {
                  id: "bt",
                  name: "Bank Transfer",
                  type: "bank",
                  accountNumber: "PK36MEZN0001234567890",
                  accountTitle: "DigitalSpot Agency",
                  bankName: "Meezan Bank",
                  isActive: true,
                  instructions: "Transfer to bank account and send receipt",
                },
              ]
        );
      })
      .catch(() => {});
  }, []);

  const update = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (valid.length < files.length) {
      toast.error("Some files exceed 10MB limit and were skipped.");
    }
    setAttachments((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      toast.error("Please sign in to place an order.");
      return;
    }
    if (!form.title || !form.description || !form.budget || !form.deadline) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Create order first to get the ID
      const orderId = await createOrder({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline,
        status: "pending",
        stage: "requirements",
        clientId: user.uid,
        clientName: profile.displayName,
        clientEmail: profile.email,
        paymentStatus: "unpaid",
        paymentMethod: form.paymentMethod || undefined,
        attachments: [],
      });

      // Upload attachments if any
      if (attachments.length > 0) {
        setUploadingFiles(true);
        const urls: string[] = [];
        for (const file of attachments) {
          try {
            const url = await uploadOrderAttachment(file, orderId);
            urls.push(url);
          } catch {
            toast.error(`Failed to upload ${file.name}`);
          }
        }
        setUploadingFiles(false);
        // Note: In production, update order with attachment URLs
      }

      toast.success("Order placed successfully! 🎉");
      router.push(`/orders/${orderId}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  const selectedMethod = paymentMethods.find(
    (m) => m.id === form.paymentMethod
  );

  return (
    <AppShell>
      <div className="px-3 pt-4 pb-8">
        {/* Back */}
        <Link
          href="/orders"
          className="flex items-center gap-2 text-slate-400 text-sm mb-5 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">
          🆕 New Order
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Fill in the details and our team will get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText size={12} /> Project Title *
            </label>
            <input
              type="text"
              placeholder="e.g., E-Commerce Website with Admin Panel"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="input-glass"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
              📝 Project Description *
            </label>
            <textarea
              placeholder="Describe your project in detail. Include features, design preferences, target audience, etc."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="input-glass resize-none"
              rows={5}
              required
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <DollarSign size={12} /> Budget (USD) *
              </label>
              <input
                type="number"
                placeholder="e.g., 2500"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                className="input-glass"
                min="1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar size={12} /> Deadline *
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                className="input-glass"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
              📎 Attachments (Optional)
            </label>
            <label
              className="border border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
              htmlFor="file-upload"
            >
              <Upload size={22} className="text-slate-400" />
              <p className="text-xs text-slate-400 text-center">
                Drop files here or{" "}
                <span className="text-indigo-400 font-semibold">browse</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Images, PDFs, Docs · Max 10MB each · Up to 5 files
              </p>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* File Preview */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10"
                  >
                    <span className="text-sm">
                      {file.type.startsWith("image/") ? "🖼️" : "📄"}
                    </span>
                    <span className="text-xs text-slate-300 flex-1 truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {(file.size / 1024).toFixed(0)}KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
              💳 Preferred Payment Method
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    form.paymentMethod === method.id
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={form.paymentMethod === method.id}
                    onChange={() => update("paymentMethod", method.id ?? "")}
                    className="sr-only"
                  />
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.15)" }}
                  >
                    {method.type === "jazzcash"
                      ? "📲"
                      : method.type === "easypaisa"
                      ? "💚"
                      : "🏦"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {method.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {method.accountNumber}
                    </p>
                  </div>
                  {form.paymentMethod === method.id && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ background: "#6366f1" }}
                    >
                      ✓
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Payment Instructions */}
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5"
              >
                <p className="text-xs font-semibold text-indigo-400 mb-1">
                  💡 Payment Instructions
                </p>
                <p className="text-xs text-slate-400">
                  {selectedMethod.instructions}
                </p>
                {selectedMethod.bankName && (
                  <p className="text-xs text-slate-500 mt-1">
                    Bank: {selectedMethod.bankName}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-0.5">
                  Account Title: {selectedMethod.accountTitle}
                </p>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || uploadingFiles}
            className="w-full py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            style={{
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            }}
          >
            {loading || uploadingFiles ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {uploadingFiles ? "Uploading files..." : "Placing Order..."}
              </>
            ) : (
              "🚀 Place Order"
            )}
          </motion.button>

          <p className="text-center text-[10px] text-slate-500">
            By placing an order, you agree to our Terms of Service. Our team
            will review and respond within 24 hours.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
