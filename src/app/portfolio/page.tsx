"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import GlassCard from "@/components/ui/GlassCard";
import { getPortfolioProjects, type PortfolioProject } from "@/lib/firestore";
import { ExternalLink } from "lucide-react";

// Demo portfolio projects (shown when Firebase not configured)
const DEMO_PROJECTS: PortfolioProject[] = [
  {
    id: "p1",
    title: "ShopNow — E-Commerce Platform",
    description:
      "Full-stack e-commerce with Next.js 14, Stripe integration, real-time inventory management and admin dashboard.",
    tags: ["Next.js", "Stripe", "Firebase", "Tailwind"],
    category: "Web App",
    isPublished: true,
    order: 1,
    iframeUrl: "",
    imageUrl: "",
  },
  {
    id: "p2",
    title: "FoodieHub — Food Delivery App",
    description:
      "Real-time food ordering with live tracking, driver app, restaurant dashboard, and payment gateway.",
    tags: ["React Native", "Node.js", "Socket.io", "MongoDB"],
    category: "Mobile App",
    isPublished: true,
    order: 2,
    iframeUrl: "",
    imageUrl: "",
  },
  {
    id: "p3",
    title: "BotWorks — AI Assistant",
    description:
      "Custom GPT-powered chatbot with CRM integration, multi-language support, and analytics dashboard.",
    tags: ["OpenAI", "Python", "FastAPI", "React"],
    category: "AI/ML",
    isPublished: true,
    order: 3,
    iframeUrl: "",
    imageUrl: "",
  },
  {
    id: "p4",
    title: "PropFlow — Real Estate Portal",
    description:
      "Property listing platform with map integration, virtual tours, mortgage calculator, and lead management.",
    tags: ["Next.js", "Google Maps", "PostgreSQL", "Drizzle"],
    category: "Web App",
    isPublished: true,
    order: 4,
    iframeUrl: "",
    imageUrl: "",
  },
  {
    id: "p5",
    title: "EduLearn — LMS Platform",
    description:
      "Learning management system with video hosting, quiz engine, certificates, and student analytics.",
    tags: ["React", "Node.js", "AWS S3", "Stripe"],
    category: "SaaS",
    isPublished: true,
    order: 5,
    iframeUrl: "",
    imageUrl: "",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Web App": "🌐",
  "Mobile App": "📱",
  "AI/ML": "🤖",
  SaaS: "☁️",
  "E-Commerce": "🛒",
  Other: "💡",
};

const GRADIENTS = [
  "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.15))",
  "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(99,102,241,0.15))",
  "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(236,72,153,0.15))",
  "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(99,102,241,0.15))",
  "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(16,185,129,0.15))",
];

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const [showIframe, setShowIframe] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const icon = CATEGORY_ICONS[project.category] ?? "💡";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 bg-white/60 dark:bg-white/5"
    >
      {/* Preview */}
      {showIframe && project.iframeUrl ? (
        <div className="relative">
          <iframe
            src={project.iframeUrl}
            className="w-full h-48 border-none"
            title={project.title}
            sandbox="allow-scripts allow-same-origin"
          />
          <button
            onClick={() => setShowIframe(false)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-sm flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className="h-44 flex items-center justify-center relative cursor-pointer group"
          style={{ background: gradient }}
          onClick={() => project.iframeUrl && setShowIframe(true)}
        >
          <div className="text-6xl">{icon}</div>
          {project.iframeUrl && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-white text-sm font-semibold flex items-center gap-2">
                <ExternalLink size={14} /> Preview
              </div>
            </div>
          )}
          {/* Category Badge */}
          <div
            className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: "rgba(99,102,241,0.8)" }}
          >
            {project.category}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {project.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getPortfolioProjects()
      .then((data) => {
        setProjects(data.length > 0 ? data : DEMO_PROJECTS);
      })
      .catch(() => {
        setProjects(DEMO_PROJECTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <AppShell requireAuth={false}>
      <div className="px-3 pt-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            🖼️ Our Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {projects.length} projects · Showcasing our best work
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "text-white"
                  : "text-slate-400 dark:text-slate-500 bg-white/5 border border-white/10"
              }`}
              style={
                activeCategory === cat
                  ? { background: "linear-gradient(135deg, #6366f1, #ec4899)" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl shimmer bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <GlassCard className="mt-5 p-5 text-center" gradient animate={false}>
          <p className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Want something like this?
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Let&apos;s build your dream project together.
          </p>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            🚀 Start a Project
          </a>
        </GlassCard>

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
