import * as React from "react"

export function MyBorrowsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-6 w-36 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="mt-3 h-9 w-64 animate-pulse rounded-xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
      </div>

      {/* Stats Skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-3xl bg-white p-5 shadow-xs dark:bg-[#152244]" />
        <div className="h-24 animate-pulse rounded-3xl bg-white p-5 shadow-xs dark:bg-[#152244]" />
        <div className="h-24 animate-pulse rounded-3xl bg-white p-5 shadow-xs dark:bg-[#152244]" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-3xl border border-[#E2ECF6] bg-white p-5 shadow-xs dark:border-[#24345E] dark:bg-[#152244]"
          >
            <div>
              <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#0B132B]" />
              <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#0B132B]" />
              <div className="mt-3 h-16 w-full animate-pulse rounded-2xl bg-[#F8FAFD] dark:bg-[#0B132B]" />
            </div>
            <div className="mt-5 flex gap-2 border-t border-[#E2ECF6] pt-4 dark:border-[#24345E]">
              <div className="h-9 flex-1 animate-pulse rounded-xl bg-[#E2ECF6] dark:bg-[#0B132B]" />
              <div className="h-9 w-28 animate-pulse rounded-xl bg-[#E2ECF6] dark:bg-[#0B132B]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}