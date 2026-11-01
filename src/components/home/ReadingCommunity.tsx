"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Heart,
  Share2,
  BookmarkCheck,
  Star,
  Quote,
} from "lucide-react"

export function ReadingCommunity() {
  const communityStats = [
    { label: "Active Readers", value: "10,000+", icon: Users },
    { label: "Books Shared", value: "5,000+", icon: BookOpen },
    { label: "Community Rating", value: "4.9 / 5", icon: Star },
  ]

  const communityFeatures = [
    {
      icon: Share2,
      title: "Share Knowledge",
      description:
        "Add books from your own collection and help fellow readers discover something wonderful.",
    },
    {
      icon: BookmarkCheck,
      title: "Effortless Borrowing",
      description:
        "Borrow available copies with a single click and manage return dates from your personal dashboard.",
    },
    {
      icon: Heart,
      title: "Connect & Grow",
      description:
        "Be part of a thriving network of readers who believe great stories are meant to be shared.",
    },
  ]

  return (
    <section className="relative w-full py-10 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/10 via-[#A9D2F5]/20 to-transparent blur-3xl dark:from-[#152244]/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-gradient-to-br from-[#EBF4FC] via-white to-[#F8FAFD] p-8 shadow-sm transition-colors duration-300 dark:border-[#24345E] dark:from-[#152244] dark:via-[#131C38] dark:to-[#0F172A] sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Heading, Description & Action */}
            <div className="flex flex-col items-start lg:col-span-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <Sparkles className="size-3.5 text-[#3985F5]" />
                <span>Reading Community</span>
              </div>

              {/* Main Heading */}
              <h2 className="mt-5 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18] dark:text-white">
                A Community Connected{" "}
                <span className="relative inline-block text-[#3155C8] dark:text-[#4671F6]">
                  Through Books
                  <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#A9D2F5]/60 dark:bg-[#3985F5]/40" />
                </span>
              </h2>

              {/* Description from Master Specification */}
              <p className="mt-5 text-base font-medium leading-relaxed text-[#60718B] sm:text-lg dark:text-[#94A3B8] max-w-xl">
                Every book has a story, and every reader has a journey. Join
                BookNook and share the joy of reading.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#3155C8] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
                >
                  <span>Join Our Library</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-6 py-3.5 text-sm font-bold text-[#243B73] shadow-2xs transition-colors hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#152244] dark:text-slate-200 dark:hover:bg-[#1E2E56]"
                >
                  <span>Browse Books</span>
                </Link>
              </div>

              {/* Avatar Stack Social Proof */}
              <div className="mt-10 flex items-center gap-4 pt-6 border-t border-[#E2ECF6] dark:border-[#24345E]/80 w-full">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white dark:ring-[#152244] object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Reader avatar"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white dark:ring-[#152244] object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Reader avatar"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white dark:ring-[#152244] object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Reader avatar"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white dark:ring-[#152244] object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Reader avatar"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8] mt-0.5">
                    Joined by thousands of book enthusiasts
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Feature Cards & Testimonial Card */}
            <div className="flex flex-col gap-4 lg:col-span-6">
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {communityStats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-2xl border border-[#E2ECF6] bg-white/90 p-4 text-center shadow-xs transition-transform duration-200 hover:-translate-y-0.5 dark:border-[#24345E] dark:bg-[#152244]/90"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD] mb-2">
                        <Icon className="size-5" />
                      </div>
                      <span className="font-heading text-xl font-black text-[#243B73] dark:text-white">
                        {stat.value}
                      </span>
                      <span className="text-[11px] font-semibold text-[#60718B] dark:text-[#94A3B8] mt-0.5">
                        {stat.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Community Values List */}
              <div className="space-y-3 mt-2">
                {communityFeatures.map((feature, idx) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 rounded-2xl border border-[#E2ECF6] bg-white/80 p-4 shadow-xs transition-all duration-200 hover:border-[#3985F5] hover:bg-white hover:shadow-md dark:border-[#24345E] dark:bg-[#152244]/70 dark:hover:border-[#3985F5] dark:hover:bg-[#152244]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EBF4FC] text-[#3155C8] transition-colors group-hover:bg-[#3155C8] group-hover:text-white dark:bg-[#1E2E56] dark:text-[#93C5FD] dark:group-hover:bg-[#3985F5]">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-heading text-sm font-bold text-[#243B73] dark:text-white">
                          {feature.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-[#60718B] dark:text-[#94A3B8] mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reader Quote Card */}
              <div className="relative mt-2 overflow-hidden rounded-2xl border border-[#DCE9F5] bg-gradient-to-r from-[#DDF0FF]/60 to-white p-4.5 shadow-xs dark:border-[#24345E] dark:from-[#1E2E56]/40 dark:to-[#152244]">
                <Quote className="absolute right-4 bottom-3 size-12 text-[#3155C8]/10 dark:text-[#93C5FD]/10 pointer-events-none" />
                <p className="text-xs italic leading-relaxed text-[#243B73] dark:text-slate-200">
                  &ldquo;BookNook transformed how our community shares books.
                  Borrowing titles and discovering authors has never been this
                  seamless and delightful!&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3155C8] dark:text-[#93C5FD]">
                    Sarah Jenkins
                  </span>
                  <span className="text-[10px] text-[#60718B] dark:text-[#94A3B8]">
                    Member since 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}