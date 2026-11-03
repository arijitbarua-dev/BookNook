import * as React from "react"
import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { RegisterFormSkeleton } from "@/components/auth/RegisterFormSkeleton"

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account on BookNook. Borrow books, track readings, and join our vibrant community library.",
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </React.Suspense>
  )
}