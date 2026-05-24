import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "RootSense AI — Incident Root Cause Analyzer",
    template: "%s · RootSense AI",
  },
  description:
    "AI-powered incident root cause analysis, log intelligence, and predictive monitoring for modern DevOps and SRE teams.",
  keywords: [
    "incident management",
    "root cause analysis",
    "AI observability",
    "SRE",
    "DevOps",
    "log analysis",
    "anomaly detection",
  ],
  openGraph: {
    title: "RootSense AI",
    description: "AI Incident Root Cause Analyzer for modern engineering teams.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen scrollbar-thin">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            toastOptions={{
              classNames: {
                toast:
                  "glass !rounded-xl !border-border/60 !text-foreground",
                description: "!text-muted-foreground",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
