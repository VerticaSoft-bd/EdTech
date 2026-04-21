import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <head>
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${hindSiliguri.className} antialiased`}
        suppressHydrationWarning
      >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Toaster 
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#1A1D1F',
              color: '#fff',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#4ADE80',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4C4C',
                secondary: '#fff',
              },
              duration: 4000,
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
