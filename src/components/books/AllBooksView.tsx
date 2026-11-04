"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Search,
  X,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  RefreshCcw,
  PlusCircle,
  Loader2,
} from "lucide-react"
import { BookCard, type Book } from "@/components/books/BookCard"

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"] as const

export function AllBooksView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read URL query params
  const initialCategory = searchParams.get("category") || "All"
  const initialSearch = searchParams.get("search") || ""

  // State
  const [books, setBooks] = React.useState<Book[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory)
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest" | "title_asc">("newest")

  // Set document title
  React.useEffect(() => {
    document.title = "All Books | BookNook"
  }, [])

  // Sync category with URL
  React.useEffect(() => {
    const cat = searchParams.get("category")
    if (cat && CATEGORIES.includes(cat as any)) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  // Fetch all books
  const fetchBooks = React.useCallback(async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}/books`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setBooks(data)
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.warn("Backend not accessible!", err)
    }

    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // Filter & Sort Logic
  const filteredBooks = React.useMemo(() => {
    return books
      .filter((book) => {
        // Category Filter
        if (
          selectedCategory !== "All" &&
          book.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false
        }

        // Search Filter (Title or Author)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase()
          const matchTitle = book.title?.toLowerCase().includes(term)
          const matchAuthor = book.author?.toLowerCase().includes(term)
          if (!matchTitle && !matchAuthor) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        }
        if (sortBy === "oldest") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateA - dateB
        }
        if (sortBy === "title_asc") {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [books, selectedCategory, searchTerm, sortBy])

  const handleResetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSortBy("newest")
    router.push("/books")
  }

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat)
    if (cat === "All") {
      router.push("/books")
    } else {
      router.push(`/books?category=${encodeURIComponent(cat)}`)
    }
  }

  return (
    <div className="relative w-full py-10 sm:py-14 lg:py-18 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#E2ECF6] pb-8 dark:border-[#24345E]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
              <Sparkles className="size-3.5 text-[#3985F5]" />
              <span>Community Library Catalog</span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl lg:text-5xl dark:text-white">
              All Books
            </h1>

            <p className="mt-3 text-sm font-medium text-[#60718B] sm:text-base dark:text-[#94A3B8] max-w-xl">
              Explore our full collection of books. Search by title, author, or filter by category.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8] self-start md:self-auto"
          >
            <PlusCircle className="size-4" />
            <span>Add a Book</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#60718B] dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by book title or author..."
              className="w-full rounded-2xl border border-[#E2ECF6] bg-white pl-11 pr-10 py-3 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-3 focus:ring-[#3985F5]/20 dark:border-[#24345E] dark:bg-[#152244] dark:text-white dark:placeholder-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#60718B] hover:text-[#243B73] dark:text-slate-400 dark:hover:text-white"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#60718B] dark:text-[#94A3B8] flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="size-3.5 text-[#3985F5]" />
              <span>Sort by:</span>
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-xl border border-[#E2ECF6] bg-white px-4 py-2.5 pr-8 text-xs font-bold text-[#243B73] shadow-xs outline-none transition-all focus:border-[#3985F5] focus:ring-2 focus:ring-[#3985F5]/20 dark:border-[#24345E] dark:bg-[#152244] dark:text-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title_asc">Title (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#60718B] dark:text-slate-400">
                <svg className="size-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#3155C8] text-white shadow-xs dark:bg-[#3985F5]"
                    : "border border-[#E2ECF6] bg-white text-[#60718B] hover:bg-[#EBF4FC] hover:text-[#243B73] dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Status Count Line */}
        <div className="mt-6 flex items-center justify-between text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
          <span>
            Showing <strong className="font-bold text-[#243B73] dark:text-white">{filteredBooks.length}</strong> {filteredBooks.length === 1 ? "book" : "books"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>

          {(selectedCategory !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-bold text-[#3155C8] hover:underline dark:text-[#93C5FD]"
            >
              <RefreshCcw className="size-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Book Grid / Loading Spinner / Empty State */}
        <div className="mt-8">
          {loading ? (
            /* Dedicated Loading Spinner */
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 rounded-3xl border border-[#E2ECF6] bg-white/60 p-8 shadow-xs dark:border-[#24345E] dark:bg-[#152244]/60">
              <div className="relative flex items-center justify-center">
                <div className="size-16 animate-spin rounded-full border-4 border-[#DCE9F5] border-t-[#3155C8] dark:border-[#24345E] dark:border-t-[#3985F5]" />
                <BookOpen className="absolute size-6 text-[#3155C8] dark:text-[#3985F5] animate-pulse" />
              </div>
              <h3 className="mt-6 font-heading text-lg font-black text-[#243B73] dark:text-white">
                Loading All Books...
              </h3>
              <p className="mt-1.5 text-xs text-[#60718B] dark:text-[#94A3B8] max-w-xs text-center">
                Fetching the complete library catalog from the server.
              </p>
            </div>
          ) : filteredBooks.length > 0 ? (
            /* Books Responsive Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#DCE9F5] bg-white py-16 px-6 text-center dark:border-[#24345E] dark:bg-[#152244]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <BookOpen className="size-8" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-[#243B73] dark:text-white">
                No Books Found
              </h3>
              <p className="mt-2 text-sm text-[#60718B] dark:text-[#94A3B8] max-w-sm">
                We couldn&apos;t find any books matching your current search or category filter.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full border border-[#DCE9F5] bg-white px-5 py-2.5 text-xs font-bold text-[#243B73] shadow-xs hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-white"
                >
                  Reset All Filters
                </button>
                <Link
                  href="/add-book"
                  className="rounded-full bg-[#3155C8] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#243B73] dark:bg-[#3985F5]"
                >
                  Add a New Book
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}