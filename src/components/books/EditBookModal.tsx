"use client"

import * as React from "react"
import {
  X,
  BookOpen,
  User,
  Layers,
  Copy,
  ImageIcon,
  Loader2,
  Save,
} from "lucide-react"
import { toast } from "sonner"
import type { Book } from "@/components/books/BookCard"

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const

interface EditBookModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book | null
  onUpdateSuccess: (updatedBook: Book) => void
}

export function EditBookModal({
  isOpen,
  onClose,
  book,
  onUpdateSuccess,
}: EditBookModalProps) {
  const [title, setTitle] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [category, setCategory] = React.useState<string>("Fiction")
  const [image, setImage] = React.useState("")
  const [totalCopies, setTotalCopies] = React.useState(1)
  const [availableCopies, setAvailableCopies] = React.useState(1)
  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Populate form with book data when opened
  React.useEffect(() => {
    if (book) {
      setTitle(book.title || "")
      setAuthor(book.author || "")
      setCategory(book.category || "Fiction")
      setImage(book.image || "")
      setTotalCopies(book.totalCopies ?? 1)
      setAvailableCopies(book.availableCopies ?? 1)
      setDescription(book.description || "")
    }
  }, [book])

  if (!isOpen || !book) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !author.trim() || !image.trim()) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Updating book details...")

    const bookId = book._id || book.id
    const updatedData = {
      title: title.trim(),
      author: author.trim(),
      category,
      image: image.trim(),
      description: description.trim(),
      totalCopies: Number(totalCopies),
      availableCopies: Math.min(Number(availableCopies), Number(totalCopies)),
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) {
        throw new Error("Failed to update book on server.")
      }

      // Also update local cache
      try {
        const localBooks = JSON.parse(localStorage.getItem("booknook-books") || "[]")
        const updated = localBooks.map((b: any) =>
          b._id === bookId || b.id === bookId ? { ...b, ...updatedData } : b
        )
        localStorage.setItem("booknook-books", JSON.stringify(updated))
      } catch {
        // Ignore local storage error
      }

      const mergedBook: Book = {
        ...book,
        ...updatedData,
      }

      toast.success("Book updated successfully!", { id: toastId })
      onUpdateSuccess(mergedBook)
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to update book.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClasses =
    "block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] py-2.5 pr-3.5 pl-10 text-sm font-medium text-[#243B73] focus:border-[#3985F5] focus:bg-white focus:outline-none dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:focus:bg-[#0B132B] dark:focus:border-[#3985F5] transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-2xl dark:border-[#24345E] dark:bg-[#152244] sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2ECF6] pb-4 dark:border-[#24345E]">
          <div>
            <h2 className="font-heading text-xl font-black text-[#243B73] dark:text-white">
              Edit Book Details
            </h2>
            <p className="text-xs text-[#60718B] dark:text-[#94A3B8]">
              Update your contributed book information
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-[#60718B] hover:bg-[#F1F6FB] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                <BookOpen className="size-4" />
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputBaseClasses}
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
              Author Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                <User className="size-4" />
              </div>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={inputBaseClasses}
              />
            </div>
          </div>

          {/* Category & Copies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
                Category
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <Layers className="size-4" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] py-2.5 pr-3.5 pl-10 text-sm font-medium text-[#243B73] focus:border-[#3985F5] focus:bg-white focus:outline-none dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:focus:bg-[#0B132B] dark:focus:border-[#3985F5] [color-scheme:light] dark:[color-scheme:dark] transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-white text-[#243B73] dark:bg-[#0B132B] dark:text-white py-1"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
                Total Copies
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <Copy className="size-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={totalCopies}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setTotalCopies(val)
                    if (val < availableCopies) setAvailableCopies(val)
                  }}
                  className={inputBaseClasses}
                />
              </div>
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
              Image URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                <ImageIcon className="size-4" />
              </div>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={inputBaseClasses}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200">
              Short Description
            </label>
            <div className="relative mt-1.5">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] p-3 text-sm font-medium text-[#243B73] focus:border-[#3985F5] focus:bg-white focus:outline-none dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:focus:bg-[#0B132B] dark:focus:border-[#3985F5] transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E2ECF6] dark:border-[#24345E]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-[#DCE9F5] px-5 py-2.5 text-xs font-bold text-[#60718B] hover:bg-[#EBF4FC] hover:text-[#243B73] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73] disabled:opacity-60 dark:bg-[#3985F5] dark:hover:bg-[#3155C8] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
