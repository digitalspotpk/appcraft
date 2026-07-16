"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/firestore-helpers";
import toast from "react-hot-toast";
import type { Order } from "@/types";

const PROJECT_TYPES = [
  "Mobile App (iOS/Android)",
  "Web Application",
  "SaaS Platform",
  "E-Commerce Store",
  "Admin Dashboard",
  "API / Backend",
  "UI/UX Design",
  "Other",
];

const BUDGET_RANGES = [
  "< $500",
  "$500 – $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
];

export default function NewOrderPage() {
  const { user, appUser } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    projectType: "",
    description: "",
    budgetRange: "",
    deadline: "",
    tags: [] as string[],
    tagInput: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const t = formData.tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, t],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const parseBudget = (range: string): number => {
    if (range.includes("<")) return 499;
    if (range.includes("10,000+")) return 10000;
    const nums = range.match(/\d+/g);
    if (nums && nums.length >= 2)
      return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2);
    return 1000;
  };

  const handleSubmit = async () => {
    if (!user || !appUser) return;
    if (!formData.title || !formData.projectType || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
        clientId: user.uid,
        clientName: appUser.displayName,
        clientEmail: appUser.email,
        title: formData.title,
        description: `${formData.projectType}\n\n${formData.description}`,
        budget: parseBudget(formData.budgetRange),
        currency: "USD",
        status: "pending",
        progress: 0,
        deadline: formData.deadline || undefined,
        tags: [formData.projectType, ...formData.tags].filter(Boolean),
        attachments: [],
        comments: [],
      };
      const id = await createOrder(orderData);
      toast.success("Order submitted successfully! 🚀");
      router.replace(`/orders/${id}`);
    } catch {
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <TopHeader title="New Order ➕" showBack backHref="/orders" />

      <main className="page-content animate-fade-in">
        {/* Steps indicator */}
        <div className="px-5 pt-5 mb-5">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s <= step
                      ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                      : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${
                      s < step
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500"
                        : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {["Project Info", "Requirements", "Review"].map((l, i) => (
              <p
                key={l}
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  i + 1 <= step ? "text-violet-400" : "text-[var(--text-muted)]"
                }`}
              >
                {l}
              </p>
            ))}
          </div>
        </div>

        {/* Step 1: Project Info */}
        {step === 1 && (
          <div className="px-5 flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. My E-Commerce App"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Project Type *
              </label>
              <select
                className="form-select"
                value={formData.projectType}
                onChange={(e) => updateField("projectType", e.target.value)}
              >
                <option value="">Select type...</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Budget Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    onClick={() => updateField("budgetRange", b)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      formData.budgetRange === b
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent"
                        : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-violet-500/50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Preferred Deadline
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
              />
            </div>
            <button
              className="btn-primary mt-2"
              onClick={() => {
                if (!formData.title || !formData.projectType) {
                  toast.error("Please fill required fields");
                  return;
                }
                setStep(2);
              }}
            >
              Next: Requirements →
            </button>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div className="px-5 flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Project Description *
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Describe your project in detail. Include features, target audience, reference apps you like, and any specific requirements..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                style={{ minHeight: "140px" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Tech Stack / Keywords (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="e.g. React Native"
                  value={formData.tagInput}
                  onChange={(e) => updateField("tagInput", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <button
                  onClick={addTag}
                  className="px-4 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-500 transition-colors"
                >
                  +
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 tag cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <span className="text-[var(--text-muted)]">×</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Attachments (optional)
              </label>
              <div
                className="border-2 border-dashed border-[var(--border)] rounded-2xl p-6 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files ?? []))
                  }
                />
                <p className="text-3xl mb-2">📎</p>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">
                  Upload Requirements / References
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Images, PDFs, Docs — Max 10MB each
                </p>
              </div>
              {files.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2"
                    >
                      <span>📄</span>
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-[var(--text-muted)]">
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                className="btn-secondary flex-1"
                style={{ width: "auto" }}
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className="btn-primary flex-1"
                style={{ width: "auto" }}
                onClick={() => {
                  if (!formData.description) {
                    toast.error("Please describe your project");
                    return;
                  }
                  setStep(3);
                }}
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="px-5 flex flex-col gap-4 animate-fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 text-lg">
                Order Summary
              </h3>
              {[
                { label: "Project", value: formData.title },
                { label: "Type", value: formData.projectType },
                { label: "Budget", value: formData.budgetRange || "TBD" },
                {
                  label: "Deadline",
                  value: formData.deadline
                    ? new Date(formData.deadline).toLocaleDateString()
                    : "Flexible",
                },
                {
                  label: "Attachments",
                  value: `${files.length} file(s)`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-2.5 border-b border-[var(--border)] last:border-0"
                >
                  <span className="text-sm text-[var(--text-muted)] font-medium">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] max-w-[60%] text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {formData.description}
              </p>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              ⚡ Our team will review your order and get back to you within{" "}
              <strong>24 hours</strong>.
            </div>

            <div className="flex gap-3 mt-2">
              <button
                className="btn-secondary flex-1"
                style={{ width: "auto" }}
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                className="btn-primary flex-1"
                style={{ width: "auto" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "🚀 Submit Order"}
              </button>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
