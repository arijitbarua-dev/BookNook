"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  PlusCircle,
  Pencil,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  BookPlus,
  LogIn,
  Library,
} from "lucide-react"
import { toast } from "sonner"
import { useSession, getAuthToken } from "@/lib/auth-client"
import type { Book } from "@/components/books/BookCard"
import { EditBookModal } from "@/components/books/EditBookModal"

export function MyBooksView() {
  const { data: session, isPending: sessionLoading } = useSession()
  const [currentUser, setCurrentUser] = React.useState<{ name: string; email: string } | null>(null)
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(true)

  // Edit and Delete Modal States
  const [editingBook, setEditingBook] = React.useState<Book | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [deletingBook, setDeletingBook] = React.useState<Book | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Sync user state from Better Auth session or local cache
  React.useEffect(() => {
    if (session?.user?.email) {
      setCurrentUser({
        name: session.user.name || "Member",
        email: session.user.email,
      })
      return
    }

    setCurrentUser(null)
  }, [session])

  // Fetch books added by current user
  const fetchMyBooks = React.useCallback(async (userEmail: string) => {
    setLoading(true)
    let fetchedBooks: Book[] = []

    // Fetch from server API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`${apiUrl}/books?addedByEmail=${encodeURIComponent(userEmail)}`, {
        cache: "no-store",
        headers,
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          fetchedBooks = data
        }
      }
    } catch (err) {
      console.warn("Backend not reachable for my-books, checking local storage:", err)
    }

    setBooks(fetchedBooks)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    if (currentUser?.email) {
      fetchMyBooks(currentUser.email)
    } else {
      setLoading(false)
    }
  }, [currentUser, fetchMyBooks])

  // Handle book update success
  const handleUpdateSuccess = (updatedBook: Book) => {
    const updatedId = updatedBook._id || updatedBook.id
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedId || b.id === updatedId ? updatedBook : b))
    )
  }

  // Handle book delete action
  const handleConfirmDelete = async () => {
    if (!deletingBook) return
    setIsDeleting(true)
    const toastId = toast.loading(`Deleting "${deletingBook.title}"...`)

    const bookId = deletingBook._id || deletingBook.id

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`${apiUrl}/books/${bookId}`, {
        method: "DELETE",
        headers,
      })

      if (!res.ok) {
        throw new Error("Failed to delete book on server.")
      }


      setBooks((prev) => prev.filter((b) => b._id !== bookId && b.id !== bookId))
      toast.success("Book removed from library catalog successfully.", { id: toastId })
      setIsDeleteModalOpen(false)
      setDeletingBook(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book.", { id: toastId })
    } finally {
      setIsDeleting(false)
    }
  }

  // Stats calculation
  const totalBooksCount = books.length
  const totalCopiesSum = books.reduce((acc, b) => acc + (b.totalCopies ?? 1), 0)
  const availableCopiesSum = books.reduce((acc, b) => acc + (b.availableCopies ?? 0), 0)

  // Unauthenticated Callout
  if (!sessionLoading && !currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#DCE9F5] bg-white shadow-lg dark:border-[#24345E] dark:bg-[#152244]">
          <Library className="size-10 text-[#3155C8] dark:text-[#93C5FD]" />
        </div>

        <h2 className="mt-6 font-heading text-2xl font-black text-[#243B73] dark:text-white sm:text-3xl">
          Sign In to View Your Books
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#60718B] dark:text-[#94A3B8]">
          Please log in to manage books you have added to BookNook, update copy quantities, or add new literature to the library.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login?callbackUrl=/my-books"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#243B73] dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <LogIn className="size-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            href="/register?callbackUrl=/my-books"
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
              <span>Contributor Dashboard</span>
            </div>
            <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
              My Added Books
            </h1>
            <p className="mt-1 text-sm text-[#60718B] dark:text-[#94A3B8]">
              Manage literature and titles you have contributed to BookNook ({currentUser?.email}).
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3155C8] px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
          >
            <PlusCircle className="size-4" />
            <span>Add New Book</span>
          </Link>
        </div>

        {/* Top Stats Banner */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#E2ECF6] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#152244]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Total Books Contributed
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-3xl font-black text-[#243B73] dark:text-white">
                {totalBooksCount}
              </span>
              <BookOpen className="size-5 text-[#3985F5]" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#E2ECF6] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#152244]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Total Copies in Library
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-3xl font-black text-[#243B73] dark:text-white">
                {totalCopiesSum}
              </span>
              <Layers className="size-5 text-[#3985F5]" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#E2ECF6] bg-white p-5 shadow-xs transition-colors dark:border-[#24345E] dark:bg-[#152244]">
            <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
              Available to Borrowers
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-heading text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {availableCopiesSum}
              </span>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mt-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EBF4FC] border-t-[#3155C8]" />
              <p className="mt-4 text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
                Loading your books...
              </p>
            </div>
          ) : books.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-[#DCE9F5] bg-white/70 p-12 text-center backdrop-blur-xs dark:border-[#24345E] dark:bg-[#152244]/50">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <BookPlus className="size-8" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-[#243B73] dark:text-white">
                No Books Added Yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-xs text-[#60718B] dark:text-[#94A3B8]">
                You haven&apos;t added any books under <strong className="text-[#243B73] dark:text-white">{currentUser?.email}</strong>. Share your favorite books with our community library.
              </p>
              <Link
                href="/add-book"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73] dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
              >
                <PlusCircle className="size-4" />
                <span>Add Your First Book</span>
              </Link>
            </div>
          ) : (
            /* Book Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => {
                const bookId = book._id || book.id
                const isAvailable = (book.availableCopies ?? 0) > 0

                return (
                  <div
                    key={bookId}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#24345E] dark:bg-[#152244]"
                  >
                    <div>
                      {/* Book Cover Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E2ECF6] bg-[#F1F6FB] dark:border-[#24345E] dark:bg-[#0B132B]">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized={book.image?.startsWith("http")}
                        />
                        {/* Category Tag Overlay */}
                        <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#3155C8] shadow-sm backdrop-blur-md dark:bg-[#0B132B]/90 dark:text-[#93C5FD]">
                          {book.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4">
                        <h3 className="line-clamp-1 font-heading text-lg font-bold text-[#243B73] transition-colors group-hover:text-[#3155C8] dark:text-white dark:group-hover:text-[#93C5FD]">
                          {book.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
                          By {book.author}
                        </p>

                        {/* Copies Status Badge */}
                        <div className="mt-3 flex items-center justify-between border-t border-[#E2ECF6] pt-3 dark:border-[#24345E]">
                          <span className="text-[11px] font-medium text-[#60718B] dark:text-[#94A3B8]">
                            Stock Status:
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              isAvailable
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                            }`}
                          >
                            {book.availableCopies} of {book.totalCopies ?? 1} Available
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="mt-5 flex items-center gap-2 border-t border-[#E2ECF6] pt-4 dark:border-[#24345E]">
                      {/* View Details */}
                      <Link
                        href={`/books/${bookId}`}
                        aria-label="View book details"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#EBF4FC] py-2 text-xs font-bold text-[#3155C8] transition-all hover:bg-[#3155C8] hover:text-white active:scale-98 dark:bg-[#1E2E56] dark:text-[#93C5FD] dark:hover:bg-[#3985F5] dark:hover:text-white"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>View</span>
                      </Link>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBook(book)
                          setIsEditModalOpen(true)
                        }}
                        aria-label="Edit book"
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#EBF4FC] text-[#3155C8] transition-all hover:bg-[#3155C8] hover:text-white active:scale-95 dark:bg-[#1E2E56] dark:text-[#93C5FD] dark:hover:bg-[#3985F5] dark:hover:text-white"
                      >
                        <Pencil className="size-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingBook(book)
                          setIsDeleteModalOpen(true)
                        }}
                        aria-label="Delete book"
                        className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white active:scale-95 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingBook(null)
        }}
        book={editingBook}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-2xl dark:border-[#24345E] dark:bg-[#152244] sm:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Trash2 className="size-7" />
              </div>

              <h3 className="mt-4 font-heading text-lg font-bold text-[#243B73] dark:text-white">
                Delete This Book?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#60718B] dark:text-[#94A3B8]">
                Are you sure you want to delete <strong className="text-[#243B73] dark:text-white">&quot;{deletingBook.title}&quot;</strong>? This action cannot be undone and will permanently remove the title from BookNook.
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setDeletingBook(null)
                  }}
                  disabled={isDeleting}
                  className="flex-1 rounded-2xl border border-[#DCE9F5] py-2.5 text-xs font-bold text-[#60718B] hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-60 dark:bg-rose-600 dark:hover:bg-rose-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Book</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}