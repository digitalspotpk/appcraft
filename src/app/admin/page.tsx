"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Settings,
  Image,
  Bell,
  CreditCard,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "users", label: "Users", icon: Users },
  { key: "payments", label: "Payments", icon: DollarSign },
  { key: "portfolio", label: "Portfolio", icon: Image },
  { key: "notifications", label: "Alerts", icon: Bell },
  { key: "payment-methods", label: "Pay Methods", icon: CreditCard },
  { key: "settings", label: "Settings", icon: Settings },
];

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
function DashboardTab() {
  const stats = [
    { icon: "💰", label: "Total Revenue", value: "$24,580", change: "+18%", up: true, color: "#6366f1" },
    { icon: "📦", label: "Total Orders", value: "87", change: "+12 this month", up: true, color: "#ec4899" },
    { icon: "✅", label: "Completed", value: "61", change: "70% rate", up: true, color: "#10b981" },
    { icon: "⏳", label: "Pending Pay", value: "5", change: "$4,200 owed", up: false, color: "#f59e0b" },
  ];

  const recentOrders = [
    { id: "001", title: "E-Commerce Platform", client: "ZaynTech", amount: 2400, status: "active", stage: "development" },
    { id: "002", title: "Mobile App UI", client: "FoodieHub", amount: 1800, status: "pending", stage: "design" },
    { id: "003", title: "AI Chatbot", client: "BotWorks", amount: 3200, status: "completed", stage: "delivery" },
    { id: "004", title: "Real Estate Portal", client: "PropMax", amount: 4500, status: "active", stage: "testing" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            <div className={`text-[10px] font-semibold mt-1.5 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
              {s.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <GlassCard className="p-4" animate={false}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">📈 Monthly Revenue</h3>
          <TrendingUp size={16} className="text-indigo-400" />
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {[40, 55, 35, 70, 85, 60, 90, 45, 75, 65, 80, 100].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.2 + i * 0.04 }}
              style={{
                background: i === 11
                  ? "linear-gradient(180deg, #6366f1, #ec4899)"
                  : i % 2 === 0
                  ? "rgba(99,102,241,0.4)"
                  : "rgba(236,72,153,0.3)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-1.5 mt-1">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
            <div key={i} className="flex-1 text-center text-[8px] text-slate-500">{m}</div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Orders */}
      <GlassCard className="p-4" animate={false}>
        <h3 className="text-sm font-bold text-white mb-3">🗂 Recent Orders</h3>
        <div className="space-y-2">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-sm">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{o.title}</p>
                <p className="text-[10px] text-slate-400">{o.client} · {o.stage}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">${o.amount.toLocaleString()}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  o.status === "active" ? "bg-emerald-500/15 text-emerald-400"
                  : o.status === "completed" ? "bg-indigo-500/15 text-indigo-400"
                  : "bg-amber-500/15 text-amber-400"
                }`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── ORDERS TAB ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const orders = [
    { id: "ORD001", title: "E-Commerce Platform", client: "ZaynTech", amount: 2400, status: "active", stage: "development", deadline: "Dec 30" },
    { id: "ORD002", title: "Mobile App UI", client: "FoodieHub", amount: 1800, status: "pending", stage: "design", deadline: "Jan 5" },
    { id: "ORD003", title: "AI Chatbot", client: "BotWorks", amount: 3200, status: "active", stage: "testing", deadline: "Jan 12" },
    { id: "ORD004", title: "Real Estate Portal", client: "PropMax", amount: 4500, status: "completed", stage: "delivery", deadline: "Dec 20" },
    { id: "ORD005", title: "LMS Platform", client: "EduTech", amount: 5800, status: "active", stage: "requirements", deadline: "Feb 1" },
  ];

  const STAGES = ["requirements", "design", "development", "testing", "delivery"];

  const handleStageUpdate = (id: string, stage: string) => {
    toast.success(`Order ${id} moved to ${stage}`);
  };

  return (
    <div className="space-y-3">
      {orders.map((o, i) => (
        <motion.div
          key={o.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="p-4 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-[10px] text-slate-500 font-mono">#{o.id}</p>
              <p className="text-sm font-bold text-white">{o.title}</p>
              <p className="text-xs text-slate-400">{o.client} · Due {o.deadline}</p>
            </div>
            <span className="text-sm font-black text-white">${o.amount.toLocaleString()}</span>
          </div>
          {/* Stage Selector */}
          <div className="flex gap-1 flex-wrap mt-2">
            {STAGES.map((stage) => (
              <button
                key={stage}
                onClick={() => handleStageUpdate(o.id, stage)}
                className={`text-[9px] font-bold px-2 py-1 rounded-full transition-all ${
                  o.stage === stage
                    ? "text-white"
                    : "text-slate-400 bg-white/5 hover:bg-white/10"
                }`}
                style={o.stage === stage ? { background: "linear-gradient(135deg, #6366f1, #ec4899)" } : {}}
              >
                {stage}
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── PAYMENTS TAB ─────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments] = useState([
    { id: "P001", client: "ZaynTech", order: "E-Commerce Platform", amount: 2400, method: "JazzCash", txId: "JC-789456", status: "pending", date: "Dec 22" },
    { id: "P002", client: "FoodieHub", order: "Mobile App", amount: 1800, method: "EasyPaisa", txId: "EP-123789", status: "pending", date: "Dec 21" },
    { id: "P003", client: "BotWorks", order: "AI Chatbot", amount: 1600, method: "Bank Transfer", txId: "BT-456123", status: "approved", date: "Dec 20" },
  ]);

  const handleApprove = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    toast.success("Payment approved! ✅");
  };

  const handleReject = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
    toast.error("Payment rejected.");
  };

  return (
    <div className="space-y-3">
      {payments.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="p-4 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] text-slate-500 font-mono">#{p.id}</p>
              <p className="text-sm font-bold text-white">{p.client}</p>
              <p className="text-xs text-slate-400">{p.order} · {p.method}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">TX: {p.txId} · {p.date}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-white">${p.amount.toLocaleString()}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                p.status === "approved" ? "bg-emerald-500/15 text-emerald-400"
                : p.status === "rejected" ? "bg-red-500/15 text-red-400"
                : "bg-amber-500/15 text-amber-400"
              }`}>
                {p.status}
              </span>
            </div>
          </div>
          {p.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApprove(p.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}
              >
                <CheckCircle size={13} /> Approve
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReject(p.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/20"
              >
                <XCircle size={13} /> Reject
              </motion.button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── SETTINGS TAB ────────────────────────────────────────────────────────────
function SettingsTab() {
  const [config, setConfig] = useState({
    appName: "AppCraft by DigitalSpot",
    maintenanceMode: false,
    globalAlertText: "🎉 JazzCash & EasyPaisa payments now available!",
    whatsappNumber: "+923001234567",
    currency: "USD",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { updateAppConfig } = await import("@/lib/firestore");
      await updateAppConfig(config);
      toast.success("Settings saved successfully! ✅");
    } catch {
      toast.error("Failed to save. Check Firebase connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4" animate={false}>
        <h3 className="text-sm font-bold text-white mb-4">⚙️ System Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">App Name</label>
            <input
              type="text"
              value={config.appName}
              onChange={e => setConfig(p => ({ ...p, appName: e.target.value }))}
              className="input-glass text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Global Alert Text</label>
            <input
              type="text"
              value={config.globalAlertText}
              onChange={e => setConfig(p => ({ ...p, globalAlertText: e.target.value }))}
              className="input-glass text-sm"
              placeholder="Leave empty to hide banner"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">WhatsApp Number</label>
            <input
              type="text"
              value={config.whatsappNumber}
              onChange={e => setConfig(p => ({ ...p, whatsappNumber: e.target.value }))}
              className="input-glass text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Currency</label>
            <select
              value={config.currency}
              onChange={e => setConfig(p => ({ ...p, currency: e.target.value }))}
              className="input-glass text-sm"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-400">Show upgrade screen to all non-admin users</p>
            </div>
            <button
              onClick={() => setConfig(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
              className={`relative w-12 h-6 rounded-full transition-all ${
                config.maintenanceMode ? "bg-red-500" : "bg-white/20"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                config.maintenanceMode ? "left-6" : "left-0.5"
              }`} />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : "💾 Save Settings"}
        </motion.button>
      </GlassCard>
    </div>
  );
}

// ─── USERS TAB ───────────────────────────────────────────────────────────────
function UsersTab() {
  const users = [
    { id: "u1", name: "Ahmed Hassan", email: "ahmed@zayntech.com", role: "client", orders: 5, spent: "$8,400", joined: "Oct 2024" },
    { id: "u2", name: "Sara Khan", email: "sara@foodiehub.com", role: "client", orders: 3, spent: "$5,200", joined: "Nov 2024" },
    { id: "u3", name: "Ali Raza", email: "ali@botworks.com", role: "client", orders: 2, spent: "$3,200", joined: "Dec 2024" },
    { id: "u4", name: "Admin User", email: "admin@digitalspot.com", role: "admin", orders: 0, spent: "$0", joined: "Jan 2024" },
  ];

  return (
    <div className="space-y-3">
      {users.map((u, i) => (
        <motion.div
          key={u.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: u.role === "admin" ? "linear-gradient(135deg, #6366f1, #ec4899)" : "rgba(99,102,241,0.15)" }}
          >
            {u.role === "admin" ? "👨‍💼" : "👤"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{u.name}</p>
            <p className="text-[10px] text-slate-400">{u.email}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {u.orders} orders · {u.spent} · Joined {u.joined}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            u.role === "admin"
              ? "bg-indigo-500/20 text-indigo-400"
              : "bg-emerald-500/10 text-emerald-400"
          }`}>
            {u.role}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── PORTFOLIO TAB ───────────────────────────────────────────────────────────
function PortfolioTab() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "", iframeUrl: "", category: "Web App" });

  const handleAdd = () => {
    if (!form.title) { toast.error("Title is required."); return; }
    toast.success(`Portfolio project "${form.title}" added! ✅`);
    setShowForm(false);
    setForm({ title: "", description: "", tags: "", iframeUrl: "", category: "Web App" });
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          ➕ Add Portfolio Project
        </motion.button>
      ) : (
        <GlassCard className="p-4" animate={false}>
          <h3 className="text-sm font-bold text-white mb-4">Add Project</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Project Title *" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="input-glass text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input-glass text-sm resize-none" rows={3} />
            <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} className="input-glass text-sm" />
            <input type="url" placeholder="iframe URL (optional)" value={form.iframeUrl} onChange={e => setForm(p => ({...p, iframeUrl: e.target.value}))} className="input-glass text-sm" />
            <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="input-glass text-sm">
              <option>Web App</option>
              <option>Mobile App</option>
              <option>AI/ML</option>
              <option>SaaS</option>
              <option>E-Commerce</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
                Save Project
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-400">
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      <p className="text-xs text-slate-500 text-center">
        Projects are stored in Firestore and displayed on the Portfolio page.
      </p>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ───────────────────────────────────────────────────────
function NotificationsTab() {
  const [form, setForm] = useState({ title: "", message: "", target: "all", type: "info" });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!form.title || !form.message) { toast.error("Fill in all fields."); return; }
    setSending(true);
    try {
      const { createDocument } = await import("@/lib/firestore");
      await createDocument("notifications", { ...form, isRead: false });
      toast.success("Notification sent! 🔔");
      setForm({ title: "", message: "", target: "all", type: "info" });
    } catch {
      toast.error("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <GlassCard className="p-4" animate={false}>
      <h3 className="text-sm font-bold text-white mb-4">📣 Send Notification</h3>
      <div className="space-y-3">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="input-glass text-sm" />
        <textarea placeholder="Message" value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} className="input-glass text-sm resize-none" rows={3} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 mb-1 block">Target</label>
            <select value={form.target} onChange={e => setForm(p => ({...p, target: e.target.value}))} className="input-glass text-sm py-2">
              <option value="all">All Users</option>
              <option value="userId">Specific User</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 mb-1 block">Type</label>
            <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="input-glass text-sm py-2">
              <option value="info">ℹ️ Info</option>
              <option value="success">✅ Success</option>
              <option value="warning">⚠️ Warning</option>
              <option value="error">❌ Error</option>
            </select>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSend}
          disabled={sending}
          className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "🔔 Send Notification"}
        </motion.button>
      </div>
    </GlassCard>
  );
}

// ─── PAYMENT METHODS TAB ─────────────────────────────────────────────────────
function PaymentMethodsTab() {
  const [methods, setMethods] = useState([
    { id: "jc", name: "JazzCash", type: "jazzcash", accountNumber: "0300-1234567", accountTitle: "DigitalSpot", isActive: true },
    { id: "ep", name: "EasyPaisa", type: "easypaisa", accountNumber: "0333-7654321", accountTitle: "DigitalSpot", isActive: true },
    { id: "bt", name: "Bank Transfer", type: "bank", accountNumber: "PK36MEZN0001234567", accountTitle: "DigitalSpot", bankName: "Meezan Bank", isActive: false },
  ]);

  const toggle = (id: string) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
    toast.success("Payment method updated!");
  };

  return (
    <div className="space-y-3">
      {methods.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="text-2xl">
            {m.type === "jazzcash" ? "📲" : m.type === "easypaisa" ? "💚" : "🏦"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{m.name}</p>
            <p className="text-[10px] text-slate-400">{m.accountNumber} · {m.accountTitle}</p>
            {m.bankName && <p className="text-[10px] text-slate-500">{m.bankName}</p>}
          </div>
          <button
            onClick={() => toggle(m.id)}
            className={`relative w-12 h-6 rounded-full transition-all ${m.isActive ? "bg-indigo-500" : "bg-white/20"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${m.isActive ? "left-6" : "left-0.5"}`} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0f0f1a" }}
      >
        <LoadingSpinner size="lg" text="Verifying admin access..." />
      </div>
    );
  }

  if (!isAdmin) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "orders": return <OrdersTab />;
      case "users": return <UsersTab />;
      case "payments": return <PaymentsTab />;
      case "portfolio": return <PortfolioTab />;
      case "notifications": return <NotificationsTab />;
      case "payment-methods": return <PaymentMethodsTab />;
      case "settings": return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  const currentTab = TABS.find(t => t.key === activeTab);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 40%, #0d1b4b 100%)" }}
    >
      {/* Admin Header */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-white/10"
        style={{ background: "rgba(15,15,26,0.9)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
        >
          🛡️
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Admin Panel</h1>
          <p className="text-[10px] text-slate-400">AppCraft by DigitalSpot</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Tab Bar — Horizontal Scroll */}
        <div className="flex gap-1.5 overflow-x-auto px-3 pt-3 pb-0 -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === tab.key
                    ? "text-white border-transparent"
                    : "text-slate-400 border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg, #6366f1, #ec4899)" } : {}}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="px-3 pt-4 pb-8">
          <div className="flex items-center gap-2 mb-4">
            {currentTab && <currentTab.icon size={16} className="text-indigo-400" />}
            <h2 className="text-base font-bold text-white">{currentTab?.label}</h2>
          </div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
