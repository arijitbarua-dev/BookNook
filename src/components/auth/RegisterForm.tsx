"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
  Camera,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react"
import { toast } from "sonner"
import { signUp, signIn, signOut } from "@/lib/auth-client"
import { uploadToImgBB } from "@/lib/upload"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallbackUrl = searchParams.get("callbackUrl")
  // Only follow internal paths so registration never redirects off-site, defaulting to Home page ("/")
  const callbackUrl =
    rawCallbackUrl &&
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//") &&
    !rawCallbackUrl.startsWith("/login") &&
    !rawCallbackUrl.startsWith("/register")
      ? rawCallbackUrl
      : "/"

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [agreeTerms, setAgreeTerms] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Photo / Avatar via ImgBB
  const [photoUrl, setPhotoUrl] = React.useState("")
  const [photoPreview, setPhotoPreview] = React.useState("")
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select a valid image (JPEG, PNG, WEBP, GIF).")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.")
      return
    }

    const localPreview = URL.createObjectURL(file)
    setPhotoPreview(localPreview)
    setIsUploadingPhoto(true)
    const uploadToast = toast.loading("Uploading photo to ImgBB...")

    try {
      const directUrl = await uploadToImgBB(file)
      setPhotoUrl(directUrl)
      setPhotoPreview(directUrl)
      toast.success("Avatar uploaded to ImgBB successfully!", { id: uploadToast })
    } catch (err: any) {
      console.warn("Direct ImgBB upload failed, trying server proxy:", err)
      try {
        const formData = new FormData()
        formData.append("image", file)
        const proxyRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const proxyData = await proxyRes.json()
        if (proxyRes.ok && proxyData.url) {
          setPhotoUrl(proxyData.url)
          setPhotoPreview(proxyData.url)
          toast.success("Avatar uploaded to ImgBB successfully!", { id: uploadToast })
          return
        }
      } catch (proxyErr) {
        console.error("Proxy upload failed:", proxyErr)
      }

      toast.error(err.message || "Failed to upload avatar to ImgBB.", { id: uploadToast })
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = () => {
    setPhotoUrl("")
    setPhotoPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePhotoUrlChange = (val: string) => {
    setPhotoUrl(val)
    setPhotoPreview(val.trim())
  }

  // Password validation helpers
  const hasMinLength = password.length >= 6
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  // Handle Email & Password Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.")
      return
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to BookNook Terms of Service.")
      return
    }

    setIsLoading(true)
    const toastId = toast.loading("Creating your BookNook account...")

    try {
      // Attempt Better Auth Sign Up with photo url (image)
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
        image: photoUrl.trim() || undefined,
      })

      if (res?.error) {
        const msg = res.error.message || "Failed to create account."
        setErrorMessage(msg)
        toast.error(msg, { id: toastId })
        return
      }

      // Ensure session only starts after explicit login
      try {
        await signOut()
      } catch {
        // Ignore
      }
      localStorage.removeItem("booknook-user")
      window.dispatchEvent(new Event("storage"))

      toast.success("Account registered successfully! Please sign in to start your session.", {
        id: toastId,
        duration: 4000,
      })

      // Navigate to Login page with email prefilled
      const loginTarget =
        callbackUrl && callbackUrl !== "/"
          ? `/login?registered=true&email=${encodeURIComponent(email.trim())}&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : `/login?registered=true&email=${encodeURIComponent(email.trim())}`

      router.push(loginTarget)
    } catch (err: any) {
      console.error("Sign up error:", err)
      const msg = err?.message || "Failed to create account. Please try again."
      setErrorMessage(msg)
      toast.error(msg, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Social Sign In / Up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      })
    } catch (err: any) {
      toast.error(err.message || "Google sign-up could not be initiated.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-[550px] w-[650px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3985F5]/15 via-[#A9D2F5]/20 to-transparent blur-3xl dark:from-[#3155C8]/15 dark:via-[#152244]/40" />

      <div className="w-full max-w-md space-y-8">
        {/* Header Card */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#DCE9F5] bg-white shadow-sm dark:border-[#24345E] dark:bg-[#152244]">
              <Image
                src="/images/logo.jpg"
                alt="BookNook Logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="text-left">
              <span className="font-heading text-2xl font-black tracking-tight text-[#243B73] dark:text-white">
                Book<span className="text-[#3985F5]">Nook</span>
              </span>
              <span className="block text-[11px] font-semibold text-[#60718B] dark:text-[#94A3B8]">
                A Small Online Library
              </span>
            </div>
          </Link>

          <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-[#243B73] sm:text-3xl dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-[#60718B] dark:text-[#94A3B8]">
            Join our community library to borrow books, track reading, and share recommendations.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-white/90 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-[#24345E] dark:bg-[#152244]/90 sm:p-10">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Sign-up Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#DCE9F5] bg-white px-4 py-3 text-sm font-bold text-[#243B73] shadow-2xs transition-all hover:bg-[#F1F6FB] hover:border-[#3985F5] hover:shadow-sm active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:hover:bg-[#1E2E56]"
            >
              {isGoogleLoading ? (
                <Loader2 className="size-4 animate-spin text-[#3985F5]" />
              ) : (
                <svg className="size-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#E2ECF6] dark:border-[#24345E]" />
            <span className="absolute bg-white px-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] dark:bg-[#152244]">
              or register with email
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
              >
                Full Name
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <User className="size-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] py-3 pr-3.5 pl-10 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] transition-colors focus:border-[#3985F5] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3985F5]/15 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:placeholder-[#64748B] dark:focus:bg-[#0B132B]"
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <Mail className="size-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] py-3 pr-3.5 pl-10 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] transition-colors focus:border-[#3985F5] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3985F5]/15 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:placeholder-[#64748B] dark:focus:bg-[#0B132B]"
                />
              </div>
            </div>

            {/* Profile Photo / Avatar (via ImgBB) */}
            <div className="rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] p-3.5 dark:border-[#24345E] dark:bg-[#0B132B]/60">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="photoUrl"
                  className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
                >
                  Profile Photo
                </label>
                <span className="text-[10px] font-semibold text-[#60718B] dark:text-[#94A3B8]">
                  via ImgBB
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Circular Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-tr from-[#3155C8] to-[#3985F5] shadow-xs ring-2 ring-[#DCE9F5] dark:border-[#152244] dark:ring-[#24345E]">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                        onError={() => setPhotoPreview("")}
                      />
                    ) : (
                      <User className="size-7 text-white/90" />
                    )}

                    {isUploadingPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                        <Loader2 className="size-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  {photoPreview && !isUploadingPhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Remove avatar"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                {/* Upload action and details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="avatar-file-input"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto || isLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE9F5] bg-white px-3 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs transition-all hover:bg-[#F1F6FB] hover:border-[#3985F5] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#24345E] dark:bg-[#152244] dark:text-[#93C5FD] dark:hover:bg-[#1E2E56]"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin text-[#3985F5]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="size-3.5 text-[#3985F5]" />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </button>

                    {photoUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>Uploaded</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#60718B] dark:text-[#94A3B8]">
                    Upload an image. This will be your user avatar after sign in.
                  </p>
                </div>
              </div>

              {/* Photo URL Input Field */}
              <div className="mt-3.5 pt-3 border-t border-[#E2ECF6] dark:border-[#24345E]/70">
                <label
                  htmlFor="photoUrl"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
                >
                  Photo URL
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                    <LinkIcon className="size-3.5" />
                  </div>
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => handlePhotoUrlChange(e.target.value)}
                    placeholder="https://i.ibb.co/... (or paste image URL)"
                    className="block w-full rounded-xl border border-[#DCE9F5] bg-white py-2.5 pr-3.5 pl-10 text-xs font-medium text-[#243B73] placeholder-[#94A3B8] transition-colors focus:border-[#3985F5] focus:outline-none focus:ring-2 focus:ring-[#3985F5]/15 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:placeholder-[#64748B] dark:focus:bg-[#0B132B]"
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#60718B] dark:text-[#94A3B8]">
                  Auto-filled when uploading via ImgBB, or you can paste a direct photo URL.
                </p>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <Lock className="size-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full rounded-2xl border border-[#DCE9F5] bg-[#F8FAFD] py-3 pr-11 pl-10 text-sm font-medium text-[#243B73] placeholder-[#94A3B8] transition-colors focus:border-[#3985F5] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3985F5]/15 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:placeholder-[#64748B] dark:focus:bg-[#0B132B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#60718B] hover:text-[#243B73] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-[#243B73] dark:text-slate-200"
              >
                Confirm Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#60718B] dark:text-[#94A3B8]">
                  <Lock className="size-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`block w-full rounded-2xl border py-3 pr-10 pl-10 text-sm font-medium transition-colors focus:outline-none focus:ring-3 ${
                    confirmPassword && !passwordsMatch
                      ? "border-rose-300 bg-rose-50/50 text-rose-800 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300"
                      : "border-[#DCE9F5] bg-[#F8FAFD] text-[#243B73] placeholder-[#94A3B8] focus:border-[#3985F5] focus:bg-white focus:ring-[#3985F5]/15 dark:border-[#24345E] dark:bg-[#0B132B] dark:text-white dark:placeholder-[#64748B] dark:focus:bg-[#0B132B]"
                  }`}
                />
                {confirmPassword && passwordsMatch && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-600 dark:text-emerald-400">
                    <Check className="size-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Requirement Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                  hasMinLength
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <CheckCircle2 className="size-3" />
                <span>6+ characters</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                  hasLetter
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <CheckCircle2 className="size-3" />
                <span>Letters</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                  hasNumber
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <CheckCircle2 className="size-3" />
                <span>Numbers</span>
              </span>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-slate-300 text-[#3155C8] focus:ring-[#3985F5] dark:border-slate-700 dark:bg-[#0B132B]"
                />
                <span className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
                  I agree to the{" "}
                  <Link href="#" className="font-bold text-[#3155C8] underline dark:text-[#93C5FD]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="font-bold text-[#3155C8] underline dark:text-[#93C5FD]">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || isUploadingPhoto}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3155C8] py-3.5 px-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#243B73] hover:shadow-lg active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : isUploadingPhoto ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Uploading Avatar to ImgBB...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-[#60718B] dark:text-[#94A3B8]">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-[#3155C8] hover:underline dark:text-[#93C5FD]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}