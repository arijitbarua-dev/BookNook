import * as React from "react"
import { Metadata } from "next"
import { MyBooksView } from "@/components/books/MyBooksView"
import { MyBooksSkeleton } from "@/components/books/MyBooksSkeleton"
import { RequireAuth } from "@/components/auth/RequireAuth"

export const metadata: Metadata = {
  title: "My Books",
  description: "View and manage all books you have contributed to the BookNook community library.",
}

export default function MyBooksPage() {
  return (
    <RequireAuth>
      <React.Suspense fallback={<MyBooksSkeleton />}>
        <MyBooksView />
      </React.Suspense>
    </RequireAuth>
  )
}