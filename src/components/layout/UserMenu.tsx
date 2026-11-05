"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  User as UserIcon,
  BookMarked,
  Bookmark,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Library,
} from "lucide-react"
import { toast } from "sonner"
import { useSession, signOut } from "@/lib/auth-client"

interface LocalUser {
  name: string
  email: string
  image?: string | null
  id?: string
  role?: string
}

export function UserMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const [localUser, setLocalUser] = React.useState<LocalUser | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)
  const [avatarError, setAvatarError] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Sync session and localStorage
  React.useEffect(() => {
    const readStorageUser = () => {
      try {
        const stored = localStorage.getItem("booknook-user")
        if (stored) {
          setLocalUser(JSON.parse(stored))
        } else {
          setLocalUser(null)
        }
      } catch {
        setLocalUser(null)
      }
    }

    readStorageUser()

    // Listen for storage changes across tabs or login events
    window.addEventListener("storage", readStorageUser)
    return () => window.removeEventListener("storage", readStorageUser)
  }, [])

  // Derive current user
  const user: LocalUser | null = React.useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name || "Member",
        email: session.user.email || "",
        image: session.user.image || null,
        id: session.user.id,
      }
    }
    return localUser
  }, [session, localUser])

  // Reset avatar error when user image updates
  React.useEffect(() => {
    setAvatarError(false)
  }, [user?.image])

  // Click outside listener to close dropdown and modal on Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
        setIsProfileModalOpen(false)
      }
    }

    if (isOpen || isProfileModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, isProfileModalOpen])

  // Handle Logout
  const handleLogout = async () => {
    setIsOpen(false)
    const toastId = toast.loading("Logging out...")

    try {
      await signOut()
    } catch (err) {
      console.warn("Better Auth signOut error:", err)
    }

    localStorage.removeItem("booknook-user")
    setLocalUser(null)

    toast.success("Logged out successfully.", { id: toastId })
    router.push("/")
    router.refresh()
  }

  // If user is not logged in, render Login & Register CTA buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2 pl-1 border-l border-[#E2ECF6] dark:border-[#24345E]">
        <Link
          href="/login"
          className="rounded-xl px-4 py-2 text-sm font-bold text-[#3155C8] transition-colors hover:bg-[#EBF4FC] dark:text-[#93C5FD] dark:hover:bg-[#1E2E56]"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-1.5 rounded-xl bg-[#3155C8] px-4.5 py-2 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#243B73] hover:shadow-md active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
        >
          <Sparkles className="size-3.5" />
          <span>Register</span>
        </Link>
      </div>
    )
  }

  // Generate initials for avatar fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="relative pl-1 border-l border-[#E2ECF6] dark:border-[#24345E]" ref={menuRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#3155C8] to-[#3985F5] shadow-sm transition-all duration-200 hover:ring-2 hover:ring-[#3985F5] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#3985F5] dark:border-[#152244]"
      >
        {user.image && !avatarError ? (
          <Image
            src={user.image}
            alt={user.name}
            width={40}
            height={40}
            unoptimized
            className="h-full w-full rounded-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="font-heading text-xs font-black tracking-wider text-white">
            {initials}
          </span>
        )}

        {/* Online Indicator Badge */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0B132B]" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 origin-top-right rounded-3xl border border-[#DCE9F5] bg-white p-3 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in-50 zoom-in-95 dark:border-[#24345E] dark:bg-[#152244] z-50">
          {/* Header Profile Info */}
          <div className="flex items-center gap-3 p-2.5">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#3155C8] to-[#3985F5] text-white shadow-xs dark:border-[#24345E]">
              {user.image && !avatarError ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="font-heading text-xs font-black">{initials}</span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="truncate font-heading text-sm font-bold text-[#243B73] dark:text-white">
                  {user.name}
                </span>
                <span className="shrink-0 rounded-full bg-[#EBF4FC] px-2 py-0.5 text-[10px] font-bold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                  Member
                </span>
              </div>
              <span className="truncate text-xs text-[#60718B] dark:text-[#94A3B8]">
                {user.email}
              </span>
            </div>
          </div>

          <div className="my-2 border-t border-[#DCE9F5] dark:border-[#24345E]" />

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setIsProfileModalOpen(true)
              }}
              className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-[#243B73] transition-colors hover:bg-[#F1F6FB] dark:text-slate-200 dark:hover:bg-[#1E2E56]"
            >
              <UserIcon className="size-4 text-[#3985F5]" />
              <span>Profile</span>
            </button>
          </div>

          <div className="my-2 border-t border-[#DCE9F5] dark:border-[#24345E]" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Profile Details Dialog Modal mounted directly to document.body via Portal to escape header backdrop-blur containing block */}
      {isProfileModalOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#DCE9F5] bg-white p-6 shadow-2xl dark:border-[#24345E] dark:bg-[#152244] animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              aria-label="Close profile modal"
              className="absolute top-4 right-4 rounded-full p-1.5 text-[#60718B] hover:bg-[#F1F6FB] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:bg-[#1E2E56] dark:hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Profile Content */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#DCE9F5] bg-gradient-to-tr from-[#3155C8] to-[#3985F5] text-white shadow-md dark:border-[#24345E]">
                {user.image && !avatarError ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="font-heading text-2xl font-black">{initials}</span>
                )}
              </div>

              <h3 className="mt-4 font-heading text-lg font-black text-[#243B73] dark:text-white">
                {user.name}
              </h3>
              <p className="text-xs text-[#60718B] dark:text-[#94A3B8] mt-0.5">{user.email}</p>

              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#DCE9F5] bg-[#EBF4FC] px-3 py-1 text-xs font-bold text-[#3155C8] dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <ShieldCheck className="size-3.5 text-[#3985F5]" />
                <span>Verified Library Reader</span>
              </span>

              {/* Stats Box */}
              <div className="mt-6 grid w-full grid-cols-2 gap-3 rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] p-3 text-left dark:border-[#24345E] dark:bg-[#0B132B]">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#60718B] dark:text-[#94A3B8]">
                    Account Type
                  </span>
                  <p className="text-xs font-bold text-[#243B73] dark:text-white mt-0.5">
                    Community
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#60718B] dark:text-[#94A3B8]">
                    Borrow Limit
                  </span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    5 Books Active
                  </p>
                </div>
              </div>

              <div className="mt-6 flex w-full gap-2">
                <Link
                  href="/my-borrows"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 rounded-2xl bg-[#3155C8] py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-[#243B73] dark:bg-[#3985F5] dark:hover:bg-[#3155C8] transition-colors"
                >
                  My Borrows
                </Link>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="rounded-2xl border border-[#DCE9F5] px-5 py-2.5 text-xs font-bold text-[#60718B] hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#0B132B] dark:text-[#94A3B8] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}