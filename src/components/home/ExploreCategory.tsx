"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  Atom,
  Landmark,
  Palette,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react"

interface CategoryItem {
  id: string
  name: string
  tagline: string
  description: string
  icon: React.ElementType
  bookCount: string
  badgeColor: string
  iconBg: string
  iconColor: string
  href: string
}

const categories: CategoryItem[] = [
  {
    id: "fiction",
    name: "Fiction",
    tagline: "Stories & Imagination",
    description: "Novels, sci-fi epics, thrillers, and timeless literary journeys.",
    icon: Sparkles,
    bookCount: "180+ Books",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    iconBg: "bg-[#EBF4FC] dark:bg-[#1E2E56]",
    iconColor: "text-[#3155C8] dark:text-[#93C5FD]",
    href: "/books?category=Fiction",
  },
  {
    id: "science",
    name: "Science",
    tagline: "Knowledge & Nature",
    description: "Astronomy, physics, biology, mathematics, and futuristic tech.",
    icon: Atom,
    bookCount: "140+ Books",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    href: "/books?category=Science",
  },
  {
    id: "history",
    name: "History",
    tagline: "Past & Civilizations",
    description: "Ancient empires, influential biographies, and world heritage.",
    icon: Landmark,
    bookCount: "115+ Books",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    href: "/books?category=History",
  },
  {
    id: "kids",
    name: "Kids",
    tagline: "Young Explorers",
    description: "Illustrated adventures, fairy tales, bedtime stories, and early learning.",
    icon: Palette,
    bookCount: "95+ Books",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    href: "/books?category=Kids",
  },
  {
    id: "others",
    name: "Others",
    tagline: "Diverse Horizons",
    description: "Philosophy, psychology, business, art, poetry, and memoirs.",
    icon: Layers,
    bookCount: "130+ Books",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    href: "/books?category=Others",
  },
]

export function ExploreCategory() {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 -z-10 h-80 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
            <BookOpen className="size-3.5 text-[#3985F5]" />
            <span>Curated Genres</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
            Explore Categories
          </h2>

          <p className="mt-3 text-sm font-medium text-[#60718B] sm:text-base dark:text-[#94A3B8]">
            Browse our diverse catalog of titles thoughtfully organized to match your curiosity and reading mood.
          </p>
        </div>

        {/* Categories Grid (5 columns on xl, 3 on lg, 2 on sm, 1 on mobile) */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3985F5] hover:shadow-xl dark:border-[#24345E] dark:bg-[#152244] dark:hover:border-[#3985F5]"
              >
                <div>
                  {/* Top Bar: Icon + Count Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconBg} ${category.iconColor} shadow-xs transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="size-6" />
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${category.badgeColor}`}
                    >
                      {category.bookCount}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-6">
                    <h3 className="font-heading text-xl font-bold text-[#243B73] transition-colors group-hover:text-[#3155C8] dark:text-white dark:group-hover:text-[#93C5FD]">
                      {category.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#3985F5] dark:text-[#93C5FD] mt-0.5">
                      {category.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-[#60718B] dark:text-[#94A3B8]">
                    {category.description}
                  </p>
                </div>

                {/* Browse Category Link */}
                <div className="mt-6 pt-4 border-t border-[#E2ECF6] dark:border-[#24345E]/80">
                  <Link
                    href={category.href}
                    className="group/link flex w-full items-center justify-between rounded-xl bg-[#F8FAFD] px-3.5 py-2 text-xs font-bold text-[#3155C8] transition-all duration-200 group-hover:bg-[#3155C8] group-hover:text-white dark:bg-[#0B132B]/60 dark:text-[#93C5FD] dark:group-hover:bg-[#3985F5] dark:group-hover:text-white"
                  >
                    <span>Browse Category</span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ExploreCategory  