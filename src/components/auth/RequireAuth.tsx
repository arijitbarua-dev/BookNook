"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"

/**
 * Client-side guard for private routes.
 *
 * While the session is being resolved it renders a lightweight loader.
 * Once resolved, unauthenticated visitors are redirected to the Login page
 * with a `callbackUrl` so they are sent back to the original page after
 * signing in.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const [hasLocalUser, setHasLocalUser] = React.useState(false)

  // Fall back to the local cache used across the app (Navbar/UserMenu)
  React.useEffect(() => {
    const readStorageUser = () => {
      try {
        setHasLocalUser(Boolean(localStorage.getItem("booknook-user")))
      } catch {
        setHasLocalUser(false)
      }
    }

    readStorageUser()
    window.addEventListener("storage", readStorageUser)
    return () => window.removeEventListener("storage", readStorageUser)
  }, [])

  const isAuthenticated = Boolean(session?.user) || hasLocalUser

  React.useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [isPending, isAuthenticated, pathname, router])

  // Do not render private content until the session check finishes
  if (isPending || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EBF4FC] border-t-[#3155C8] dark:border-[#152244] dark:border-t-[#3985F5]" />
          <p className="text-xs font-semibold text-[#60718B] dark:text-[#94A3B8]">
            Checking your session...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}