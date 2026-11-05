"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  BookOpen,
  User,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  Share2,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { type Book } from "@/components/books/BookCard"
import { BorrowModal } from "@/components/books/BorrowModal"
import { useSession, getAuthToken } from "@/lib/auth-client"

interface BookDetailsViewProps {
  bookId: string
}

export function BookDetailsView({ bookId }: BookDetailsViewProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [book, setBook] = React.useState<Book | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isBorrowModalOpen, setIsBorrowModalOpen] = React.useState(false)
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = React.useState(false)

  // Fetch book details
  React.useEffect(() => {
    async function loadBook() {
      setLoading(true)

      // Try fetching from backend API
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}/books/${bookId}`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (data && (data._id || data.id)) {
            setBook(data)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn("Backend not accessible!", err)
      }

      setLoading(false)
    }

    loadBook()
  }, [bookId])

  // Check if current user has already borrowed this book (from local cache and server)
  const checkBorrowStatus = React.useCallback(async (userEmail: string, currentBookId: string) => {
    if (!userEmail || !currentBookId) return

    const normalizedEmail = userEmail.trim().toLowerCase()
    const targetBookId = String(currentBookId)

    // 1. Check local storage cache first
    try {
      const storedBorrows = JSON.parse(localStorage.getItem("booknook-borrows") || "[]")
      const localMatch = storedBorrows.some(
        (b: any) =>
          String(b.bookId) === targetBookId &&
          (!b.userEmail || b.userEmail.toLowerCase() === normalizedEmail)
      )
      if (localMatch) {
        setIsAlreadyBorrowed(true)
      }
    } catch {
      // Ignore
    }

    // 2. Fetch authoritative active borrows from backend API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`${apiUrl}/borrows?userEmail=${encodeURIComponent(normalizedEmail)}`, {
        cache: "no-store",
        headers,
      })

      if (res.ok) {
        const serverBorrows = await res.json()
        if (Array.isArray(serverBorrows)) {
          // Sync with localStorage
          try {
            localStorage.setItem("booknook-borrows", JSON.stringify(serverBorrows))
          } catch {}

          const hasActiveBorrow = serverBorrows.some(
            (b: any) => String(b.bookId) === targetBookId
          )
          setIsAlreadyBorrowed(hasActiveBorrow)
        }
      }
    } catch (err) {
      console.warn("Could not verify borrow status from backend:", err)
    }
  }, [])

  React.useEffect(() => {
    let email = session?.user?.email
    if (!email) {
      try {
        const stored = localStorage.getItem("booknook-user")
        if (stored) {
          email = JSON.parse(stored).email
        }
      } catch {}
    }

    if (email) {
      checkBorrowStatus(email, bookId)
    }

    const handleStorageChange = () => {
      let currentEmail = session?.user?.email
      if (!currentEmail) {
        try {
          const stored = localStorage.getItem("booknook-user")
          if (stored) currentEmail = JSON.parse(stored).email
        } catch {}
      }
      if (currentEmail) {
        checkBorrowStatus(currentEmail, bookId)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [session, bookId, checkBorrowStatus])

  const handleBorrowSuccess = (updatedCopies: number) => {
    setBook((prev) => (prev ? { ...prev, availableCopies: updatedCopies } : null))
    setIsAlreadyBorrowed(true)
    // Dispatch storage event so other components immediately know
    window.dispatchEvent(new Event("storage"))
  }

  const handleBorrowClick = () => {
    if (isAlreadyBorrowed) {
      toast.error("You cannot borrow the same book two times at the same time. Please return your active copy first.")
      return
    }
    if (!isAvailable) {
      toast.error("Sorry, this book is currently out of stock.")
      return
    }
    setIsBorrowModalOpen(true)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EBF4FC] border-t-[#3155C8]" />
          <p className="mt-4 text-sm font-semibold text-[#60718B] dark:text-[#94A3B8]">
            Loading book details...
          </p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#243B73] dark:text-white">
          Book Not Found
        </h2>
        <p className="mt-2 text-sm text-[#60718B] dark:text-[#94A3B8]">
          The book you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex rounded-full bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73]"
        >
          Back to All Books
        </Link>
      </div>
    )
  }

  const isAvailable = (book.availableCopies ?? 0) > 0
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Added"

  return (
    <div className="relative w-full py-10 sm:py-14 lg:py-18 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60718B] transition-colors hover:text-[#3155C8] dark:text-[#94A3B8] dark:hover:text-[#93C5FD]"
          >
            <ChevronLeft className="size-4" />
            <span>Back to All Books</span>
          </Link>

          <div className="flex items-center gap-2">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FC] px-3 py-1.5 text-xs font-bold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
              <Sparkles className="size-3 text-[#3985F5]" />
              <span>{book.category}</span>
            </span>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#24345E] dark:bg-[#152244] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Large Book Cover */}
            <div className="flex flex-col items-center lg:col-span-5">
              <div className="group relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border-2 border-white bg-[#F1F6FB] shadow-xl dark:border-[#24345E] dark:bg-[#0B132B]">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                  unoptimized={book.image?.startsWith("http")}
                />
              </div>

              {/* Status Pill beneath cover */}
              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-xs ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>{book.availableCopies} of {book.totalCopies ?? 1} Available</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3.5 text-rose-600" />
                      <span>Currently Out of Stock</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Right Column: Book Details & Borrow Action */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                {/* Category tag */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FC] px-3.5 py-1 text-xs font-bold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                  <Layers className="size-3" />
                  <span>{book.category}</span>
                </div>

                {/* Title */}
                <h1 className="mt-4 font-heading text-2xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
                  {book.title}
                </h1>

                {/* Author */}
                <div className="mt-2.5 flex items-center gap-2 text-sm font-semibold text-[#60718B] dark:text-[#94A3B8]">
                  <User className="size-4 text-[#3985F5]" />
                  <span>By <strong className="text-[#243B73] dark:text-white">{book.author}</strong></span>
                </div>

                {/* Copies Stats Row */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[#E2ECF6] bg-[#F8FAFD] p-4 dark:border-[#24345E] dark:bg-[#0B132B]">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
                      Total Copies
                    </span>
                    <span className="font-heading text-xl font-bold text-[#243B73] dark:text-white">
                      {book.totalCopies ?? 1}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
                      Available to Borrow
                    </span>
                    <span className={`font-heading text-xl font-bold ${isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                      {book.availableCopies ?? 0}
                    </span>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mt-6 space-y-2">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#243B73] dark:text-white">
                    About This Book
                  </h3>
                  <p className="text-sm leading-relaxed text-[#60718B] dark:text-[#94A3B8] whitespace-pre-line">
                    {book.description || "No detailed description provided for this book yet."}
                  </p>
                </div>

                {/* Contributor / Added By Information */}
                <div className="mt-8 rounded-2xl border border-[#E2ECF6] bg-white p-4 dark:border-[#24345E] dark:bg-[#152244]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#60718B] dark:text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      <User className="size-3.5 text-[#3985F5] shrink-0" />
                      <span>Added by: <strong className="text-[#243B73] dark:text-slate-200">{book.addedBy || "Community Member"}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-[#3985F5] shrink-0" />
                      <span className="truncate">Email: <strong className="text-[#243B73] dark:text-slate-200">{book.addedByEmail || "library@booknook.dev"}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Calendar className="size-3.5 text-[#3985F5] shrink-0" />
                      <span>Date Added: <strong className="text-[#243B73] dark:text-slate-200">{formattedDate}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area: Borrow & Browse */}
              <div className="mt-8 pt-6 border-t border-[#DCE9F5] dark:border-[#24345E] flex flex-col gap-4">
                {isAlreadyBorrowed && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/40">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          You currently have this book borrowed.
                        </p>
                        <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                          You cannot borrow the same book two times at the same time.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/my-borrows"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-amber-700 active:scale-95 dark:bg-amber-500 dark:text-black dark:hover:bg-amber-400 shrink-0"
                    >
                      <span>Return in My Borrows</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  {isAlreadyBorrowed ? (
                    <button
                      type="button"
                      onClick={handleBorrowClick}
                      className="inline-flex items-center gap-2.5 rounded-full bg-amber-600 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-700 active:scale-95 dark:bg-amber-500 dark:text-black dark:hover:bg-amber-400"
                    >
                      <BookmarkPlus className="size-4" />
                      <span>Borrow This Book</span>
                    </button>
                  ) : isAvailable ? (
                    <button
                      type="button"
                      onClick={handleBorrowClick}
                      className="inline-flex items-center gap-2.5 rounded-full bg-[#3155C8] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
                    >
                      <BookmarkPlus className="size-4" />
                      <span>Borrow This Book</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-full bg-slate-200 px-8 py-3.5 text-sm font-bold text-slate-500 shadow-none dark:bg-slate-800 dark:text-slate-400"
                    >
                      Not Available (Out of Stock)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {book && (
        <BorrowModal
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          book={book}
          onBorrowSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  )
}