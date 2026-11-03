import * as React from "react"

export function LoginFormSkeleton() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="mt-6 h-8 w-44 animate-pulse rounded-lg bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
        </div>

        <div className="rounded-3xl border border-[#E2ECF6] bg-white/90 p-8 shadow-xl dark:border-[#24345E] dark:bg-[#152244]/90 sm:p-10">
          <div className="h-12 w-full animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="my-6 h-4 w-full animate-pulse rounded bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          <div className="space-y-5">
            <div className="h-11 w-full animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
            <div className="h-11 w-full animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-[#E2ECF6] dark:bg-[#1E2E56]" />
          </div>
        </div>
      </div>
    </div>
  )
}

