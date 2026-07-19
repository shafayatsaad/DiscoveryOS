// Purpose: Define the dark-only root layout, fonts, metadata, and global shell.

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DiscoveryOS | Autonomous Scientific Discovery",
  description:
    "DiscoveryOS is an autonomous scientific operating system for evidence-backed research workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
