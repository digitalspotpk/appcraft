"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAppConfig, type AppConfig } from "@/lib/firestore";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MaintenanceScreen from "@/components/ui/MaintenanceScreen";
import AlertBanner from "@/components/ui/AlertBanner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion } from "framer-motion";

interface AppShellProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AppShell({
  children,
  requireAuth = true,
}: AppShellProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAppConfig()
      .then((cfg) => {
        if (mounted) setConfig(cfg);
      })
      .catch(() => {
        // Firebase may not be configured in demo — use defaults
        if (mounted) {
          setConfig({
            appName: "AppCraft by DigitalSpot",
            maintenanceMode: false,
            globalAlertText:
              "🎉 JazzCash & EasyPaisa payments now available for all clients!",
            whatsappNumber: "+923001234567",
            currency: "USD",
          });
        }
      })
      .finally(() => {
        if (mounted) setConfigLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, requireAuth, router]);

  if (loading || (configLoading && requireAuth)) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "#0f0f1a" }}
      >
        <LoadingSpinner size="lg" text="Loading AppCraft..." />
      </div>
    );
  }

  if (requireAuth && !user) return null;

  // Maintenance Mode (non-admins only)
  if (config?.maintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: "var(--bg)" }}
    >
      {/* Mobile App Shell */}
      <div className="app-shell">
        <AppHeader />

        {/* Alert Banner */}
        {config?.globalAlertText && (
          <AlertBanner text={config.globalAlertText} />
        )}

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* WhatsApp FAB */}
        <WhatsAppButton phone={config?.whatsappNumber} />
      </div>
    </div>
  );
}
