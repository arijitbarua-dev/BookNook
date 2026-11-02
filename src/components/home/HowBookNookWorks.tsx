"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  BookMarked,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react"

interface StepItem {
  number: string
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  actionLink?: {
    label: string
    href: string
  }
  features: string[]
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Discover Books",
    subtitle: "Browse the growing collection",
    description:
      "Explore curated titles across Fiction, Science, History, Kids, and more. Search by book title or filter by category to find your next favorite story.",
    icon: Compass,
    features: ["Search by title & author", "Filter across genres", "Instant availability check"],
  },
  {
    number: "02",
    title: "Borrow Books",
    subtitle: "Borrow available books for a limited period",
    description:
      "Check out available books with a single click. View your active borrows, manage return dates, and keep your reading journey organized effortlessly.",
    icon: BookMarked,
    features: ["One-click borrowing", "Due date tracking", "Personal borrow dashboard"],
  },
  {
    number: "03",
    title: "Return & Repeat",
    subtitle: "Return on time and discover new stories",
    description:
      "Return books seamlessly once finished so other community readers can enjoy them. Expand your bookshelf and repeat the adventure with a new title.",
    icon: RotateCcw,
    features: ["Easy one-tap returns", "Real-time copy updates", "Zero late penalty fees"],
  },
]

export function HowBookNookWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-96 w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/15 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
            <Sparkles className="size-3.5 text-[#3985F5]" />
            <span>Simple & Transparent</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl dark:text-white">
            How BookNook Works
          </h2>

          <p className="mt-3 text-sm font-medium text-[#60718B] sm:text-base dark:text-[#94A3B8]">
            Borrowing and sharing books has never been easier. Start your reading journey in three simple steps.
          </p>
        </div>

        {/* Steps Grid: 3 Equal-Height Responsive Columns */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#E2ECF6] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3985F5] hover:shadow-xl dark:border-[#24345E] dark:bg-[#152244] dark:hover:border-[#3985F5] sm:p-8"
              >
                <div>
                  {/* Step Top Bar: Icon + Step Number */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] shadow-xs transition-colors duration-300 group-hover:bg-[#3155C8] group-hover:text-white dark:bg-[#1E2E56] dark:text-[#93C5FD] dark:group-hover:bg-[#3985F5]">
                      <Icon className="size-7" />
                    </div>

                    <span className="font-heading text-3xl font-black tracking-tighter text-[#A9D2F5]/60 transition-colors group-hover:text-[#3155C8] dark:text-[#24345E] dark:group-hover:text-[#93C5FD]">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3985F5] dark:text-[#93C5FD]">
                      Step {index + 1}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-bold text-[#243B73] transition-colors group-hover:text-[#3155C8] dark:text-white dark:group-hover:text-[#93C5FD]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#3155C8] dark:text-[#93C5FD]/80">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Step Description */}
                  <p className="mt-3 text-sm leading-relaxed text-[#60718B] dark:text-[#94A3B8]">
                    {step.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-2 border-t border-[#E2ECF6] pt-5 dark:border-[#24345E]/80">
                    {step.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-center gap-2 text-xs font-medium text-[#243B73] dark:text-slate-300"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step Action Link */}
                {step.actionLink && (
                  <div className="mt-6 pt-4 border-t border-[#E2ECF6] dark:border-[#24345E]/80">
                    <Link
                      href={step.actionLink.href}
                      className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-[#3155C8] transition-colors hover:text-[#243B73] dark:text-[#93C5FD] dark:hover:text-white"
                    >
                      <span>{step.actionLink.label}</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Community Trust Banner */}
        <div className="mt-12 rounded-3xl border border-[#E2ECF6] bg-gradient-to-r from-[#EBF4FC]/80 via-white to-[#EBF4FC]/80 p-6 text-center dark:border-[#24345E] dark:from-[#152244] dark:via-[#131C38] dark:to-[#152244]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3155C8] text-white dark:bg-[#3985F5]">
                <BookOpen className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243B73] dark:text-white">
                  Ready to discover your next story?
                </p>
                <p className="text-xs text-[#60718B] dark:text-[#94A3B8]">
                  Join hundreds of readers sharing knowledge today.
                </p>
              </div>
            </div>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-full bg-[#3155C8] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#243B73] hover:shadow-md active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}



export default HowBookNookWorks