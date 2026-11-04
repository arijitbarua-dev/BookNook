import Link from "next/link"
import Image from "next/image"
import { Home, BookOpen, ArrowLeft, Search, Sparkles } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - Page Not Found | BookNook",
  description: "The page you are looking for does not exist on BookNook online library.",
}

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/15 via-[#A9D2F5]/20 to-transparent blur-3xl dark:from-[#3155C8]/15 dark:via-[#152244]/40" />

      <div className="mx-auto max-w-lg">
        {/* Animated Badge & Logo */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-4 py-1.5 text-xs font-bold text-[#3155C8] shadow-xs dark:border-[#24345E] dark:bg-[#152244] dark:text-[#93C5FD]">
          <Sparkles className="size-3.5 text-[#3985F5]" />
          <span>Error 404</span>
        </div>

        {/* 404 Illustration / Graphic */}
        <div className="relative my-8 flex items-center justify-center">
          <span className="font-heading text-8xl sm:text-9xl font-black tracking-tight text-[#E2ECF6] select-none dark:text-[#1E2E56]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl border-2 border-[#DCE9F5] bg-white shadow-xl dark:border-[#24345E] dark:bg-[#0B132B]">
              <BookOpen className="size-12 sm:size-14 text-[#3985F5]" />
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#243B73] dark:text-white">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm font-medium text-[#60718B] sm:text-base dark:text-[#94A3B8] leading-relaxed">
          Oops! The page or bookshelf you are looking for has been moved, archived, or does not exist.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}