import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import SessionWrapper from "@/components/Auth/SessionWrapper";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/Layout/ScrollToTop";

export const metadata: Metadata = {
  title: "BandGrowth",
  description: "BandGrowth is a platform for IELTS practice and preparation.",
  icons: {
    icon: "/logo/BandGrowth_favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <SessionWrapper>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex min-h-screen flex-col`}
          suppressHydrationWarning
        >
          <ScrollToTop />
          <Navbar />
          <div className="flex-1 min-w-0 overflow-x-hidden">{children}</div>
          <Footer />
        </body>
      </SessionWrapper>
    </html>
  );
}
