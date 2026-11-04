"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Bookmark,
  PlusCircle,
  Library,
  BookMarked,
  Menu,
  X,
} from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { UserMenu } from "@/components/layout/UserMenu"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const { data: session, isPending: sessionLoading } = useSession()
  const [hasLocalUser, setHasLocalUser] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Track the locally cached user so guests get sent to Login
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

  const isLoggedIn = Boolean(session?.user) || hasLocalUser

  const navLinks = [
    { label: "Home", href: "/", icon: BookOpen, protected: false },
    { label: "All Books", href: "/books", icon: Library, protected: false },
    { label: "Add Book", href: "/add-book", icon: PlusCircle, protected: true },
    { label: "My Books", href: "/my-books", icon: Bookmark, protected: true },
    { label: "My Borrows", href: "/my-borrows", icon: BookMarked, protected: true },
  ]

  // Guests are sent to Login and returned here after signing in
  const getLinkHref = (link: (typeof navLinks)[number]) => {
    if (link.protected && !sessionLoading && !isLoggedIn) {
      return `/login?callbackUrl=${encodeURIComponent(link.href)}`
    }
    return link.href
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2ECF6] bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-[#24345E] dark:bg-[#0B132B]/90">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-200 active:scale-95"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E2ECF6] bg-[#F1F6FB] shadow-xs transition-all duration-300 group-hover:border-[#3985F5] group-hover:shadow-md dark:border-[#24345E] dark:bg-[#152244]">
            <Image
              src="/images/logo.jpg"
              alt="BookNook Logo"
              width={44}
              height={44}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-2xl font-black tracking-tight text-[#243B73] transition-colors group-hover:text-[#3155C8] dark:text-white dark:group-hover:text-[#93C5FD]">
                Book<span className="text-[#3985F5]">Nook</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#EBF4FC] px-2 py-0.5 text-[10px] font-semibold text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                Library
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#60718B] dark:text-[#94A3B8] -mt-1 hidden sm:block">
              Explore • Borrow • Read
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={getLinkHref(link)}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-[#EBF4FC] text-[#3155C8] shadow-xs dark:bg-[#1E2E56] dark:text-[#93C5FD]"
                    : "text-[#60718B] hover:bg-[#F1F6FB] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:bg-[#152244] dark:hover:text-white"
                )}
              >
                <link.icon
                  className={cn(
                    "size-4 transition-colors",
                    active
                      ? "text-[#3155C8] dark:text-[#93C5FD]"
                      : "text-[#60718B] dark:text-[#94A3B8]"
                  )}
                />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Section: Theme Toggle & User Avatar / Login-Register */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>

        {/* Mobile Hamburger & Theme Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2ECF6] bg-white text-[#243B73] shadow-xs transition-colors hover:bg-[#F1F6FB] dark:border-[#24345E] dark:bg-[#152244] dark:text-white dark:hover:bg-[#1E2E56]"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2ECF6] bg-white/95 px-4 pt-3 pb-6 shadow-xl backdrop-blur-lg dark:border-[#24345E] dark:bg-[#0B132B]/95 animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={getLinkHref(link)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-semibold transition-colors",
                    active
                      ? "bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]"
                      : "text-[#60718B] hover:bg-[#F1F6FB] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:bg-[#152244] dark:hover:text-white"
                  )}
                >
                  <link.icon className="size-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile User or Auth Buttons */}
          <div className="mt-4 border-t border-[#E2ECF6] pt-4 dark:border-[#24345E]">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  )
}