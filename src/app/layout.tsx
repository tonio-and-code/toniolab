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
  title: "toniolab - English + Vibe Coding",
  description: "ネイティブ英語を構造分析して学習システムを作った。まだ喋れない。",
  openGraph: {
    title: "toniolab",
    description: "ネイティブ英語を構造分析して学習システムを作った。まだ喋れない。",
    url: "https://toniolab.com",
    siteName: "toniolab",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "toniolab",
    description: "ネイティブ英語を構造分析して学習システムを作った。まだ喋れない。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
