import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import * as React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | BookNook",
    default: "BookNook – A Small Online Library",
  },
  description:
    "Explore, borrow, and share knowledge with BookNook. A modern, minimalist online community library.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#F8FAFD] dark:bg-[#0B132B] text-[#243B73] dark:text-[#F8FAFC] transition-colors duration-300"
      >
        <ThemeProvider>
          <React.Suspense fallback={<header className="sticky top-0 z-50 h-20 w-full border-b border-[#E2ECF6] bg-white/80 backdrop-blur-md dark:border-[#1E293B] dark:bg-[#0B132B]/85" />}>
            <Navbar />
          </React.Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}