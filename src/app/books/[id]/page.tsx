import * as React from "react"
import { Metadata } from "next"
import { BookDetailsView } from "@/components/books/BookDetailsView"
import { BookDetailsSkeleton } from "@/components/books/BookDetailsSkeleton"
import { RequireAuth } from "@/components/auth/RequireAuth"

interface BookDetailsPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Book Details",
  description: "Explore book on BookNook Online Library. Read description, check availability, and borrow instantly.",
}

async function BookDetailsContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>
}) {
  const { id } = await paramsPromise
  return <BookDetailsView bookId={id} />
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  return (
    <React.Suspense fallback={<BookDetailsSkeleton />}>
      <RequireAuth>
        <BookDetailsContent paramsPromise={params} />
      </RequireAuth>
    </React.Suspense>
  )
}