import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AppCraft by DigitalSpot",
  description:
    "Professional mobile app development agency portal — order management, client portal, and portfolio showcase.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AppCraft by DigitalSpot",
    description: "Your premier software development agency portal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  maxWidth: "360px",
                  marginBottom: "100px",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
