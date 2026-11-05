"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import {
  BookMarked,
  Calendar,
  Clock,
  RotateCcw,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Library,
  LogIn,
  Loader2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import { useSession, getAuthToken } from "@/lib/auth-client"

export interface BorrowRecord {
  _id: string
  bookId: string
  bookTitle: string
  bookImage?: string
  userName: string
  userEmail: string
  borrowDate: string
  returnDate: string
  createdAt?: string
}

export function MyBorrowsView() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [currentUser, setCurrentUser] = React.useState<{ name: string; email: string } | null>(null)
  const [borrows, setBorrows] = React.useState<BorrowRecord[]>([])
  const [loading, setLoading] = React.useState(true)

  // Return modal state
  const [returningBorrow, setReturningBorrow] = React.useState<BorrowRecord | null>(null)
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false)
  const [isReturning, setIsReturning] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsReturnModalOpen(false)
        setReturningBorrow(null)
      }
    }
    if (isReturnModalOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isReturnModalOpen])

  // Sync user state from Better Auth session or local storage
  React.useEffect(() => {
    const updateUser = () => {
      let email = session?.user?.email
      let name = session?.user?.name

      if (!email) {
        try {
          const stored = localStorage.getItem("booknook-user")
          if (stored) {
            const parsed = JSON.parse(stored)
            email = parsed.email
            name = parsed.name
          }
        } catch {}
      }

      if (email) {
        setCurrentUser({ name: name || "Member", email })
      } else if (!sessionLoading) {
        setCurrentUser(null)
        setLoading(false)
      }
    }

    updateUser()
    window.addEventListener("storage", updateUser)
    return () => window.removeEventListener("storage", updateUser)
  }, [session, sessionLoading])

  // Fetch borrows for current user
  const fetchMyBorrows = React.useCallback(async (userEmail: string) => {
    setLoading(true)
    let fetchedBorrows: BorrowRecord[] = []

    // 1. Fetch from server API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`${apiUrl}/borrows?userEmail=${encodeURIComponent(userEmail)}`, {
        cache: "no-store",
        headers,
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          fetchedBorrows = data
        }
      }
    } catch (err) {
      console.warn("Backend borrows endpoint not reachable, checking local cache:", err)
    }

    // 2. Merge with locally cached borrows
    try {
      const localBorrows = JSON.parse(localStorage.getItem("booknook-borrows") || "[]")
      const localUserBorrows = localBorrows.filter(
        (b: any) => b.userEmail?.toLowerCase() === userEmail.toLowerCase()
      )

      const existingIds = new Set(fetchedBorrows.map((b) => b._id || b.bookId))
      for (const lb of localUserBorrows) {
        if (!existingIds.has(lb._id || lb.bookId)) {
          fetchedBorrows.unshift(lb)
        }
      }
    } catch {
      // Ignore
    }

    setBorrows(fetchedBorrows)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    if (currentUser?.email) {
      fetchMyBorrows(currentUser.email)
    } else {
      setLoading(false)
    }
  }, [currentUser, fetchMyBorrows])

  // Return book handler
  const handleConfirmReturn = async () => {
    if (!returningBorrow) return
    setIsReturning(true)
    const toastId = toast.loading(`Returning "${returningBorrow.bookTitle}"...`)

    const borrowId = returningBorrow._id

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`${apiUrl}/borrows/${borrowId}`, {
        method: "DELETE",
        headers,
      })

      if (!res.ok) {
        throw new Error("Failed to return book on server.")
      }

      // Update local storage
      try {
        const localBorrows = JSON.parse(localStorage.getItem("booknook-borrows") || "[]")
        const filtered = localBorrows.filter((b: any) => b._id !== borrowId && b.bookId !== returningBorrow.bookId)
        localStorage.setItem("booknook-borrows", JSON.stringify(filtered))
        window.dispatchEvent(new Event("storage"))

        // Increment copy in local book cache
        const localBooks = JSON.parse(localStorage.getItem("booknook-books") || "[]")
        const updatedBooks = localBooks.map((b: any) =>
          b._id === returningBorrow.bookId || b.id === returningBorrow.bookId
            ? { ...b, availableCopies: (b.availableCopies ?? 0) + 1 }
            : b
        )
        localStorage.setItem("booknook-books", JSON.stringify(updatedBooks))
      } catch {
        // Ignore
      }

      setBorrows((prev) => prev.filter((b) => b._id !== borrowId))
      toast.success(`You returned "${returningBorrow.bookTitle}". Thank you!`, { id: toastId })
      setIsReturnModalOpen(false)
      setReturningBorrow(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to return book.", { id: toastId })
    } finally {
      setIsReturning(false)
    }
  }

  // Calculate remaining days & status
  const getDueStatus = (returnDateStr: string) => {
    const returnDate = new Date(returnDateStr)
    const now = new Date()
    const diffTime = returnDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"}`,
        type: "overdue" as const,
        badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/50",
        icon: AlertTriangle,
      }
    } else if (diffDays <= 3) {
      return {
        label: diffDays === 0 ? "Due Today" : `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
        type: "due-soon" as const,
        badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
        icon: Clock,
      }
    } else {
      return {
        label: `${diffDays} days remaining`,
        type: "on-track" as const,
        badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
        icon: CheckCircle2,
      }
    }
  }

  // Summary stats
  const totalBorrowsCount = borrows.length
  const maxBorrowLimit = 5
  const remainingSlots = Math.max(0, maxBorrowLimit - totalBorrowsCount)
  const dueSoonCount = borrows.filter((b) => {
    const diff = new Date(b.returnDate).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days <= 3
  }).length

  // Unauthenticated Callout
  if (!sessionLoading && !currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#DCE9F5] bg-white shadow-lg dark:border-[#24345E] dark:bg-[#152244]">
          <BookMarked className="size-10 text-[#3155C8] dark:text-[#93C5FD]" />
        </div>

        <h2 className="mt-6 font-heading text-2xl font-black text-[#243B73] dark:text-white sm:text-3xl">
          Sign In to View Your Borrows
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#60718B] dark:text-[#94A3B8]">
          Please log in with your BookNook reader account to check your active borrows, return dates, and renewal privileges.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login?callbackUrl=/my-borrows"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#243B73] dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <LogIn className="size-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            href="/register?callbackUrl=/my-borrows"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE9F5] bg-white px-6 py-3 text-xs font-bold text-[#243B73] shadow-xs hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#152244] dark:text-[#93C5FD]"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full py-10 sm:py-14 lg:py-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-96 w-[750px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title & CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4FC] px-3 py-1 text-xs font-bold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
              <Sparkles className="size-3 text-[#3985F5]" />
              <span>Reader Circulation</span>
            </div>
            <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
              My Borrowed Books
            </h1>
            <p className="mt-1 text-sm text-[#60718B] dark:text-[#94A3B8]">
              Track books currently checked out to your account ({currentUser?.email}).
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3155C8] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <BookOpen className="size-4" />
            <span>Explore More Books</span>
          </Link>
        </div>

        {/* Top Stats Banner */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#DCE9F5] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#131E3A]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Active Borrowings
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-3xl font-black text-[#243B73] dark:text-white">
                {totalBorrowsCount}
              </span>
              <BookMarked className="size-5 text-[#3985F5]" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#DCE9F5] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#131E3A]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Due Soon / Overdue
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`font-heading text-3xl font-black ${dueSoonCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-[#243B73] dark:text-white"}`}>
                {dueSoonCount}
              </span>
              <Clock className="size-5 text-amber-500" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#DCE9F5] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#131E3A]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Available Borrow Limit
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {remainingSlots} of {maxBorrowLimit}
              </span>
              <ShieldCheck className="size-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Borrow Content */}
        <div className="mt-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EBF4FC] border-t-[#3155C8]" />
              <p className="mt-4 text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
                Loading your borrowed books...
              </p>
            </div>
          ) : borrows.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-[#DCE9F5] bg-white/70 p-12 text-center backdrop-blur-xs dark:border-[#24345E] dark:bg-[#152244]/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <BookMarked className="size-8" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-[#243B73] dark:text-white">
                No Active Borrows
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-[#60718B] dark:text-[#94A3B8]">
                You currently have no books checked out from the library. Browse our catalog and start reading today!
              </p>
              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73] dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
              >
                <span>Browse Library Catalog</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            /* Borrowed Books Table */
            <div className="overflow-hidden rounded-3xl border border-[#DCE9F5] bg-white shadow-sm dark:border-[#24345E] dark:bg-[#131E3A]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#DCE9F5] bg-[#F4F9FE] text-xs font-bold uppercase tracking-wider text-[#60718B] dark:border-[#24345E] dark:bg-[#152244]/80 dark:text-[#94A3B8]">
                      <th scope="col" className="py-4 pl-6 pr-3 w-24">
                        Image
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Title
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Borrow Date
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Return Date
                      </th>
                      <th scope="col" className="py-4 pl-3 pr-6 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF2FA] text-sm dark:divide-[#24345E]/60">
                    {borrows.map((borrow) => {
                      const borrowId = borrow._id
                      const bookId = borrow.bookId
                      const status = getDueStatus(borrow.returnDate)
                      const StatusIcon = status.icon

                      const formattedBorrowDate = new Date(borrow.borrowDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })

                      const formattedReturnDate = new Date(borrow.returnDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })

                      return (
                        <tr
                          key={borrowId}
                          className="group transition-colors hover:bg-[#F8FBFE] dark:hover:bg-[#1E2E56]/40"
                        >
                          {/* Image */}
                          <td className="py-4 pl-6 pr-3 align-middle">
                            <Link href={`/books/${bookId}`} className="block">
                              <div className="relative h-20 w-14 overflow-hidden rounded-xl border border-[#DCE9F5] bg-[#F1F6FB] shadow-2xs transition-transform duration-200 group-hover:scale-105 dark:border-[#24345E] dark:bg-[#0B132B]">
                                {borrow.bookImage ? (
                                  <Image
                                    src={borrow.bookImage}
                                    alt={borrow.bookTitle}
                                    fill
                                    sizes="56px"
                                    className="h-full w-full object-cover"
                                    unoptimized={borrow.bookImage?.startsWith("http")}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                                    <BookOpen className="size-6" />
                                  </div>
                                )}
                              </div>
                            </Link>
                          </td>

                          {/* Title */}
                          <td className="px-4 py-4 align-middle">
                            <div className="flex flex-col">
                              <Link
                                href={`/books/${bookId}`}
                                className="font-heading text-base font-bold text-[#243B73] transition-colors hover:text-[#3155C8] dark:text-white dark:hover:text-[#93C5FD]"
                              >
                                {borrow.bookTitle}
                              </Link>
                              <span className="mt-1 flex items-center gap-1.5 text-xs text-[#60718B] dark:text-[#94A3B8]">
                                <Library className="size-3 text-[#3985F5]" />
                                <span>Borrow ID: <span className="font-mono text-[11px] font-semibold">{borrowId.slice(-6)}</span></span>
                              </span>
                            </div>
                          </td>

                          {/* Borrow Date */}
                          <td className="px-4 py-4 align-middle">
                            <div className="inline-flex items-center gap-2 rounded-xl bg-[#F8FAFD] border border-[#DCE9F5] px-3 py-1.5 text-xs font-semibold text-[#243B73] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-slate-200">
                              <Calendar className="size-3.5 text-[#3985F5]" />
                              <span>{formattedBorrowDate}</span>
                            </div>
                          </td>

                          {/* Return Date */}
                          <td className="px-4 py-4 align-middle">
                            <div className="flex flex-col items-start gap-1.5">
                              {/* <div className="inline-flex items-center gap-2 rounded-xl bg-[#F8FAFD] border border-[#DCE9F5] px-3 py-1.5 text-xs font-semibold text-[#243B73] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-slate-200">
                                <Clock className="size-3.5 text-[#3985F5]" />
                                <span>{formattedReturnDate}</span>
                              </div> */}
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-2xs ${status.badgeClass}`}
                              >
                                <StatusIcon className="size-3" />
                                <span>{status.label}</span>
                              </span>
                            </div>
                          </td>

                          {/* Return Book Button */}
                          <td className="py-4 pl-3 pr-6 text-right align-middle">
                            <button
                              type="button"
                              onClick={() => {
                                setReturningBorrow(borrow)
                                setIsReturnModalOpen(true)
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 shadow-2xs transition-all hover:bg-rose-600 hover:text-white active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                            >
                              <RotateCcw className="size-3.5" />
                              <span>Return Book</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Confirmation Modal via Portal */}
      {isReturnModalOpen && returningBorrow && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            if (!isReturning) {
              setIsReturnModalOpen(false)
              setReturningBorrow(null)
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-[#DCE9F5] bg-white p-6 shadow-2xl dark:border-[#24345E] dark:bg-[#152244] sm:p-7 animate-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <RotateCcw className="size-7" />
              </div>

              <h3 className="mt-4 font-heading text-lg font-bold text-[#243B73] dark:text-white">
                Return This Book?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#60718B] dark:text-[#94A3B8]">
                Are you ready to return <strong className="text-[#243B73] dark:text-white">&quot;{returningBorrow.bookTitle}&quot;</strong>? This will release the book back to the community library catalog so other readers can enjoy it.
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsReturnModalOpen(false)
                    setReturningBorrow(null)
                  }}
                  disabled={isReturning}
                  className="flex-1 rounded-2xl border border-[#DCE9F5] py-2.5 text-xs font-bold text-[#60718B] hover:bg-[#EBF4FC] hover:text-[#243B73] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white transition-colors"
                >
                  Keep Reading
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  disabled={isReturning}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#3155C8] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73] disabled:opacity-60 dark:bg-[#3985F5] dark:hover:bg-[#3155C8] transition-colors"
                >
                  {isReturning ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Returning...</span>
                    </>
                  ) : (
                    <span>Confirm Return</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}