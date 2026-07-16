"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, updateUser, adjustLoyaltyPoints } from "@/lib/firestore-helpers";
import toast from "react-hot-toast";
import type { AppUser } from "@/types";

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [editPoints, setEditPoints] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace("/");
  }, [isAdmin, authLoading, router]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) loadUsers();
  }, [authLoading, isAdmin, loadUsers]);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (uid: string, isActive: boolean) => {
    try {
      await updateUser(uid, { isActive: !isActive });
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, isActive: !isActive } : u))
      );
      toast.success(isActive ? "User suspended" : "User activated");
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleMakeAdmin = async (uid: string, role: "admin" | "client") => {
    const newRole = role === "admin" ? "client" : "admin";
    try {
      await updateUser(uid, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleSavePoints = async () => {
    if (!editUser || !editPoints) return;
    const delta = parseInt(editPoints);
    if (isNaN(delta)) {
      toast.error("Invalid points value");
      return;
    }
    setSaving(true);
    try {
      await adjustLoyaltyPoints(editUser.uid, delta);
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === editUser.uid
            ? { ...u, loyaltyPoints: Math.max(0, (u.loyaltyPoints ?? 0) + delta) }
            : u
        )
      );
      toast.success("Loyalty points updated! ⭐");
      setEditUser(null);
      setEditPoints("");
    } catch {
      toast.error("Failed to update points");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <TopHeader title="Manage Users 👥" showBack backHref="/admin" />

      <main className="page-content animate-fade-in">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="section-title">
              👥 <span>Users</span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {users.length} registered users
            </p>
          </div>
        </div>

        <div className="px-5 mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              🔍
            </span>
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="px-5 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-5 text-center py-10">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-[var(--text-muted)] text-sm">No users found</p>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3">
            {filtered.map((u) => (
              <div
                key={u.uid}
                className={`bg-[var(--bg-card)] border rounded-2xl p-4 transition-all ${
                  u.isActive ? "border-[var(--border)]" : "border-red-500/30 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {u.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
                      {u.displayName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-violet-500/20 text-violet-400"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        u.isActive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {u.isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                  <span>⭐ {(u.loyaltyPoints ?? 0).toLocaleString()} pts</span>
                  <span>
                    Joined{" "}
                    {new Date(u.createdAt).toLocaleDateString("en", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditUser(u);
                      setEditPoints("");
                    }}
                    className="flex-1 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold rounded-lg hover:bg-amber-500/30 transition-all"
                  >
                    ⭐ Points
                  </button>
                  <button
                    onClick={() => handleMakeAdmin(u.uid, u.role)}
                    className="flex-1 py-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[11px] font-bold rounded-lg hover:bg-violet-500/30 transition-all"
                  >
                    {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => handleToggleActive(u.uid, u.isActive)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                      u.isActive
                        ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                        : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                  >
                    {u.isActive ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Points Modal */}
      {editUser && (
        <div
          className="bottom-sheet-overlay open"
          onClick={() => setEditUser(null)}
        >
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">
              ⭐ Adjust Loyalty Points
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-5">
              {editUser.displayName} · Current:{" "}
              <strong className="text-amber-400">
                {editUser.loyaltyPoints ?? 0} pts
              </strong>
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Points to Add/Remove (use negative to deduct)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 100 or -50"
                value={editPoints}
                onChange={(e) => setEditPoints(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleSavePoints}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Points"}
            </button>
            <button
              className="btn-secondary mt-3"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
