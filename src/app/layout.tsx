import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import SplashScreen from "@/components/ui/SplashScreen";

export const metadata: Metadata = {
  title: "AppCraft by DigitalSpot",
  description:
    "All-in-one Agency Portal — Order Management, Client Dashboard & Financial System",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AppCraft",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Blocking theme script — prevents light/dark flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("appcraft-theme");if(t!=="light"){document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <SplashScreen />
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#1a1a2e",
                  color: "#f1f5f9",
                  borderRadius: "12px",
                  border: "1px solid rgba(99,102,241,0.3)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "13px",
                },
                success: {
                  iconTheme: { primary: "#6366f1", secondary: "white" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "white" },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
