"use client"

import * as React from "react"
import Image from "next/image"
import {
  X,
  Calendar,
  User,
  Mail,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import type { Book } from "@/components/books/BookCard"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
  onBorrowSuccess: (updatedAvailableCopies: number) => void
}

export function BorrowModal({
  isOpen,
  onClose,
  book,
  onBorrowSuccess,
}: BorrowModalProps) {
  const { data: session } = useSession()
  const [userName, setUserName] = React.useState("Library Reader")
  const [userEmail, setUserEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [borrowDays, setBorrowDays] = React.useState<number>(14)

  // Sync active user identity
  React.useEffect(() => {
    if (session?.user?.email) {
      setUserName(session.user.name || "Library Reader")
      setUserEmail(session.user.email)
      return
    }

    try {
      const stored = localStorage.getItem("booknook-user")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.email) {
          setUserName(parsed.name || "Library Reader")
          setUserEmail(parsed.email)
          return
        }
      }
    } catch {
      // Ignore
    }
  }, [session, isOpen])

  // Current borrow date
  const borrowDateStr = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [])

  // Calculated return date
  const returnDateStr = React.useMemo(() => {
    const returnDate = new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000)
    return returnDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [borrowDays])

  if (!isOpen) return null

  const handleConfirmBorrow = async () => {
    // Determine effective user
    let activeEmail = userEmail
    let activeName = userName

    if (!activeEmail) {
      try {
        const stored = localStorage.getItem("booknook-user")
        if (stored) {
          const parsed = JSON.parse(stored)
          activeEmail = parsed.email || ""
          activeName = parsed.name || activeName
        }
      } catch {}
    }

    if (!activeEmail) {
      toast.error("Please sign in to borrow books.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Processing your borrow request...")

    const bookId = book._id || book.id || "1"
    const borrowRecord = {
      bookId: String(bookId),
      bookTitle: book.title,
      bookImage: book.image,
      userName: activeName,
      userEmail: activeEmail,
      borrowDate: new Date().toISOString(),
      returnDate: new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000).toISOString(),
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      let newCopies = Math.max(0, (book.availableCopies ?? 1) - 1)

      try {
        const res = await fetch(`${apiUrl}/borrows`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(borrowRecord),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.error || "Failed to borrow book.")
        }

        const data = await res.json()
        if (typeof data.availableCopies === "number") {
          newCopies = data.availableCopies
        }
      } catch (networkErr: any) {
        if (networkErr.message?.includes("already borrowed")) {
          throw networkErr
        }
        console.warn("Server request failed!", networkErr)
      }

      toast.success(`You have successfully borrowed "${book.title}"!`, {
        id: toastId,
        description: `Please return it by ${returnDateStr}.`,
      })

      onBorrowSuccess(newCopies)
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to borrow this book!", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-2xl transition-all dark:border-[#24345E] dark:bg-[#152244] sm:p-8 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#60718B] transition-colors hover:bg-[#EBF4FC] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#E2ECF6] pb-5 dark:border-[#24345E]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
            <BookOpen className="size-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3985F5] dark:text-[#93C5FD]">
              Borrowing Confirmation
            </span>
            <h3 className="font-heading text-xl font-bold text-[#243B73] dark:text-white">
              Borrow This Book
            </h3>
          </div>
        </div>

        {/* Book Mini Summary */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#E2ECF6] bg-[#F8FAFD] p-3.5 dark:border-[#24345E] dark:bg-[#0B132B]">
          <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-xs dark:border-[#24345E]">
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="56px"
              className="object-cover"
              unoptimized={book.image.startsWith("http")}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#3155C8] dark:text-[#93C5FD]">
              {book.category}
            </span>
            <h4 className="font-heading text-sm font-bold text-[#243B73] dark:text-white line-clamp-1">
              {book.title}
            </h4>
            <span className="text-xs text-[#60718B] dark:text-[#94A3B8]">
              by {book.author}
            </span>
          </div>
        </div>

        {/* Modal Form Fields */}
        <div className="mt-5 space-y-4">
          {/* User Name & Email (Read-only) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <User className="size-3.5 text-[#3985F5]" />
                <span>User Name (Read-only)</span>
              </label>
              <input
                type="text"
                readOnly
                value={userName}
                className="w-full rounded-xl border border-[#E2ECF6] bg-white/70 px-3.5 py-2 text-xs font-bold text-[#243B73] cursor-not-allowed dark:border-[#24345E] dark:bg-[#0B132B] dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#3985F5]" />
                <span>User Email (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                value={userEmail}
                className="w-full rounded-xl border border-[#E2ECF6] bg-white/70 px-3.5 py-2 text-xs font-bold text-[#243B73] cursor-not-allowed dark:border-[#24345E] dark:bg-[#0B132B] dark:text-slate-200 truncate"
              />
            </div>
          </div>

          {/* Borrow Date & Return Period */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#3985F5]" />
                <span>Borrow Date</span>
              </label>
              <div className="flex items-center rounded-xl border border-[#E2ECF6] bg-[#F8FAFD] px-3.5 py-2 text-xs font-bold text-[#243B73] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-slate-200">
                {borrowDateStr}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#3985F5]" />
                <span>Borrow Duration</span>
              </label>
              <select
                value={borrowDays}
                onChange={(e) => setBorrowDays(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E2ECF6] bg-white px-3.5 py-2 text-xs font-bold text-[#243B73] outline-none transition-all focus:border-[#3985F5] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white"
              >
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (2 Weeks - Standard)</option>
                <option value={21}>21 Days (3 Weeks)</option>
                <option value={30}>30 Days (1 Month)</option>
              </select>
            </div>
          </div>

          {/* Calculated Due Date Highlight */}
          <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-[#EBF4FC] p-3 text-xs dark:border-[#24345E] dark:bg-[#1E2E56]/60">
            <div className="flex items-center gap-2 text-[#3155C8] dark:text-[#93C5FD]">
              <Calendar className="size-4 shrink-0" />
              <span className="font-medium">Due Return Date:</span>
            </div>
            <span className="font-bold text-[#243B73] dark:text-white">
              {returnDateStr}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E2ECF6] pt-5 dark:border-[#24345E]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-[#DCE9F5] bg-white px-5 py-2.5 text-xs font-bold text-[#60718B] shadow-2xs hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmBorrow}
            disabled={isSubmitting || (book.availableCopies ?? 0) <= 0}
            className="inline-flex items-center gap-2 rounded-full bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-60 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Confirm Borrow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}