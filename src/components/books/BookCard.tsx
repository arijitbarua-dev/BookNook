"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, User, ArrowRight, Sparkles } from "lucide-react"

export interface Book {
  _id?: string
  id?: string
  title: string
  author: string
  category: string
  image: string
  description?: string
  totalCopies?: number
  availableCopies?: number
  addedBy?: string
  addedByEmail?: string
  createdAt?: string
}

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const bookId = book._id || book.id || "1"
  const isAvailable = (book.availableCopies ?? 1) > 0

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#3985F5] hover:shadow-xl dark:border-[#24345E] dark:bg-[#152244] dark:hover:border-[#3985F5]">
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F1F6FB] dark:bg-[#0B132B]">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={book.image.startsWith("http")}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#60718B] dark:text-[#94A3B8]">
            <BookOpen className="size-10 text-[#3985F5]/40 mb-2" />
            <span className="text-xs font-semibold">No Cover Available</span>
          </div>
        )}

        {/* Category Badge overlay on top-left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#3155C8] shadow-xs backdrop-blur-md dark:bg-[#0B132B]/90 dark:text-[#93C5FD]">
            <Sparkles className="size-2.5 text-[#3985F5]" />
            <span>{book.category}</span>
          </span>
        </div>

        {/* Availability Badge on top-right */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md ${
              isAvailable
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {isAvailable ? `${book.availableCopies ?? 1} Available` : "Not Available"}
          </span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <h3
            title={book.title}
            className="font-heading text-base font-bold text-[#243B73] transition-colors group-hover:text-[#3155C8] dark:text-white dark:group-hover:text-[#93C5FD] line-clamp-1"
          >
            {book.title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#60718B] dark:text-[#94A3B8] line-clamp-1">
            <User className="size-3.5 text-[#3985F5] shrink-0" />
            <span>by {book.author}</span>
          </p>

          {book.description && (
            <p className="mt-2 text-xs leading-relaxed text-[#60718B] dark:text-[#94A3B8] line-clamp-2">
              {book.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-[#E2ECF6] dark:border-[#24345E]/80">
          <Link
            href={`/books/${bookId}`}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#EBF4FC] py-2.5 text-xs font-bold text-[#3155C8] transition-all duration-200 hover:bg-[#3155C8] hover:text-white active:scale-98 dark:bg-[#1E2E56] dark:text-[#93C5FD] dark:hover:bg-[#3985F5] dark:hover:text-white"
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}