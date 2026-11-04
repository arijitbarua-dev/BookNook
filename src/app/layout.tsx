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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("booknook-theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&p)){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#EAF3FC] dark:bg-[#0B132B] text-[#243B73] dark:text-[#F8FAFC]"
      >
        <ThemeProvider>
          <React.Suspense fallback={<header className="sticky top-0 z-50 h-20 w-full border-b border-[#DCE9F5]/70 bg-[#EAF3FC]/90 backdrop-blur-md dark:border-[#24345E] dark:bg-[#0B132B]/90" />}>
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