"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import TopHeader from "@/components/TopHeader";
import { getPortfolioProjects } from "@/lib/firestore-helpers";
import type { PortfolioProject } from "@/types";

// Fallback demo projects
const DEMO_PROJECTS: PortfolioProject[] = [
  { id: "1", title: "ShopFlow Pro", category: "E-Commerce", description: "A full-featured mobile e-commerce platform with real-time inventory, payments, and order tracking.", iframeUrl: "", tags: ["React Native", "Firebase", "Stripe"], isLive: true, isFeatured: true, gradient: "linear-gradient(135deg,#7c3aed,#06b6d4)", icon: "🛒", sortOrder: 1, createdAt: "" },
  { id: "2", title: "MetricsPulse", category: "SaaS Dashboard", description: "Real-time analytics dashboard for business intelligence with beautiful charts.", iframeUrl: "", tags: ["Next.js", "PostgreSQL", "D3.js"], isLive: true, isFeatured: true, gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: "📊", sortOrder: 2, createdAt: "" },
  { id: "3", title: "QuickBite", category: "Food Delivery", description: "Multi-vendor food delivery app with live driver tracking and smart restaurant matching.", iframeUrl: "", tags: ["Flutter", "Node.js", "Google Maps"], isLive: true, isFeatured: false, gradient: "linear-gradient(135deg,#10b981,#06b6d4)", icon: "🍔", sortOrder: 3, createdAt: "" },
  { id: "4", title: "EstateView", category: "Real Estate", description: "Premium property listing platform with virtual tours and mortgage calculator.", iframeUrl: "", tags: ["Vue.js", "Laravel", "AWS"], isLive: false, isFeatured: false, gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)", icon: "🏠", sortOrder: 4, createdAt: "" },
  { id: "5", title: "FitTrack 360", category: "Health & Fitness", description: "Comprehensive workout tracking app with AI-powered coaching and nutrition plans.", iframeUrl: "", tags: ["React Native", "Python", "TensorFlow"], isLive: true, isFeatured: true, gradient: "linear-gradient(135deg,#0f766e,#14b8a6)", icon: "💪", sortOrder: 5, createdAt: "" },
  { id: "6", title: "WalletX", category: "FinTech", description: "Secure digital wallet with multi-currency support, crypto integration, and instant transfers.", iframeUrl: "", tags: ["React Native", "Node.js", "Blockchain"], isLive: true, isFeatured: false, gradient: "linear-gradient(135deg,#0e7490,#0284c7)", icon: "💳", sortOrder: 6, createdAt: "" },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getPortfolioProjects()
      .then((data) => setProjects(data.length > 0 ? data : DEMO_PROJECTS))
      .catch(() => setProjects(DEMO_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <AppLayout>
      <TopHeader title="Portfolio 🎨" />

      <main className="page-content animate-fade-in">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <h2 className="section-title">
            Our <span>Work</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {projects.length} projects delivered
          </p>
        </div>

        {/* Category filter */}
        <div className="px-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 border ${
                filter === cat
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent shadow-[0_4px_15px_rgba(124,58,237,0.4)]"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-violet-500/50"
              }`}
            >
              {cat === "all" ? "All Projects" : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-5 mt-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-5 mt-3">
            {filtered.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setSelected(project)}
                className="text-left animate-slide-up cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-violet-500/40 hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(124,58,237,0.2)]">
                  {/* Thumbnail */}
                  <div
                    className="h-28 flex items-center justify-center relative"
                    style={{ background: project.gradient }}
                  >
                    <span className="text-4xl opacity-90">{project.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                    {project.isLive && (
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Live ✓
                      </span>
                    )}
                    {project.isFeatured && (
                      <span className="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="font-bold text-[var(--text-primary)] text-sm line-clamp-1">
                      {project.title}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {project.category}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mx-5 mt-5 p-5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-violet-500/30 text-center">
          <p className="text-2xl mb-2">💡</p>
          <h3 className="font-bold text-[var(--text-primary)] mb-1">
            Have a project in mind?
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Let&apos;s turn your idea into a reality
          </p>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm rounded-xl hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all"
          >
            💬 Discuss Your Project
          </a>
        </div>
      </main>

      {/* Project Modal */}
      {selected && (
        <div
          className="bottom-sheet-overlay open"
          onClick={() => setSelected(null)}
        >
          <div
            className="bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />

            {/* Preview */}
            {selected.iframeUrl ? (
              <div className="iframe-container mb-4 h-48">
                <iframe
                  src={selected.iframeUrl}
                  title={selected.title}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div
                className="h-44 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden"
                style={{ background: selected.gradient }}
              >
                <span className="text-6xl">{selected.icon}</span>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
              </div>
            )}

            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-1">
              {selected.title}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-3">
              {selected.category}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {selected.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {selected.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {selected.isLive && (
                <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                  🟢 Live Project
                </span>
              )}
            </div>

            {selected.liveUrl && (
              <a
                href={selected.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2 mb-3"
              >
                🌐 View Live Site
              </a>
            )}
            <button
              className="btn-secondary"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
