import * as React from "react"
import { Metadata } from "next"
import { MyBorrowsView } from "@/components/books/MyBorrowsView"
import { MyBorrowsSkeleton } from "@/components/books/MyBorrowsSkeleton"
import { RequireAuth } from "@/components/auth/RequireAuth"

export const metadata: Metadata = {
  title: "My Borrows",
  description: "View and manage all books currently checked out to your BookNook online library account.",
}

export default function MyBorrowsPage() {
  return (
    <React.Suspense fallback={<MyBorrowsSkeleton />}>
      <RequireAuth>
        <MyBorrowsView />
      </RequireAuth>
    </React.Suspense>
  )
}