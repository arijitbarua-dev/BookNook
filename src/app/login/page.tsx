import * as React from "react"
import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"
import { LoginFormSkeleton } from "@/components/auth/LoginFormSkeleton"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your BookNook account to explore, borrow, and track books in your online community library.",
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </React.Suspense>
  )
}