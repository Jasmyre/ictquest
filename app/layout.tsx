import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import Layout from './components/layout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.BASE_URL ?? "err:Environment_'BASE_URL'_Variable_Is_Not_Defined";

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
  openGraph: {
    title: "ICTQuest | Master HTML",
    url: new URL(BASE_URL),
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Thumbnail image for " + BASE_URL,
      },
    ],
  },
  other: {
    "google-site-verification": GOOGLE_SITE_VERIFICATION,
  },
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//         >
//           <Layout>
//           {children}
//           </Layout>
//         </ThemeProvider>
//         <Analytics />
//       </body>
//     </html>
//   );
// }
