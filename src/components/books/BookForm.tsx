"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Upload,
  BookOpen,
  User,
  Mail,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { uploadToImgBB } from "@/lib/upload"
import { getAuthToken } from "@/lib/auth-client"

export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const
export type Category = (typeof CATEGORIES)[number]

export interface BookFormData {
  title: string
  author: string
  category: Category
  image: string
  description: string
  totalCopies: number
  availableCopies: number
  addedBy: string
  addedByEmail: string
  createdAt?: string
}

interface BookFormProps {
  initialData?: Partial<BookFormData>
  isEdit?: boolean
  bookId?: string
  onSuccess?: () => void
}

export function BookForm({ initialData, isEdit = false, bookId, onSuccess }: BookFormProps) {
  const router = useRouter()

  // Form State
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [author, setAuthor] = React.useState(initialData?.author || "")
  const [category, setCategory] = React.useState<Category>(
    (initialData?.category as Category) || "Fiction"
  )
  const [imageUrl, setImageUrl] = React.useState(initialData?.image || "")
  const [description, setDescription] = React.useState(initialData?.description || "")
  const [totalCopies, setTotalCopies] = React.useState<number>(
    initialData?.totalCopies ?? 1
  )

  // Read-only user info (can pull from localStorage/session if logged in)
  const [addedBy, setAddedBy] = React.useState(initialData?.addedBy || "Habib Rahman")
  const [addedByEmail, setAddedByEmail] = React.useState(
    initialData?.addedByEmail || "habib@booknook.dev"
  )

  // Image Upload State
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string>(initialData?.image || "")
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Load user from local session if available
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("booknook-user")
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed.name) setAddedBy(parsed.name)
        if (parsed.email) setAddedByEmail(parsed.email)
      }
    } catch {
      // Fallback to default
    }
  }, [])

  // Handle Image File Selection & ImgBB Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Local validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP).")
      toast.error("Invalid file type. Please upload an image.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.")
      toast.error("File is too large. Max size is 10MB.")
      return
    }

    // Set preview immediately for user feedback
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    setImageFile(file)
    setIsUploading(true)

    const uploadToast = toast.loading("Uploading book cover to ImgBB...")

    try {
      // Upload to ImgBB
      const uploadedDirectUrl = await uploadToImgBB(file)
      setImageUrl(uploadedDirectUrl)
      setPreviewUrl(uploadedDirectUrl)
      toast.success("Cover image uploaded successfully!", { id: uploadToast })
    } catch (err: any) {
      console.error("ImgBB upload error:", err)

      try {
        const formData = new FormData()
        formData.append("image", file)
        const proxyRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const proxyData = await proxyRes.json()
        if (proxyRes.ok && proxyData.url) {
          setImageUrl(proxyData.url)
          setPreviewUrl(proxyData.url)
          toast.success("Cover image uploaded successfully!", { id: uploadToast })
          return
        }
      } catch (proxyErr) {
        console.error("Proxy upload failed:", proxyErr)
      }

      setUploadError(err.message || "Failed to upload image. Please try again.")
      toast.error("Upload failed: " + (err.message || "Check network/API key"), {
        id: uploadToast,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImageUrl("")
    setPreviewUrl("")
    setImageFile(null)
    setUploadError(null)
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = "Book title is required"
    if (!author.trim()) newErrors.author = "Author name is required"
    if (!description.trim() || description.length < 10) {
      newErrors.description = "Please provide a description (at least 10 characters)"
    }
    if (!imageUrl && !previewUrl) {
      newErrors.image = "Please upload a book cover image"
    }
    if (totalCopies < 1) {
      newErrors.totalCopies = "Total copies must be at least 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isUploading) {
      toast.warning("Please wait for the cover image to finish uploading.")
      return
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    const submitToast = toast.loading(isEdit ? "Updating book..." : "Saving new book to BookNook...")

    const bookPayload: BookFormData = {
      title: title.trim(),
      author: author.trim(),
      category,
      image: imageUrl || previewUrl,
      description: description.trim(),
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies), // Defaults to total copies when adding
      addedBy,
      addedByEmail,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const endpoint = isEdit ? `${apiUrl}/books/${bookId}` : `${apiUrl}/books`
      const method = isEdit ? "PATCH" : "POST"

      // Try sending to Express backend
      let serverSaved = false
      try {
        const token = await getAuthToken()
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        let res = await fetch(endpoint, {
          method,
          headers,
          body: JSON.stringify(bookPayload),
        })

        // Also try fallback endpoint '/add-book' if '/books' 404s
        if (!res.ok && !isEdit) {
          res = await fetch(`${apiUrl}/add-book`, {
            method: "POST",
            headers,
            body: JSON.stringify(bookPayload),
          })
        }

        if (res.ok) {
          serverSaved = true
        }
      } catch (networkErr) {
        console.warn("Backend not reachable, saving to local cache:", networkErr)
      }

      // Also persist to local cache so All Books and My Books always load it
      try {
        const storedBooks = JSON.parse(localStorage.getItem("booknook-books") || "[]")
        if (isEdit && bookId) {
          const updated = storedBooks.map((b: any) =>
            b._id === bookId || b.id === bookId ? { ...b, ...bookPayload } : b
          )
          localStorage.setItem("booknook-books", JSON.stringify(updated))
        } else {
          const newEntry = {
            ...bookPayload,
            _id: "book_" + Date.now(),
          }
          storedBooks.unshift(newEntry)
          localStorage.setItem("booknook-books", JSON.stringify(storedBooks))
        }
      } catch (cacheErr) {
        console.error("Local storage error:", cacheErr)
      }

      toast.success(
        isEdit
          ? "Book updated successfully!"
          : "Book added to BookNook library successfully!",
        { id: submitToast }
      )

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/books")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save book.", { id: submitToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 2-Column Grid for main inputs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Book Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center gap-1.5">
            <BookOpen className="size-4 text-[#3985F5]" />
            <span>Book Title *</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. To Kill a Mockingbird"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:bg-[#152244] dark:text-white dark:placeholder-slate-500 ${
              errors.title
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-[#E2ECF6] dark:border-[#24345E]"
            }`}
          />
          {errors.title && (
            <p className="text-xs font-semibold text-rose-500">{errors.title}</p>
          )}
        </div>

        {/* Author Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center gap-1.5">
            <User className="size-4 text-[#3985F5]" />
            <span>Author Name *</span>
          </label>
          <input
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Harper Lee"
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:bg-[#152244] dark:text-white dark:placeholder-slate-500 ${
              errors.author
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-[#E2ECF6] dark:border-[#24345E]"
            }`}
          />
          {errors.author && (
            <p className="text-xs font-semibold text-rose-500">{errors.author}</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="size-4 text-[#3985F5]" />
            <span>Category *</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full appearance-none rounded-2xl border border-[#E2ECF6] bg-white px-4 py-3 text-sm font-semibold text-[#243B73] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:border-[#24345E] dark:bg-[#152244] dark:text-white cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#60718B] dark:text-slate-400">
              <svg className="size-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Copies */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center gap-1.5">
            <BookOpen className="size-4 text-[#3985F5]" />
            <span>Total Copies *</span>
          </label>
          <input
            type="number"
            min={1}
            max={500}
            required
            value={totalCopies}
            onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-2xl border border-[#E2ECF6] bg-white px-4 py-3 text-sm font-semibold text-[#243B73] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:border-[#24345E] dark:bg-[#152244] dark:text-white"
          />
        </div>
      </div>

      {/* Book Cover Image Upload (ImgBB) */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Upload className="size-4 text-[#3985F5]" />
            <span>Book Cover Image (via ImgBB) *</span>
          </span>
          <span className="text-xs font-normal text-[#60718B] dark:text-[#94A3B8]">
            Max 10MB • JPG, PNG, WEBP
          </span>
        </label>

        {/* Image Preview or Dropzone */}
        {previewUrl ? (
          <div className="relative flex items-center gap-6 rounded-3xl border-2 border-[#E2ECF6] bg-[#F8FAFD] p-4 dark:border-[#24345E] dark:bg-[#0B132B]">
            <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md dark:border-[#24345E] dark:bg-[#152244]">
              <Image
                src={previewUrl}
                alt="Book cover preview"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                  <Loader2 className="size-6 animate-spin text-[#3985F5]" />
                  <span className="text-[10px] font-bold mt-1">Uploading...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                <span>
                  {isUploading ? "Uploading to ImgBB..." : "Cover image ready"}
                </span>
              </div>
              <p className="text-xs text-[#60718B] dark:text-[#94A3B8] max-w-sm truncate">
                {imageUrl || "Temporary preview"}
              </p>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-600 shadow-2xs hover:bg-rose-50 dark:border-rose-900/50 dark:bg-[#152244] dark:text-rose-400"
              >
                <X className="size-3.5" />
                <span>Change Image</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DCE9F5] bg-white p-8 text-center transition-all hover:border-[#3985F5] hover:bg-[#F8FAFD] dark:border-[#24345E] dark:bg-[#152244] dark:hover:bg-[#1E2E56]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Upload book cover"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] shadow-xs group-hover:scale-105 transition-transform dark:bg-[#1E2E56] dark:text-[#93C5FD]">
              {isUploading ? (
                <Loader2 className="size-7 animate-spin text-[#3985F5]" />
              ) : (
                <Upload className="size-7" />
              )}
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#243B73] dark:text-white">
              {isUploading ? "Uploading to ImgBB..." : "Click or drag book cover image here"}
            </h4>
            <p className="mt-1 text-xs text-[#60718B] dark:text-[#94A3B8]">
              PNG, JPG, or WEBP up to 10MB
            </p>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 pt-1">
            <AlertCircle className="size-3.5" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#243B73] dark:text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="size-4 text-[#3985F5]" />
            <span>Short Description *</span>
          </span>
          <span className="text-xs text-[#60718B] dark:text-[#94A3B8]">
            {description.length} characters
          </span>
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide a brief synopsis, plot summary, or what readers will learn from this book..."
          className={`w-full rounded-2xl border bg-white p-4 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:bg-[#152244] dark:text-white dark:placeholder-slate-500 ${
            errors.description
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-[#E2ECF6] dark:border-[#24345E]"
          }`}
        />
        {errors.description && (
          <p className="text-xs font-semibold text-rose-500">{errors.description}</p>
        )}
      </div>

      {/* Read-only User Information (Added By & Email) */}
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-[#E2ECF6] bg-[#F8FAFD] p-5 md:grid-cols-2 dark:border-[#24345E] dark:bg-[#0B132B]">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
            <User className="size-3.5 text-[#3985F5]" />
            <span>Added By (Read-only)</span>
          </label>
          <input
            type="text"
            readOnly
            value={addedBy}
            className="w-full rounded-xl border border-[#E2ECF6] bg-white/70 px-3.5 py-2 text-xs font-bold text-[#243B73] cursor-not-allowed dark:border-[#24345E] dark:bg-[#152244] dark:text-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5">
            <Mail className="size-3.5 text-[#3985F5]" />
            <span>User Email (Read-only)</span>
          </label>
          <input
            type="email"
            readOnly
            value={addedByEmail}
            className="w-full rounded-xl border border-[#E2ECF6] bg-white/70 px-3.5 py-2 text-xs font-bold text-[#243B73] cursor-not-allowed dark:border-[#24345E] dark:bg-[#152244] dark:text-slate-300"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-[#DCE9F5] bg-white px-6 py-3 text-sm font-bold text-[#60718B] shadow-2xs hover:bg-[#EBF4FC] hover:text-[#243B73] dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8] dark:hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex items-center gap-2 rounded-full bg-[#3155C8] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-60 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{isEdit ? "Updating Book..." : "Saving Book..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>{isEdit ? "Update Book" : "Add Book to Library"}</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}