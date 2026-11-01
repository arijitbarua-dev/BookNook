import type { Metadata } from "next"
import Link from "next/link"
import { BookPlus, ChevronLeft, Sparkles, BookOpen } from "lucide-react"
import { BookForm } from "@/components/books/BookForm"

export const metadata: Metadata = {
  title: "Add Book",
  description: "Contribute a new book to the BookNook community library collection.",
}

export default function AddBookPage() {
  return (
    <div className="relative w-full py-10 sm:py-14 lg:py-18">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60718B] transition-colors hover:text-[#3155C8] dark:text-[#94A3B8] dark:hover:text-[#93C5FD]"
          >
            <ChevronLeft className="size-4" />
            <span>Back to All Books</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FC] px-3 py-1 text-xs font-bold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
            <Sparkles className="size-3 text-[#3985F5]" />
            <span>Community Contribution</span>
          </span>
        </div>

        {/* Form Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#24345E] dark:bg-[#152244] sm:p-10 lg:p-12">
          {/* Header */}
          <div className="mb-8 border-b border-[#E2ECF6] pb-6 dark:border-[#24345E]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] shadow-xs dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <BookPlus className="size-6" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-black tracking-tight text-[#243B73] sm:text-3xl dark:text-white">
                  Add a New Book
                </h1>
                <p className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8] sm:text-sm mt-0.5">
                  Share a book from your collection with fellow readers in the BookNook community.
                </p>
              </div>
            </div>
          </div>

          {/* Add Book Form with ImgBB upload */}
          <BookForm />
        </div>
      </div>
    </div>
  )
}

