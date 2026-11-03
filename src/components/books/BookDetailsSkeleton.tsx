import * as React from "react"

export function BookDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#1E2E56]" />
      </div>

      {/* Main card skeleton */}
      <div className="rounded-3xl border border-[#E2ECF6] bg-white p-6 dark:border-[#24345E] dark:bg-[#152244] sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col items-center lg:col-span-5">
            <div className="aspect-[3/4] w-full max-w-sm animate-pulse rounded-3xl bg-[#E2ECF6] dark:bg-[#0B132B]" />
            <div className="mt-5 h-8 w-44 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#0B132B]" />
          </div>

          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="h-6 w-24 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#1E2E56]" />
              <div className="mt-4 h-10 w-3/4 animate-pulse rounded-lg bg-[#E2ECF6] dark:bg-[#1E2E56]" />
              <div className="mt-3 h-5 w-1/2 animate-pulse rounded-lg bg-[#E2ECF6] dark:bg-[#1E2E56]" />

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-16 animate-pulse rounded-2xl bg-[#F8FAFD] dark:bg-[#0B132B]" />
                <div className="h-16 animate-pulse rounded-2xl bg-[#F8FAFD] dark:bg-[#0B132B]" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
              </div>

              <div className="mt-8 h-20 animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
            </div>

            <div className="mt-8 flex gap-4 pt-6">
              <div className="h-12 w-44 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#1E2E56]" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-[#E2ECF6] dark:bg-[#1E2E56]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}