import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SwProvider } from "../components/pwa/sw-provider";
import { ThemeProvider } from "../components/theme-provider";

import { Toaster } from "../components/ui/toaster";

import "@/styles/globals.css";
import { TRPCReactProvider } from "../trpc/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ??
  "err:Environment_'GOOGLE_SITE_VERIFICATION'_Variable_Is_Not_Defined";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  keywords: [
    "ict",
    "quest",
    "ict meaning",
    "ict protocol",
    "html",
    "html color picker",
    "html color codes",
    "html table",
    "what is html",
    "html button",
    "html code",
    "html tags",
    "what does html stand for",
    "html compiler",
    "ictquest",
    "ict quest",
    "master html",
    "information communication technology",
    "html meaning",
    "what is html",
    "w3schools html",
  ],
  title: {
    default: "ICTQuest | Master HTML",
    template: "%s | ICTQuest",
  },
  description: "ICTQuest. Master HTML from zero to hero",
  applicationName: "ICTQuest",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ICTQuest | Master HTML",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/pwa/apple-touch-icon.png",
  },
  openGraph: {
    title: "ICTQuest | Master HTML",
    url: new URL(BASE_URL),
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: `Thumbnail image for ${BASE_URL}`,
      },
    ],
  },
  other: {
    "google-site-verification": GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
};

/**
 * Thin root layout (ADR 0003): fonts, theme, and providers only. Per-group
 * shells own their chrome — `(marketing)` minimal, `(app)` full
 * nav-plus-footer — while `/auth/*` and `/maintenance` stay shell-less.
 *
 * PWA head tags (manifest, apple web-app, icons, theme color) are static so
 * they are cache-safe here; worker registration lives in the non-cached
 * client boundary `SwProvider` (Migration 16, #39 — full worker build in
 * #40).
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  "use cache";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <SwProvider swUrl="/serwist/sw.js">
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster />
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
          </TRPCReactProvider>
        </SwProvider>
      </body>
    </html>
  );
}
