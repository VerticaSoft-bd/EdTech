import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youthins",
  description: "The best platform for learning and education",
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
