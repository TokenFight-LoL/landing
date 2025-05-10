"use client"

import { AuthButton } from "@/components/auth-button"
import { Users } from "lucide-react"
import Image from "next/image"
import { Klee_One } from "next/font/google"
import "./token-fight.css"
import { useEffect, useState } from "react"
import { getGenesisUsersCount, GENESIS_SPOTS } from "@/lib/api"

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
  const [genesisCount, setGenesisCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Effect to set the CSS custom property for viewport height
  useEffect(() => {
    // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // We create a function to update the property on resize/orientation change
    const updateVhProperty = () => {
      const newVh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${newVh}px`);
    };

    // Add event listeners with a debounced approach to avoid too many updates
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateVhProperty, 250);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Orientation change needs a slight delay to get accurate values
      setTimeout(updateVhProperty, 50);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateVhProperty);
      clearTimeout(resizeTimeout);
    };
  }, []);
  
  // Fetch Genesis users count
  useEffect(() => {
    const fetchGenesisCount = async () => {
      try {
        const count = await getGenesisUsersCount();
        setGenesisCount(count);
      } catch (error) {
        console.error("Error fetching Genesis count:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenesisCount();
  }, []);
  
  // Calculate Genesis spots remaining - ensure it never goes below 0
  const genesisSpotsLeft = Math.max(0, GENESIS_SPOTS - genesisCount);

  return (
    <div className="z-10 flex flex-col items-center justify-between real-vh px-3 sm:px-4 md:px-5 lg:px-6 pb-10 pt-10">
      {/* Empty flex space at top to help with centering */}
      <div className="flex-grow" />
      
      {/* Main content - centered */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        {/* {referrerData && (
          <div className="relative overflow-hidden bg-gradient-to-r from-[#8af337]/30 to-[#8af337]/20 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-white font-medium animate-pulse mb-5 sm:mb-6 md:mb-8 max-w-xs sm:max-w-sm md:max-w-md">
            <div className="absolute -top-10 -left-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-16 sm:w-20 h-16 sm:h-20 bg-[#8af337]/30 rounded-full blur-xl"></div>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1 mx-auto" />
            <p className={klee.className}>You are being invited by <span className="medium-bold">
              {referrerData.twitter_username || referrerData.email || 'a TokenFight community member'}
            </span></p>
          </div>
        )} */}

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
          <p className={`${klee.className} text-base sm:text-xl md:text-3xl font-normal`}><span className="strong-bold">Trade</span> tokens that <span className="strong-bold">kill</span> each other.</p>
        </div>

        <div>
          <AuthButton size="lg" className="animate-glow-pulse hover:animate-none" />
        </div>
        
        {/* Genesis spots counter - now below the join button */}
        <div className="text-center mt-4 sm:mt-5 md:mt-6">
          <p className={`${klee.className} text-xs sm:text-sm md:text-base text-white/50`}>
            ⚡ <span className="text-[#8af337]/70">{loading ? '...' : genesisSpotsLeft}</span>/{GENESIS_SPOTS} Genesis Spots left
          </p>
        </div>
      </div>
      
      {/* Empty flex space to push content to center */}
      <div className="flex-grow" />

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-xl max-w-xs sm:max-w-sm md:max-w-none text-center sm:text-left mt-6 pb-6">
        <Image
          src="/moneybag.png"
          alt="Money Bag"
          width={30}
          height={30}
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-[30px] lg:h-[30px]"
        />
        <p className={`${klee.className} font-normal medium-bold`}>Join early, <span className="light-bold">invite friends</span>, and earn trading fees when we&apos;re live!</p>
      </div>
      
      {/* Twitter follow link */}
      <div className="mt-2 mb-2">
        <a 
          href="https://x.com/tokenfightlol" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-gray-400 hover:text-[#8af337] transition-colors text-xs sm:text-sm"
        >
          <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow @tokenfightlol
        </a>
      </div>
    </div>
  )
} 