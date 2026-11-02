"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, BookOpen, Layers } from "lucide-react"
import { BookCard, type Book } from "@/components/books/BookCard"


export function NewArrivals() {
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}/new-arrivals`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setBooks(data)
            return
          }
        }
      } catch (err) {
        console.warn("Could not reach backend /new-arrivals, checking local storage cache:", err)
      }
    }

    fetchNewArrivals().finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-[#DDF0FF]/30 blur-3xl dark:bg-[#152244]/20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
            <Sparkles className="size-3.5 text-[#3985F5]" />
            <span>New Arrivals</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
            Fresh From the Bookshelf
          </h2>

          <p className="mt-3 text-sm font-medium text-[#60718B] sm:text-base dark:text-[#94A3B8]">
            Explore the newest additions to our growing collection.
          </p>
        </div>

        {/* Responsive Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? /* Skeleton Loading State */
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col h-[420px] rounded-3xl border border-[#E2ECF6] bg-white p-4 shadow-xs dark:border-[#24345E] dark:bg-[#152244] animate-pulse"
                >
                  <div className="aspect-[3/4] w-full rounded-2xl bg-[#EBF4FC] dark:bg-[#1E2E56]" />
                  <div className="mt-4 space-y-2">
                    <div className="h-5 w-3/4 rounded-lg bg-[#EBF4FC] dark:bg-[#1E2E56]" />
                    <div className="h-3 w-1/2 rounded-md bg-[#EBF4FC] dark:bg-[#1E2E56]" />
                    <div className="h-3 w-5/6 rounded-md bg-[#EBF4FC] dark:bg-[#1E2E56]" />
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="h-9 w-full rounded-xl bg-[#EBF4FC] dark:bg-[#1E2E56]" />
                  </div>
                </div>
              ))
            : books.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
        </div>

        {/* "See All Books" Button below grid */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/books"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#3155C8] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <span>See All Books</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals