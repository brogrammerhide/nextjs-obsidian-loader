import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Obsidian Loader — Digital Garden",
  description: "Load, parse, and explore Obsidian notes with bidirectional backlinks and interactive knowledge graphs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark scroll-smooth`}
      data-theme="midnight"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
