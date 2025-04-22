"use client"

import { AuthButton } from "@/components/auth-button"
import { Users } from "lucide-react"
import Image from "next/image"
import { Klee_One } from "next/font/google"
import "./token-fight.css"

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
    <div className="z-10 flex flex-col items-center justify-between min-h-screen px-3 sm:px-4 md:px-5 lg:px-6 pb-10 pt-10">
      {/* Empty flex space at top to help with centering */}
      <div className="flex-grow" />
      
      {/* Main content - centered */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        {referrerData && (
          <div className="relative overflow-hidden bg-gradient-to-r from-[#8af337]/30 to-[#8af337]/20 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-white font-medium animate-pulse mb-5 sm:mb-6 md:mb-8 max-w-xs sm:max-w-sm md:max-w-md">
            <div className="absolute -top-10 -left-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1 mx-auto" />
            <p className={klee.className}>You are being invited by <span className="medium-bold">
              {referrerData.twitter_username || referrerData.email || 'a TokenFight community member'}
            </span></p>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-8 mb-5 sm:mb-6 md:mb-8">
          <Image
            src="/logo.png"
            alt="Token Fight Logo"
            width={90}
            height={90}
            className="w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] md:w-[97px] md:h-[100px]"
          />
          <h1 className={`${klee.className} text-white text-[24px] sm:text-[28px] md:text-[32px] lg:text-[42px] font-semibold leading-normal strong-bold`}>Token Fight</h1>
        </div>

        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 text-white/90">
          <p className={`${klee.className} text-base sm:text-xl md:text-3xl mb-1 font-normal`}>Fully <span className="medium-bold">on-chain</span> MMO.</p>
          <p className={`${klee.className} text-base sm:text-xl md:text-3xl font-normal`}>Trade tokens that <span className="strong-bold">kill</span> each other.</p>
        </div>

        <div>
          <AuthButton size="lg" className="animate-glow-pulse hover:animate-none" />
        </div>
      </div>
      
      {/* Empty flex space to push content to center */}
      <div className="flex-grow" />

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-xl max-w-xs sm:max-w-sm md:max-w-none text-center sm:text-left mt-6">
        <Image
          src="/moneybag.png"
          alt="Money Bag"
          width={30}
          height={30}
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-[30px] lg:h-[30px]"
        />
        <p className={`${klee.className} font-normal medium-bold`}>Join early, <span className="light-bold">invite friends</span>, and earn trading fees we launch!</p>
      </div>
    </div>
  )
} 