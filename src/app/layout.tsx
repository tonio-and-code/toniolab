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
  title: "English Quest RPG -- toniolab",
  description: "教科書のきれいな英語じゃない。ネイティブが本当に使うum, like, you knowだらけの英語を、RPGのクエストとして攻略する。",
  openGraph: {
    title: "English Quest RPG",
    description: "教科書のきれいな英語じゃない。ネイティブが本当に使うum, like, you knowだらけの英語を、RPGのクエストとして攻略する。",
    url: "https://toniolab.com",
    siteName: "toniolab",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Quest RPG",
    description: "教科書のきれいな英語じゃない。ネイティブが本当に使うum, like, you knowだらけの英語を、RPGのクエストとして攻略する。",
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
