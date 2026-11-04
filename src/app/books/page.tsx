import * as React from "react"
import { Metadata } from "next"
import { AllBooksView } from "@/components/books/AllBooksView"

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse the complete collection of library books, categories, and authors on BookNook.",
}

export default function BooksPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen py-24 flex flex-col items-center justify-center">
          <div className="size-14 animate-spin rounded-full border-4 border-[#DCE9F5] border-t-[#3155C8] dark:border-[#24345E] dark:border-t-[#3985F5]" />
          <p className="mt-4 text-sm font-semibold text-[#60718B] dark:text-[#94A3B8]">
            Loading All Books...
          </p>
        </div>
      }
    >
      <AllBooksView />
    </React.Suspense>
  )
}