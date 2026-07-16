"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "./BottomNav";
import WhatsAppFAB from "./WhatsAppFAB";
import SplashScreen from "./SplashScreen";
import MaintenanceScreen from "./MaintenanceScreen";
import { getSystemConfig } from "@/lib/firestore-helpers";
import type { SystemConfig } from "@/types";

const DEFAULT_CONFIG: SystemConfig = {
  appName: "AppCraft by DigitalSpot",
  maintenanceMode: false,
  maintenanceMessage: "We are upgrading our systems. Back shortly!",
  maintenanceEta: "2 hours",
  alertBannerActive: true,
  alertBannerMessage: "🚀 Welcome to AppCraft! Track your orders in real-time.",
  alertBannerType: "info",
  whatsappNumber: "923001234567",
  pushNotificationsEnabled: true,
  loyaltyPointsRate: 10,
  currency: "USD",
  updatedAt: new Date().toISOString(),
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/signup"];
  const isPublic = publicRoutes.includes(pathname);

  // Auth redirect
  useEffect(() => {
    if (!loading) {
      if (!user && !isPublic) {
        router.replace("/login");
      }
    }
  }, [user, loading, isPublic, router]);

  // Config fetch
  useEffect(() => {
    getSystemConfig().then(setConfig).catch(() => {});
  }, []);

  // Splash screen only on first visit
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3300);
    return () => clearTimeout(timer);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
            ⚡
          </div>
          <p className="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen />}

      {/* Maintenance mode for non-admins */}
      {config.maintenanceMode && !isAdmin && !isPublic && (
        <MaintenanceScreen config={config} />
      )}

      <div className="app-shell">
        {children}
      </div>

      {/* Bottom Nav — only for authenticated, non-public routes */}
      {user && !isPublic && (
        <>
          <BottomNav />
          <WhatsAppFAB number={config.whatsappNumber} />
        </>
      )}
    </>
  );
}
