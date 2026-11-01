import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, ArrowRight, Heart, BookOpen, Sparkles, MapPin } from "lucide-react"

// Clean SVG Icons for Facebook and Instagram
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function Footer() {
  const currentYear = 2026

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "All Books", href: "/books" },
    { label: "Fiction", href: "/books?category=Fiction" },
    { label: "Science", href: "/books?category=Science" },
    { label: "History", href: "/books?category=History" },
    { label: "Kids", href: "/books?category=Kids" },
  ]

  const userLinks = [
    { label: "Add a Book", href: "/add-book" },
    { label: "My Bookshelf", href: "/my-books" },
    { label: "My Borrowed Books", href: "/my-borrows" },
    { label: "How BookNook Works", href: "/#how-it-works" },
  ]

  return (
    <footer className="w-full border-t border-[#E2ECF6] bg-[#F8FAFD] backdrop-blur-sm transition-colors duration-300 dark:border-[#24345E] dark:bg-[#0B132B]">
      {/* Top Pre-Footer Callout Card */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-gradient-to-r from-[#EBF4FC] via-white to-[#F8FAFD] p-8 shadow-xs dark:border-[#24345E] dark:from-[#152244] dark:via-[#131C38] dark:to-[#152244] sm:p-10">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#3155C8] shadow-2xs dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                <Sparkles className="size-3.5" />
                <span>Join Our Reading Community</span>
              </div>
              <h3 className="font-heading text-2xl font-black tracking-tight text-[#243B73] sm:text-3xl dark:text-white">
                Discover your next favorite book today
              </h3>
              <p className="text-sm font-medium text-[#60718B] dark:text-[#94A3B8]">
                Browse hundreds of curated books, borrow stories from fellow readers, or contribute titles to help knowledge grow.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#3155C8] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
              >
                <span>Browse All Books</span>
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="mailto:booknooklibrary@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE9F5] bg-white px-5 py-3 text-sm font-bold text-[#243B73] shadow-xs transition-colors hover:bg-[#DDF0FF] dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-white dark:hover:bg-[#24345E]"
              >
                <Mail className="size-4 text-[#3985F5]" />
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Multi-Column Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1 & 2 (Spans 2 cols on lg): Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#DCE9F5] bg-white shadow-xs transition-all group-hover:border-[#3985F5] group-hover:shadow-md dark:border-[#24345E] dark:bg-[#152244]">
                <Image
                  src="/images/logo.jpg"
                  alt="BookNook Logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black tracking-tight text-[#243B73] dark:text-white">
                  Book<span className="text-[#3985F5]">Nook</span>
                </span>
                <span className="text-[11px] font-semibold text-[#60718B] dark:text-[#94A3B8] -mt-1">
                  A Small Online Library
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#60718B] dark:text-[#94A3B8] max-w-sm">
              A serene, modern digital library space designed to connect curious minds. Explore, borrow, and share books with ease and joy.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-white mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/book.nooklibrary?cplk=MXc1ZzBpeW9kcHF4cg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BookNook on Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#DCE9F5] bg-white text-[#243B73] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3985F5] hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  <InstagramIcon className="size-5" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1DzHXB5spk/
"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BookNook on Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#DCE9F5] bg-white text-[#243B73] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3985F5] hover:bg-[#1877F2] hover:text-white dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  <FacebookIcon className="size-5" />
                </a>

                {/* Email Direct */}
                <a
                  href="mailto:booknooklibrary@gmail.com"
                  aria-label="Send email to BookNook"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#DCE9F5] bg-white text-[#243B73] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3985F5] hover:bg-[#3155C8] hover:text-white dark:border-[#24345E] dark:bg-[#152244] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  <Mail className="size-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#243B73] dark:text-white">
              Explore Library
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#60718B] transition-colors hover:text-[#3155C8] hover:underline hover:underline-offset-4 dark:text-[#94A3B8] dark:hover:text-[#93C5FD]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Member Features */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#243B73] dark:text-white">
              Community Hub
            </h4>
            <ul className="space-y-2 text-sm">
              {userLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#60718B] transition-colors hover:text-[#3155C8] hover:underline hover:underline-offset-4 dark:text-[#94A3B8] dark:hover:text-[#93C5FD]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#243B73] dark:text-white">
              Contact & Support
            </h4>
            <div className="space-y-3 text-sm text-[#60718B] dark:text-[#94A3B8]">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#3985F5]" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#243B73] dark:text-slate-300">
                    Email Inquiries
                  </span>
                  <a
                    href="mailto:booknooklibrary@gmail.com"
                    className="font-medium text-[#3155C8] hover:underline dark:text-[#93C5FD] break-all"
                  >
                    booknooklibrary@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#3985F5]" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#243B73] dark:text-slate-300">
                    Availability
                  </span>
                  <span>24/7 Online Access</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#DCE9F5] bg-white/70 p-3 text-xs leading-relaxed dark:border-[#24345E] dark:bg-[#152244]/60">
                <p className="font-semibold text-[#243B73] dark:text-white">
                  Have questions or suggestions?
                </p>
                <p className="text-[#60718B] dark:text-[#94A3B8] mt-0.5">
                  Reach out to us via email or DM us on Instagram or Facebook.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#DCE9F5] pt-8 text-xs text-[#60718B] sm:flex-row dark:border-[#24345E] dark:text-[#94A3B8]">
          <p className="flex items-center gap-1">
            <span>© {currentYear} BookNook. All rights reserved.</span>
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#3155C8] dark:hover:text-[#93C5FD] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#3155C8] dark:hover:text-[#93C5FD] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
