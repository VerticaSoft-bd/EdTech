import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

import SiteSettings from "@/models/SiteSettings";
import connectDB from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne();
    const siteTitle = settings?.siteTitle || "Youthins";
    return {
      title: {
        template: `%s | ${siteTitle}`,
        default: siteTitle,
      },
      description: settings?.siteTagline || "The best platform for learning and education",
      icons: {
        icon: settings?.favicon || "/favicon.ico",
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Youthins",
      description: "The best platform for learning and education",
    };
  }
}

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body
        className={`${hindSiliguri.className} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
