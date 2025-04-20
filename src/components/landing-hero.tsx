"use client"

import { AuthButton } from "@/components/auth-button"
import { Users } from "lucide-react"
import Image from "next/image"
import { Klee_One } from "next/font/google"

const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
})

// Type for referrer data
export type ReferrerData = {
  id: string
  twitter_username?: string
  email?: string
  referral_code: string
}

interface LandingHeroProps {
  referrerData?: ReferrerData | null
}

export function LandingHero({ referrerData }: LandingHeroProps) {
  return (
    <div className="z-10 flex flex-col items-center text-center px-4">
      {referrerData && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#8af337]/30 to-[#8af337]/20 p-4 rounded-lg text-sm text-white font-medium animate-pulse mb-8">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
          <Users className="h-5 w-5 mb-1 mx-auto" />
          <p className={klee.className}>You are being invited by <span className="font-bold">
            {referrerData.twitter_username || referrerData.email || 'a TokenFight community member'}
          </span></p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.png"
          alt="Token Fight Logo"
          width={90}
          height={90}
          className="w-[90px] h-[90px]"
        />
        <h1 className={`${klee.className} text-white text-4xl font-bold tracking-wide`}>Token Fight</h1>
      </div>

      <div className="mb-14 text-white/90">
        <p className={`${klee.className} text-xl mb-1 font-normal`}>Enter the arena.</p>
        <p className={`${klee.className} text-xl font-normal`}>Trade tokens that kill each other.</p>
      </div>

      <div className="mb-16">
        <AuthButton size="lg" className="animate-glow-pulse hover:animate-none" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 flex items-center gap-3 text-white/90">
        <Image
          src="/moneybag.png"
          alt="Money Bag"
          width={30}
          height={30}
        />
        <p className={`${klee.className} text-base font-normal`}>Join early, invite friends, and earn trading fees</p>
      </div>
    </div>
  )
} 