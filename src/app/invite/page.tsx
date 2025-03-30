"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the referral code from the URL
    const ref = searchParams.get("ref")

    // Redirect to the home page with the referral code
    if (ref) {
      router.push(`/?ref=${ref}`)
    } else {
      router.push("/")
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  )
}

